import "dotenv/config";
import { scrapeAndSaveArticles } from "./src/jobs/scrapeAndSave.job.js";
import { logger } from "./src/utils/logger.js";
import { runUploader } from "./src/jobs/uploader.job.js";



async function main() {
  logger.info("=== Job started ===");

  // Scrape all articles from Zendesk and save .md into articles/
  const manifest = await scrapeAndSaveArticles();

  // Compare delta and upload new/change to Vector Store
  await runUploader(manifest)

  logger.info("=== Job done ===");
  process.exit(0)
}

main().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});