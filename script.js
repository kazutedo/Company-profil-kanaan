const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Menutup menu ketika link diklik
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

// Menambahkan class active pada menu yang diklik
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // Hapus class active dari semua link
    navLinks.forEach((l) => l.classList.remove("active"));

    // Tambah class active ke link yang diklik
    this.classList.add("active");
  });
});

// Menandai menu aktif berdasarkan URL saat ini
function setActiveMenu() {
  const currentLocation = window.location.pathname;
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentLocation) {
      link.classList.add("active");
    }
  });
}

// Jalankan saat halaman dimuat
setActiveMenu();

// Portfolio Carousel dengan logika Andaz Bali tanpa mengubah desain
document.addEventListener("DOMContentLoaded", function () {
  // Get all portfolio items
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const carousel = document.querySelector(".portfolio-carousel");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const dotsContainer = document.querySelector(".carousel-dots");

  // Jika elemen tidak ditemukan, keluar dari fungsi
  if (!carousel || portfolioItems.length === 0) return;

  // Variables
  let currentIndex = 0;
  let itemsPerView = 3; // Desktop default
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let isTransitioning = false; // Flag untuk mencegah multiple klik saat transisi
  let autoplayInterval;
  let dragThreshold = 30; // Reduced threshold for more responsive drag
  let lastWheelTime = 0; // Untuk throttle wheel event

  // Keyboard navigation - more responsive
  document.addEventListener("keydown", function (e) {
    if (isTransitioning) return;

    // Only respond to arrow keys
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stopAutoplay();
      currentIndex--;
      updateCarouselWithAndazLogic();
      setTimeout(startAutoplay, 1500); // Reduced timeout
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stopAutoplay();
      currentIndex++;
      updateCarouselWithAndazLogic();
      setTimeout(startAutoplay, 1500); // Reduced timeout
    }
  });

  // Mouse wheel event - more responsive
  carousel.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault(); // Prevent page scrolling

      // Throttle wheel events - reduced to make more responsive
      const now = new Date().getTime();
      if (now - lastWheelTime < 150) return; // 150ms throttle (much more responsive)
      lastWheelTime = now;

      if (isTransitioning) return; // Prevent scroll during transition

      // Stop autoplay when user interacts
      stopAutoplay();

      // Scroll direction
      if (e.deltaY > 0 || e.deltaX > 0) {
        // Scroll down or right
        currentIndex++;
      } else {
        // Scroll up or left
        currentIndex--;
      }

      updateCarouselWithAndazLogic();

      // Resume autoplay after interaction - reduced timeout
      setTimeout(startAutoplay, 1500);
    },
    { passive: false }
  );

  // Touch events - optimized for responsiveness
  function touchStart(event) {
    if (isTransitioning) return; // Prevent drag during transition

    // Stop autoplay when user interacts
    stopAutoplay();

    const touch = event.type.includes("mouse") ? event : event.touches[0];
    startPos = touch.clientX;
    isDragging = true;
    carousel.classList.add("grabbing");

    // Stop any ongoing animation
    cancelAnimationFrame(animationID);

    // Record the current position
    prevTranslate = currentTranslate;

    // Start animation loop
    animationID = requestAnimationFrame(animation);

    // Prevent default behavior only for mouse events to avoid issues on touch devices
    if (event.type.includes("mouse")) {
      event.preventDefault();
    }
  }

  function touchMove(event) {
    if (!isDragging) return;

    const touch = event.type.includes("mouse") ? event : event.touches[0];
    const currentPosition = touch.clientX;
    const diff = currentPosition - startPos;

    // Update current translate based on drag - more responsive
    currentTranslate = prevTranslate + diff * 1.2; // Multiplier for more responsive feel

    // Apply the transform
    carousel.style.transition = "none"; // No transition during drag for immediate response
    carousel.style.transform = `translateX(${currentTranslate}px)`;

    // Prevent default to stop page scrolling during drag
    event.preventDefault();
  }

  function touchEnd() {
    if (!isDragging) return;

    isDragging = false;
    cancelAnimationFrame(animationID);
    carousel.classList.remove("grabbing");

    const movedBy = currentTranslate - prevTranslate;

    // More responsive thresholds
    if (movedBy < -dragThreshold) {
      currentIndex += 1;
    } else if (movedBy > dragThreshold) {
      currentIndex -= 1;
    }

    // Update carousel with Andaz logic
    updateCarouselWithAndazLogic();

    // Resume autoplay after interaction - reduced timeout
    setTimeout(startAutoplay, 1500);
  }

  function animation() {
    if (isDragging) {
      setSliderPosition();
      requestAnimationFrame(animation);
    }
  }

  function setSliderPosition() {
    carousel.style.transform = `translateX(${currentTranslate}px)`;
  }

  // Add event listeners for mouse and touch events
  // Mouse events
  carousel.addEventListener("mousedown", touchStart);
  carousel.addEventListener("mousemove", touchMove);
  carousel.addEventListener("mouseup", touchEnd);
  carousel.addEventListener("mouseleave", touchEnd);

  // Touch events
  carousel.addEventListener("touchstart", touchStart);
  carousel.addEventListener("touchmove", touchMove);
  carousel.addEventListener("touchend", touchEnd);

  // Prevent context menu on long press
  carousel.addEventListener("contextmenu", (e) => e.preventDefault());

  // Add CSS cursor styles to indicate draggable
  carousel.style.cursor = "grab";

  // Clone items for infinite loop
  function setupInfiniteLoop() {
    // Get visible items only
    const visibleItems = Array.from(portfolioItems).filter(
      (item) => item.style.display !== "none"
    );

    if (visibleItems.length === 0) return;

    // Remove any existing clones
    carousel.querySelectorAll(".clone").forEach((clone) => clone.remove());

    // Clone ALL items for true infinite loop
    for (let i = 0; i < visibleItems.length; i++) {
      const clone = visibleItems[i].cloneNode(true);
      clone.classList.add("clone");
      clone.setAttribute("aria-hidden", "true");
      carousel.appendChild(clone);
    }

    // Clone ALL items again for the beginning
    for (let i = visibleItems.length - 1; i >= 0; i--) {
      const clone = visibleItems[i].cloneNode(true);
      clone.classList.add("clone");
      clone.setAttribute("aria-hidden", "true");
      carousel.insertBefore(clone, carousel.firstChild);
    }

    // Adjust initial position to show first real slide (not clone)
    const itemWidth = visibleItems[0].offsetWidth + 20; // width + margin
    currentIndex = visibleItems.length; // Start at first real item (after clones)
    const initialTranslate = -currentIndex * itemWidth;
    carousel.style.transition = "none";
    carousel.style.transform = `translateX(${initialTranslate}px)`;
    prevTranslate = initialTranslate;
    currentTranslate = initialTranslate;

    // Force reflow
    void carousel.offsetWidth;

    // Re-enable transitions
    setTimeout(() => {
      carousel.style.transition =
        "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
    }, 10);
  }

  // Fungsi untuk memperbarui carousel - dengan transisi indikator yang lebih mulus
  function updateCarouselWithAndazLogic() {
    // Dapatkan item yang terlihat saja (termasuk clone)
    const allVisibleItems = Array.from(
      carousel.querySelectorAll(".portfolio-item")
    ).filter((item) => item.style.display !== "none");

    // Dapatkan item asli (bukan clone)
    const originalVisibleItems = Array.from(portfolioItems).filter(
      (item) => item.style.display !== "none"
    );

    if (originalVisibleItems.length === 0) return;

    // Hitung total halaman berdasarkan item asli
    const totalItems = originalVisibleItems.length;

    // Normalisasi currentIndex untuk dot navigation (mengabaikan clone)
    const normalizedIndex =
      (((currentIndex - totalItems) % totalItems) + totalItems) % totalItems;

    // Update posisi carousel dengan transisi mulus
    const itemWidth = originalVisibleItems[0].offsetWidth + 20; // width + margin
    const translateX = -currentIndex * itemWidth;

    // Gunakan transisi CSS untuk animasi mulus - faster transition
    carousel.style.transition = "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)"; // Reduced to 0.3s
    carousel.style.transform = `translateX(${translateX}px)`;

    // Update for drag functionality
    prevTranslate = translateX;
    currentTranslate = translateX;

    // Update sliding indicator position
    if (dotsContainer) {
      const segmentWidth = 100 / totalItems;
      const indicatorPosition = segmentWidth * normalizedIndex;
      dotsContainer.style.setProperty(
        "--indicator-transform",
        `translateX(${indicatorPosition}%)`
      );
    }

    // Update active dot for accessibility
    updateDots(normalizedIndex);

    // Set flag transisi - shorter transition time
    isTransitioning = true;
    setTimeout(() => {
      isTransitioning = false;
    }, 300); // Reduced to match transition time
  }

  // Update dots function for separate line indicators
  function updateDots(activeIndex) {
    if (!dotsContainer) return;

    const dots = document.querySelectorAll(".dot");
    if (dots.length === 0) return;

    dots.forEach((dot, index) => {
      dot.classList.remove("active");
      dot.style.width = "25px"; // Reset width

      if (index === activeIndex) {
        dot.classList.add("active");
        dot.style.width = "35px"; // Active dot is wider
      }
    });

    // Perbarui warna dot berdasarkan kategori aktif
    const activeFilter = document.querySelector(".filter-btn.active");
    if (activeFilter) {
      const filterValue = activeFilter.getAttribute("data-filter");
      if (filterValue !== "all") {
        updateDotsStyle(filterValue);
      } else {
        // Default color for active dot when "all" is selected
        const activeDot = document.querySelector(".dot.active");
        if (activeDot) {
          activeDot.style.backgroundColor = "#007bff";
        }
      }
    }
  }

  // Autoplay functions like Andaz
  function startAutoplay() {
    // Clear any existing interval first
    if (autoplayInterval) clearInterval(autoplayInterval);

    autoplayInterval = setInterval(() => {
      if (!isDragging && !isTransitioning) {
        currentIndex++;
        updateCarouselWithAndazLogic();
      }
    }, 5000); // 5 second interval like Andaz
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Event listeners for buttons - more responsive
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (isTransitioning) return;
      stopAutoplay();
      currentIndex--;
      updateCarouselWithAndazLogic();
      setTimeout(startAutoplay, 1500); // Reduced timeout
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (isTransitioning) return;
      stopAutoplay();
      currentIndex++;
      updateCarouselWithAndazLogic();
      setTimeout(startAutoplay, 1500); // Reduced timeout
    });
  }

  // Adjust items per view based on screen size
  function updateItemsPerView() {
    const oldItemsPerView = itemsPerView;

    if (window.innerWidth <= 768) {
      itemsPerView = 1;
    } else if (window.innerWidth <= 992) {
      itemsPerView = 2;
    } else {
      itemsPerView = 3;
    }

    // If itemsPerView changed, we need to reset the infinite loop
    if (oldItemsPerView !== itemsPerView) {
      setupInfiniteLoop();
    } else {
      updateCarouselWithAndazLogic();
    }
  }

  // Create dots as separate lines with cursor drag functionality
  function createDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    // Get visible items only (excluding clones)
    const visibleItems = Array.from(portfolioItems).filter(
      (item) => item.style.display !== "none"
    );

    // Calculate total dots based on visible items
    const totalDots = visibleItems.length;

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        if (isTransitioning) return; // Prevent clicks during transition
        stopAutoplay(); // Stop autoplay on user interaction
        currentIndex = i + visibleItems.length; // Adjust for clones at start
        updateCarouselWithAndazLogic();
        setTimeout(startAutoplay, 1500); // Reduced timeout
      });

      dotsContainer.appendChild(dot);
    }

    // Apply initial category styling if needed
    const activeFilter = document.querySelector(".filter-btn.active");
    if (activeFilter) {
      const filterValue = activeFilter.getAttribute("data-filter");
      if (filterValue !== "all") {
        updateDotsStyle(filterValue);
      }
    }

    // Add cursor drag functionality to the dots container
    let isDraggingDots = false;
    let startDragX = 0;

    // Mouse events for dots container
    dotsContainer.addEventListener("mousedown", startDragDots);
    dotsContainer.addEventListener("mousemove", dragDots);
    dotsContainer.addEventListener("mouseup", endDragDots);
    dotsContainer.addEventListener("mouseleave", endDragDots);

    // Touch events for dots container
    dotsContainer.addEventListener("touchstart", startDragDots);
    dotsContainer.addEventListener("touchmove", dragDots);
    dotsContainer.addEventListener("touchend", endDragDots);

    function startDragDots(e) {
      if (isTransitioning) return;

      isDraggingDots = true;
      dotsContainer.style.cursor = "grabbing";

      // Get start position
      startDragX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

      // Stop autoplay when user interacts
      stopAutoplay();

      // Prevent default behavior
      e.preventDefault();
    }

    function dragDots(e) {
      if (!isDraggingDots) return;

      // Get current position
      const currentX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
      const diffX = currentX - startDragX;

      // Calculate which dot to move to based on drag distance
      const containerWidth = dotsContainer.offsetWidth;
      const dotWidth = containerWidth / totalDots;
      const dotsToMove = Math.round(diffX / dotWidth);

      if (Math.abs(dotsToMove) >= 1) {
        // Calculate new index
        let newIndex = currentIndex - dotsToMove;

        // Update carousel
        currentIndex = newIndex;
        updateCarouselWithAndazLogic();

        // Reset start position
        startDragX = currentX;
      }

      // Prevent default behavior
      e.preventDefault();
    }

    function endDragDots() {
      if (!isDraggingDots) return;

      isDraggingDots = false;
      dotsContainer.style.cursor = "grab";

      // Ensure we snap to the nearest dot position
      const originalVisibleItems = Array.from(portfolioItems).filter(
        (item) => item.style.display !== "none"
      );

      if (originalVisibleItems.length > 0) {
        const totalItems = originalVisibleItems.length;

        // Normalize current index to ensure it's within valid range
        const normalizedIndex =
          (((currentIndex - totalItems) % totalItems) + totalItems) %
          totalItems;

        // Calculate the actual index including clones
        const targetIndex = normalizedIndex + totalItems;

        // Apply smooth transition to the target index
        smoothTransitionToIndex(targetIndex);
      }

      // Resume autoplay after interaction
      setTimeout(startAutoplay, 1500);
    }
  }

  // Add smooth transition when dragging ends
  function smoothTransitionToIndex(targetIndex) {
    // Ensure target index is valid
    const originalVisibleItems = Array.from(portfolioItems).filter(
      (item) => item.style.display !== "none"
    );

    if (originalVisibleItems.length === 0) return;

    // Set current index to target
    currentIndex = targetIndex;

    // Update carousel with smooth transition
    updateCarouselWithAndazLogic();
  }

  // Filter functionality with Andaz-style transitions
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      // Add active category class to portfolio container
      const portfolioSection = document.querySelector(".portfolio");
      portfolioSection.className = "portfolio"; // Reset classes
      if (filterValue !== "all") {
        portfolioSection.classList.add(`category-${filterValue}`);
      }

      // Filter items with smooth transition
      let visibleItems = 0;
      portfolioItems.forEach((item) => {
        // Add transition for smooth appearance/disappearance
        item.style.transition = "opacity 0.3s ease, transform 0.3s ease";

        if (filterValue === "all" || item.classList.contains(filterValue)) {
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";

          setTimeout(() => {
            item.style.display = "block";
            // Force reflow
            void item.offsetWidth;
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 50);

          visibleItems++;
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";

          setTimeout(() => {
            item.style.display = "none";
          }, 300); // Wait for fade out to complete
        }
      });

      // Reset carousel position and recalculate
      stopAutoplay(); // Stop autoplay during filter change

      // Make sure to update carousel after filtering
      setTimeout(() => {
        // Reset and rebuild infinite loop with new filtered items
        setupInfiniteLoop();
        createDots();
        startAutoplay(); // Resume autoplay after filter change
      }, 350); // Small delay to ensure DOM updates
    });
  });

  // Function to update dots style based on category
  function updateDotsStyle(category) {
    const dots = document.querySelectorAll(".dot");

    // Reset dot styles
    dots.forEach((dot) => {
      dot.style.backgroundColor = "#ccc";
      dot.style.width = dot.classList.contains("active") ? "35px" : "25px";
      // Remove all category classes
      dot.classList.remove(
        "dot-cctv",
        "dot-internet",
        "dot-audio-video",
        "dot-Home-Automation"
      );
    });

    // Apply category-specific styles to active dot
    const activeDot = document.querySelector(".dot.active");
    if (activeDot) {
      switch (category) {
        case "cctv":
          activeDot.style.backgroundColor = "#007bff";
          break;
        case "internet":
          activeDot.style.backgroundColor = "#28a745";
          break;
        case "audio-video":
          activeDot.style.backgroundColor = "#6f42c1";
          break;
        case "Home-Automation":
          activeDot.style.backgroundColor = "#fd7e14";
          break;
        default:
          activeDot.style.backgroundColor = "#007bff";
      }
    }
  }

  // Handle window resize like Andaz (debounced)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateItemsPerView();
      createDots();
    }, 250);
  });

  // Add transitionend event listener for perfect looping
  carousel.addEventListener("transitionend", function () {
    // Dapatkan item asli (bukan clone)
    const originalVisibleItems = Array.from(portfolioItems).filter(
      (item) => item.style.display !== "none"
    );

    if (originalVisibleItems.length === 0) return;

    const totalItems = originalVisibleItems.length;

    // Jika sudah di slide terakhir dari set kedua (clone), reset ke set asli
    if (currentIndex >= totalItems * 2) {
      carousel.style.transition = "none";
      currentIndex = currentIndex - totalItems; // Reset ke set asli
      const itemWidth = originalVisibleItems[0].offsetWidth + 20;
      const translateX = -currentIndex * itemWidth;
      carousel.style.transform = `translateX(${translateX}px)`;
      prevTranslate = translateX;
      currentTranslate = translateX;

      // Force reflow
      void carousel.offsetWidth;

      // Aktifkan kembali transisi untuk gerakan selanjutnya - faster transition
      setTimeout(() => {
        carousel.style.transition =
          "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
      }, 5); // Reduced timeout
    }

    // Jika di slide pertama dari set pertama (clone), reset ke set asli
    if (currentIndex < totalItems) {
      carousel.style.transition = "none";
      currentIndex = currentIndex + totalItems; // Reset ke set asli
      const itemWidth = originalVisibleItems[0].offsetWidth + 20;
      const translateX = -currentIndex * itemWidth;
      carousel.style.transform = `translateX(${translateX}px)`;
      prevTranslate = translateX;
      currentTranslate = translateX;

      // Force reflow
      void carousel.offsetWidth;

      // Aktifkan kembali transisi untuk gerakan selanjutnya - faster transition
      setTimeout(() => {
        carousel.style.transition =
          "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
      }, 5); // Reduced timeout
    }
  });

  // Initialize carousel with infinite loop
  setupInfiniteLoop();
  createDots();

  // Start autoplay like Andaz
  startAutoplay();

  // Pause autoplay on hover/touch like Andaz
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("touchstart", stopAutoplay);

  // Resume autoplay when mouse leaves like Andaz
  carousel.addEventListener("mouseleave", () => {
    setTimeout(startAutoplay, 1000);
  });

  carousel.addEventListener("touchend", () => {
    setTimeout(startAutoplay, 1000);
  });
});

