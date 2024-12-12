document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const menu = document.getElementById("menu");
  const commentForm = document.getElementById("comment-form");

  // Function to display error popup
  function showErrorPopup(message) {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.zIndex = "9998";
    overlay.style.backdropFilter = "blur(5px)";
    document.body.appendChild(overlay);

    // Create the error popup
    const errorPopup = document.createElement("div");
    errorPopup.id = "errorPopup";
    errorPopup.style.position = "fixed";
    errorPopup.style.top = "50%";
    errorPopup.style.left = "50%";
    errorPopup.style.transform = "translate(-50%, -50%)";
    errorPopup.style.backgroundColor = "#fff";
    errorPopup.style.padding = "20px";
    errorPopup.style.border = "1px solid #ccc";
    errorPopup.style.zIndex = "9999";
    errorPopup.innerHTML = `
      <h2 style="color: red; font-weight: 600; margin-bottom: 5px;">Error</h2>
      <p>${message}</p>
      <button style="margin-top: 10px; padding: 5px 10px; float: right;">Close</button>
    `;

    document.body.appendChild(errorPopup);

    // Attach event listener to the close button directly via DOM element
    const closeButton = errorPopup.querySelector("button");
    closeButton.addEventListener("click", () => {
      errorPopup.remove();
      overlay.remove();
    });
  }

  //cursor smooth
  const circles = document.querySelectorAll(".circle");
  const logo = document.querySelector(".logo"); // Assuming the logo has a class "logo"
  const coords = { x: 0, y: 0 };
  if (logo) {
    const logoRect = logo.getBoundingClientRect();
    coords.x = logoRect.left + logoRect.width / 2; // Center of the logo horizontally
    coords.y = logoRect.top + logoRect.height / 2; // Center of the logo vertically
  }

  // Updated color palette
  const colors = [
    "#8bcb94",
    "#84c78f",
    "#7cc28a",
    "#74be86",
    "#6cb982",
    "#64a46c",
    "#5d9e67",
    "#558962",
    "#4e925d",
    "#4e8d57",
    "#4e8851",
    "#4e834c",
    "#4e7e46",
    "#448444",
    "#447c4c",
    "#649c6c",
    "#74a478",
    "#b5d2ac",
    "#c2dfbc",
    "#e0e9cd",
    "#d6e4c6",
    "#cce0c0",
    "#0d4e10",
  ];

  // Set colors for each circle and initialize their positions
  circles.forEach((circle, index) => {
    circle.style.backgroundColor = colors[index % colors.length]; // Set circle colors
    circle.x = 0; // Initialize circle positions
    circle.y = 0;
  });

  // Track mouse movements and update coordinates
  document.addEventListener("mousemove", function (e) {
    coords.x = e.clientX; // Use clientX and clientY for cursor-relative positioning
    coords.y = e.clientY;
  });

  // Animate the circles based on mouse movement
  function animateCircles() {
    let x = coords.x;
    let y = coords.y;

    circles.forEach((circle, index) => {
      // Set the position for the circles with slight offset
      circle.style.left = `${x - 12}px`;
      circle.style.top = `${y - 12}px`;

      // Scale the circles based on their index
      circle.style.transform = `scale(${
        (circles.length - index) / circles.length
      })`;

      // Update the position for the next circle
      const nextCircle = circles[index + 1] || circles[0];
      x += (nextCircle.x - x) * 0.2; // Adjust smoothing factor
      y += (nextCircle.y - y) * 0.2; // Adjust smoothing factor

      circle.x = x; // Update current circle's position for the next iteration
      circle.y = y; // Update current circle's position for the next iteration
    });

    requestAnimationFrame(animateCircles); // Keep the animation running
  }

  animateCircles(); // Start the circle animation

  // Comment Submission
  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const comment = document.getElementById("comment").value;

      const commentHTML = `<div class="bg-gray-700 text-white p-4 rounded-lg">
                    <strong>${username}:</strong>
                    <p>${comment}</p>
                </div>`;

      document
        .getElementById("comments-list")
        .insertAdjacentHTML("beforeend", commentHTML);

      // Reset form
      document.getElementById("comment-form").reset();
    });
  }

  // Feedback Submission
  window.onload = function () {
    document
      .getElementById("feedback-form")
      ?.addEventListener("submit", function (event) {
        event.preventDefault();
        emailjs.sendForm("your_service_id", "feedback_form", this).then(
          () => {
            console.log("SUCCESS!");

            // Reset the form
            document.getElementById("feedback-form").reset();
          },
          (error) => {
            console.log("FAILED...", error);
          }
        );
      });
  };

  // Theme Toggle
  const body = document.body;

  function initializeTheme() {
    const currentTheme = localStorage.getItem("theme") || "dark";
    body.classList.toggle("dark-theme", currentTheme === "dark");
    body.classList.toggle("light-theme", currentTheme === "light");
  }

  function toggleTheme() {
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");

    // Save theme in localStorage
    const newTheme = body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
  }

  // Initialize theme on load
  initializeTheme();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      console.log("clicker");
      toggleTheme();
    });
  }

  //Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menu.classList.remove("scale-0");
      menu.classList.add("scale-100");
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", () => {
      menu.classList.add("scale-0");
      menu.classList.remove("scale-100");
    });
  }

  //faq auto type answer
  const faqBoxes = document.querySelectorAll(".faq-box");

  faqBoxes.forEach((box) => {
    // Hover event on the entire FAQ box
    box.addEventListener("mouseenter", function () {
      const question = box.querySelector(".faq-question");
      const answerId = question.getAttribute("data-answer");
      const answerElement = document.getElementById(answerId);

      // Check if the answer has already been displayed
      if (!answerElement.classList.contains("hidden")) return;

      // Add the typing effect
      typeAnswer(
        answerElement,
        answerElement.dataset.fulltext || answerElement.innerHTML
      );
    });
  });

  function typeAnswer(element, answer) {
    element.dataset.fulltext = answer; // Store the full text in a data attribute
    element.innerHTML = ""; // Clear the current text
    element.classList.remove("hidden"); // Make the answer visible
    let i = 0;

    function type() {
      if (i < answer.length) {
        element.innerHTML += answer.charAt(i);
        i++;
        setTimeout(type, 50); // Adjust typing speed here
      }
    }

    type();
  }
});
// Function to load an HTML file into an element
function loadHTML(file, elementId) {
  fetch(file)
    .then((response) => {
      if (!response.ok)
        throw new Error("Erreur lors du chargement du fichier " + file);
      return response.text();
    })
    .then((data) => {
      if (document.getElementById(elementId))
        document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => console.error(error));
}

// Load header and footer
document.addEventListener("DOMContentLoaded", function () {
  loadHTML("./header.html", "header-placeholder");
  loadHTML("./footer.html", "footer-placeholder");
});

// // Hide the loader when the page is fully loaded
window.addEventListener("load", function () {
  // Cache le spinner après que la page est entièrement chargée
  const loader = document.getElementById("loader");
  loader.classList.add("hidden");
});
// Profile picture change handler
const uploadPicBtn = document.getElementById("upload-pic");
if (uploadPicBtn) {
  uploadPicBtn.addEventListener("click", () => {
    alert("Profile picture change feature is coming soon!");
    // You can add a file upload input in the future.
  });
}

// Name change functionality
const editNameBtn = document.getElementById("edit-name");
if (editNameBtn) {
  editNameBtn.addEventListener("click", () => {
    const newName = prompt("Enter your new name:");
    if (newName) {
      document.querySelector(
        ".profile-section p"
      ).innerText = `Name: ${newName}`;
    }
  });
}

// Friend card expand/collapse
// Friend cards toggle animation
document.querySelectorAll(".friend-card").forEach((card) => {
  card.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const content = document.querySelector(targetId);
    const isCollapsed = content.classList.contains("expanded");

    // Toggle the card content
    if (isCollapsed) {
      content.classList.remove("expanded");
      card.classList.add("collapsed");
    } else {
      content.classList.add("expanded");
      card.classList.remove("collapsed");
    }
  });
});
// auto-type
var typed = new Typed(".auto-type", {
  strings: [
    "Easy upload",
    "Instant preview",
    "Customize settings",
    "Secure payments",
    "Delivery options",
    "Track order",
  ],
  typeSpeed: 150,
  backSpeed: 150,
  loop: true,
});
// Function to start typing animation
function startTyping(target, text) {
  new Typed(target, {
    strings: [text],
    typeSpeed: 50,
    backSpeed: 0,
    loop: false,
    showCursor: false,
  });
}

