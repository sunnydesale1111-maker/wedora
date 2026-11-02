/**
 * Wedora Application Configuration & Feature Flags
 *
 * This file centralizes configuration flags and timings, allowing
 * instant toggling without database modifications or breaking changes.
 */

/**
 * ENABLE_EVENT_HERO_CAROUSEL
 *
 * Controls whether the multi-event carousel is displayed on the live homepage hero.
 * Set to `true` to display the approved six-banner event carousel.
 * Set to `false` to immediately restore the original wedding hero exactly as it was.
 */
export const ENABLE_EVENT_HERO_CAROUSEL = true;

/**
 * AUTO_SLIDE_INTERVAL
 *
 * The official autoplay interval for the event hero carousel: 5000 ms (5 seconds).
 * Each banner automatically displays for 5 seconds before advancing.
 */
export const AUTO_SLIDE_INTERVAL = 5000;

/**
 * SLIDE_TRANSITION_DURATION
 *
 * The horizontal sliding animation duration: 600 ms.
 */
export const SLIDE_TRANSITION_DURATION = 600;

/**
 * HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS
 *
 * Alias for AUTO_SLIDE_INTERVAL (5000 ms).
 */
export const HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS = AUTO_SLIDE_INTERVAL;

/**
 * HERO_CAROUSEL_READABLE_INTERVAL_MS
 *
 * Human reading interval option (5000 ms).
 */
export const HERO_CAROUSEL_READABLE_INTERVAL_MS = 5000;
