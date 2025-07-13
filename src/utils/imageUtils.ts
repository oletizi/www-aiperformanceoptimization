// Utility function to safely import images with fallback
export async function safeImageImport(imagePath: string): Promise<any> {
  try {
    // Check if the file exists first
    const fs = await import('fs/promises');
    await fs.access(imagePath);
    
    // If file exists, try to import it
    return await import(imagePath);
  } catch (error) {
    // Return null if image doesn't exist or can't be imported
    return null;
  }
}

// Alternative approach using dynamic imports with error handling
export async function safeDynamicImageImport(imagePath: string): Promise<any> {
  try {
    // Use dynamic import with full path
    const fullPath = new URL(imagePath, import.meta.url);
    return await import(fullPath.href);
  } catch (error) {
    console.warn(`Failed to import image: ${imagePath}`, error);
    return null;
  }
} 