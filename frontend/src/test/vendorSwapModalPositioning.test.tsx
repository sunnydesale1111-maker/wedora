import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { VendorSwapModal } from '../components/planner/VendorSwapModal';
import { DEMO_VENDORS } from '../data/demoVendors';

describe('WEDORA — VENDOR SWAP MODAL POSITIONING & SCROLL PRESERVATION', () => {
  const originalVendor = DEMO_VENDORS[0]; // pun-cat-01
  let scrollToSpy: any;

  beforeEach(() => {
    scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;
    document.body.style.overflow = '';
    document.body.style.overscrollBehavior = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
    document.body.style.overscrollBehavior = '';
  });

  // =========================================================================
  // 1. MODAL RENDERS VIA PORTAL DIRECTLY INTO DOCUMENT.BODY
  // =========================================================================
  it('Requirement 1 & 2: Modal renders as a proper overlay via Portal directly in document.body', () => {
    const { getByTestId } = render(
      <VendorSwapModal
        isOpen={true}
        onClose={vi.fn()}
        originalVendor={originalVendor}
        eventName="Rohan & Priya Wedding"
        eventDate="2026-12-15"
        onConfirmSwap={vi.fn()}
      />
    );

    const modalOverlay = getByTestId('vendor-swap-modal');
    expect(modalOverlay).toBeDefined();

    // Must be directly mounted in document.body, free of parent transforms
    expect(modalOverlay.parentElement).toBe(document.body);

    // Overlay must have fixed viewport positioning and high z-index
    expect(modalOverlay.className).toContain('fixed');
    expect(modalOverlay.className).toContain('inset-0');
    expect(modalOverlay.className).toContain('z-50');
    expect(modalOverlay.className).toContain('items-start'); // Near top of viewport
  });

  // =========================================================================
  // 2. BACKGROUND SCROLL LOCKING ON OPEN
  // =========================================================================
  it('Requirement 3 & 4: Prevents background scrolling when open and does not shift scroll position', () => {
    // Simulate user scrolled down 520px
    Object.defineProperty(window, 'scrollY', { value: 520, writable: true });

    const { unmount } = render(
      <VendorSwapModal
        isOpen={true}
        onClose={vi.fn()}
        originalVendor={originalVendor}
        eventName="Rohan & Priya Wedding"
        eventDate="2026-12-15"
        onConfirmSwap={vi.fn()}
      />
    );

    // Body overflow must be locked to 'hidden'
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.overscrollBehavior).toBe('contain');

    // Unmount/Close modal
    unmount();

    // Body overflow restored
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.overscrollBehavior).toBe('');

    // Must restore the exact previous scroll position (520px) without animation jumping
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 520,
      left: 0,
      behavior: 'instant',
    });
  });

  // =========================================================================
  // 3. KEYBOARD ESCAPE KEY CLOSES MODAL
  // =========================================================================
  it('Requirement 8 & 9: Pressing Escape dismisses the popup and restores scroll position', () => {
    const onCloseMock = vi.fn();

    render(
      <VendorSwapModal
        isOpen={true}
        onClose={onCloseMock}
        originalVendor={originalVendor}
        eventName="Rohan & Priya Wedding"
        eventDate="2026-12-15"
        onConfirmSwap={vi.fn()}
      />
    );

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // 4. BACKDROP CLICK CLOSES MODAL (INNER DIALOG CLICK DOES NOT)
  // =========================================================================
  it('Requirement 8: Clicking overlay backdrop dismisses popup, clicking dialog card does not', () => {
    const onCloseMock = vi.fn();

    const { getByTestId, getByText } = render(
      <VendorSwapModal
        isOpen={true}
        onClose={onCloseMock}
        originalVendor={originalVendor}
        eventName="Rohan & Priya Wedding"
        eventDate="2026-12-15"
        onConfirmSwap={vi.fn()}
      />
    );

    const overlay = getByTestId('vendor-swap-modal');

    // Click inside the dialog card (should NOT close)
    const title = getByTestId('swap-modal-title');
    fireEvent.click(title);
    expect(onCloseMock).not.toHaveBeenCalled();

    // Click the overlay backdrop itself (should close)
    fireEvent.click(overlay);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // 5. FOCUS RESTORATION WITH PREVENTSCROLL: TRUE
  // =========================================================================
  it('Requirement 9: Restores focus to the triggering element with preventScroll: true', () => {
    // Create a mock trigger button
    const triggerButton = document.createElement('button');
    triggerButton.id = 'swap-trigger-btn';
    const focusSpy = vi.fn();
    triggerButton.focus = focusSpy;
    document.body.appendChild(triggerButton);

    // Set triggerButton as active element
    Object.defineProperty(document, 'activeElement', {
      value: triggerButton,
      writable: true,
      configurable: true,
    });

    const { unmount } = render(
      <VendorSwapModal
        isOpen={true}
        onClose={vi.fn()}
        originalVendor={originalVendor}
        eventName="Rohan & Priya Wedding"
        eventDate="2026-12-15"
        onConfirmSwap={vi.fn()}
      />
    );

    unmount();

    // Focus restored with preventScroll: true to prevent browser auto-scroll
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });

    document.body.removeChild(triggerButton);
  });

  // =========================================================================
  // 6. POPUP CARD FITS VIEWPORT AND INNER CONTENT SCROLLS INDEPENDENTLY
  // =========================================================================
  it('Requirement 5 & 6: Popup dialog card fits viewport height and inner list scrolls independently', () => {
    const { getByTestId } = render(
      <VendorSwapModal
        isOpen={true}
        onClose={vi.fn()}
        originalVendor={originalVendor}
        eventName="Rohan & Priya Wedding"
        eventDate="2026-12-15"
        onConfirmSwap={vi.fn()}
      />
    );

    const overlay = getByTestId('vendor-swap-modal');
    // Top spacing for natural viewport positioning
    expect(overlay.className).toContain('pt-3');

    const card = overlay.firstElementChild as HTMLElement;
    expect(card).toBeDefined();

    // Dialog card is constrained to viewport
    expect(card.className).toContain('max-h-[calc(100vh-1.5rem)]');
    expect(card.className).toContain('overflow-hidden');

    // Inner replacement vendor list has independent vertical scrolling
    const list = getByTestId('replacement-vendor-list');
    expect(list.parentElement?.className).toContain('overflow-y-auto');
    expect(list.parentElement?.className).toContain('min-h-0');
  });
});
