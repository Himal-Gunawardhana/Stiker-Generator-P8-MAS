const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const fsSync = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// Ensure directories exist
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "output");
const templatesDir = path.join(__dirname, "templates");

[uploadDir, outputDir, templatesDir].forEach((dir) => {
  if (!fsSync.existsSync(dir)) {
    fsSync.mkdirSync(dir, { recursive: true });
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "excel") {
      const allowedExcelTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (allowedExcelTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only Excel files are allowed"), false);
      }
    } else if (file.fieldname === "template") {
      const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"), false);
      }
    } else {
      cb(null, true);
    }
  },
});

// Template configurations
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

// API Routes

// Get template configuration
app.get("/api/template/:country", (req, res) => {
  const country = req.params.country.toLowerCase();
  const config = templateConfigs[country];

  if (!config) {
    return res.status(404).json({ error: "Template not found" });
  }

  res.json(config);
});

// Upload and process Excel file
app.post("/api/upload-excel", upload.single("excel"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Validate required columns
    if (data.length === 0) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    const firstRow = data[0];
    console.log("Excel file column headers:", Object.keys(firstRow));
    console.log("Sample Excel row data:", firstRow);

    // Create case-insensitive column checking
    const columnKeys = Object.keys(firstRow).map((key) => key.toLowerCase());
    const hasCode = columnKeys.includes("code");
    const hasColor =
      columnKeys.includes("color") || columnKeys.includes("colour");

    console.log("Column check - hasCode:", hasCode, "hasColor:", hasColor);

    if (!hasCode || !hasColor) {
      return res.status(400).json({
        error: 'Excel file must contain "Code" and "Color" columns',
      });
    }

    // Keep original data structure - don't normalize column names
    // This allows the column mapping to work with the original Excel column names
    const normalizedData = data;

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting uploaded file:", err);
    });

    res.json({
      success: true,
      data: normalizedData,
      columns: Object.keys(data[0]),
      count: normalizedData.length,
    });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).json({ error: "Failed to process Excel file" });
  }
});

// Generate stickers
app.post("/api/generate-stickers", async (req, res) => {
  try {
    const {
      country,
      data,
      stickerName,
      outputFormat,
      stickerSize,
      customTemplate,
      columnMapping,
    } = req.body;

    let config;

    if (customTemplate && customTemplate.positions) {
      // Use custom template
      config = {
        name: "Custom Template",
        positions: customTemplate.positions,
        size: customTemplate.size || { width: 300, height: 200 },
        image: customTemplate.image, // Include the base64 image data
        supportedFormats: ["PNG", "PDF", "SVG"],
      };
    } else {
      // Use preset template
      config = templateConfigs[country.toLowerCase()];
      if (!config) {
        return res.status(404).json({ error: "Template not found" });
      }
    }

    // Calculate size based on selection
    let size = config.size;
    let sizeClass = "medium";
    if (stickerSize === "small") {
      size = {
        width: Math.round(config.size.width * 0.7),
        height: Math.round(config.size.height * 0.7),
      };
      sizeClass = "small";
    } else if (stickerSize === "large") {
      size = {
        width: Math.round(config.size.width * 1.3),
        height: Math.round(config.size.height * 1.3),
      };
      sizeClass = "large";
    }

    const results = [];

    // Create HTML-based stickers for each row of data
    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      const templateName = customTemplate ? "custom" : country;
      const stickerId = `sticker_${templateName}_${i}_${Date.now()}`;

      // Map Excel data to template positions using column mapping
      const mappedData = {};
      if (columnMapping) {
        // Use column mapping for custom templates
        console.log("Using column mapping:", columnMapping);
        console.log("Row data structure:", rowData);
        console.log("Available keys in rowData:", Object.keys(rowData));

        // Create case-insensitive lookup for Excel columns
        const excelColumnLookup = {};
        Object.keys(rowData).forEach((key) => {
          excelColumnLookup[key.toLowerCase()] = key;
        });
        console.log(
          "Excel column lookup (case-insensitive):",
          excelColumnLookup
        );

        Object.keys(columnMapping).forEach((positionName) => {
          const columnName = columnMapping[positionName];

          // Try exact match first
          let value = rowData[columnName];

          // If no exact match, try case-insensitive match
          if (value === undefined) {
            const lowerColumnName = columnName.toLowerCase();
            const actualColumnName = excelColumnLookup[lowerColumnName];
            if (actualColumnName) {
              value = rowData[actualColumnName];
              console.log(
                `Case-insensitive match: ${columnName} -> ${actualColumnName} = ${value}`
              );
            }
          }

          mappedData[positionName] = value;
          console.log(`Mapped ${positionName} -> ${columnName} = ${value}`);
        });
      } else {
        // Use direct mapping for preset templates
        mappedData = rowData;
      }
      console.log("Final mapped data:", mappedData);

      // Generate HTML for the sticker
      const stickerHtml = generateStickerHTML(
        config,
        mappedData,
        size,
        templateName,
        sizeClass
      );

      results.push({
        id: stickerId,
        name: `Sticker ${i + 1}`,
        code: mappedData.code || rowData.code || "N/A",
        color: mappedData.color || rowData.color || "N/A",
        html: stickerHtml,
        filename: `${stickerName}_${templateName}_${i + 1}_${
          mappedData.code || rowData.code || "unknown"
        }`,
        size: size,
      });
    }

    res.json({
      success: true,
      count: results.length,
      stickers: results,
      config: config,
    });
  } catch (error) {
    console.error("Error generating stickers:", error);
    res.status(500).json({ error: "Failed to generate stickers" });
  }
});

