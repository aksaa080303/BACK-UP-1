<!-- 
  SIGAP RATU - WebGIS Platform PLTU Pelabuhan Ratu
  
  DOKUMENTASI TEKNIS & CODE STRUCTURE
  =====================================
  
  File ini menjelaskan arsitektur, best practices, dan tips pengembangan
  untuk maintainability dan scalability project.
  
  Updated: January 2025
  Version: 1.0.0
  
-->

# 🏗️ Dokumentasi Teknis SIGAP RATU

## Arsitektur Project

### Separation of Concerns (SoC)
Project dipisahkan berdasarkan responsibility:

```
┌─────────────────────────────────────┐
│      index.html (Structure)         │
│  - Semantic HTML5 markup            │
│  - No styling inline                │
│  - No JavaScript inline             │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼─────┐   ┌─────▼──────┐
│ style.css  │   │script.js   │
│(Presentation) │(Behavior)   │
└────────────┘   └────────────┘
```

### Module Organization

#### JavaScript (script.js)
```javascript
1. Landing Page Logic
   - Navbar scroll effect
   - Reveal on scroll animation

2. Preview Map Module
   - initPreviewMap()
   - Lazy loading handler

3. GIS Page Management
   - openGIS()
   - closeGIS()

4. GIS Map Initialization
   - initGISMap()
   - Basemap setup
   - Layer initialization
   - Event handlers

5. Layer Management
   - toggleLayer()
   - setBasemap()

6. User Interaction
   - locateUser()
   - fitBounds()

7. GPX Export
   - downloadGPX()
```

#### CSS (style.css)
```
:root (Colors & Spacing)
  ├─ Global Base Styles
  ├─ Navigation
  ├─ Hero Section
  ├─ Features
  ├─ Why Section
  ├─ CTA & Footer
  ├─ GIS Page
  ├─ GIS Components
  ├─ Animations
  ├─ Responsive
  └─ Leaflet Customization
```

## 💻 Code Style Guide

### JavaScript Conventions

#### Naming
```javascript
// Constants (UPPER_SNAKE_CASE)
const CENTER_LAT_LNG = [-6.995, 106.560];
const ZOOM_LEVEL = 14;

// Variables (camelCase)
let gisMap;
let layerState = {};
let currentBasemap = 'osm';

// Functions (camelCase)
function initGISMap() {}
function toggleLayer(name) {}

// Private functions (prefix with _)
function _updateMapView() {}
```

#### Comments
```javascript
// Single line comment untuk penjelasan singkat
const map = L.map('id'); // inline comment

/**
 * Multi-line JSDoc untuk functions
 * @param {type} name - description
 * @returns {type} description
 */
function processData(data) {}

// Section separator (untuk organization)
/* ==================== MODULE NAME ==================== */
```

#### Best Practices
```javascript
// ✅ DO: Modular functions
function toggleLayer(name) {
  layerState[name] = !layerState[name];
  updateLayerUI(name);
}

// ❌ DON'T: Monolithic functions
function toggleLayerAndUpdateUIAndSaveState(name) {
  // 50 lines of code
}

// ✅ DO: Use const/let
const map = L.map('id');
let layerState = {};

// ❌ DON'T: Use var
var map = L.map('id');

// ✅ DO: Arrow functions untuk callbacks
document.addEventListener('click', (e) => {
  handleClick(e);
});

// ✅ DO: Default parameters
function setZoom(zoom = 13) {}

// ✅ DO: Template literals
const message = `Lat: ${lat}, Lng: ${lng}`;
```

### CSS Conventions

#### Naming (BEM-like)
```css
/* Block */
.navbar {}
.navbar-logo {}      /* Element */
.navbar.scrolled {}  /* Modifier */

/* Utility */
.hidden { display: none; }
.visible { visibility: visible; }
```

