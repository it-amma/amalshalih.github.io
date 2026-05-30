import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  listImagesInFolder,
  listSubfolders,
  getThumbnailUrl,
  getFullImageUrl,
  parseFolderName,
  type DriveFolder,
} from '../src/lib/google-drive.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '..', 'src', 'data', 'cache');
const GALLERIES_FILE = join(__dirname, '..', 'src', 'data', 'generated-galleries.json');

const PARENT_FOLDER_ID = '1g2ISaHQI3lRU1fh8N5U2coFVYt4sktDm';

interface GeneratedGallery {
  slug: string;
  title: string;
  description: string;
  folderId: string;
  category: 'pendidikan' | 'keagamaan' | 'sosial' | 'umum';
  eventDate: string;
  coverPhotoId?: string;
  published: boolean;
  totalImages: number;
  images: Array<{
    id: string;
    name: string;
    thumbnailUrl: string;
    fullUrl: string;
    width?: number;
    height?: number;
    createdTime?: string;
  }>;
}

async function discoverAndCacheGalleries() {
  mkdirSync(CACHE_DIR, { recursive: true });

  console.log('🔍 Discovering galleries from parent folder...');

  let subfolders: DriveFolder[] = [];
  try {
    subfolders = await listSubfolders(PARENT_FOLDER_ID);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to list subfolders:', message);
    process.exit(1);
  }

  if (subfolders.length === 0) {
    console.log('⚠️ No subfolders found in parent folder');
    writeFileSync(GALLERIES_FILE, JSON.stringify([], null, 2), 'utf-8');
    return;
  }

  console.log(`📁 Found ${subfolders.length} subfolders`);

  const generatedGalleries: GeneratedGallery[] = [];

  for (const folder of subfolders) {
    const metadata = parseFolderName(folder.name);

    if (!metadata) {
      console.warn(`⚠️ Skipping folder "${folder.name}" — unable to parse name`);
      continue;
    }

    const validCategories = ['pendidikan', 'keagamaan', 'sosial', 'umum'] as const;
    const category = validCategories.find((c) => c === metadata.category.toLowerCase()) || 'umum';

    console.log(`📸 Processing "${folder.name}" (${metadata.slug})...`);

    let images: Awaited<ReturnType<typeof listImagesInFolder>> = [];
    try {
      images = await listImagesInFolder(folder.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to fetch images for "${folder.name}":`, message);
      continue;
    }

    const gallery: GeneratedGallery = {
      slug: metadata.slug,
      title: metadata.title,
      description: `Dokumentasi kegiatan ${metadata.title} yang diadakan oleh Yayasan Amal Shalih Insan Bantul.`,
      folderId: folder.id,
      category: category,
      eventDate: metadata.date,
      coverPhotoId: images.length > 0 ? images[0].id : undefined,
      published: true,
      totalImages: images.length,
      images: images.map((img) => ({
        id: img.id,
        name: img.name,
        thumbnailUrl: getThumbnailUrl(img.id, 400),
        fullUrl: getFullImageUrl(img.id, 1600),
        width: img.width,
        height: img.height,
        createdTime: img.createdTime,
      })),
    };

    const cacheFile = join(CACHE_DIR, `${metadata.slug}.json`);
    writeFileSync(cacheFile, JSON.stringify(gallery, null, 2), 'utf-8');

    generatedGalleries.push(gallery);

    console.log(`✅ Cached ${images.length} images for "${folder.name}" (${metadata.slug})`);
  }

  writeFileSync(GALLERIES_FILE, JSON.stringify(generatedGalleries, null, 2), 'utf-8');

  console.log(`\n🎉 Successfully generated ${generatedGalleries.length} galleries`);
  console.log(`📁 Generated galleries file: src/data/generated-galleries.json`);
}

discoverAndCacheGalleries();