// WhatsApp Button Animation and Functionality
document.addEventListener("DOMContentLoaded", function () {
  const whatsappBtn = document.querySelector(".whatsapp-btn");

  // Simplified pulse animation
  setInterval(() => {
    whatsappBtn.classList.add("pulse");
    setTimeout(() => {
      whatsappBtn.classList.remove("pulse");
    }, 1000);
  }, 5000); // Increased interval to 5 seconds

  // Simplified scroll behavior
  let isVisible = true;
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Only show button after scrolling down 100px
    if (scrollY > 100) {
      whatsappBtn.classList.add("show");
    } else {
      whatsappBtn.classList.remove("show");
    }
  });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scrollToTop");

// Tampilkan tombol scroll to top ketika user scroll ke bawah
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

// Event listener untuk tombol scroll to top
scrollToTopBtn.addEventListener("click", () => {
  // Gunakan implementasi manual untuk smooth scroll ke atas
  const startPosition = window.scrollY;
  const duration = 800; // ms
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentage = Math.min(progress / duration, 1);

    // Fungsi easing
    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    window.scrollTo(0, startPosition * (1 - easeInOutQuad(percentage)));

    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
});

// Smooth scroll untuk semua link navigasi
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      // Tambahkan offset untuk header
      const headerOffset = 80; // Sesuaikan dengan tinggi header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      // Implementasi manual smooth scroll
      const startPosition = window.scrollY;
      const distance = offsetPosition - startPosition;
      const duration = 800; // ms
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);

        // Fungsi easing
        const easeInOutQuad = (t) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        window.scrollTo(
          0,
          startPosition + distance * easeInOutQuad(percentage)
        );

        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      }

      window.requestAnimationFrame(step);

      // Tambahkan class active ke link yang diklik
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
      });
      this.classList.add("active");
    }

    // Jika menggunakan hamburger menu, tutup menu setelah klik
    const navMenu = document.querySelector(".nav-menu");
    const hamburger = document.querySelector(".hamburger");
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    }
  });
});

