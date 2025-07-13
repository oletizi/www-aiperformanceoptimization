# Feature Card Images Setup

## Overview
The homepage feature cards now use images instead of emoji icons. Each card has a dedicated image that represents the topic.

## Current Image Structure
All feature card images are located in `public/images/`:

- **`cost-optimization.jpg`** - Cost Optimization card
- **`performance-tuning.jpg`** - Performance Tuning card  
- **`reliability.jpg`** - Reliability & Resilience card
- **`infrastructure.jpg`** - Infrastructure Management card
- **`monitoring.jpg`** - Monitoring & Analytics card
- **`best-practices.jpg`** - Best Practices card

## Image Specifications
For optimal performance and visual consistency:

- **Format**: JPG or WebP
- **Dimensions**: 400x200px (2:1 aspect ratio)
- **File Size**: Under 100KB each
- **Style**: AI/technology themed, consistent visual style
- **Colors**: Should work well with the site's color scheme

## How to Replace Images
1. Replace each image file in `public/images/` with your desired images
2. Keep the same filenames or update the HTML in `src/pages/index.astro`
3. Test the build with `npm run build`

## CSS Styling
The feature card images are styled in `src/pages/index.astro`:

```css
.feature-image {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
}

.feature-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.feature-card:hover .feature-image img {
    transform: scale(1.05);
}
```

## Features
- **Responsive Design**: Images scale properly on all devices
- **Hover Effects**: Images slightly zoom on hover for interactivity
- **Fallback**: Gradient background shows if images fail to load
- **Optimized**: Uses `object-fit: cover` for consistent sizing

## Alternative Options
You can also use:
- **WebP format** for better compression
- **SVG icons** for scalable graphics
- **Multiple image sizes** for responsive loading
- **Lazy loading** for performance optimization

## Performance Tips
- Use WebP format for better compression
- Optimize images for web use
- Consider implementing lazy loading
- Test loading speed on mobile devices 