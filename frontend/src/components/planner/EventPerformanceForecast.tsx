import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Vendor } from '@/types/vendor';
import { WeddingEvent } from '@/types/event';

interface EventPerformanceForecastProps {
  activeEvent: WeddingEvent;
  selectedVendors: Vendor[];
  eventDate: string;
}

const ESSENTIAL_CATEGORIES = [
  'Catering and Food Services',
  'Decoration Services',
  'Photography and Videography',
  'Wedding Lawns and Venues',
  'DJ and Sound Systems',
  'Makeup and Mehendi Artists',
];

export const EventPerformanceForecast: React.FC<EventPerformanceForecastProps> = ({
  activeEvent,
  selectedVendors,
  eventDate,
}) => {
  // 1. Categories Filled vs Missing
  const filledCategorySet = new Set(selectedVendors.map((v) => v.category));
  const filledCount = ESSENTIAL_CATEGORIES.filter((c) => filledCategorySet.has(c as any)).length;
  const missingCategories = ESSENTIAL_CATEGORIES.filter((c) => !filledCategorySet.has(c as any));

  // 2. Availability Coverage
  const conflicts: { vendorName: string; reason: string }[] = [];
  let availableCount = 0;

  selectedVendors.forEach((v) => {
    const status = v.availabilityDates[eventDate];
    if (status === 'Fully Booked' || status === 'Unavailable') {
      conflicts.push({
        vendorName: v.businessName,
        reason: `Unavailable on ${eventDate}. Please swap with an alternative vendor.`,
      });
    } else {
      availableCount++;
    }
  });

  const totalVendors = selectedVendors.length;
  const availabilityCoverage =
    totalVendors > 0 ? Math.round((availableCount / totalVendors) * 100) : 100;

  // 3. Budget vs Quotations
  const totalQuotedAmount = selectedVendors.reduce((sum, v) => sum + (v.startingPrice || 0), 0);
  const eventBudget = activeEvent.estimatedBudget || 2500000;
  const budgetVariance = eventBudget - totalQuotedAmount;
  const isWithinBudget = budgetVariance >= 0;

  // 4. Historical On-Time Delivery Average
  const totalOnTime = selectedVendors.reduce((sum, v) => sum + (v.onTimeDeliveryPercent || 95), 0);
  const avgOnTime =
    totalVendors > 0 ? Math.round(totalOnTime / totalVendors) : 98;

  // 5. Readiness Score (0-100)
  // Weighted: Category coverage (40%), Availability coverage (30%), On-Time record (30%)
  const categoryRatio = filledCount / ESSENTIAL_CATEGORIES.length;
  const rawScore =
    categoryRatio * 40 +
    (availabilityCoverage / 100) * 30 +
    (avgOnTime / 100) * 30;
  const readinessScore = Math.min(100, Math.round(rawScore));

  const readinessTier =
    readinessScore >= 80
      ? { label: 'Optimal Readiness', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' }
      : readinessScore >= 60
      ? { label: 'Moderate Readiness', color: 'text-amber-700 bg-amber-100 border-amber-300' }
      : { label: 'Needs Attention', color: 'text-rose-700 bg-rose-100 border-rose-300' };

  return (
    <div className="rounded-3xl border border-gold/30 bg-card p-6 shadow-soft space-y-5 animate-in fade-in">
      {/* Title & Readiness Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gold/15 text-gold">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-plum">
              Event Performance Forecast
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time analytics for <strong className="text-navy">{activeEvent.eventName}</strong> ({eventDate})
            </p>
          </div>
        </div>

        <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${readinessTier.color}`}>
          <Sparkles className="size-3.5" />
          <span>{readinessTier.label} ({readinessScore}%)</span>
        </div>
      </div>

      {/* Conflicts Alert if any */}
      {conflicts.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-800 space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertTriangle className="size-4 shrink-0 text-rose-600" />
            <span>Scheduling Conflicts Detected:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700">
            {conflicts.map((c, i) => (
              <li key={i}>
                <strong className="font-semibold">{c.vendorName}:</strong> {c.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Availability Coverage */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Availability Coverage</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-navy">
            {availabilityCoverage}%
          </div>
          <p className="text-[11px] text-muted-foreground">
            {availableCount} of {totalVendors} vendors confirmed on {eventDate}
          </p>
        </div>

        {/* Metric 2: Categories Filled */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Category Coverage</span>
            <Layers className="size-4 text-gold" />
          </div>
          <div className="text-2xl font-bold font-display text-navy">
            {filledCount} / {ESSENTIAL_CATEGORIES.length}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {missingCategories.length > 0
              ? `Missing: ${missingCategories[0].split(' ')[0]}`
              : 'All 6 key categories covered'}
          </p>
        </div>

        {/* Metric 3: Budget vs Quotations */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Budget Allocation</span>
            <DollarSign className="size-4 text-gold" />
          </div>
          <div className="text-2xl font-bold font-display text-navy">
            ₹{totalQuotedAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] font-medium text-muted-foreground">
            {isWithinBudget ? (
              <span className="text-emerald-700">
                +₹{budgetVariance.toLocaleString('en-IN')} under budget
              </span>
            ) : (
              <span className="text-rose-700">
                -₹{Math.abs(budgetVariance).toLocaleString('en-IN')} over budget
              </span>
            )}
          </p>
        </div>

        {/* Metric 4: Historical On-Time Average */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>On-Time Delivery Rate</span>
            <Clock className="size-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-display text-navy">
            {avgOnTime}%
          </div>
          <p className="text-[11px] text-muted-foreground">
            Average on-time delivery across verified track records
          </p>
        </div>
      </div>

      {/* Category Badges Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60 text-xs">
        <span className="text-muted-foreground font-semibold">Service Coverage:</span>
        {ESSENTIAL_CATEGORIES.map((cat) => {
          const isFilled = filledCategorySet.has(cat as any);
          const shortName = cat.split(' ')[0];
          return (
            <span
              key={cat}
              className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] transition ${
                isFilled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-muted text-muted-foreground border border-border border-dashed'
              }`}
            >
              {isFilled ? '✓ ' : '+ '}
              {shortName}
            </span>
          );
        })}
      </div>
    </div>
  );
};

