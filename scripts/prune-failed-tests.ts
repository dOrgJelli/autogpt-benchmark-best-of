import { processReports } from "./common";

import path from "path";
import fs from "fs";

const reportsDir = path.join(__dirname, "../reports");

processReports(
  reportsDir,
  (report, reportSubdir) => {
    const json = JSON.parse(report);

    if (!json.tests) {
      return;
    }

    const tests: Record<string, unknown> = {};

    for (const [name, result] of Object.entries(json.tests)) {
      if (!result) {
        continue;
      }
      const metrics = (result as any).metrics;
      if (!metrics || !metrics.success) {
        continue;
      }
      tests[name] = result;
    }

    json.tests = tests;
    const jsonStr = JSON.stringify(json, null, 2);
    const outputPath = path.join(
      __dirname,
      "../reports-pruned",
      reportSubdir,
      "report.json"
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, jsonStr, "utf-8");
  }
);
