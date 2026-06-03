// @ts-nocheck
// Build-time script to cache gallery photos from Google Drive.
// Run with: npx tsx scripts/cache-gallery-photos.ts
// Requires GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY env var (from Google Cloud Service Account JSON)

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { listImagesInFolder, getThumbnailUrl, getFullImageUrl } from '../src/lib/google-drive.ts';

// This script runs standalone (outside Astro/Cloudflare Workers runtime).
// It needs a GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY to be set in the environment.
// The gallery config data is fetched directly from Google Drive subfolders.

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '..', 'src', 'data', 'cache');
const PARENT_FOLDER_ID = '1g2ISaHQI3lRU1fh8N5U2coFVYt4sktDm';

interface CachedGallery {
  slug: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  coverPhotoId: string | undefined;
  totalImages: number;
  images: Array<{
    id: string;
    name: string;
    thumbnailUrl: string;
    fullUrl: string;
    width: number | undefined;
    height: number | undefined;
    createdTime: string | undefined;
  }>;
  cachedAt: string;
}

async function cacheGalleryPhotos() {
  const { listSubfolders, parseFolderName } = await import('../src/lib/google-drive');
  
  mkdirSync(CACHE_DIR, { recursive: true });

  const subfolders = await listSubfolders(PARENT_FOLDER_ID);
  console.log(`📁 Found ${subfolders.length} gallery folders`);

  for (const folder of subfolders) {
    const metadata = parseFolderName(folder.name);
    if (!metadata) {
      console.warn(`⚠️  Skipping "${folder.name}" — unable to parse name`);
      continue;
    }

    try {
      console.log(`📸 Fetching photos for "${metadata.slug}"...`);
      const images = await listImagesInFolder(folder.id);
      
      const cached: CachedGallery = {
        slug: metadata.slug,
        title: metadata.title,
        description: `Dokumentasi kegiatan ${metadata.title}.`,
        category: metadata.category.toLowerCase(),
        eventDate: metadata.date,
        coverPhotoId: images.length > 0 ? images[0].id : undefined,
        totalImages: images.length,
        images: images.map((img) => ({
          id: img.id,
          name: img.name,
          thumbnailUrl: getThumbnailUrl(img.id, 400),
          fullUrl: getFullImageUrl(img.id),
          width: img.width,
          height: img.height,
          createdTime: img.createdTime,
        })),
        cachedAt: new Date().toISOString(),
      };

      const cacheFile = join(CACHE_DIR, `${metadata.slug}.json`);
      writeFileSync(cacheFile, JSON.stringify(cached, null, 2), 'utf-8');
      console.log(`✅ Cached ${images.length} images for "${metadata.slug}"`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to cache "${metadata.slug}":`, message);
    }
  }
}

cacheGalleryPhotos();
