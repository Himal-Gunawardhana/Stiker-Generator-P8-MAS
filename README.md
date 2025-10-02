# 🏷️ Peshi Sticker Generator

A powerful web application for creating custom stickers with country templates and Excel data integration.

![Sticker Generator](https://img.shields.io/badge/Status-Live-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 🌍 **Multiple Country Templates**: Pre-built templates for USA, UK, Canada, Australia, Germany, France, Japan, and India
- 📊 **Excel Integration**: Upload Excel files and automatically map data to sticker fields
- 🎨 **Custom Templates**: Upload your own template images with interactive positioning
- 🎯 **Advanced Formatting**: Comprehensive text formatting controls including:
  - Font family, weight, and style options
  - Text decoration and alignment
  - Letter spacing and line height adjustments
  - Text shadow effects
- 📏 **Multiple Sizes**: Generate stickers in small, medium, or large sizes
- 💾 **Multiple Formats**: Export as PNG, PDF, or SVG
- 🖱️ **Interactive Editor**: Click-to-position text and color elements
- 🎨 **Real-time Preview**: See changes instantly as you edit

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Himal-Gunawardhana/Stiker-Generator-P8-MAS.git
cd Stiker-Generator-P8-MAS
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 📖 Usage

### Using Preset Templates

1. **Select a Country Template**: Choose from 8 pre-built country templates
2. **Upload Excel File**: Your Excel file should contain at least "Code" and "Color" columns
3. **Configure Settings**: Choose sticker size and output format
4. **Generate Stickers**: Click generate to create your stickers
5. **Download**: Download individual stickers or all at once

### Using Custom Templates

1. **Upload Template Image**: Click "Upload Custom Template" and select your image
2. **Position Elements**: Click on the template to add text and color elements
3. **Map Excel Columns**: Map your Excel columns to the positioned elements
4. **Format Text**: Use the formatting controls to style your text
5. **Generate**: Create your custom stickers

### Excel File Format

Your Excel file should include these columns:

- **Code**: Product or item code (required)
- **Color**: Color value or name (required)
- **Title**: Additional text (optional)

Example:
| Code | Color | Title |
|------|-------|-------|
| ABC001 | #FF0000 | Red Product |
| XYZ002 | #00FF00 | Green Item |

## 🛠️ API Endpoints

- `GET /api/template/:country` - Get template configuration
- `POST /api/upload-excel` - Upload and process Excel file
- `POST /api/generate-stickers` - Generate stickers
- `GET /api/download/:filename` - Download generated files
- `GET /api/health` - Health check

## 🌐 Deployment

### Deploy to GitHub Pages (Static Version)

1. **Enable GitHub Pages**:

   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as source

2. **Automatic Deployment**:
   - Push changes to main branch
   - GitHub Actions will build and deploy automatically
   - Access your app at: `https://your-username.github.io/Stiker-Generator-P8-MAS`

⚠️ **Note**: GitHub Pages version has limited functionality (no server-side features)

### Deploy to Vercel (Full Features - Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm install`
3. Set publish directory: `public`

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Railway will automatically detect and deploy your Node.js app

### Deploy to Render

1. Connect your GitHub repository to Render
2. Render will use the `render.yaml` configuration

### Docker Deployment

```bash
docker build -t peshi-sticker-generator .
docker run -p 3000:3000 peshi-sticker-generator
```

## 🏗️ Project Structure

```
peshi-sticker-generator/
├── public/                 # Frontend files
│   ├── index.html         # Main interface
│   ├── script.js          # Frontend JavaScript
│   └── styles.css         # Styling
├── templates/             # Template images
├── uploads/               # Uploaded files
├── output/                # Generated stickers
├── server.js              # Express server
├── package.json           # Dependencies
├── vercel.json            # Vercel config
├── netlify.toml           # Netlify config
├── render.yaml            # Render config
└── Dockerfile             # Docker config
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Template Configuration

Templates are configured in `server.js` with:

- Position coordinates
- Font sizes and colors
- Supported formats
- Default dimensions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- Report bugs: [GitHub Issues](https://github.com/Himal-Gunawardhana/Stiker-Generator-P8-MAS/issues)
- Feature requests: [GitHub Discussions](https://github.com/Himal-Gunawardhana/Stiker-Generator-P8-MAS/discussions)

## 🙏 Acknowledgments

- Built with Express.js and Node.js
- Uses XLSX library for Excel processing
- Canvas API for interactive editing
- Multiple deployment platform support

---

**Made with ❤️ by the Peshi Development Team**
