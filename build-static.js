const fs = require("fs");
const path = require("path");

console.log("🔧 Building static version for GitHub Pages...");

// Read the current index.html
const indexPath = path.join(__dirname, "public", "index.html");
const indexContent = fs.readFileSync(indexPath, "utf8");

// Create a modified version that includes the template configurations inline
const templateConfigs = {
  usa: {
    name: "USA Standard",
    previewImage: "/templates/usa-preview.svg",
    templateImage: "templates/usa-template.svg",
    positions: [
      {
        name: "code",
        x: 60,
        y: 110,
        fontSize: 22,
        color: "#0052CC",
        align: "left",
      },
      { name: "color", x: 200, y: 105, type: "color", width: 45, height: 25 },
      {
        name: "title",
        x: 60,
        y: 150,
        fontSize: 16,
        color: "#0052CC",
        align: "left",
      },
    ],
    size: { width: 300, height: 200 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
  uk: {
    name: "UK Standard",
    previewImage: "/templates/uk-preview.svg",
    templateImage: "templates/uk-template.svg",
    positions: [
      {
        name: "code",
        x: 50,
        y: 95,
        fontSize: 24,
        color: "#000080",
        align: "left",
      },
      { name: "color", x: 180, y: 90, type: "color", width: 55, height: 30 },
      {
        name: "title",
        x: 50,
        y: 135,
        fontSize: 18,
        color: "#000080",
        align: "left",
      },
    ],
    size: { width: 280, height: 180 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
  canada: {
    name: "Canada Standard",
    previewImage: "/templates/canada-preview.svg",
    templateImage: "templates/canada-template.svg",
    positions: [
      {
        name: "code",
        x: 45,
        y: 100,
        fontSize: 25,
        color: "#FF0000",
        align: "left",
      },
      { name: "color", x: 175, y: 95, type: "color", width: 50, height: 30 },
      {
        name: "title",
        x: 45,
        y: 140,
        fontSize: 20,
        color: "#FF0000",
        align: "left",
      },
    ],
    size: { width: 320, height: 220 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
  australia: {
    name: "Australia Standard",
    previewImage: "/templates/australia-preview.svg",
    templateImage: "templates/australia-template.svg",
    positions: [
      {
        name: "code",
        x: 55,
        y: 105,
        fontSize: 24,
        color: "#0066CC",
        align: "left",
      },
      { name: "color", x: 190, y: 100, type: "color", width: 50, height: 30 },
      {
        name: "title",
        x: 55,
        y: 145,
        fontSize: 18,
        color: "#0066CC",
        align: "left",
      },
    ],
    size: { width: 290, height: 190 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
  germany: {
    name: "Germany Standard",
    previewImage: "/templates/germany-preview.svg",
    templateImage: "templates/germany-template.svg",
    positions: [
      {
        name: "code",
        x: 50,
        y: 90,
        fontSize: 23,
        color: "#000000",
        align: "left",
      },
      { name: "color", x: 170, y: 85, type: "color", width: 60, height: 35 },
      {
        name: "title",
        x: 50,
        y: 130,
        fontSize: 19,
        color: "#000000",
        align: "left",
      },
    ],
    size: { width: 275, height: 185 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
  france: {
    name: "France Standard",
    previewImage: "/templates/france-preview.svg",
    templateImage: "templates/france-template.svg",
    positions: [
      {
        name: "code",
        x: 55,
        y: 105,
        fontSize: 22,
        color: "#0055AA",
        align: "left",
      },
      { name: "color", x: 185, y: 100, type: "color", width: 48, height: 28 },
      {
        name: "title",
        x: 55,
        y: 145,
        fontSize: 17,
        color: "#0055AA",
        align: "left",
      },
    ],
    size: { width: 285, height: 195 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
  japan: {
    name: "Japan Standard",
    previewImage: "/templates/japan-preview.svg",
    templateImage: "templates/japan-template.svg",
    positions: [
      {
        name: "code",
        x: 60,
        y: 115,
        fontSize: 21,
        color: "#CC0000",
        align: "center",
      },
      { name: "color", x: 150, y: 110, type: "color", width: 50, height: 25 },
      {
        name: "title",
        x: 60,
        y: 150,
        fontSize: 18,
        color: "#CC0000",
        align: "center",
      },
    ],
    size: { width: 270, height: 190 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
  india: {
    name: "India Standard",
    previewImage: "/templates/india-preview.svg",
    templateImage: "templates/india-template.svg",
    positions: [
      {
        name: "code",
        x: 55,
        y: 100,
        fontSize: 26,
        color: "#FF6600",
        align: "left",
      },
      { name: "color", x: 185, y: 95, type: "color", width: 55, height: 32 },
      {
        name: "title",
        x: 55,
        y: 145,
        fontSize: 20,
        color: "#FF6600",
        align: "left",
      },
    ],
    size: { width: 310, height: 210 },
    supportedFormats: ["PNG", "PDF", "SVG"],
  },
};

// Inject the template configurations into the HTML
const modifiedContent = indexContent.replace(
  "</head>",
  `  <script>
    // Template configurations for static version
    window.TEMPLATE_CONFIGS = ${JSON.stringify(templateConfigs, null, 2)};
    
    // GitHub Pages indicator
    window.GITHUB_PAGES = true;
    window.BASE_URL = window.location.origin + window.location.pathname.replace('/index.html', '');
  </script>
</head>`
);

// Write the modified HTML to dist directory
const distPath = path.join(__dirname, "dist");
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

fs.writeFileSync(path.join(distPath, "index.html"), modifiedContent);

// Copy other necessary files
const filesToCopy = ["script.js", "styles.css"];
filesToCopy.forEach((file) => {
  const sourcePath = path.join(__dirname, "public", file);
  const destPath = path.join(distPath, file);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
  }
});

// Create a simplified version message
fs.writeFileSync(
  path.join(distPath, "README.md"),
  `
# Peshi Sticker Generator - GitHub Pages Version

This is a simplified static version hosted on GitHub Pages.

⚠️ **Limited Functionality**: This version has reduced functionality compared to the full Node.js version.

## Available Features:
- ✅ Template preview and selection
- ✅ Manual sticker creation (client-side only)
- ✅ Custom template upload and positioning
- ✅ Text formatting controls
- ❌ Excel file processing (requires server)
- ❌ Bulk sticker generation (requires server)

## Full Version Available At:
- **Vercel**: [Deploy to Vercel](https://vercel.com/import/project?template=https://github.com/Himal-Gunawardhana/Stiker-Generator-P8-MAS)
- **Railway**: [Deploy to Railway](https://railway.app/new/template?template=https://github.com/Himal-Gunawardhana/Stiker-Generator-P8-MAS)
- **Render**: [Deploy to Render](https://render.com/deploy?repo=https://github.com/Himal-Gunawardhana/Stiker-Generator-P8-MAS)

---
**Made with ❤️ by the Peshi Development Team**
`
);

console.log("✅ Static version built successfully!");
console.log("📁 Files created in dist/ directory");
console.log("🚀 Ready for GitHub Pages deployment");
