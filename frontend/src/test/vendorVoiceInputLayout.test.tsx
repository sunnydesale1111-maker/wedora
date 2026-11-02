import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VendorVoiceAssistant } from '../components/vendor/VendorVoiceAssistant';
import { Vendor } from '../types/vendor';

const mockVendor: Vendor = {
  id: 'vendor-catering-01',
  businessName: 'Royal Feast Catering & Hospitality',
  category: 'Catering',
  city: 'Pune',
  serviceableLocalities: ['Baner', 'Kothrud', 'Aundh', 'Wakad'],
  priceRange: '₹800 - ₹2,500',
  rating: 4.9,
  reviewsCount: 120,
  yearsInBusiness: 12,
  description: 'Premium catering solutions for luxury Indian celebrations.',
  coverImage: '/images/catering.jpg',
  photos: [],
  services: ['Full Course Catering', 'Live Food Counters', 'Custom Menus'],
  verified: true,
};

describe('WEDORA — VENDOR AI ASSISTANT: INPUT BAR ORDER & QUOTATION CARD UI TESTS', () => {
  it('Requirement 1: Input controls appear in exact horizontal order: Type Message Box -> Microphone -> Send Button', () => {
    const { container } = render(
      <VendorVoiceAssistant
        vendor={mockVendor}
        inquiries={[]}
        bookings={[]}
        calendarOverrides={{}}
        onUpdateAvailability={vi.fn()}
        onCreateQuotation={vi.fn()}
      />
    );

    // Find the input bar form
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
    if (!form) return;

    // Check direct children of the form
    const formChildren = Array.from(form.children);
    expect(formChildren.length).toBe(3);

    // 1. First child: Type Message Box (flex-1 container holding the input)
    const messageBoxContainer = formChildren[0];
    expect(messageBoxContainer.className).toContain('flex-1');
    const inputElement = messageBoxContainer.querySelector('input');
    expect(inputElement).toBeTruthy();
    expect(inputElement?.getAttribute('placeholder')).toContain('Type a message or tap mic to speak');

    // 2. Second child: Microphone Button
    const microphoneButton = formChildren[1] as HTMLButtonElement;
    expect(microphoneButton.tagName).toBe('BUTTON');
    expect(microphoneButton.getAttribute('type')).toBe('button');
    expect(microphoneButton.getAttribute('title')).toContain('microphone');

    // 3. Third child: Send Button
    const sendButton = formChildren[2] as HTMLButtonElement;
    expect(sendButton.tagName).toBe('BUTTON');
    expect(sendButton.getAttribute('type')).toBe('submit');
    expect(sendButton.getAttribute('title')).toBe('Send message');
  });

  it('Requirement 3: Generates Provisional Quotation card with Draft status and explicit review button', async () => {
    const onCreateQuotationMock = vi.fn();

    const { container } = render(
      <VendorVoiceAssistant
        vendor={mockVendor}
        inquiries={[]}
        bookings={[]}
        calendarOverrides={{}}
        onUpdateAvailability={vi.fn()}
        onCreateQuotation={onCreateQuotationMock}
      />
    );

    const input = screen.getByPlaceholderText(/Type a message or tap mic to speak/i);
    const form = container.querySelector('form')!;

    // Type quote instruction: 500 guests at ₹1,200 per plate
    fireEvent.change(input, { target: { value: 'Create quotation for 500 guests at ₹1,200 per plate' } });
    fireEvent.submit(form);

    // Check Provisional Quotation Card appears
    expect(await screen.findByText(/Provisional Quotation Draft Generated/i)).toBeTruthy();
    expect(screen.getByText(/Status: Draft \/ Provisional/i)).toBeTruthy();
    expect(screen.getByText(/Royal Feast Catering & Hospitality/i)).toBeTruthy();
    expect(screen.getAllByText(/500/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₹1,200/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₹6,00,000/).length).toBeGreaterThan(0);

    // Verify Review & Approve button is present
    const reviewBtn = screen.getByRole('button', { name: /Review & Approve Quotation/i });
    expect(reviewBtn).toBeTruthy();

    // Verify nothing dispatched yet before explicit review & approval
    expect(onCreateQuotationMock).not.toHaveBeenCalled();
  });
});