// Handle navigation to references.html with smooth transition
document.addEventListener("DOMContentLoaded", function () {
  // Get the references link in the navigation
  const referencesLink = document.querySelector('a[href="references.html"]');

  if (referencesLink) {
    referencesLink.addEventListener("click", function (e) {
      // Only apply the transition if we're not already on the references page
      if (!window.location.href.includes("references.html")) {
        e.preventDefault();

        // Add a fade-out effect to the current page
        document.body.style.opacity = "0";
        document.body.style.transition = "opacity 0.5s ease";

        // After the fade-out animation completes, navigate to references.html
        setTimeout(function () {
          window.location.href = "references.html";
        }, 500);
      }
    });
  }

  // Add fade-in effect when the page loads
  document.body.style.opacity = "0";
  setTimeout(function () {
    document.body.style.opacity = "1";
    document.body.style.transition = "opacity 0.5s ease";
  }, 10);
});

// View All button functionality for references page
document.addEventListener("DOMContentLoaded", function () {
  const viewAllButtons = document.querySelectorAll(".view-all-btn");

  viewAllButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get the target hidden items container
      const targetId = this.getAttribute("data-target");
      const hiddenItems = document.querySelector(`.${targetId}`);

      // Toggle visibility
      if (hiddenItems) {
        hiddenItems.classList.toggle("show");
        this.classList.toggle("active");

        // Scroll to newly visible content if expanding
        if (hiddenItems.classList.contains("show")) {
          // Smooth scroll to the first new item
          setTimeout(() => {
            hiddenItems.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }, 100);
        }
      }
    });
  });
});
