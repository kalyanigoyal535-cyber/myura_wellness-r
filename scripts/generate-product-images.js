const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..', 'public', 'Final Images');
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const TARGET_WIDTHS = [320, 640, 960];
const PLACEHOLDER_WIDTH = 24;
const OUTPUT_SUBDIR = 'optimized';

const log = {
  info: (message) => console.log(`[optimize-images] ${message}`),
  warn: (message) => console.warn(`[optimize-images] ${message}`),
  error: (message) => console.error(`[optimize-images] ${message}`),
};

const ensureDir = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const shouldSkipExtension = (filePath) => !ALLOWED_EXTENSIONS.has(path.extname(filePath).toLowerCase());

const isOptimizedFile = (filePath) => filePath.includes(`${path.sep}${OUTPUT_SUBDIR}${path.sep}`);

const generateVariantName = (baseName, width, format) => `${baseName}-${width}w.${format}`;

const generatePlaceholderName = (baseName) => `${baseName}-placeholder.jpg`;

const fileIsUpToDate = async (sourcePath, targetPath) => {
  if (!fs.existsSync(targetPath)) {
    return false;
  }
  const [sourceStats, targetStats] = await Promise.all([
    fs.promises.stat(sourcePath),
    fs.promises.stat(targetPath),
  ]);
  return targetStats.mtimeMs >= sourceStats.mtimeMs;
};

const createVariants = async (inputPath, outputDir) => {
  const { name: baseName } = path.parse(inputPath);
  ensureDir(outputDir);

  const variantTasks = [];

  for (const width of TARGET_WIDTHS) {
    const webpPath = path.join(outputDir, generateVariantName(baseName, width, 'webp'));
    const avifPath = path.join(outputDir, generateVariantName(baseName, width, 'avif'));

    variantTasks.push(
      (async () => {
        if (!(await fileIsUpToDate(inputPath, webpPath))) {
          await sharp(inputPath)
            .resize({ width, fit: 'inside', withoutEnlargement: true })
            .webp({ effort: 5, quality: 78 })
            .toFile(webpPath);
        }
      })(),
      (async () => {
        if (!(await fileIsUpToDate(inputPath, avifPath))) {
          await sharp(inputPath)
            .resize({ width, fit: 'inside', withoutEnlargement: true })
            .avif({ effort: 5, quality: 60 })
            .toFile(avifPath);
        }
      })()
    );
  }

  const placeholderPath = path.join(outputDir, generatePlaceholderName(baseName));
  variantTasks.push(
    (async () => {
      if (!(await fileIsUpToDate(inputPath, placeholderPath))) {
        await sharp(inputPath)
          .resize({ width: PLACEHOLDER_WIDTH, fit: 'inside', withoutEnlargement: true })
          .blur(8)
          .jpeg({ quality: 35 })
          .toFile(placeholderPath);
      }
    })()
  );

  await Promise.all(variantTasks);
  log.info(`Optimized variants created for ${path.relative(ROOT_DIR, inputPath)}`);
};

const walkAndOptimize = async () => {
  const categories = await fs.promises.readdir(ROOT_DIR);

  for (const category of categories) {
    const categoryPath = path.join(ROOT_DIR, category);
    const stats = await fs.promises.stat(categoryPath);
    if (!stats.isDirectory()) {
      continue;
    }

    const files = await fs.promises.readdir(categoryPath);

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const fileStats = await fs.promises.stat(filePath);

      if (fileStats.isDirectory()) {
        continue;
      }

      if (shouldSkipExtension(filePath) || isOptimizedFile(filePath)) {
        continue;
      }

      try {
        await createVariants(filePath, path.join(categoryPath, OUTPUT_SUBDIR));
      } catch (error) {
        log.error(`Failed optimizing ${filePath}: ${error.message}`);
      }
    }
  }
};

(async () => {
  const start = Date.now();
  log.info('Starting product image optimization...');
  await walkAndOptimize();
  const duration = ((Date.now() - start) / 1000).toFixed(1);
  log.info(`Completed in ${duration}s`);
})().catch((error) => {
  log.error(error);
  process.exit(1);
});

