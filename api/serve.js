const fs = require("fs");
const path = require("path");

// Force the bundler to include these files by referencing them
const FILES = {
  "site": path.join(__dirname, "..", "index.html"),
  "platform-status": path.join(__dirname, "..", "platform-status.html"),
  "infrastructure": path.join(__dirname, "..", "infrastructure.html"),
  "documentation": path.join(__dirname, "..", "documentation.html"),
  "about": path.join(__dirname, "..", "about.html"),
  "api-tokens": path.join(__dirname, "..", "api-tokens.html"),
  "maintenance": path.join(__dirname, "..", "maintenance.html"),
  "compliance": path.join(__dirname, "..", "compliance.html"),
  "deployment": path.join(__dirname, "..", "deployment.html"),
  "integrations": path.join(__dirname, "..", "integrations.html"),
  "credentials": path.join(__dirname, "..", "credentials.html"),
  "migration": path.join(__dirname, "..", "migration.html"),
  "seo-report": path.join(__dirname, "..", "seo-report.html"),
};

// Pre-load all HTML at cold start to ensure they're bundled
const CACHE = {};
for (const [key, filepath] of Object.entries(FILES)) {
  try {
    CACHE[key] = fs.readFileSync(filepath, "utf-8");
  } catch (e) {
    // Will be loaded at request time if not available at cold start
  }
}

module.exports = async function handler(req, res) {
  const session = req.query.session || "unknown";
  const page = req.query.p || "site";

  let html = CACHE[page];
  if (!html) {
    const filepath = FILES[page];
    if (!filepath) {
      return res.status(404).send("Page not found");
    }
    try {
      html = fs.readFileSync(filepath, "utf-8");
    } catch (e) {
      return res.status(404).send("File not available");
    }
  }

  html = html.replace(/SESSION_ID/g, session);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
};
