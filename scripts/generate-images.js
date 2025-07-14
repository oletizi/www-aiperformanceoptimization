import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Theme colors for consistency
const THEME_COLORS = {
  primary: '#1B365D',
  secondary: '#009BDF', 
  accent: '#00BFB3',
  light: '#E6F1F8',
  dark: '#0A192F',
  white: '#FFFFFF',
  gray: '#F5F7FA',
  orange: '#FF6B35'
};

// Base image generation configurations
const BASE_CONFIGS = {
  featureCard: {
    size: "1024x1024",
    quality: "standard",
    basePrompt: "A modern, professional illustration for {title}. {specificElements} Use tech-friendly colors with blues ({primary}) and {accentColor}. Clean, minimalist style suitable for a technology website card. Abstract, geometric design."
  },
  heroBackground: {
    size: "1792x1024", 
    quality: "hd",
    basePrompt: "A sophisticated, professional hero background for {title}. {specificElements} Use a gradient from deep blue ({primary}) to lighter blue ({secondary}) with subtle {accent} accents. Abstract, atmospheric style with depth and movement. Wide landscape format perfect for website hero sections."
  },
  pageHero: {
    size: "1792x1024",
    quality: "hd", 
    basePrompt: "A professional, elegant hero background for {title}. {specificElements} Use a sophisticated color palette with deep blues ({primary}), lighter blues ({secondary}) and {accent} accents. Clean, modern aesthetic with subtle depth and professional feel. Wide format suitable for page hero sections."
  }
};

// Image generation configurations by category
const IMAGE_CONFIGS = {
  // Feature card images (400x200 for cards)
  featureCards: {
    ...BASE_CONFIGS.featureCard,
    images: [
      {
        id: 'cost-optimization',
        title: 'Cost Optimization',
        specificElements: 'Abstract geometric elements showing downward trending cost arrows, dollar signs, optimization graphs, and neural network symbols.',
        accentColor: 'purples'
      },
      {
        id: 'performance-tuning', 
        title: 'Performance Tuning',
        specificElements: 'Abstract elements including speedometer, upward trending performance graphs, gears, optimization symbols, and neural network icons.',
        accentColor: 'greens'
      },
      {
        id: 'reliability-resilience',
        title: 'Reliability & Resilience',
        specificElements: 'Abstract elements like shield icons, interconnected nodes, backup systems, monitoring dashboards, and stable network connections.',
        accentColor: 'teals'
      },
      {
        id: 'infrastructure-management',
        title: 'Infrastructure Management', 
        specificElements: 'Abstract elements including server racks, cloud symbols, scaling arrows, management dashboards, and interconnected systems.',
        accentColor: 'grays'
      },
      {
        id: 'monitoring-analytics',
        title: 'Monitoring & Analytics',
        specificElements: 'Abstract elements including dashboard charts, data visualization graphs, monitoring screens, analytics symbols, and real-time metrics.',
        accentColor: 'oranges'
      },
      {
        id: 'best-practices',
        title: 'Best Practices',
        specificElements: 'Abstract elements including checkmarks, quality badges, standards symbols, best practice icons, and professional development elements.',
        accentColor: 'gold accents'
      }
    ]
  },
  
  // Hero background images (wide format for hero sections)
  heroBackgrounds: {
    ...BASE_CONFIGS.heroBackground,
    images: [
      {
        id: 'ai-optimization-hero',
        title: 'AI Performance Optimization',
        specificElements: 'Abstract technological landscape with floating neural network nodes, data streams, performance metrics visualizations, and optimization symbols. Subtle geometric patterns and light particles creating depth.',
        accent: 'teal highlights'
      }
    ]
  },

  // Learning center page heroes
  learningHeroes: {
    ...BASE_CONFIGS.pageHero,
    images: [
      {
        id: 'learning-center-hero',
        title: 'AI Performance Learning Center',
        specificElements: 'Abstract educational and knowledge elements including flowing data streams, interconnected learning nodes, book and document symbols, graduation elements, and neural network patterns representing knowledge transfer. Subtle geometric patterns suggesting growth and learning.',
        accent: 'warm orange and teal'
      }
    ]
  }
};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

