import path from "path";
import fs from "fs";

function getAgentNames(reportsDir: string): string[] {
  return fs.readdirSync(reportsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function processReports(
  reportsDir: string,
  callback: (
    report: string,
    reportSubdir: string
  ) => void
): void {
  const agents = getAgentNames(reportsDir);
  agents.forEach((agentName) => {
    const agentDir = path.join(reportsDir, agentName);
    fs.readdirSync(agentDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .forEach((dirent) => {
        const reportPath = path.join(agentDir, dirent.name, "report.json");
        if (!fs.existsSync(reportPath)) {
          return;
        }
        const report = fs.readFileSync(reportPath, "utf-8");
        const reportSubdir = path.join(agentName, dirent.name);
        callback(report, reportSubdir);
      });
  });
}
