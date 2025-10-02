class StickerCreator {
  constructor() {
    this.currentCountry = null;
    this.excelData = null;
    this.templateMode = "preset"; // 'preset' or 'custom'
    this.customTemplate = {
      image: null,
      size: { width: 400, height: 300 },
      displaySize: { width: 400, height: 300 },
      positions: [],
    };
    this.columnMapping = {};

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Template mode selection
    document.querySelectorAll(".template-option-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        document
          .querySelectorAll(".template-option-card")
          .forEach((c) => c.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const mode = e.currentTarget.dataset.mode;
        this.templateMode = mode;

        document.querySelectorAll(".template-content").forEach((content) => {
          content.classList.remove("active");
        });

        if (mode === "preset") {
          document.getElementById("presetTemplates").classList.add("active");
          document.getElementById("mappingSection").style.display = "none";
        } else {
          document.getElementById("customTemplates").classList.add("active");
        }

        this.validateForm();
      });
    });

    // Preset template selection
    document.querySelectorAll(".template-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        document
          .querySelectorAll(".template-card")
          .forEach((c) => c.classList.remove("selected"));
        e.currentTarget.classList.add("selected");
        this.currentCountry = e.currentTarget.dataset.country;
        this.validateForm();
      });
    });

    // Custom template upload
    document
      .getElementById("templateUpload")
      .addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleTemplateUpload(file);
        }
      });

    // Canvas click handler
    document.addEventListener("click", (e) => {
      if (e.target.id === "templateCanvas") {
        this.handleCanvasClick(e);
      }
    });

    // Element type change
    document
      .getElementById("elementTypeSelect")
      .addEventListener("change", (e) => {
        const isColor = e.target.value === "color";
        document.getElementById("elementNameGroup").style.display = isColor
          ? "none"
          : "block";
        document.getElementById("textControls").style.display = isColor
          ? "none"
          : "block";
        document.getElementById("colorControls").style.display = isColor
          ? "block"
          : "none";

        if (isColor) {
          document.getElementById("elementName").value = "color";
        } else {
          document.getElementById("elementName").value = "";
        }
      });

    // Template size inputs
    document.getElementById("templateWidth").addEventListener("change", () => {
      this.updateTemplateSize();
    });

    document.getElementById("templateHeight").addEventListener("change", () => {
      this.updateTemplateSize();
    });

    // Excel upload
    document.getElementById("excelUpload").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.uploadExcel(file);
      }
    });

    // Form inputs
    document.getElementById("stickerName").addEventListener("input", () => {
      this.validateForm();
    });

    // Generate button
    document.getElementById("generateBtn").addEventListener("click", () => {
      this.generateStickers();
    });

    // Range slider event listeners for live value updates
    document.getElementById("letterSpacing").addEventListener("input", (e) => {
      document.getElementById("letterSpacingValue").textContent =
        e.target.value + "px";
    });

    document.getElementById("lineHeight").addEventListener("input", (e) => {
      document.getElementById("lineHeightValue").textContent = e.target.value;
    });
  }

  updateTemplateSize() {
    const width = parseInt(document.getElementById("templateWidth").value);
    const height = parseInt(document.getElementById("templateHeight").value);

    if (width > 0 && height > 0) {
      this.customTemplate.size = { width, height };
      console.log(`Template size updated to: ${width} x ${height}px`);
      this.validateForm();
    }
  }

  handleTemplateUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.setupCustomTemplateEditor(img, e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  setupCustomTemplateEditor(img, imageUrl) {
    const canvas = document.getElementById("templateCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size maintaining aspect ratio
    const maxWidth = 600;
    const maxHeight = 400;

    let { width, height } = img;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Draw image on canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Store template info
    this.customTemplate.image = imageUrl; // Store the base64 data URL
    this.customTemplate.size = {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
    this.customTemplate.displaySize = { width, height };
    this.customTemplate.positions = [];

    // Auto-update the size input fields with detected dimensions
    document.getElementById("templateWidth").value = img.naturalWidth;
    document.getElementById("templateHeight").value = img.naturalHeight;

    console.log(
      `Auto-detected template size: ${img.naturalWidth} x ${img.naturalHeight}px`
    );

    // Show success message for auto-detection
    this.showSuccess(
      `✅ Template size auto-detected: ${img.naturalWidth} x ${img.naturalHeight}px`
    );

    // Show editor
    document.getElementById("customTemplateEditor").style.display = "block";

    // Reset positions list
    this.updatePositionsList();
    this.validateForm();
  }

  // Handle canvas click for adding positions
  handleCanvasClick(e) {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();

    // Get click coordinates relative to canvas
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Convert to actual template coordinates
    const scaleX =
      this.customTemplate.size.width / this.customTemplate.displaySize.width;
    const scaleY =
      this.customTemplate.size.height / this.customTemplate.displaySize.height;

    const actualX = Math.round(x * scaleX);
    const actualY = Math.round(y * scaleY);

    // Get element properties
    const elementType = document.getElementById("elementTypeSelect").value;
    const elementName =
      elementType === "color"
        ? "color"
        : document.getElementById("elementName").value.trim();

    if (!elementName) {
      this.showError("Please enter a column name for this element.");
      return;
    }

    // Create position object
    const position = {
      id: Date.now(),
      name: elementName.toLowerCase(),
      x: actualX,
      y: actualY,
      displayX: x,
      displayY: y,
    };

    if (elementType === "color") {
      position.type = "color";
      position.width = parseInt(document.getElementById("colorWidth").value);
      position.height = parseInt(document.getElementById("colorHeight").value);
    } else {
      position.fontSize = parseInt(document.getElementById("fontSize").value);
      position.color = document.getElementById("textColor").value;
      position.align = document.getElementById("textAlign").value;
      position.fontFamily = document.getElementById("fontFamily").value;
      position.fontWeight = document.getElementById("fontWeight").value;
      position.fontStyle = document.getElementById("fontStyle").value;
      position.textDecoration = document.getElementById("textDecoration").value;
      position.letterSpacing =
        document.getElementById("letterSpacing").value + "px";
      position.lineHeight = document.getElementById("lineHeight").value;
      position.textShadow = document.getElementById("textShadow").value;
    }

    // Add to positions array
    this.customTemplate.positions.push(position);

    // Update display
    this.addPositionMarker(position);
    this.updatePositionsList();

    // Clear element name for next addition (except for color)
    if (elementType !== "color") {
      document.getElementById("elementName").value = "";
    }

    this.validateForm();
  }

  addPositionMarker(position) {
    const markersContainer = document.getElementById("positionMarkers");
    const marker = document.createElement("div");
    marker.className = "position-marker";
    marker.setAttribute("data-name", position.name);
    marker.style.left = position.displayX + "px";
    marker.style.top = position.displayY + "px";
    marker.dataset.positionId = position.id;
    markersContainer.appendChild(marker);
  }

  updatePositionsList() {
    const listContainer = document.getElementById("positionsList");
    if (this.customTemplate.positions.length === 0) {
      listContainer.innerHTML =
        '<p style="color: #718096; font-style: italic;">No positions added yet. Click on the template to add fields.</p>';
      return;
    }

    listContainer.innerHTML = this.customTemplate.positions
      .map(
        (position) => `
      <div class="position-item">
        <div class="position-info">
          <div class="position-name">${position.name}</div>
          <div class="position-coords">${
            position.type === "color" ? "Color Block" : "Text"
          } at (${position.x}, ${position.y})</div>
        </div>
        <button class="remove-position" onclick="stickerCreator.removePosition(${
          position.id
        })">Remove</button>
      </div>
    `
      )
      .join("");
  }

  removePosition(positionId) {
    // Remove from positions array
    this.customTemplate.positions = this.customTemplate.positions.filter(
      (p) => p.id !== positionId
    );

    // Remove marker from canvas
    const marker = document.querySelector(`[data-position-id="${positionId}"]`);
    if (marker) {
      marker.remove();
    }

    // Update positions list
    this.updatePositionsList();
    this.validateForm();
  }

  async uploadExcel(file) {
    const formData = new FormData();
    formData.append("excel", file);

    try {
      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        this.excelData = result.data;
        this.displayExcelPreview(result.data, result.columns);

        // If using custom template, show column mapping
        if (
          this.templateMode === "custom" &&
          this.customTemplate.positions.length > 0
        ) {
          this.generateColumnMapping(result.columns);
          document.getElementById("mappingSection").style.display = "block";
        }

        this.validateForm();
      } else {
        this.showError(result.error || "Failed to upload Excel file");
      }
    } catch (error) {
      console.error("Error uploading Excel:", error);
      this.showError("Failed to upload Excel file");
    }
  }

  displayExcelPreview(data, columns) {
    const previewContainer = document.getElementById("excelPreview");

    if (data.length === 0) {
      previewContainer.innerHTML = "<p>No data found in Excel file.</p>";
      return;
    }

    const previewData = data.slice(0, 5); // Show first 5 rows

    let tableHtml = `
      <h4>Excel Preview (${data.length} total rows)</h4>
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${col}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${previewData
            .map(
              (row) => `
            <tr>
              ${columns.map((col) => `<td>${row[col] || "-"}</td>`).join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    if (data.length > 5) {
      tableHtml += `<p style="margin-top: 10px; color: #718096; font-size: 0.9rem;">... and ${
        data.length - 5
      } more rows</p>`;
    }

    previewContainer.innerHTML = tableHtml;
  }

  generateColumnMapping(excelColumns) {
    const mappingContainer = document.getElementById("columnMapping");
    const positionNames = this.customTemplate.positions.map((p) => p.name);

    mappingContainer.innerHTML = positionNames
      .map(
        (positionName) => `
      <div class="mapping-item">
        <div class="mapping-label">${positionName}:</div>
        <select class="mapping-select" data-position="${positionName}">
          <option value="">Select Excel Column</option>
          ${excelColumns
            .map((col) => `<option value="${col}">${col}</option>`)
            .join("")}
        </select>
      </div>
    `
      )
      .join("");

    // Add event listeners to mapping selects
    mappingContainer.querySelectorAll(".mapping-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const positionName = e.target.dataset.position;
        const columnName = e.target.value;

        if (columnName) {
          this.columnMapping[positionName] = columnName;
        } else {
          delete this.columnMapping[positionName];
        }

        this.validateForm();
      });
    });
  }

  validateForm() {
    const generateBtn = document.getElementById("generateBtn");
    const stickerName = document.getElementById("stickerName").value.trim();

    let isValid = false;

    if (this.templateMode === "preset") {
      // For preset templates: need country, excel data, and sticker name
      isValid =
        this.currentCountry &&
        this.excelData &&
        this.excelData.length > 0 &&
        stickerName;
    } else if (this.templateMode === "custom") {
      // For custom templates: need template image, positions, column mapping, excel data, and sticker name
      const hasTemplate =
        this.customTemplate.image && this.customTemplate.positions.length > 0;
      const hasMapping = Object.keys(this.columnMapping).length > 0;

      isValid =
        hasTemplate &&
        hasMapping &&
        this.excelData &&
        this.excelData.length > 0 &&
        stickerName;
    }

    generateBtn.disabled = !isValid;
  }

  async generateStickers() {
    const generateBtn = document.getElementById("generateBtn");
    const btnText = generateBtn.querySelector(".btn-text");
    const btnLoader = generateBtn.querySelector(".btn-loader");

    // Show loading state
    generateBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "block";

    try {
      const requestData = {
        country: this.currentCountry,
        data: this.excelData,
        stickerName: document.getElementById("stickerName").value,
        outputFormat: document.getElementById("outputFormat").value,
        stickerSize: document.getElementById("stickerSize").value,
      };

      // Add custom template data if using custom template
      if (
        this.templateMode === "custom" &&
        this.customTemplate.positions.length > 0
      ) {
        requestData.customTemplate = {
          positions: this.customTemplate.positions,
          size: this.customTemplate.size,
          image: this.customTemplate.image, // Include the base64 image data
        };
        requestData.columnMapping = this.columnMapping;
        console.log("Sending custom template data:", {
          positions: this.customTemplate.positions,
          columnMapping: this.columnMapping,
          templateSize: this.customTemplate.size,
        });
      }

      const response = await fetch("/api/generate-stickers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate stickers");
      }

      const result = await response.json();
      this.displayResults(result);

      document.getElementById("resultsSection").style.display = "block";
      document.getElementById("resultsSection").scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error generating stickers:", error);
      this.showError("Failed to generate stickers. Please try again.");
    } finally {
      // Reset button state
      generateBtn.disabled = false;
      btnText.style.display = "block";
      btnLoader.style.display = "none";
    }
  }

  displayResults(results) {
    const resultsGrid = document.getElementById("resultsGrid");

    resultsGrid.innerHTML = results.stickers
      .map(
        (sticker, index) => `
            <div class="sticker-result">
                <div class="sticker-preview" id="preview_${sticker.id}">
                    ${sticker.html}
                </div>
                <h4>${sticker.name}</h4>
                <p><strong>Code:</strong> ${sticker.code}</p>
                <p><strong>Color:</strong> <span style="display: inline-block; width: 20px; height: 20px; background: ${sticker.color}; border: 1px solid #ccc; border-radius: 3px; vertical-align: middle;"></span> ${sticker.color}</p>
                <button class="download-individual" onclick="stickerCreator.downloadStickerAsPNG('preview_${sticker.id}', '${sticker.filename}')">
                    Download PNG
                </button>
            </div>
        `
      )
      .join("");
  }

  async downloadStickerAsPNG(elementId, filename) {
    try {
      const element = document.getElementById(elementId);
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error downloading sticker:", error);
      this.showError("Failed to download sticker");
    }
  }

  showError(message) {
    // Remove existing error messages
    document.querySelectorAll(".error-message").forEach((el) => el.remove());

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    // Insert after the current section
    const activeSection = document.querySelector(".section");
    activeSection.parentNode.insertBefore(errorDiv, activeSection.nextSibling);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  showSuccess(message) {
    // Remove existing success messages
    document.querySelectorAll(".success-message").forEach((el) => el.remove());

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;

    // Insert after the current section
    const activeSection = document.querySelector(".section");
    activeSection.parentNode.insertBefore(
      successDiv,
      activeSection.nextSibling
    );

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 3000);
  }
}

// Initialize the application
const stickerCreator = new StickerCreator();

// Add global event listener for form validation
document.addEventListener("input", () => {
  stickerCreator.validateForm();
});
