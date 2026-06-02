# 🗺️ SIGAP RATU — WebGIS Platform PLTU Pelabuhan Ratu

Platform WebGIS modern yang dirancang untuk risk mapping, monitoring jalur evakuasi, dan keselamatan operasional PLTU Pelabuhan Ratu.

## 📋 Struktur Project

```
SIGAP-RATU/
│
├── index.html                 # File HTML utama (struktur layout saja)
├── README.md                  # Dokumentasi project
│
├── css/
│   └── style.css             # Semua styling (responsif & modern)
│
├── js/
│   └── script.js             # Semua logika JavaScript (modular)
│
├── assets/
│   ├── img/                  # Gambar & aset visual
│   ├── icons/                # Icon custom
│   └── gpx/                  # File GPX jalur evakuasi
│
└── data/
    ├── zona.geojson          # Data zona risiko
    ├── evakuasi.geojson      # Data jalur evakuasi
    └── bangunan.geojson      # Data bangunan fasilitas
```

## 🎯 Fitur Utama

### Landing Page
- ✅ Navbar responsif dengan scroll effect
- ✅ Hero section dengan animasi SVG industrial
- ✅ Features showcase dengan card interactive
- ✅ Risk overview dengan statistics
- ✅ Preview map interaktif
- ✅ CTA section untuk membuka peta
- ✅ Responsive design (mobile & desktop)

### GIS Page
- 🗺️ **Peta Interaktif** - Leaflet.js dengan multiple basemaps
- 📍 **Layer Management** - Toggle zona risiko, jalur evakuasi, titik kumpul, fasilitas
- 🔴 **Risk Zones** - Visualisasi zona merah (sangat tinggi), kuning (tinggi), biru (buffer)
- 🚩 **Evacuation Routes** - 4 jalur evakuasi dengan arah panah
- 👥 **Assembly Points** - 5 titik kumpul dengan kapasitas
- 🏭 **Facilities** - 6 fasilitas penting PLTU
- 🔍 **Search** - Cari lokasi berdasarkan nama
- 📍 **Geolocation** - Lokasi pengguna saat ini
- 📥 **GPX Export** - Download jalur evakuasi
- 📊 **Coordinate Display** - Lat, Lng, Zoom level
- 🎨 **Modern UI** - Glassmorphism design

## 🚀 Quick Start

### Membuka Project

1. **Lokal Development**
   ```bash
   # Buka file index.html di browser
   # Atau gunakan live server
   python -m http.server 8000
   ```

2. **File Browser**
   - Buka `index.html` langsung di browser
   - Semua library sudah dari CDN

### Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🎨 Teknologi & Library

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Animations
- **JavaScript (ES6+)** - Modular, clean code

