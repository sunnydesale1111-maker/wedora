import prisma from '../config/prisma.js';
import { AvailabilityStatus, BookingStatus } from '@prisma/client';
import { VendorMetricsService, VendorPerformanceMetrics } from './vendor-metrics.service.js';

export interface VendorSearchParams {
  category?: string;
  city?: string;
  areas?: string[];
  date?: string | Date;
  guestCount?: number;
  maxBudget?: number;
  sortBy?: 'completed_orders' | 'repeat_orders' | 'referrals' | 'price_asc' | 'price_desc';
}

export interface MatchedVendorResult {
  vendorId: string;
  businessName: string;
  businessDescription: string;
  primaryCity: string;
  contactPerson: string | null;
  serviceId: string;
  categoryName: string;
  categorySlug: string;
  serviceDescription: string;
  maximumGuestCapacity: number | null;
  maximumSimultaneousBookings: number;
  startingPrice: number | null;
  portfolioImages: string[];
  matchedAreas: string[];
  availability: {
    date: string | null;
    status: string;
    availableCapacity: number;
  };
  metrics: VendorPerformanceMetrics;
}

export class VendorSearchService {
  public static async searchVendors(params: VendorSearchParams): Promise<{
    results: MatchedVendorResult[];
    totalMatched: number;
    filtersApplied: Record<string, any>;
  }> {
    const { category, city, areas, date, guestCount, maxBudget, sortBy } = params;

    // 1. Base query for active vendor services
    const whereClause: any = {
      isActive: true,
      vendor: {
        verificationStatus: 'VERIFIED',
      },
    };

    // Filter by Service Category (by slug or name)
    if (category && category.trim() !== '') {
      const cleanCat = category.trim().toLowerCase();
      whereClause.category = {
        OR: [
          { slug: { equals: cleanCat, mode: 'insensitive' } },
          { categoryName: { contains: cleanCat, mode: 'insensitive' } },
        ],
      };
    }

    // Filter by Guest Capacity
    if (guestCount && guestCount > 0) {
      whereClause.OR = [
        { maximumGuestCapacity: null },
        { maximumGuestCapacity: { gte: guestCount } },
      ];
    }

    // Filter by Starting Price / Budget
    if (maxBudget && maxBudget > 0) {
      whereClause.startingPrice = {
        lte: maxBudget,
      };
    }

    // Filter by Location (Vendor Service Areas)
    if (city && city.trim() !== '') {
      const cleanCity = city.trim();
      const cityFilter: any = {
        city: { equals: cleanCity, mode: 'insensitive' },
      };

      if (areas && areas.length > 0) {
        cityFilter.area = {
          in: areas,
          mode: 'insensitive',
        };
      }

      whereClause.vendor.serviceAreas = {
        some: cityFilter,
      };
    }

    // Fetch candidate vendor services
    const candidateServices = await prisma.vendorService.findMany({
      where: whereClause,
      include: {
        vendor: {
          include: {
            serviceAreas: true,
          },
        },
        category: true,
      },
    });

    const parsedDate = date ? new Date(date) : null;
    const targetDateStr = parsedDate ? parsedDate.toISOString().split('T')[0] : null;

    const eligibleResults: MatchedVendorResult[] = [];

    // Check date availability and capacity constraints for each candidate
    for (const service of candidateServices) {
      let isAvailable = true;
      let availStatus: string = 'AVAILABLE';
      let availableCapacity = service.maximumSimultaneousBookings;
      if (guestCount && service.maximumGuestCapacity && service.maximumGuestCapacity < guestCount) {
        continue;
      }

      if (parsedDate && targetDateStr) {
        const startOfDay = new Date(`${targetDateStr}T00:00:00.000Z`);
        const endOfDay = new Date(`${targetDateStr}T23:59:59.999Z`);

        // Check specific calendar entry
        const calendarEntry = await prisma.vendorAvailability.findFirst({
          where: {
            vendorServiceId: service.id,
            availabilityDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

        if (!calendarEntry || calendarEntry.status !== AvailabilityStatus.AVAILABLE || calendarEntry.availableCapacity <= 0) {
          isAvailable = false;
        } else {
          availStatus = calendarEntry.status;
          availableCapacity = calendarEntry.availableCapacity;
        }

        // Also check actual confirmed bookings on that date
        const confirmedBookingsCount = await prisma.booking.count({
          where: {
            vendorServiceId: service.id,
            eventDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
            },
          },
        });

        const remainingCapacity = service.maximumSimultaneousBookings - confirmedBookingsCount;
        if (remainingCapacity <= 0) {
          isAvailable = false;
          availStatus = AvailabilityStatus.FULLY_BOOKED;
        } else {
          availableCapacity = Math.min(availableCapacity, remainingCapacity);
        }
      }

      if (!isAvailable) {
        continue;
      }

      // Filter matched areas
      const matchedAreas = service.vendor.serviceAreas
        .filter((sa) => {
          if (city && sa.city.toLowerCase() !== city.toLowerCase()) return false;
          if (areas && areas.length > 0) {
            return areas.some((a) => a.toLowerCase() === sa.area.toLowerCase());
          }
          return true;
        })
        .map((sa) => `${sa.area}, ${sa.city}`);

      // If specific areas were requested, ensure at least one area matched
      if (areas && areas.length > 0 && matchedAreas.length === 0) {
        continue;
      }

      eligibleResults.push({
        vendorId: service.vendor.id,
        businessName: service.vendor.businessName,
        businessDescription: service.vendor.businessDescription,
        primaryCity: service.vendor.primaryCity,
        contactPerson: service.vendor.contactPerson,
        serviceId: service.id,
        categoryName: service.category.categoryName,
        categorySlug: service.category.slug,
        serviceDescription: service.serviceDescription,
        maximumGuestCapacity: service.maximumGuestCapacity,
        maximumSimultaneousBookings: service.maximumSimultaneousBookings,
        startingPrice: service.startingPrice,
        portfolioImages: service.portfolioImages,
        matchedAreas,
        availability: {
          date: targetDateStr,
          status: availStatus,
          availableCapacity,
        },
        metrics: {} as any, // populated next
      });
    }

    // Attach performance metrics for all eligible vendors
    const vendorIds = Array.from(new Set(eligibleResults.map((r) => r.vendorId)));
    const metricsMap = await VendorMetricsService.calculateBatchMetrics(vendorIds, parsedDate || new Date());

    for (const item of eligibleResults) {
      item.metrics = metricsMap.get(item.vendorId) || {
        vendorId: item.vendorId,
        completedOrdersCount90Days: 0,
        repeatOrdersCount: 0,
        customerReferralsCount: 0,
        metricDisplayText: 'New to Platform — No verified transaction history yet.',
        isNewToPlatform: true,
        totalCompletedLifetime: 0,
      };
    }

    // Sorting
    if (sortBy === 'completed_orders') {
      eligibleResults.sort((a, b) => b.metrics.completedOrdersCount90Days - a.metrics.completedOrdersCount90Days);
    } else if (sortBy === 'repeat_orders') {
      eligibleResults.sort((a, b) => b.metrics.repeatOrdersCount - a.metrics.repeatOrdersCount);
    } else if (sortBy === 'referrals') {
      eligibleResults.sort((a, b) => b.metrics.customerReferralsCount - a.metrics.customerReferralsCount);
    } else if (sortBy === 'price_asc') {
      eligibleResults.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
    } else if (sortBy === 'price_desc') {
      eligibleResults.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
    }

    return {
      results: eligibleResults,
      totalMatched: eligibleResults.length,
      filtersApplied: {
        category: category || null,
        city: city || null,
        areas: areas || [],
        date: targetDateStr,
        guestCount: guestCount || null,
        maxBudget: maxBudget || null,
        sortBy: sortBy || null,
      },
    };
  }
}