function generateStickerHTML(config, data, size, country, sizeClass) {
  console.log("Generating sticker HTML for:", {
    config: config.name,
    data,
    size,
    country,
    sizeClass,
  });
  console.log("Template positions:", config.positions);
  console.log("Config size:", config.size, "Output size:", size);

  const scaleX = size.width / config.size.width;
  const scaleY = size.height / config.size.height;

  console.log("Scaling factors - X:", scaleX, "Y:", scaleY);

  let positionsHtml = "";

  config.positions.forEach((position) => {
    const value = data[position.name] || "";
    let x, y;

    // Always scale coordinates based on the size ratio
    // Position coordinates are stored in template coordinate system
    x = Math.round(position.x * scaleX);
    y = Math.round(position.y * scaleY);

    console.log(
      `Position ${position.name}: original(${position.x}, ${position.y}) -> scaled(${x}, ${y})`
    );

    if (position.type === "color") {
      // Handle color blocks
      const colorValue = data[position.name] || data.color || "#CCCCCC";

      // Always scale dimensions based on the size ratio
      const width = Math.round((position.width || 50) * scaleX);
      const height = Math.round((position.height || 30) * scaleY);

      console.log(
        `Color block ${position.name}: original(${position.width || 50}x${
          position.height || 30
        }) -> scaled(${width}x${height})`
      );

      positionsHtml += `
                <div class="color-box" style="
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${width}px;
                    height: ${height}px;
                    background-color: ${colorValue};
                    border: 1px solid #000;
                "></div>
            `;
    } else if (value) {
      // Handle text elements
      // Always scale font size based on the scaling factor
      const fontSize = Math.round(
        (position.fontSize || 14) * Math.min(scaleX, scaleY)
      );

      console.log(
        `Adding text element: ${position.name} = "${value}" at (${x}, ${y}) with fontSize ${fontSize}`
      );

      positionsHtml += `
                <div class="sticker-text" style="
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: ${fontSize}px;
                    color: ${position.color || "#000000"} !important;
                    font-family: ${
                      position.fontFamily || "Arial, sans-serif"
                    } !important;
                    font-weight: ${position.fontWeight || "normal"} !important;
                    font-style: ${position.fontStyle || "normal"} !important;
                    text-decoration: ${
                      position.textDecoration || "none"
                    } !important;
                    text-align: ${position.align || "left"} !important;
                    line-height: ${position.lineHeight || "1.2"} !important;
                    letter-spacing: ${
                      position.letterSpacing || "0px"
                    } !important;
                    text-shadow: ${position.textShadow || "none"} !important;
                    white-space: nowrap !important;
                    z-index: 999 !important;
                    display: block !important;
                ">${value}</div>
            `;
    }
  });

  // Different styling for custom vs preset templates
  let containerStyle, headerHtml, borderHtml;

  if (country === "custom" && config.image) {
    // Custom template with uploaded background image
    containerStyle = `
            position: relative;
            width: ${size.width}px;
            height: ${size.height}px;
            background-image: url('${config.image}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        `;
    headerHtml = ""; // No header for custom templates
    borderHtml = ""; // No border for custom templates
  } else {
    // Preset template styling
    containerStyle = `
            position: relative;
            width: ${size.width}px;
            height: ${size.height}px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 3px solid ${getCountryColor(country)};
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        `;
    headerHtml = `
            <div class="country-header" style="
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                font-size: ${Math.round(16 * Math.min(scaleX, scaleY))}px;
                font-weight: bold;
                color: ${getCountryColor(country)};
                text-transform: uppercase;
            ">${country}</div>
        `;
    borderHtml = `
            <div class="sticker-border" style="
                position: absolute;
                top: 5px;
                left: 5px;
                right: 5px;
                bottom: 5px;
                border: 1px dashed ${getCountryColor(country)};
                border-radius: 4px;
                opacity: 0.3;
            "></div>
        `;
  }

  const finalHtml = `
        <div class="sticker-container ${country} ${sizeClass}" style="${containerStyle}">
            ${headerHtml}
            ${positionsHtml}
            ${borderHtml}
        </div>
    `;

  console.log("Generated HTML length:", finalHtml.length);
  console.log("Positions HTML:", positionsHtml);

  return finalHtml;
}

function getCountryColor(country) {
  const colors = {
    usa: "#0052CC",
    uk: "#000080",
    canada: "#FF0000",
    australia: "#0066CC",
    germany: "#000000",
    france: "#0055AA",
    japan: "#CC0000",
    india: "#FF6600",
  };
  return colors[country] || "#000000";
}

// Download individual sticker
app.get("/api/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "output", filename);

  if (fsSync.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Peshi Sticker Creator server running on http://localhost:${PORT}`
  );
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`📁 Templates directory: ${templatesDir}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down Peshi Sticker Creator server...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down Peshi Sticker Creator server...");
  process.exit(0);
});
