import { processReports } from "./common";

import path from "path";
import fs from "fs";

const reportsDir = path.join(__dirname, "../reports-pruned");

type ReportValue<T = number> = {
  report: string;
  value: T;
}

const bestOfRuns: Record<string, {
  "success_%": ReportValue[],
  "cost": ReportValue[],
  "run_time": ReportValue<string>[]
}> = {};

processReports(
  reportsDir,
  (report, reportSubdir) => {
    const json = JSON.parse(report);

    if (!json.tests) {
      return;
    }

    for (const [name, result] of Object.entries(json.tests)) {
      if (!result) {
        continue;
      }
      const metrics = (result as any).metrics;
      if (!metrics) {
        continue;
      }

      if (!bestOfRuns[name]) {
        bestOfRuns[name] = {
          "success_%": [],
          "cost": [],
          "run_time": []
        };
      }

      // save the top 3 in each categor
      if (metrics["success_%"]) {
        bestOfRuns[name]["success_%"].push({
          report: reportSubdir,
          value: metrics["success_%"]
        });
        bestOfRuns[name]["success_%"].sort((a, b) =>
          b.value - a.value
        );
        if (bestOfRuns[name]["success_%"].length > 3) {
          bestOfRuns[name]["success_%"].pop();
        }
      }

      if (metrics["cost"]) {
        bestOfRuns[name]["cost"].push({
          report: reportSubdir,
          value: metrics["cost"]
        });
        bestOfRuns[name]["cost"].sort((a, b) =>
          a.value - b.value
        );
        if (bestOfRuns[name]["cost"].length > 3) {
          bestOfRuns[name]["cost"].pop();
        }
      }

      bestOfRuns[name]["run_time"].push({
        report: reportSubdir,
        value: metrics["run_time"]
      });
      bestOfRuns[name]["run_time"].sort((a, b) =>
        a.value.localeCompare(b.value)
      );
      if (bestOfRuns[name]["run_time"].length > 3) {
        bestOfRuns[name]["run_time"].pop();
      }
    }
  }
);

const outputPath = path.join(__dirname, "../best-of.json");
fs.writeFileSync(
  outputPath,
  JSON.stringify(bestOfRuns, null, 2),
  "utf-8"
);
