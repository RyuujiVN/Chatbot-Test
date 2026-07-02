import "dotenv/config";
import app from "./app.js";
import { scrapeAndSaveArticles } from "./src/jobs/scrapeAndSave.job.js";
import { logger } from "./src/utils/logger.js";
import { runUploader } from "./src/jobs/uploader.job.js";

const PORT = process.env.PORT || 3000;

async function main() {
  logger.info("=== Job started ===");

  // Scrape all articles from Zendesk and save .md into articles/
  const manifest = await scrapeAndSaveArticles();

  // Compare delta and upload new/change to Vector Store
  await runUploader(manifest)

  app.listen(PORT, () => {
    logger.success(`Server running on port ${PORT}`);
    logger.info(`POST http://localhost:${PORT}/chat`);
  });
}

main().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});