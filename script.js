// Constants
const THEME_KEY = "theme";
const DEFAULT_THEME = "dark";

// DOM Elements Cache
const domElements = {
  themeToggle: document.getElementById("theme-toggle"),
  menuToggle: document.getElementById("menu-toggle"),
  menuClose: document.getElementById("menu-close"),
  menu: document.getElementById("menu"),
  commentForm: document.getElementById("comment-form"),
  loader: document.getElementById("loader"),
  circles: document.querySelectorAll(".circle"),
  headerPlaceholder: document.getElementById("header-placeholder"),
  footerPlaceholder: document.getElementById("footer-placeholder"),
};

// Theme Management
const themeManager = {
  initialize() {
    const currentTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    document.body.classList.toggle("dark-theme", currentTheme === "dark");
    document.body.classList.toggle("light-theme", currentTheme === "light");
    document.documentElement.setAttribute("data-theme", currentTheme);

    // Add event listener for theme toggle
    if (domElements.themeToggle) {
      domElements.themeToggle.addEventListener("click", () => this.toggle());
    }
  },

  toggle() {
    const isDark = document.body.classList.contains("dark-theme");
    document.body.classList.toggle("dark-theme", !isDark);
    document.body.classList.toggle("light-theme", isDark);
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  },
};

// Auto-type Animation
const autoTypeManager = {
  initialize() {
    const typed = new Typed(".auto-type", {
      strings: ["Print Now", "Pay Later", "Easy Access", "Fast Service"],
      typeSpeed: 150,
      backSpeed: 150,
      loop: true,
    });
  },
};

// Form Handlers
const formHandler = {
  initialize() {
    this.initializeCommentForm();
    this.initializeContactForm();
    this.initializeUploadForm();
  },

  initializeCommentForm() {
    if (domElements.commentForm) {
      domElements.commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const comment = document.getElementById("comment").value.trim();

        if (username && comment) {
          const commentHTML = `
            <div class="bg-gray-700 text-white p-4 rounded-lg">
              <strong>${this.sanitizeInput(username)}:</strong>
              <p>${this.sanitizeInput(comment)}</p>
            </div>`;
          document
            .getElementById("comments-list")
            .insertAdjacentHTML("beforeend", commentHTML);
          domElements.commentForm.reset();
        }
      });
    }
  },

  initializeContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Message sent successfully!");
        contactForm.reset();
      });
    }
  },

  initializeUploadForm() {
    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
      uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Document uploaded successfully!");
        uploadForm.reset();
      });
    }
  },

  sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  },
};

// Map Handler
const mapHandler = {
  initialize() {
    const locateButton = document.getElementById("locateButton");
    if (locateButton) {
      locateButton.addEventListener("click", () => this.initializeMap());
    }
  },

  initializeMap() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => this.handlePosition(position),
      (error) => alert("Unable to retrieve your location.")
    );
  },

  handlePosition(position) {
    const mapContainer = document.getElementById("map");
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    const map = L.map("map").setView(
      [position.coords.latitude, position.coords.longitude],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([position.coords.latitude, position.coords.longitude])
      .addTo(map)
      .bindPopup("You are here")
      .openPopup();
  },
};

// Header and Footer Loader
const layoutLoader = {
  initialize() {
    this.loadHeader();
    this.loadFooter();
  },

  async loadHeader() {
    try {
      const response = await fetch("header.html");
      const html = await response.text();
      if (domElements.headerPlaceholder) {
        domElements.headerPlaceholder.innerHTML = html;
      }
    } catch (error) {
      console.error("Error loading header:", error);
    }
  },

  async loadFooter() {
    try {
      const response = await fetch("footer.html");
      const html = await response.text();
      if (domElements.footerPlaceholder) {
        domElements.footerPlaceholder.innerHTML = html;
      }
    } catch (error) {
      console.error("Error loading footer:", error);
    }
  },
};

// Initialize Everything
document.addEventListener("DOMContentLoaded", () => {
  layoutLoader.initialize();
  themeManager.initialize();
  formHandler.initialize();
  mapHandler.initialize();
  if (document.querySelector(".auto-type")) {
    autoTypeManager.initialize();
  }

  if (domElements.menuToggle && domElements.menu) {
    domElements.menuToggle.addEventListener("click", () => {
      domElements.menu.classList.toggle("hidden");
    });
  }

  if (domElements.menuClose && domElements.menu) {
    domElements.menuClose.addEventListener("click", () => {
      domElements.menu.classList.add("scale-0");
      domElements.menu.classList.remove("scale-100");
    });
  }
});

