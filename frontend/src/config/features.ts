/**
 * Wedora Application Configuration & Feature Flags
 *
 * This file centralizes temporary and permanent feature flags,
 * allowing instant toggling without database modifications or breaking changes.
 */

/**
 * ENABLE_EVENT_HERO_CAROUSEL
 *
 * Controls whether the 5-slide event carousel (Wedding, Birthday, Baby Shower,
 * Griha Pravesh, Ganpati Decoration) is displayed on the live homepage hero.
 *
 * Set to `true` to display the 5-slide event carousel.
 * Set to `false` to immediately restore the original wedding hero exactly as it was.
 */
export const ENABLE_EVENT_HERO_CAROUSEL = true;

/**
 * HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS
 *
 * Default autoplay rotation interval for the homepage hero carousel.
 * Set to 3000 ms so visitors have sufficient time to read slide content.
 */
export const HERO_CAROUSEL_AUTOPLAY_INTERVAL_MS = 3000;

/**
 * HERO_CAROUSEL_FAST_TEST_INTERVAL_MS
 *
 * High-speed interval option (150 ms) for automated test verification and rapid transition checks.
 */
export const HERO_CAROUSEL_FAST_TEST_INTERVAL_MS = 150;