// Add hover listener to the correct section using existing class names
const featureSection = document.querySelector("section.rounded-5.p-5.my-5"); // Target based on existing classes
let typedOnce = false; // Flag to ensure typing happens only once

featureSection.addEventListener("mouseenter", function () {
  // Check if typing has already been triggered
  if (!typedOnce) {
    // Select all the type-target elements inside the container
    document.querySelectorAll(".type-target").forEach((targetSpan) => {
      // Get the text from the data-text attribute
      const text = targetSpan.getAttribute("data-text");

      // Clear any previous typed content
      targetSpan.innerHTML = "";

      // Start typing animation for each feature box
      startTyping(targetSpan, text);
    });

    // Set the flag to true to prevent retyping on hover
    typedOnce = true;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Get the saved theme from localStorage, default to "dark" if none is set
  const currentTheme = localStorage.getItem("theme") || "dark";

  // Set the theme on the <html> element
  document.documentElement.setAttribute("data-theme", currentTheme);
});

// Function to toggle between light and dark theme
const toggleTheme = () => {
  // Get the current theme from the <html> element's data-theme attribute
  const currentTheme = document.documentElement.getAttribute("data-theme");

  // Determine the new theme based on the current one
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Set the new theme on the <html> element
  document.documentElement.setAttribute("data-theme", newTheme);

  // Save the new theme to localStorage
  localStorage.setItem("theme", newTheme);
};

// Add event listener for the theme toggle button
document.getElementById("theme-toggle");

//auto-type contributors
const titles = [
  "Collaborators",
  "Authors",
  "Developers",
  "Co-authors",
  "Team Members",
  "Participants",
  "Co-contributors",
  "Supporters",
  "Associates",
  "Engagers",
  "Project Allies",
  "engineers",
  "Contributing Members",
];

let titleIndex = 0;
let charIndex = 0;
const typingSpeed = 100; // Speed of typing in milliseconds
const erasingSpeed = 50; // Speed of erasing in milliseconds
const pauseDuration = 1500; // Pause before starting the next title

const autoType = () => {
  const currentTitle = titles[titleIndex];

  if (charIndex < currentTitle.length) {
    document.getElementById("auto-type-title").textContent +=
      currentTitle.charAt(charIndex);
    charIndex++;
    setTimeout(autoType, typingSpeed);
  } else {
    // Pause at the end of the word before erasing
    setTimeout(erase, pauseDuration);
  }
};

const erase = () => {
  const currentTitle = titles[titleIndex];

  if (charIndex > 0) {
    document.getElementById("auto-type-title").textContent = currentTitle.slice(
      0,
      charIndex - 1
    );
    charIndex--;
    setTimeout(erase, erasingSpeed);
  } else {
    // Move to the next title
    titleIndex = (titleIndex + 1) % titles.length; // Loop back to the first title
    setTimeout(autoType, typingSpeed);
  }
};

// Start the typing effect
document.addEventListener("DOMContentLoaded", () => {
  autoType();
});
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const message = document.getElementById("message").value;

      if (name && email && phone && message) {
        document.getElementById("success-msg").classList.remove("hidden");
        setTimeout(
          () => document.getElementById("success-msg").classList.add("hidden"),
          5000
        );

        // Reset form after submission
        this.reset();
      }
    });
  } else {
    console.error("The contact-form element is missing.");
  }
});

