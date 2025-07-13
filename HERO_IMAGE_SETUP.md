# Hero Background Image Setup

## Overview
The homepage hero section now uses an image background instead of a gradient. The image is referenced as `/hero-bg.jpg` in the public directory.

## Current Setup
- **Image Path**: `public/hero-bg.jpg`
- **Background Style**: The image is used with a gradient overlay for better text readability
- **Responsive**: The image scales and centers properly on all devices

## Recommended Image Specifications
For optimal performance and visual appeal, your hero image should be:

- **Format**: JPG or WebP
- **Dimensions**: 1920x1080px (16:9 aspect ratio) or larger
- **File Size**: Under 500KB for fast loading
- **Content**: AI/technology themed, abstract, or geometric patterns
- **Colors**: Dark or neutral tones work best with the overlay

## How to Replace the Image
1. Replace the file `public/hero-bg.jpg` with your desired image
2. Keep the same filename or update the CSS in `src/pages/index.astro`
3. Test the build with `npm run build`

## CSS Customization
The hero background styling is in `src/pages/index.astro`:

```css
.hero {
    background: linear-gradient(rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)), url('/hero-bg.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    /* ... other styles */
}
```

## Alternative Image Options
You can also use:
- `/hero-bg.webp` (better compression)
- `/hero-bg.png` (if transparency is needed)
- Multiple image sizes for responsive loading

## Performance Tips
- Use WebP format for better compression
- Consider adding a `srcset` for responsive images
- Optimize the image for web use
- Test loading speed on mobile devices 