#### Organization
```css
/* Root variables (colors, spacing, etc) */
:root { --color: #value; }

/* Global resets */
* { margin: 0; padding: 0; }

/* Base elements */
html, body { font-family: serif; }

/* Components (blocks) */
.navbar { }
.button { }

/* Responsive (at bottom) */
@media (max-width: 600px) { }
```

#### Best Practices
```css
/* ✅ DO: Use variables */
background: var(--em);

/* ❌ DON'T: Hardcode values */
background: #059669;

/* ✅ DO: Use shorthand */
margin: 1rem 2rem;
padding: 1rem;

/* ❌ DON'T: Verbose */
margin-top: 1rem;
margin-right: 2rem;

/* ✅ DO: Mobile-first */
.sidebar { width: 100%; }
@media (min-width: 900px) { .sidebar { width: 260px; } }

/* ✅ DO: Organize logically */
.button {
  display: flex;
  align-items: center;
  background: var(--em);
  color: white;
  padding: 1rem;
  border-radius: 50px;
  transition: all 0.3s;
}
```

## 🔌 API & External Libraries

### Leaflet.js API
```javascript
// Initialize map
const map = L.map('id').setView([lat, lng], zoom);

// Add tileset
L.tileLayer('url/{z}/{x}/{y}.png').addTo(map);

// Add circle
L.circle([lat, lng], {
  radius: 500,
  color: '#red',
  fillOpacity: 0.5
}).addTo(map);

// Add marker with popup
L.marker([lat, lng])
  .bindPopup('Content')
  .addTo(map)
  .openPopup();

// Add polyline
L.polyline([[lat1, lng1], [lat2, lng2]])
  .addTo(map);

// Layer group
const group = L.layerGroup();
group.addTo(map);
group.removeFrom(map);

// Events
map.on('click', (e) => {
  console.log(e.latlng);
});
```

### Font Awesome Icons
```html
<!-- Solid icons -->
<i class="fas fa-map"></i>

<!-- Brands -->
<i class="fab fa-github"></i>

<!-- Usage in JavaScript -->
<button><i class="fas fa-arrow-right"></i> Click</button>
```

## 📊 Data Management

### Layer State Management
```javascript
// Global state
let layerState = {
  risk: true,
  evac: true,
  assembly: true,
  facilities: true
};

// Toggle function
function toggleLayer(name) {
  layerState[name] = !layerState[name];
  
  if (layerState[name]) {
    layerMap[name].addTo(gisMap);
  } else {
    gisMap.removeLayer(layerMap[name]);
  }
}
```

### Basemap Switching
```javascript
const baseLayers = {
  osm: L.tileLayer(...),
  satellite: L.tileLayer(...),
  topo: L.tileLayer(...)
};

function setBasemap(type) {
  // Remove all
  Object.values(baseLayers).forEach(layer => {
    gisMap.removeLayer(layer);
  });
  
  // Add selected
  baseLayers[type].addTo(gisMap);
}
```

## 🎯 Performance Optimization

### Lazy Loading
```javascript
// Load preview map hanya saat section visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !previewMap) {
      initPreviewMap();
    }
  });
}, { threshold: 0.2 });

observer.observe(document.getElementById('preview-map'));
```

### CSS Optimizations
```css
/* Use transform instead of margin */
.item:hover {
  transform: translateY(-3px); /* Better performance */
}

/* Use opacity instead of visibility */
.fade {
  opacity: 0; /* Can be animated */
  transition: opacity 0.3s;
}

/* Use will-change sparingly */
.animated {
  will-change: transform;
}
```

### JavaScript Optimizations
```javascript
// Cache DOM queries
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Debounce expensive operations
function debounce(fn, delay) {
  let timeoutId;
  return function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
}
```

## 🐛 Debugging Tips

### Console Utilities
```javascript
// Log layer state
console.table(layerState);

// Log map bounds
console.log(gisMap.getBounds());

// Log all markers
gisMap.eachLayer(layer => {
  console.log(layer);
});

// Check browser support
console.log('Geolocation:', !!navigator.geolocation);
```