function buildPrompt(config, image) {
  return config.basePrompt
    .replace('{title}', image.title)
    .replace('{specificElements}', image.specificElements)
    .replace('{primary}', THEME_COLORS.primary)
    .replace('{secondary}', THEME_COLORS.secondary)
    .replace('{accentColor}', image.accentColor || 'teals')
    .replace('{accent}', image.accent || 'teal accents');
}

async function generateImage(imageConfig, config, outputDir = 'public/images') {
  try {
    console.log(`Generating image for: ${imageConfig.title}`);
    
    const prompt = buildPrompt(config, imageConfig);
    console.log(`Prompt: ${prompt}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: config.size,
      quality: config.quality,
    });

    const imageUrl = response.data[0].url;
    console.log(`Generated image URL for ${imageConfig.title}: ${imageUrl}`);
    
    // Create output directory if it doesn't exist
    const imagesDir = path.join(__dirname, '..', outputDir);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Download and save the image
    const filename = `${imageConfig.id}.png`;
    const filepath = path.join(imagesDir, filename);
    await downloadImage(imageUrl, filepath);
    
    console.log(`Saved image: ${filepath}`);
    
    return {
      id: imageConfig.id,
      title: imageConfig.title,
      filename: filename,
      filepath: filepath,
      url: imageUrl,
      type: config.type || 'unknown'
    };
  } catch (error) {
    console.error(`Error generating image for ${imageConfig.title}:`, error);
    return null;
  }
}

async function generateImageSet(setName, config, outputDir = 'public/images') {
  console.log(`\nGenerating ${setName} images using DALL-E 3...`);
  
  const results = [];
  for (const imageConfig of config.images) {
    const result = await generateImage(imageConfig, config, outputDir);
    if (result) {
      result.type = setName;
      results.push(result);
    }
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}

// Utility function to add new image configurations dynamically
function addImageConfig(setName, baseConfigType, images) {
  if (!BASE_CONFIGS[baseConfigType]) {
    throw new Error(`Unknown base config type: ${baseConfigType}`);
  }
  
  IMAGE_CONFIGS[setName] = {
    ...BASE_CONFIGS[baseConfigType],
    images: images
  };
  
  console.log(`Added image config set: ${setName} (${images.length} images)`);
}

// Utility function to generate a single custom image
async function generateCustomImage(imageConfig, baseConfigType = 'pageHero', outputDir = 'public/images') {
  if (!BASE_CONFIGS[baseConfigType]) {
    throw new Error(`Unknown base config type: ${baseConfigType}`);
  }
  
  const config = BASE_CONFIGS[baseConfigType];
  return await generateImage(imageConfig, config, outputDir);
}

async function generateAllImages(sets = null) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY environment variable is required');
    console.log('Please set your OpenAI API key:');
    console.log('export OPENAI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  // Determine which sets to generate
  const setsToGenerate = sets || Object.keys(IMAGE_CONFIGS);
  console.log(`Generating images for: ${setsToGenerate.join(', ')}`);
  console.log(`Available sets: ${Object.keys(IMAGE_CONFIGS).join(', ')}`);
  
  const allResults = [];
  
  for (const setName of setsToGenerate) {
    if (IMAGE_CONFIGS[setName]) {
      const results = await generateImageSet(setName, IMAGE_CONFIGS[setName]);
      allResults.push(...results);
    } else {
      console.warn(`Unknown image set: ${setName}`);
      console.log(`Available sets: ${Object.keys(IMAGE_CONFIGS).join(', ')}`);
    }
  }
  
  // Save results to a file for reference
  const resultsPath = path.join(__dirname, 'generated-images.json');
  fs.writeFileSync(resultsPath, JSON.stringify(allResults, null, 2));
  console.log(`\nGenerated image info saved to ${resultsPath}`);
  
  console.log('\nGeneration complete!');
  console.log('Images saved to public/images/ directory');
  console.log('You can now update your site to use these new images.');
  
  return allResults;
}

// Command line interface
const args = process.argv.slice(2);
if (args.length > 0) {
  // Generate specific sets if provided as arguments
  generateAllImages(args).catch(console.error);
} else {
  // Generate all sets by default  
  generateAllImages().catch(console.error);
}