# FeatureCard Component Documentation

## Overview
The `FeatureCard` component is a reusable component for displaying feature cards with images, titles, and descriptions. It's used on the homepage and can be easily reused across the site.

## Location
`src/components/FeatureCard.astro`

## Props
The component accepts the following props:

- **`title`** (string): The title of the feature
- **`description`** (string): The description text
- **`image`** (any): The image import from assets
- **`imageAlt`** (string): Alt text for accessibility

## Usage Example
```astro
---
import FeatureCard from '../components/FeatureCard.astro';
import myImage from '../assets/images/my-image.jpg';
---

<FeatureCard 
  title="My Feature"
  description="This is a description of my feature."
  image={myImage}
  imageAlt="My Feature"
/>
```

## Features
- **Responsive Design**: Adapts to different screen sizes
- **Hover Effects**: Cards lift and images zoom on hover
- **Image Optimization**: Uses Astro's optimized Image component
- **Accessibility**: Proper alt text support
- **Consistent Styling**: Maintains design consistency across the site

## Styling
The component includes its own scoped styles:
- White background with rounded corners
- Subtle shadow with hover enhancement
- Image container with gradient fallback
- Smooth transitions for interactions
- Mobile-responsive image heights

## Homepage Implementation
The homepage now uses a data-driven approach:

```astro
---
// Feature data array
const features = [
  {
    title: "Cost Optimization",
    description: "Learn strategies to reduce AI costs...",
    image: costOptimizationImg,
    imageAlt: "Cost Optimization"
  },
  // ... more features
];
---

<!-- Render features dynamically -->
{features.map(feature => (
  <FeatureCard 
    title={feature.title}
    description={feature.description}
    image={feature.image}
    imageAlt={feature.imageAlt}
  />
))}
```

## Benefits
1. **DRY Principle**: Eliminates code duplication
2. **Maintainability**: Changes to card styling only need to be made in one place
3. **Consistency**: Ensures uniform appearance across all feature cards
4. **Scalability**: Easy to add new features by updating the data array
5. **Reusability**: Can be used on other pages throughout the site

## Image Requirements
- Images must be valid image files (JPG, PNG, WebP)
- Recommended size: 400x200px
- Should be placed in `src/assets/images/`
- Will be automatically optimized by Astro's image service 