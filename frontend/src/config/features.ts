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
 * Set to `true` to display the approved six-slide event carousel.
 * Set to `false` to immediately restore the original wedding hero exactly as it was.
 */
export const ENABLE_EVENT_HERO_CAROUSEL = true;

/**
 * HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS
 *
 * The requested autoplay transition interval for the event hero carousel.
 * Configured to 120 milliseconds as requested.
 */
export const HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS = 120;

/**
 * HERO_CAROUSEL_READABLE_INTERVAL_MS
 *
 * Safe fallback / readable interval option (3,000 ms) allowing human visitors
 * to comfortably read banner headlines and descriptions.
 */
export const HERO_CAROUSEL_READABLE_INTERVAL_MS = 3000;
