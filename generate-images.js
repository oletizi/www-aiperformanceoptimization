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

// Feature cards that need images
const features = [
  {
    id: 'cost-optimization',
    title: 'Cost Optimization',
    description: 'Learn strategies to reduce AI costs by 30-70% while maintaining or improving performance.',
    prompt: 'A modern, professional illustration for AI cost optimization. Abstract geometric elements showing downward trending cost arrows, dollar signs, optimization graphs, and neural network symbols. Use a tech-friendly gradient with blues (#667eea) and purples (#764ba2). Clean, minimalist style suitable for a technology website header. 16:9 aspect ratio.'
  },
  {
    id: 'performance-tuning',
    title: 'Performance Tuning',
    description: 'Optimize AI model performance for speed, accuracy, and efficiency across different providers.',
    prompt: 'A professional illustration for AI performance tuning. Abstract elements including speedometer, upward trending performance graphs, gears, optimization symbols, and neural network icons. Use tech colors with blues (#667eea) and greens. Modern, clean, professional style for technology website. 16:9 aspect ratio.'
  },
  {
    id: 'reliability-resilience',
    title: 'Reliability & Resilience',
    description: 'Build robust AI systems with failover strategies, error handling, and monitoring.',
    prompt: 'A professional illustration for AI system reliability and resilience. Abstract elements like shield icons, interconnected nodes, backup systems, monitoring dashboards, and stable network connections. Use trustworthy colors with blues (#667eea) and teals. Style should convey strength and stability. 16:9 aspect ratio.'
  },
  {
    id: 'infrastructure-management',
    title: 'Infrastructure Management',
    description: 'Master tools and techniques for managing AI infrastructure at scale.',
    prompt: 'A professional illustration for AI infrastructure management. Abstract elements including server racks, cloud symbols, scaling arrows, management dashboards, and interconnected systems. Use enterprise colors with blues (#667eea) and grays. Modern, professional style for technology infrastructure. 16:9 aspect ratio.'
  },
  {
    id: 'monitoring-analytics',
    title: 'Monitoring & Analytics',
    description: 'Implement comprehensive monitoring and analytics for AI model performance.',
    prompt: 'A professional illustration for AI monitoring and analytics. Abstract elements including dashboard charts, data visualization graphs, monitoring screens, analytics symbols, and real-time metrics. Use data-focused colors with blues (#667eea) and oranges. Modern, analytical style. 16:9 aspect ratio.'
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    description: 'Learn industry best practices for production-ready AI deployments.',
    prompt: 'A professional illustration for AI best practices. Abstract elements including checkmarks, quality badges, standards symbols, best practice icons, and professional development elements. Use authoritative colors with blues (#667eea) and gold accents. Professional, expert style. 16:9 aspect ratio.'
  }
];

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

async function generateImage(feature) {
  try {
    console.log(`Generating image for: ${feature.title}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: feature.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    console.log(`Generated image URL for ${feature.title}: ${imageUrl}`);
    
    // Create public/images directory if it doesn't exist
    const imagesDir = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Download and save the image
    const filename = `${feature.id}.png`;
    const filepath = path.join(imagesDir, filename);
    await downloadImage(imageUrl, filepath);
    
    console.log(`Saved image: ${filepath}`);
    
    return {
      id: feature.id,
      title: feature.title,
      filename: filename,
      filepath: filepath,
      url: imageUrl
    };
  } catch (error) {
    console.error(`Error generating image for ${feature.title}:`, error);
    return null;
  }
}

async function generateAllImages() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY environment variable is required');
    console.log('Please set your OpenAI API key:');
    console.log('export OPENAI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  console.log('Starting image generation for feature cards using DALL-E 3...');
  
  const results = [];
  for (const feature of features) {
    const result = await generateImage(feature);
    if (result) {
      results.push(result);
    }
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Save results to a file for reference
  fs.writeFileSync('generated-images.json', JSON.stringify(results, null, 2));
  console.log('Generated image info saved to generated-images.json');
  
  console.log('\nGeneration complete!');
  console.log('Images saved to public/images/ directory');
  console.log('You can now update your HTML to use these new images.');
}

// Run the generation
generateAllImages().catch(console.error);