import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GALLERIES } from '../src/data/galleries.ts';
import { listImagesInFolder, getThumbnailUrl, getFullImageUrl } from '../src/lib/google-drive.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '..', 'src', 'data', 'cache');

async function cacheGalleryPhotos() {
  mkdirSync(CACHE_DIR, { recursive: true });

  for (const gallery of GALLERIES) {
    if (!gallery.published) continue;
    if (gallery.folderId === 'GANTI_DENGAN_FOLDER_ID_DRIVE') {
      console.warn(`⚠️  Skipping "${gallery.slug}" — folderId not configured`);
      continue;
    }

    try {
      console.log(`📸 Fetching photos for "${gallery.slug}"...`);
      const images = await listImagesInFolder(gallery.folderId);
      
      const cached = {
        slug: gallery.slug,
        title: gallery.title,
        description: gallery.description,
        category: gallery.category,
        eventDate: gallery.eventDate,
        coverPhotoId: gallery.coverPhotoId,
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

      const cacheFile = join(CACHE_DIR, `${gallery.slug}.json`);
      writeFileSync(cacheFile, JSON.stringify(cached, null, 2), 'utf-8');
      console.log(`✅ Cached ${images.length} images for "${gallery.slug}"`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to cache "${gallery.slug}":`, message);
    }
  }
}

cacheGalleryPhotos();
