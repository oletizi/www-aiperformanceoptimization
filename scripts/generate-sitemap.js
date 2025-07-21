import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://aiperformanceoptimization.com';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const CONTENT_DIR = path.join(__dirname, '../src/content');
const PAGES_DIR = path.join(__dirname, '../src/pages');

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Generate URL entries for static pages
function getStaticPages() {
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/learn', priority: '0.9', changefreq: 'weekly' },
    { path: '/model-connectivity', priority: '0.7', changefreq: 'monthly' },
    { path: '/tools', priority: '0.7', changefreq: 'monthly' },
    { path: '/strategies', priority: '0.7', changefreq: 'monthly' }
  ];

  return staticPages.map(page => ({
    loc: `${BASE_URL}${page.path}`,
    lastmod: getCurrentDate(),
    changefreq: page.changefreq,
    priority: page.priority
  }));
}

// Generate URL entries for learn articles
function getLearnArticles() {
  const learnDir = path.join(CONTENT_DIR, 'learn');
  const articles = [];

  if (fs.existsSync(learnDir)) {
    const files = fs.readdirSync(learnDir);
    
    files.forEach(file => {
      if (file.endsWith('.mdx')) {
        const slug = file.replace('.mdx', '');
        const priority = slug === 'getting-started' ? '0.8' : '0.7';
        
        articles.push({
          loc: `${BASE_URL}/learn/${slug}`,
          lastmod: getCurrentDate(),
          changefreq: 'monthly',
          priority: priority
        });
      }
    });
  }

  return articles;
}

// Generate URL entries for blog posts (if any)
function getBlogPosts() {
  const blogDir = path.join(CONTENT_DIR, 'blog');
  const posts = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    
    files.forEach(file => {
      if (file.endsWith('.mdx')) {
        const slug = file.replace('.mdx', '');
        
        posts.push({
          loc: `${BASE_URL}/blog/${slug}`,
          lastmod: getCurrentDate(),
          changefreq: 'monthly',
          priority: '0.6'
        });
      }
    });
  }

  return posts;
}

// Generate the XML sitemap
function generateSitemapXML(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

// Main function
function generateSitemap() {
  console.log('🔄 Generating sitemap...');
  
  try {
    // Collect all URLs
    const staticPages = getStaticPages();
    const learnArticles = getLearnArticles();
    const blogPosts = getBlogPosts();
    
    const allUrls = [...staticPages, ...learnArticles, ...blogPosts];
    
    // Generate XML
    const sitemapXML = generateSitemapXML(allUrls);
    
    // Write to file
    fs.writeFileSync(SITEMAP_PATH, sitemapXML, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📊 Total URLs: ${allUrls.length}`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Learn articles: ${learnArticles.length}`);
    console.log(`   - Blog posts: ${blogPosts.length}`);
    console.log(`📁 Location: ${SITEMAP_PATH}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}

export { generateSitemap }; 