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
  handleScroll(); // Initial check

  // --- Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = mainNav.querySelectorAll('a:not(.nav-cta)'); // Exclude CTA button if needed
  const navCtaButton = mainNav.querySelector('.nav-cta');

  if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
          mainNav.classList.toggle('active');
          menuToggle.classList.toggle('active');
      });

      const closeMobileMenu = () => {
           if (mainNav.classList.contains('active')) {
               mainNav.classList.remove('active');
               menuToggle.classList.remove('active');
           }
      }

      // Close menu when a standard link is clicked
      navLinks.forEach(link => {
          link.addEventListener('click', closeMobileMenu);
      });
      // Close menu when the CTA button inside the nav is clicked
      if(navCtaButton) {
          navCtaButton.addEventListener('click', closeMobileMenu);
      }
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (href && href !== '#' && href.startsWith('#')) {
              const targetElement = document.querySelector(href);
              if (targetElement) {
                  e.preventDefault();

                  const headerOffset = header.offsetHeight;
                  const elementPosition = targetElement.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                  window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                  });
              }
          }
      });
  });

  // --- Active Nav Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.main-nav a.nav-link');

  const setActiveLink = () => {
      let currentSectionId = '';
      const headerHeight = header.offsetHeight + 20;

      sections.forEach(section => {
          const sectionTop = section.offsetTop - headerHeight;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
              currentSectionId = section.getAttribute('id');
          }
      });

       if (window.scrollY < sections[0].offsetTop - headerHeight) {
           currentSectionId = sections[0].getAttribute('id');
       } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
           // Prioritize CTA section if it's the last one
           const lastSectionId = sections[sections.length - 1].getAttribute('id');
           currentSectionId = (lastSectionId === 'cta') ? 'cta' : currentSectionId;
           // If scrolled fully to bottom, ensure last section is active if appropriate
            if (!currentSectionId && sections.length > 0) {
               currentSectionId = lastSectionId;
           }
       }

      allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === currentSectionId) {
              link.classList.add('active');
          }
      });

      // Handle 'Home' link activation more reliably
      if (!document.querySelector('.main-nav a.nav-link.active') && window.scrollY < 300) {
          const homeLink = document.querySelector('.main-nav a[href="#hero"]');
          if (homeLink) homeLink.classList.add('active');
      }
  };

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // Initial check

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
          } else {
              // entry.target.classList.remove('visible'); // Uncomment to re-hide on scroll up
          }
      });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Update Footer Year ---
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
  }

  // --- Chatbot Functionality ---
  const chatbotToggler = document.getElementById('chatbot-toggler');
  const chatbot = document.getElementById('chatbot');
  const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
  const chatRequestBtn = document.getElementById('chat-request-btn'); // Get the request button

  if (chatbotToggler && chatbot && chatbotCloseBtn) {
      // Function to toggle chat visibility
      const toggleChat = () => {
          chatbot.classList.toggle('visible');
          chatbotToggler.classList.toggle('active'); // Optional: for icon change or style
           // Add/remove body class to prevent background scroll when chat is open
           document.body.classList.toggle('chat-open', chatbot.classList.contains('visible'));
      };

      chatbotToggler.addEventListener('click', toggleChat);
      chatbotCloseBtn.addEventListener('click', toggleChat);

       // Example: Handle click on the "Request Support" button
       if (chatRequestBtn) {
           chatRequestBtn.addEventListener('click', () => {
               // Option 1: Redirect to contact page/section
               // window.location.href = '#cta'; // Or '/contact'
               // toggleChat(); // Close chat after clicking

               // Option 2: Display a message guiding the user
               const chatbotBox = document.getElementById('chatbot-box');
               const requestMessage = `
                   <div class="chat-message">
                       <span><i class="fas fa-robot"></i></span>
                       <p>Great! Please fill out our contact form or email us at contact@dsonext.com with your details, and we'll get back to you shortly.</p>
                   </div>`;
               chatbotBox.insertAdjacentHTML('beforeend', requestMessage);
               // Scroll to the bottom of the chat box
               chatbotBox.scrollTop = chatbotBox.scrollHeight;

               // Optionally disable the button after clicking
               chatRequestBtn.disabled = true;
               chatRequestBtn.textContent = "Contact us via form/email";
           });
       }

       // Add style to body when chat is open to prevent background scroll (optional)
       const style = document.createElement('style');
       style.textContent = `
           body.chat-open {
               overflow: hidden;
           }
       `;
       document.head.appendChild(style);


  } else {
      console.warn("Chatbot elements not found.");
  }

});