### Browser DevTools
```
F12 → Elements Tab     : Inspect HTML structure
F12 → Console Tab      : Run JavaScript commands
F12 → Network Tab      : Check CDN loads
F12 → Performance Tab  : Check rendering issues
```

## 🚀 Extending Features

### Menambah Layer Baru
```javascript
// 1. Buat layerGroup
const newLayer = L.layerGroup();

// 2. Tambah features
L.marker([lat, lng])
  .bindPopup('Info')
  .addTo(newLayer);

// 3. Tambah ke map
newLayer.addTo(gisMap);

// 4. Setup toggle (optional)
function toggleNewLayer() {
  if (layerState.new) {
    newLayer.addTo(gisMap);
  } else {
    gisMap.removeLayer(newLayer);
  }
}
```

### Menambah Custom Control
```javascript
// 1. Create control
const customControl = L.Control.extend({
  onAdd: function(map) {
    const div = L.DomUtil.create('div', 'custom-control');
    div.innerHTML = 'Custom Control';
    div.onclick = () => { /* do something */ };
    return div;
  }
});

// 2. Add to map
new customControl({ position: 'topright' }).addTo(gisMap);

// 3. Style in CSS
.custom-control {
  background: white;
  padding: 1rem;
  /* ... */
}
```

### Menambah Event Listener
```javascript
// Click event
gisMap.on('click', (e) => {
  console.log('Clicked at:', e.latlng);
});

// Zoom changed
gisMap.on('zoomend', () => {
  console.log('Zoom level:', gisMap.getZoom());
});

// Layer added
gisMap.on('layeradd', (e) => {
  console.log('Layer added:', e.layer);
});
```

## 📝 Documentation Standards

### For New Functions
```javascript
/**
 * Brief description of what function does
 * 
 * Longer description if needed. Explain parameters,
 * return values, and any side effects.
 * 
 * @param {string} name - Description of parameter
 * @param {number} [optional] - Optional parameter
 * @returns {boolean} Description of return value
 * 
 * @example
 * const result = myFunction('value');
 * console.log(result); // true
 */
function myFunction(name, optional) {
  // Implementation
}
```

### For Complex Sections
```javascript
/* ==================== MODULE NAME ==================== */
// Clear separator for major sections

/* ——— SUBSECTION ——— */
// Clear separator for subsections
```

## 🔒 Security Considerations

```javascript
// ✅ DO: Sanitize user input
const searchTerm = input.value.toLowerCase();
// Check against known values before using

// ✅ DO: Use HTTPS for APIs
fetch('https://api.example.com/data');

// ✅ DO: Validate data
if (lat >= -90 && lat <= 90) { /* valid */ }

// ❌ DON'T: Eval or innerHTML with user input
// eval(userInput);  // DANGEROUS
// el.innerHTML = userInput;  // DANGEROUS

// ✅ DO: Use textContent for text
el.textContent = userText;

// ✅ DO: Use createElement for elements
const el = document.createElement('div');
el.textContent = 'Safe text';
```

## 📚 Learning Resources

- **Leaflet.js**: https://leafletjs.com/reference.html
- **MDN Web Docs**: https://developer.mozilla.org
- **CSS Tricks**: https://css-tricks.com
- **JavaScript Info**: https://javascript.info
- **Font Awesome**: https://fontawesome.com/icons

## ✅ QA Checklist

Sebelum deployment:
- [ ] Test di Chrome, Firefox, Safari
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Check console untuk errors/warnings
- [ ] Test semua buttons dan interaksi
- [ ] Verify performance (lighthouse)
- [ ] Check accessibility (tab navigation)
- [ ] Verify links dan assets load correctly
- [ ] Test geolocation permission flow
- [ ] Test GPX export functionality

---

Pertanyaan? Lihat README.md untuk info lebih lanjut.
