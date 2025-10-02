const XLSX = require("xlsx");

// Create test Excel file
const testData = [
  { Code: "ABC001", Color: "#FF0000", Title: "Red Product" },
  { Code: "XYZ002", Color: "#00FF00", Title: "Green Product" },
  { Code: "DEF003", Color: "#0000FF", Title: "Blue Product" },
];

const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(testData);
XLSX.utils.book_append_sheet(workbook, worksheet, "Test Data");
XLSX.writeFile(workbook, "test-stickers.xlsx");

console.log("✅ Test Excel file created: test-stickers.xlsx");
console.log("📊 Data structure:", testData[0]);
console.log("📋 Columns:", Object.keys(testData[0]));