### Libraries
- **[Leaflet.js](https://leafletjs.com)** (v1.9.4) - Map interaktif
- **[Font Awesome](https://fontawesome.com)** (v6.5.0) - Icon library
- **[OpenStreetMap](https://www.openstreetmap.org)** - Base map tiles
- **[Esri ArcGIS](https://www.arcgis.com)** - Satellite imagery
- **[OpenTopoMap](https://opentopomap.org)** - Topographic map

### Fonts
- **Sora** - Font heading (Google Fonts)
- **DM Sans** - Font body (Google Fonts)

## 📝 Struktur File Detail

### index.html
- **Size**: ~20 KB
- **Purpose**: Layout struktur HTML saja
- **Fitur**: Semantic markup, accessibility, meta tags
- **Includes**: External CSS dan JavaScript

### css/style.css
- **Size**: ~60 KB
- **Organization**: Grouped by section
- **Features**:
  - Root CSS variables untuk color consistency
  - Responsive design (@media queries)
  - Animations & transitions
  - Glassmorphism effects
  - Leaflet customization

### js/script.js
- **Size**: ~25 KB
- **Organization**: Modular functions
- **Features**:
  - Landing page interactions
  - Map initialization
  - Layer management
  - Event handlers
  - Utility functions
  - GPX export

## 🎯 Customization

### Mengubah Warna Tema
Edit `:root` variables di `css/style.css`:
```css
:root {
  --em: #059669;           /* Primary color */
  --em-dark: #064e3b;      /* Dark primary */
  --em-light: #6ee7b7;     /* Light accent */
  /* ... */
}
```

### Menambah Layer Baru
Edit function `initGISMap()` di `js/script.js`:
```javascript
// Tambah layer baru
newLayer = L.layerGroup();
// ... tambah features ke layer
newLayer.addTo(gisMap);
```

### Mengubah Lokasi Center Map
Edit variable `center` di `initGISMap()`:
```javascript
const center = [-6.995, 106.560]; // Ganti dengan lat, lng baru
```

## 📊 Data Format

### GeoJSON (Opsional untuk future)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [106.560, -6.995]
      },
      "properties": {
        "name": "PLTU",
        "risk": "HIGH"
      }
    }
  ]
}
```

### GPX Export
File GPX untuk navigasi offline di GPS/Smartphone:
- Rute (routes)
- Waypoint (titik kumpul)
- Format valid v1.1

## 🔧 Development Tips

### Console Debugging
```javascript
// Akses global objects
console.log(gisMap);           // Leaflet map instance
console.log(layerState);       // Status layer
console.log(baseLayers);       // Basemap layers
```

### Performance Optimization
- Lazy load preview map saat section visible
- Layer grouping untuk efficient rendering
- CSS animations dengan `transform` & `opacity`
- Minimize repaints dengan event throttling

### Responsive Breakpoints
```css
@media (max-width: 900px)  /* Tablet */
@media (max-width: 600px)  /* Mobile */
```

## 🎨 Design System

### Color Palette
- **Primary**: #059669 (Emerald)
- **Dark**: #064e3b (Dark Emerald)
- **Light**: #6ee7b7 (Light Emerald)
- **Pale**: #d1fae5 (Pale Emerald)
- **Text**: #0f2419 (Dark)
- **Warning**: #ef4444 (Red)
- **Info**: #3b82f6 (Blue)

### Typography
- **Heading**: Sora (700-800 weight)
- **Body**: DM Sans (400-500 weight)
- **Sizing**: Responsive using `clamp()`

### Spacing System
- **Base**: 4px grid
- **Padding**: 1rem (16px) multipliers
- **Gap**: 1rem - 2.5rem

## 📱 Responsive Design

### Mobile (< 600px)
- Navbar links tersembunyi (hamburger menu optional)
- Hero section: column layout
- Sidebar tersembunyi di map
- Features grid: 1 column
- Stats grid: 2 columns

### Tablet (600px - 900px)
- Full navbar tapi compact
- Why section: stacked layout
- Sidebar visible di map
- Features grid: 2 columns

### Desktop (> 900px)
- Full navbar
- Why section: 2 columns
- Sidebar visible di map
- Features grid: 3 columns

## 🔐 Best Practices

### Code Quality
- ✅ Semantic HTML
- ✅ BEM-like CSS naming
- ✅ JSDoc comments
- ✅ Modular functions
- ✅ No inline styles (except dynamic)

### Accessibility
- ✅ ARIA labels (future)
- ✅ Semantic HTML elements
- ✅ Keyboard navigation (future)
- ✅ Color contrast compliance

### Performance
- ✅ CDN for external libraries
- ✅ Lazy loading for maps
- ✅ Efficient CSS selectors
- ✅ Minimal JavaScript execution

## 🚀 Deployment

### Static Hosting
Cocok untuk deployment di:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3**
- **Any web server**

### Untuk deployment:
1. Build tidak diperlukan (static files)
2. Upload ketiga folder: `css/`, `js/`, `data/`, plus `index.html`
3. Set `index.html` sebagai entry point

## 📦 Future Enhancements

- [ ] Real-time weather integration
- [ ] Database backend untuk dynamic data
- [ ] User authentication
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Drawing tools untuk custom zones
- [ ] Offline mode dengan Service Workers
- [ ] Multi-language support

## 📄 License

© 2025 SIGAP RATU Platform. Semua hak dilindungi.

## 👥 Support

Untuk pertanyaan atau issue, silakan hubungi tim development.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
