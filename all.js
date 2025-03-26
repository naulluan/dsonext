// all.js

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.getElementById('main-header');
  const scrollThreshold = 50; // Pixels to scroll before header becomes sticky

  const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check in case page is loaded scrolled down


  // --- Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = mainNav.querySelectorAll('a'); // Get all links in nav

  if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
          mainNav.classList.toggle('active');
          menuToggle.classList.toggle('active');
          // Optional: Prevent body scroll when menu is open
          // document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu when a link is clicked (for single-page apps)
      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              if (mainNav.classList.contains('active')) {
                  mainNav.classList.remove('active');
                  menuToggle.classList.remove('active');
                  // document.body.style.overflow = ''; // Restore scroll
              }
          });
      });
  }


  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');

          // Ensure it's a link to an element on the page, not just '#'
          if (href && href !== '#' && href.startsWith('#')) {
              const targetElement = document.querySelector(href);
              if (targetElement) {
                  e.preventDefault(); // Prevent default jump

                  const headerOffset = header.offsetHeight; // Get dynamic header height
                  const elementPosition = targetElement.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                  window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                  });

                   // Close mobile nav if open after clicking a link
                   if (mainNav && mainNav.classList.contains('active')) {
                       mainNav.classList.remove('active');
                       menuToggle.classList.remove('active');
                   }
              }
          }
      });
  });


  // --- Active Nav Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID
  const allNavLinks = document.querySelectorAll('.main-nav a.nav-link'); // Select only main nav links

  const setActiveLink = () => {
      let currentSectionId = '';
      const headerHeight = header.offsetHeight + 20; // Add a small buffer

      sections.forEach(section => {
          const sectionTop = section.offsetTop - headerHeight;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
              currentSectionId = section.getAttribute('id');
          }
      });

       // Special case for top of page (hero)
       if (window.scrollY < sections[0].offsetTop - headerHeight) {
           currentSectionId = sections[0].getAttribute('id');
       }
       // Special case for bottom of page (last section fully visible)
       else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) { // Check if near bottom
           currentSectionId = sections[sections.length - 1].getAttribute('id');
       }


      allNavLinks.forEach(link => {
          link.classList.remove('active');
           // Check if the link's href matches the current section ID
           // Remove '#' from href for comparison
          if (link.getAttribute('href').substring(1) === currentSectionId) {
              link.classList.add('active');
          }
      });

      // Handle edge case where no section is "active" (e.g., footer visible but not a section)
      // If no link is active, try activating the 'Home' link if near the top.
      if (!document.querySelector('.main-nav a.nav-link.active') && window.scrollY < 300) {
           const homeLink = document.querySelector('.main-nav a[href="#hero"]');
           if (homeLink) homeLink.classList.add('active');
      }
  };

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // Initial check


  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              // Optional: Unobserve after revealing to save resources,
              // but keep observing if you want animations to replay on scroll up/down
              // observer.unobserve(entry.target);
          } else {
               // Optional: Remove 'visible' if you want elements to hide again when scrolling up
               // entry.target.classList.remove('visible');
          }
      });
  }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
      // rootMargin: "-50px 0px -50px 0px" // Optional: Adjust viewport bounds
  });

  revealElements.forEach(el => {
      revealObserver.observe(el);

      // Assign stagger delay based on CSS variable --order if present
      const cards = el.querySelectorAll('[style*="--order"]');
      cards.forEach(card => {
           // The delay is handled by CSS using var(--order)
           // No extra JS needed here if CSS is set up correctly
      });
  });


  // --- Update Footer Year ---
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
  }

});
