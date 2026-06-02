/* ============================================================
   SIGAP RATU - WebGIS Platform JavaScript
   ============================================================
   Struktur:
   - Landing Page Logic
   - Preview Map
   - GIS Page Management
   - GIS Map Initialization
   - Layer Management
   - Basemap Switching
   - User Interaction
   - Utility Functions
   - GPX Export
   ============================================================ */

/* ==================== LANDING PAGE LOGIC ==================== */

// Navbar scroll effect
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}

// Reveal on scroll animation
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 },
);

reveals.forEach((r) => observer.observe(r));

/* ==================== PREVIEW MAP (Landing Page) ==================== */

let previewMap;

/**
 * Initialize preview map on landing page
 * Displays a non-interactive map preview with risk zones
 */
function initPreviewMap() {
  previewMap = L.map("preview-map", {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    attributionControl: false,
  });

  // Add base layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    previewMap,
  );

  const center = [-7.0218, 106.54466];
  previewMap.setView(center, 14);

  // Risk zones visualization
  L.circle(center, {
    radius: 500,
    color: "#ef4444",
    fillColor: "#ef4444",
    fillOpacity: 0.35,
    weight: 2,
  }).addTo(previewMap);

  L.circle(center, {
    radius: 900,
    color: "#fbbf24",
    fillColor: "#fbbf24",
    fillOpacity: 0.2,
    weight: 1.5,
    dashArray: "6 4",
  }).addTo(previewMap);

  // PLTU marker
  const pltuIcon = L.divIcon({
    className: "",
    html: `<div style="background:linear-gradient(135deg,#059669,#064e3b);width:28px;height:28px;border-radius:50%;display:grid;place-items:center;color:white;font-size:13px;border:2px solid rgba(255,255,255,0.4);box-shadow:0 0 15px rgba(5,150,105,0.5);">⚡</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  L.marker(center, { icon: pltuIcon })
    .bindPopup(
      `<div class="popup-title">⚡ PLTU Pelabuhan Ratu</div><div class="popup-body">Pembangkit Listrik Tenaga Uap<br>Kapasitas: 3 × 350 MW</div><span class="popup-badge">Zona Risiko Tinggi</span>`,
    )
    .addTo(previewMap);
}

// Initialize preview map when "Why" section becomes visible
const whyObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !previewMap) {
        initPreviewMap();
      }
    });
  },
  { threshold: 0.2 },
);

const whySection = document.getElementById("mengapa");
if (whySection) whyObs.observe(whySection);

/* ==================== GIS PAGE MANAGEMENT ==================== */

/**
 * Open GIS page with loading animation
 */
function openGIS() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("gis-page").style.display = "block";

  // Show loading screen
  setTimeout(() => {
    document.getElementById("gis-loading").style.opacity = "1";
  }, 50);

  // Hide loading and init map
  setTimeout(() => {
    document.getElementById("gis-loading").style.transition = "opacity 0.8s";
    document.getElementById("gis-loading").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("gis-loading").style.display = "none";
      if (!gisMap) initGISMap();
    }, 800);
  }, 2500);
}

/**
 * Close GIS page and return to landing
 */
function closeGIS() {
  document.getElementById("gis-page").style.display = "none";
  document.getElementById("landing").style.display = "block";
  document.getElementById("gis-loading").style.display = "flex";
  document.getElementById("gis-loading").style.opacity = "1";
}

/* ==================== GIS MAP INITIALIZATION ==================== */

let gisMap, riskLayer, evacLayer, assemblyLayer, facilitiesLayer;
let baseLayers = {};
let currentBasemap = "osm";
let layerState = {
  risk: true,
  evac: true,
  assembly: true,
  facilities: true,
};

/**
 * Initialize the main GIS map with all layers and features
 */
function initGISMap() {
  const center = [-7.0218, 106.54466];

  // Create map instance
  gisMap = L.map("gis-map", {
    zoomControl: true,
    attributionControl: true,
  }).setView(center, 14);

  // ——— BASEMAPS ———
  baseLayers.osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    },
  );

  baseLayers.satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "© Esri",
      maxZoom: 19,
    },
  );

  baseLayers.topo = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenTopoMap",
      maxZoom: 17,
    },
  );

  baseLayers.osm.addTo(gisMap);

  // ——— RISK ZONES LAYER ———
  riskLayer = L.layerGroup();

  // Zona Merah - Sangat Tinggi (500m radius)
  L.circle(center, {
    radius: 500,
    color: "#ef4444",
    fillColor: "#ef4444",
    fillOpacity: 0.3,
    weight: 2.5,
  })
    .bindPopup(
      `<div class="popup-title">🔴 Zona Risiko Sangat Tinggi</div><div class="popup-body">Radius 500m dari pusat PLTU<br>Risiko: Kebakaran, Ledakan, Gas Berbahaya<br>Akses: Personel Terotorisasi</div><span class="popup-badge">SANGAT TINGGI</span>`,
    )
    .addTo(riskLayer);

  // Zona Kuning - Tinggi (500-1000m radius)
  L.circle(center, {
    radius: 1000,
    color: "#f59e0b",
    fillColor: "#fbbf24",
    fillOpacity: 0.18,
    weight: 2,
    dashArray: "8 4",
  })
    .bindPopup(
      `<div class="popup-title">🟡 Zona Risiko Tinggi</div><div class="popup-body">Radius 500–1000m dari pusat PLTU<br>Risiko: Paparan Bahan Berbahaya<br>Akses: Dengan APD Lengkap</div><span class="popup-badge med">TINGGI</span>`,
    )
    .addTo(riskLayer);

  // Zona Buffer (1000-1700m radius)
  L.circle(center, {
    radius: 1700,
    color: "#3b82f6",
    fillColor: "#3b82f6",
    fillOpacity: 0.08,
    weight: 1.5,
    dashArray: "4 6",
  })
    .bindPopup(
      `<div class="popup-title">🔵 Zona Buffer</div><div class="popup-body">Radius 1000–1700m dari pusat PLTU<br>Area pengawasan dan monitoring<br>Akses: Terbatas</div><span class="popup-badge safe">BUFFER</span>`,
    )
    .addTo(riskLayer);

  riskLayer.addTo(gisMap);

  // ——— EVACUATION ROUTES LAYER ———
  evacLayer = L.layerGroup();

  const evacRoutes = [
    {
      coords: [
        [-6.995, 106.56],
        [-6.99, 106.555],
        [-6.985, 106.548],
        [-6.98, 106.54],
      ],
      name: "Jalur Evakuasi Utara",
      dir: "Menuju Jl. Pelabuhan Ratu",
    },
    {
      coords: [
        [-6.995, 106.56],
        [-7.002, 106.558],
        [-7.01, 106.552],
        [-7.015, 106.545],
      ],
      name: "Jalur Evakuasi Selatan",
      dir: "Menuju Pantai Pelabuhan Ratu",
    },
    {
      coords: [
        [-6.995, 106.56],
        [-6.998, 106.57],
        [-6.995, 106.58],
      ],
      name: "Jalur Evakuasi Timur",
      dir: "Menuju Jl. Raya Cisolok",
    },
    {
      coords: [
        [-6.995, 106.56],
        [-6.992, 106.548],
        [-6.99, 106.535],
      ],
      name: "Jalur Evakuasi Barat",
      dir: "Menuju Jl. Raya Sukabumi",
    },
  ];

  evacRoutes.forEach((r, i) => {
    L.polyline(r.coords, {
      color: i % 2 === 0 ? "#3b82f6" : "#60a5fa",
      weight: 4,
      opacity: 0.85,
      dashArray: i % 2 === 0 ? null : "10 5",
    })
      .bindPopup(
        `<div class="popup-title">🔷 ${r.name}</div><div class="popup-body">${r.dir}<br>Panjang: ${(1.2 + i * 0.4).toFixed(1)} km<br>Status: Aktif & Terverifikasi</div><span class="popup-badge safe">AMAN</span>`,
      )
      .addTo(evacLayer);

    // Arrow decorations on routes
    const mid = Math.floor(r.coords.length / 2);
    const arrowIcon = L.divIcon({
      className: "",
      html: `<div style="background:#3b82f6;color:white;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;font-size:9px;border:2px solid rgba(255,255,255,0.5);">▶</div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    L.marker(r.coords[mid], { icon: arrowIcon }).addTo(evacLayer);
  });

  evacLayer.addTo(gisMap);

  // ——— ASSEMBLY POINTS LAYER ———
  assemblyLayer = L.layerGroup();

  const assemblyPts = [
    {
      lat: -7.0219,
      lng: 106.5442,
      name: "Titik Kumpul A",
      cap: "500 orang",
      desc: "Area Safety Center",
    },
    {
      lat: -7.02339,
      lng: 106.5458,
      name: "Titik Kumpul B",
      cap: "800 orang",
      desc: "Area Terbuka Ring 2",
    },
    {
      lat: -6.995,
      lng: -7.02339,
      name: "Titik Kumpul C",
      cap: "300 orang",
      desc: "Area Terbuka ",
    },
    {
      lat: -7.0188,
      lng: 106.5469,
      name: "Titik Kumpul D",
      cap: "600 orang",
      desc: "Area Titik Evakuasi Tsunami",
    },
    {
      lat: -7.005,
      lng: 106.572,
      name: "Titik Kumpul E",
      cap: "400 orang",
      desc: "Balai Desa Pelabuhan Ratu",
    },
  ];

  assemblyPts.forEach((p) => {
    const icon = L.divIcon({
      className: "",
      html: `<div style="background:linear-gradient(135deg,#10b981,#059669);width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:white;font-size:14px;border:2.5px solid rgba(255,255,255,0.6);box-shadow:0 4px 15px rgba(16,185,129,0.5);">👥</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([p.lat, p.lng], { icon })
      .bindPopup(
        `<div class="popup-title">👥 ${p.name}</div><div class="popup-body">${p.desc}<br>Kapasitas: ${p.cap}<br>Fasilitas: P3K, Air Bersih, Komunikasi</div><span class="popup-badge safe">TITIK KUMPUL</span>`,
      )
      .addTo(assemblyLayer);
  });

  assemblyLayer.addTo(gisMap);

  // ——— FACILITIES LAYER ———
  facilitiesLayer = L.layerGroup();

  const facilities = [
    {
      lat: -7.0218,
      lng: 106.5446,
      name: "PLTU Pelabuhan Ratu",
      type: "Pembangkit",
      icon: "⚡",
      color: "#059669",
      risk: "SANGAT TINGGI",
    },
    {
      lat: -7.0221,
      lng: 106.5443,
      name: "Gedung Safety Center",
      type: "Safety Office",
      icon: "🏬",
      color: "#dc2626",
      risk: "AMAN",
    },
    {
      lat: -7.0211,
      lng: 106.54437,
      name: "Masjid Nurul Iman",
      type: "Mosque",
      icon: "🕌",
      color: "#0369a1",
      risk: "AMAN",
    },
    {
      lat: -7.0244,
      lng: 106.5457,
      name: "Ruang Kontrol Utama",
      type: "Kontrol",
      icon: "🖥️",
      color: "#7c3aed",
      risk: "SEDANG",
    },
    {
      lat: -7.02114,
      lng: 106.54494,
      name: "Klinik PLTU",
      type: "Medis",
      icon: "🏥",
      color: "#dc2626",
      risk: "AMAN",
    },
    {
      lat: -7.0212,
      lng: 106.5439,
      name: "Pos Keamanan",
      type: "Security",
      icon: "🛡️",
      color: "#059669",
      risk: "AMAN",
    },
  ];

  facilities.forEach((f) => {
    const icon = L.divIcon({
      className: "",
      html: `<div style="background:${f.color};width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:16px;border:2px solid rgba(255,255,255,0.4);box-shadow:0 4px 15px rgba(0,0,0,0.3);">${f.icon}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    L.marker([f.lat, f.lng], { icon })
      .bindPopup(
        `<div class="popup-title">${f.icon} ${f.name}</div><div class="popup-body">Tipe: ${f.type}<br>Koordinat: ${f.lat.toFixed(4)}, ${f.lng.toFixed(4)}</div><span class="popup-badge ${f.risk === "AMAN" ? "safe" : f.risk === "SEDANG" ? "med" : ""}">${f.risk}</span>`,
      )
      .addTo(facilitiesLayer);
  });

  facilitiesLayer.addTo(gisMap);

  // ——— PLTU CENTER MARKER (Special) ———
  const pltuIcon = L.divIcon({
    className: "",
    html: `<div style="background:linear-gradient(135deg,#059669,#064e3b);width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:white;font-size:20px;border:3px solid rgba(255,255,255,0.5);box-shadow:0 0 30px rgba(5,150,105,0.6),0 6px 20px rgba(0,0,0,0.3);">⚡</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

  L.marker(center, { icon: pltuIcon })
    .bindPopup(
      `<div class="popup-title">⚡ PLTU Pelabuhan Ratu</div><div class="popup-body">Pembangkit Listrik Tenaga Uap<br>Kapasitas: 3 × 350 MW = 1.050 MW<br>Bahan Bakar: Batubara<br>Status: Operasional</div><span class="popup-badge">PUSAT OPERASI</span>`,
    )
    .addTo(gisMap)
    .openPopup();

  // ——— MAP EVENTS ———

  // Update coordinates display on mouse move
  gisMap.on("mousemove", (e) => {
    document.getElementById("coord-text").textContent =
      `Lat: ${e.latlng.lat.toFixed(5)} | Lng: ${e.latlng.lng.toFixed(5)} | Zoom: ${gisMap.getZoom()}`;
  });

  // Search functionality
  const searchInput = document.getElementById("gis-search");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const q = e.target.value.toLowerCase();

        if (q.includes("pltu") || q.includes("pusat")) {
          gisMap.setView(center, 16);
        } else if (q.includes("kumpul") || q.includes("assembly")) {
          gisMap.setView([-7.0218, 106.54466], 15);
        } else if (q.includes("evakuasi")) {
          gisMap.setView([-7.0218, 106.54466], 14);
        }
      }
    });
  }
}

/* ==================== LAYER MANAGEMENT ==================== */

/**
 * Toggle map layers on/off
 * @param {string} name - Layer name (risk, evac, assembly, facilities)
 */
function toggleLayer(name) {
  layerState[name] = !layerState[name];
  const toggle = document.getElementById("toggle-" + name);
  toggle.classList.toggle("on", layerState[name]);

  const layerMap = {
    risk: riskLayer,
    evac: evacLayer,
    assembly: assemblyLayer,
    facilities: facilitiesLayer,
  };

  if (layerState[name]) {
    layerMap[name].addTo(gisMap);
  } else {
    gisMap.removeLayer(layerMap[name]);
  }
}

/* ==================== BASEMAP SWITCHING ==================== */

/**
 * Switch between different basemaps
 * @param {string} type - Basemap type (osm, satellite, topo)
 */
function setBasemap(type) {
  // Remove all basemaps
  ["osm", "satellite", "topo"].forEach((t) => {
    gisMap.removeLayer(baseLayers[t]);
    const el = document.getElementById("bm-" + t);
    if (el) el.style.color = "rgba(255,255,255,0.75)";
  });

  // Add selected basemap
  baseLayers[type].addTo(gisMap);

  // Re-add all other layers
  gisMap.eachLayer((l) => {
    if (l !== baseLayers[type]) l.addTo(gisMap);
  });

  // Update UI
  const el = document.getElementById("bm-" + type);
  if (el) el.style.color = "#6ee7b7";

  currentBasemap = type;
}

/* ==================== USER INTERACTION ==================== */

/**
 * Locate user and center map on their location
 */
function locateUser() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gisMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
      },
      () => {
        gisMap.setView([-7.0218, 106.54466], 15);
      },
    );
  }
}

/**
 * Reset map view to default center and zoom
 */
function fitBounds() {
  if (gisMap) {
    gisMap.setView([-7.0218, 106.54466], 13);
  }
}

/* ==================== GPX EXPORT ==================== */

/**
 * Download evacuation routes as GPX file
 */
function downloadGPX() {
  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="SIGAP RATU WebGIS">
  <metadata>
    <name>Jalur Evakuasi PLTU Pelabuhan Ratu</name>
    <desc>Jalur evakuasi resmi PLTU Pelabuhan Ratu</desc>
  </metadata>
  <rte>
    <name>Jalur Evakuasi Utara</name>
    <rtept lat="-6.995" lon="106.560"><name>Start - PLTU</name></rtept>
    <rtept lat="-6.990" lon="106.555"><name>Titik 1</name></rtept>
    <rtept lat="-6.985" lon="106.548"><name>Titik 2</name></rtept>
    <rtept lat="-6.980" lon="106.540"><name>Titik Kumpul A</name></rtept>
  </rte>
  <rte>
    <name>Jalur Evakuasi Selatan</name>
    <rtept lat="-6.995" lon="106.560"><name>Start - PLTU</name></rtept>
    <rtept lat="-7.002" lon="106.558"><name>Titik 1</name></rtept>
    <rtept lat="-7.010" lon="106.552"><name>Titik 2</name></rtept>
    <rtept lat="-7.015" lon="106.545"><name>Titik Kumpul B</name></rtept>
  </rte>
  <wpt lat="-6.983" lon="106.548"><name>Titik Kumpul A</name><desc>Area Parkir Utama, Kapasitas 500 orang</desc></wpt>
  <wpt lat="-7.010" lon="106.550"><name>Titik Kumpul B</name><desc>Lapangan Olahraga, Kapasitas 800 orang</desc></wpt>
  <wpt lat="-6.995" lon="106.582"><name>Titik Kumpul C</name><desc>Area Terbuka Timur, Kapasitas 300 orang</desc></wpt>
</gpx>`;

  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "jalur-evakuasi-pltu-pelabuhan-ratu.gpx";
  a.click();
}

/* ==================== AI ASSISTANT INTERACTION ==================== */
function createAssistantBubble(text, type = "ai") {
  const wrapper = document.createElement("div");
  wrapper.className = `assistant-message assistant-${type}`;

  const bubble = document.createElement("div");
  bubble.className = "assistant-bubble";

  const label = document.createElement("div");
  label.className = "assistant-bubble-label";
  label.textContent = type === "user" ? "Anda" : "SIGAP AI";

  const content = document.createElement("p");
  content.textContent = text;

  bubble.appendChild(label);
  bubble.appendChild(content);
  wrapper.appendChild(bubble);

  return wrapper;
}

function appendAssistantMessage(text, type = "ai") {
  const chat = document.getElementById("assistant-chat");
  if (!chat) return;

  const message = createAssistantBubble(text, type);
  chat.appendChild(message);
  message.scrollIntoView({ behavior: "smooth", block: "end" });
}

function handleAssistantReply(query) {
  const normalized = query.toLowerCase();
  let reply = "Saya akan membantu mengecek data dan jalur di peta untuk Anda.";

  if (normalized.includes("klinik")) {
    reply =
      "Menemukan klinik terdekat, termasuk status akses dan jalur aman menuju lokasi medis.";
  } else if (
    normalized.includes("zona risiko") ||
    normalized.includes("risiko")
  ) {
    reply =
      "Zona risiko ditandai pada peta, saya merekomendasikan tetap di luar radius 500m jika terdeteksi kondisi kritis.";
  } else if (normalized.includes("shelter")) {
    reply =
      "Shelter aman berada pada titik kumpul resmi; jalur evakuasi tersedia dan sudah diverifikasi.";
  } else if (normalized.includes("jalur evakuasi")) {
    reply =
      "Jalur evakuasi aktif menunjukkan arah optimal menuju area aman dan landmark terdekat.";
  } else if (normalized.includes("cuaca")) {
    reply =
      "Cuaca saat ini berawan dengan kondisi stabil, tetap pantau pergerakan angin dan visibilitas.";
  } else if (normalized.includes("pos keamanan")) {
    reply =
      "POS Keamanan aktif dan terhubung dengan sistem pengawasan untuk dukungan operasi.";
  }

  setTimeout(() => {
    appendAssistantMessage(reply, "ai");
  }, 450);
}

function updateCharCount() {
  const input = document.getElementById("assistant-input");
  const counter = document.getElementById("assistant-charcount");
  if (!input || !counter) return;
  counter.textContent = `${input.value.length} / 320`;
}

function initAssistantPanel() {
  const form = document.getElementById("assistant-form");
  const input = document.getElementById("assistant-input");
  const panel = document.getElementById("ai-assistant");
  const launcher = document.getElementById("assistant-launcher");
  const minimize = document.querySelector(".assistant-minimize");
  const closeBtn = document.querySelector(".assistant-close");
  const chips = document.querySelectorAll(".action-chip");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input || !input.value.trim()) return;
      appendAssistantMessage(input.value.trim(), "user");
      handleAssistantReply(input.value.trim());
      input.value = "";
      updateCharCount();
    });
  }

  if (input) {
    input.addEventListener("input", updateCharCount);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form?.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });
  }

  if (minimize) {
    minimize.addEventListener("click", () => {
      panel?.classList.toggle("collapsed");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel?.classList.add("hidden");
      if (launcher) launcher.setAttribute("aria-expanded", "false");
    });
  }

  if (launcher) {
    launcher.addEventListener("click", () => {
      const isHidden = panel?.classList.toggle("hidden");
      launcher.setAttribute(
        "aria-expanded",
        isHidden === false ? "true" : "false",
      );
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const label = chip.textContent.trim();
      appendAssistantMessage(label, "user");
      handleAssistantReply(label);
    });
  });
}

window.addEventListener("load", initAssistantPanel);
