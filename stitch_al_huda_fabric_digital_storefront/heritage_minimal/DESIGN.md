---
name: Heritage Minimal
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#785a03'
  on-secondary: '#ffffff'
  secondary-container: '#fed578'
  on-secondary-container: '#785a04'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1a'
  on-tertiary-container: '#848481'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdf9c'
  secondary-fixed-dim: '#e9c167'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#e4e2df'
  tertiary-fixed-dim: '#c8c6c4'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474745'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
  button:
    fontFamily: Montserrat
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 60px
  section-gap-lg: 120px
  section-gap-sm: 60px
---

## Brand & Style

The design system is anchored in a "Heritage Minimalist" aesthetic, bridging traditional Pakistani craftsmanship with modern high-end eCommerce standards. The target audience is the discerning woman seeking premium unstitched and ready-to-wear fabrics. 

The visual direction prioritizes breathing room and editorial-grade composition. By utilizing a **Minimalist** foundation with **Tactile** accents, the UI evokes a sense of quiet luxury, exclusivity, and meticulous quality. High-end fashion editorial layouts serve as the primary inspiration, moving away from cluttered retail patterns toward a gallery-like experience.

## Colors

The palette is restricted to a timeless, high-contrast selection to ensure the product photography remains the focal point.

- **Primary (Deep Black):** Used for primary typography, icons, and high-impact UI elements. It represents authority and elegance.
- **Secondary (Antique Gold):** Reserved for call-to-action buttons, active states, and premium labels. It adds a layer of warmth and "jewelry-like" detail.
- **Tertiary (Cream):** Acts as a subtle background alternative to pure white, used to create soft sections or "paper-like" surfaces for cards and containers.
- **Neutral (White):** The primary canvas color, ensuring a clean, airy, and fast-loading visual impression.

## Typography

This design system employs a classic serif-and-sans-serif pairing to communicate both heritage and modernity. 

- **EB Garamond (Headlines):** Used for all major display headings. It provides a literary, sophisticated tone. Use lowercase for a more modern, fashion-forward look in specific editorial sections, or traditional title case for standard headers.
- **Montserrat (UI & Body):** Used for all functional text, navigation, and product descriptions. Its geometric clarity balances the ornate nature of the serif.
- **Letter Spacing:** Increase tracking for all uppercase labels and button text to enhance the luxury "breathing" effect.

## Layout & Spacing

The layout philosophy is based on a **Fixed Grid** for desktop and a **Fluid Grid** for mobile, emphasizing vertical rhythm and generous white space.

- **Desktop (1440px):** 12-column grid with 24px gutters. Use large margins (60px+) to frame the content, making the site feel like a high-end catalog.
- **Mobile:** 4-column grid with 20px margins. 
- **Sectioning:** Content sections should be separated by significant vertical gaps (`section-gap-lg`) to prevent the "wall of products" effect. 
- **Alignment:** Use asymmetrical layouts for editorial components (e.g., text offset from images) to create a more dynamic, high-fashion feel.

## Elevation & Depth

To maintain a minimal and clean aesthetic, depth is created through **Tonal Layers** rather than heavy shadows.

- **Surfaces:** Use the Cream (#FAF8F5) color to distinguish secondary containers or sidebars against the White (#FFFFFF) background.
- **Outlines:** Use very fine, 1px lines in a lightened version of the Deep Black (around 10-15% opacity) for input borders and dividers.
- **Hover States:** Instead of shadows, use subtle opacity shifts or slight image scaling (1.02x) for product cards to indicate interactivity without cluttering the UI.

## Shapes

The shape language is strictly **Sharp (0)**. 

Rectilinear forms emphasize architectural precision and professional reliability. All buttons, product cards, input fields, and image containers must have square 90-degree corners. This sharpness contrasts beautifully with the organic drapes and patterns found in the fabric products themselves.

## Components

- **Buttons:** 
  - *Primary:* Solid Deep Black background with White Montserrat text (uppercase). No border.
  - *Secondary:* Antique Gold 1px border, transparent background, Gold text.
  - *Action:* For "Add to Cart," use a solid Antique Gold button to draw immediate attention.
- **Product Cards:** Minimalist frames with no borders. Information (Title, Price) should be center-aligned underneath the image using `body-md` for the title and a slightly bolder weight for the price.
- **Input Fields:** 1px Deep Black bottom-border only (minimalist style) or full 1px light grey stroke. Labels should use `label-caps`.
- **Chips/Badges:** Small, square-edged labels in Deep Black or Antique Gold for "New Arrival" or "Limited Edition," placed subtly in the top-left corner of product images.
- **Lists/Navigation:** Clean, text-only navigation with a simple Deep Black underline for the active state.
- **Product Zoom:** A high-quality, full-screen overlay for viewing fabric textures—essential for eCommerce trust in the textile industry.