// Hide loader when page is fully loaded
window.addEventListener("load", () => {
  if (domElements.loader) {
    domElements.loader.classList.add("hidden");
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const serviceType = document.getElementById("serviceType");
  const delivery = document.getElementById("delivery");
  const pickupOptions = document.getElementById("pickupOptions");
  const deliveryOptions = document.getElementById("deliveryOptions");
  const timeOptions = document.getElementById("timeOptions");
  const dateOptions = document.getElementById("dateOptions");

  // Event listener for service type change
  serviceType.addEventListener("change", function () {
    pickupOptions.classList.add("hidden");
    deliveryOptions.classList.add("hidden");

    if (this.value === "pickup") {
      pickupOptions.classList.remove("hidden");
    } else if (this.value === "delivery") {
      deliveryOptions.classList.remove("hidden");
    }
  });

  // Event listener for delivery options change
  delivery.addEventListener("change", function () {
    timeOptions.classList.add("hidden");
    dateOptions.classList.add("hidden");

    if (this.value === "same-day" || this.value === "tomorrow") {
      timeOptions.classList.remove("hidden");
    } else if (this.value === "other-day") {
      dateOptions.classList.remove("hidden");
      // Show time options after selecting a date
      document.getElementById("date").addEventListener("change", function () {
        timeOptions.classList.remove("hidden");
      });
    }
  });
}); //login js part
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check for specific user credentials
    if (
      (email === "thilaks195@gmail.com" || email === "shalomriona@gmail.com") &&
      password === "riothi1621"
    ) {
      alert("Login successful!");
      // Redirect to index page
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials. Please try again.");
    }
  });

// Function to display previous prints (to be called on profile page)
function displayPreviousPrints() {
  const previousPrints = [
    { date: "2024-12-01", document: "Document1.pdf" },
    { date: "2024-12-05", document: "Document2.pdf" },
  ];

  const printsContainer = document.getElementById("previous-prints");
  previousPrints.forEach((print) => {
    const printItem = document.createElement("div");
    printItem.textContent = `${print.date}: ${print.document}`;
    printsContainer.appendChild(printItem);
  });
}

// Simulate Google login
document.getElementById("googleLogin").addEventListener("click", function () {
  alert("Google login is not yet implemented.");
  // Implement Google login logic here
});

// Simulate Apple login
document.getElementById("appleLogin").addEventListener("click", function () {
  alert("Apple login is not yet implemented.");
  // Implement Apple login logic here
});
// Initialize the map
const map = L.map("map").setView([51.505, -0.09], 13); // Default coordinates

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// Sample data for shops
const shops = [
  { name: "Shop 1", lat: 51.505, lng: -0.09, rating: 4.5, open: true },
  { name: "Shop 2", lat: 51.515, lng: -0.1, rating: 4.0, open: false },
  { name: "Shop 3", lat: 51.525, lng: -0.08, rating: 3.5, open: true },
];

// Function to add shop markers
function addShopMarkers() {
  shops.forEach((shop) => {
    const marker = L.marker([shop.lat, shop.lng]).addTo(map);
    marker.bindPopup(
      `<b>${shop.name}</b><br>Rating: ${shop.rating}<br>Status: ${
        shop.open ? "Open" : "Closed"
      }`
    );
  });
}

// Add shop markers to the map
addShopMarkers();

// Function to filter shops by radius
function filterShopsByRadius(radius) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      const distance = map.distance(layer.getLatLng(), map.getCenter());
      if (distance > radius) {
        map.removeLayer(layer);
      }
    }
  });
  addShopMarkers(); // Re-add markers to ensure all are displayed initially
}

// Event listener for radius input (assuming you have an input for radius)
document.getElementById("radiusInput").addEventListener("change", (event) => {
  const radius = event.target.value;
  filterShopsByRadius(radius);
});

// Function to update map with real-time traffic data (mock implementation)
function updateTrafficData() {
  // This would typically involve an API call to a traffic data provider
  console.log("Updating traffic data...");
}

// Call updateTrafficData periodically
setInterval(updateTrafficData, 60000); // Update every minute