function validateForm() {
  const documentUpload = document.getElementById("documentUpload");
  const quantity = document.getElementById("quantity");

  if (documentUpload.files.length === 0) {
    alert("Please upload a document.");
    return false;
  }

  if (quantity.value < 1) {
    alert("Number of copies must be at least 1.");
    return false;
  }

  return true;
}
const locateButton = document.getElementById("locateButton");
if (locateButton) {
  locateButton.addEventListener("click", () => {
    const map = L.map("map").setView([0, 0], 13); // Default view

    // Add the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          map.setView(userLocation, 15); // Center map on user's location

          // Add a marker for the user
          L.marker(userLocation)
            .addTo(map)
            .bindPopup("Your Location")
            .openPopup();

          // Simulate nearby shops
          const shops = [
            {
              lat: userLocation[0] + 0.01,
              lng: userLocation[1] + 0.01,
              name: "Shop A",
            },
            {
              lat: userLocation[0] - 0.01,
              lng: userLocation[1] - 0.01,
              name: "Shop B",
            },
            {
              lat: userLocation[0] + 0.02,
              lng: userLocation[1] - 0.02,
              name: "Shop C",
            },
          ];

          // Add markers for the shops
          shops.forEach((shop) => {
            L.marker([shop.lat, shop.lng]).addTo(map).bindPopup(shop.name);
          });
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
} else {
  console.error('Element with ID "locateButton" not found in the DOM.');
}
