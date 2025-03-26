// all.js

document.addEventListener('DOMContentLoaded', () => {

  // --- Utilities ---
  const throttle = (func, limit) => {
      let inThrottle;
      return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
          }
      };
  };

  // --- Cache DOM Elements ---
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.main-nav a.nav-link');
  const heroSection = document.getElementById('hero');
  const heroHeadlineSpan = document.querySelector('#hero h1 span');
  const chatbotToggler = document.getElementById('chatbot-toggler');
  const chatbot = document.getElementById('chatbot');
  const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
  const chatRequestBtn = document.getElementById('chat-request-btn');
  const chatbotBox = document.getElementById('chatbot-box');
  const yearSpan = document.getElementById('current-year');
  const revealElements = document.querySelectorAll('.reveal');
  const counterElements = document.querySelectorAll('.counter-number'); // Selector for counter numbers

  // --- Sticky Header ---
  const scrollThreshold = 50;
  const handleStickyHeader = () => {
      if (window.scrollY > scrollThreshold) {
          header?.classList.add('scrolled');
      } else {
          header?.classList.remove('scrolled');
      }
  };

  // --- Subtle Parallax Effect on Hero ---
  const handleParallax = () => {
      if (heroSection && window.innerWidth > 768) {
          const offset = window.scrollY * 0.2;
          const heroContent = heroSection.querySelector('.hero-content');
          if(heroContent) {
              // Ensure smooth transition is only applied via JS to avoid interfering with reveal animation
              heroContent.style.transition = 'transform 0.1s linear';
              heroContent.style.transform = `translateY(${offset}px)`;
          }
      } else if (heroSection) { // Reset transform on smaller screens or if effect disabled
           const heroContent = heroSection.querySelector('.hero-content');
           if(heroContent) {
               heroContent.style.transform = `translateY(0px)`;
           }
      }
  };

  // --- Active Nav Link Highlighting ---
  const setActiveLink = () => {
      let currentSectionId = '';
      const headerHeight = header ? header.offsetHeight + 20 : 70;

      sections.forEach(section => {
          const sectionTop = section.offsetTop - headerHeight;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
              currentSectionId = section.getAttribute('id');
          }
      });

      if (window.scrollY < (sections[0]?.offsetTop || 0) - headerHeight) {
          currentSectionId = sections[0]?.getAttribute('id') || 'hero';
      } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50 && sections.length > 0) {
          currentSectionId = sections[sections.length - 1].getAttribute('id');
      }

      allNavLinks.forEach(link => {
          link.classList.remove('active');
          const linkHref = link.getAttribute('href');
          if (linkHref && linkHref.substring(1) === currentSectionId) {
              link.classList.add('active');
          }
      });

      if (!document.querySelector('.main-nav a.nav-link.active') && window.scrollY < 300) {
           const homeLink = document.querySelector('.main-nav a[href="#hero"]');
           if (homeLink) homeLink.classList.add('active');
      }
  };

  // --- Throttled Scroll Handler ---
  const handleScroll = () => {
      handleStickyHeader();
      setActiveLink();
      handleParallax();
  };

  window.addEventListener('scroll', throttle(handleScroll, 100));
  handleScroll(); // Initial call

  // --- Mobile Navigation Toggle ---
  if (menuToggle && mainNav) {
      const navLinksAndCta = mainNav.querySelectorAll('a');

      menuToggle.addEventListener('click', () => {
          mainNav.classList.toggle('active');
          menuToggle.classList.toggle('active');
          document.body.classList.toggle('menu-open', mainNav.classList.contains('active'));
      });

      const closeMobileMenu = () => {
           if (mainNav.classList.contains('active')) {
               mainNav.classList.remove('active');
               menuToggle.classList.remove('active');
               document.body.classList.remove('menu-open');
           }
      }
      navLinksAndCta.forEach(link => { link.addEventListener('click', closeMobileMenu); });

      const menuStyle = document.createElement('style');
      menuStyle.textContent = `body.menu-open { overflow: hidden; }`;
      document.head.appendChild(menuStyle);
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (href && href !== '#' && href.startsWith('#')) {
              const targetElement = document.querySelector(href);
              if (targetElement) {
                  e.preventDefault();
                  const headerOffset = header?.offsetHeight || 70;
                  const elementPosition = targetElement.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              }
          }
      });
  });

  // --- Scroll Reveal Animation (Intersection Observer) ---
  if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
                  // observer.unobserve(entry.target); // Keep observing for parallax/other effects
              } else {
                   // entry.target.classList.remove('visible'); // Optional: re-hide
              }
          });
      }, { threshold: 0.1 }); // Trigger earlier for sections

      revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Hero Section Typing Effect ---
  if (heroHeadlineSpan) {
      const words = ["Secure", "Agile", "Automated", "Compliant", "Efficient"];
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      const typingSpeed = 120;
      const deletingSpeed = 60;
      const delayBetweenWords = 1500;

      const type = () => {
          const currentWord = words[wordIndex];
          let displayText;

          if (isDeleting) {
              displayText = currentWord.substring(0, charIndex - 1);
              charIndex--;
          } else {
              displayText = currentWord.substring(0, charIndex + 1);
              charIndex++;
          }

          heroHeadlineSpan.textContent = displayText || ' '; // Use space if empty to prevent collapse
          heroHeadlineSpan.style.borderRight = isDeleting ? 'none' : '2px solid var(--secondary-color)';

          let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

          if (!isDeleting && charIndex === currentWord.length) {
              typeSpeed = delayBetweenWords;
              isDeleting = true;
          } else if (isDeleting && charIndex === 0) {
              isDeleting = false;
              wordIndex = (wordIndex + 1) % words.length;
              typeSpeed = typingSpeed * 0.8;
          }

          setTimeout(type, typeSpeed);
      };
      setTimeout(type, 500); // Start after short delay
  }


  // --- Chatbot Functionality ---
  if (chatbotToggler && chatbot && chatbotCloseBtn) {
      const toggleChat = () => {
          chatbot.classList.toggle('visible');
          chatbotToggler.classList.toggle('active');
          document.body.classList.toggle('chat-open', chatbot.classList.contains('visible'));
      };

      chatbotToggler.addEventListener('click', toggleChat);
      chatbotCloseBtn.addEventListener('click', toggleChat);

       if (chatRequestBtn && chatbotBox) {
           chatRequestBtn.addEventListener('click', () => {
               const requestMessage = `
                   <div class="chat-message">
                       <span><i class="fas fa-robot"></i></span>
                       <p>Great! Please use the <a href="#cta" style="color: var(--primary-color); font-weight: 600;">Contact Form</a> below or email us directly at <a href="mailto:contact@dsonext.com" style="color: var(--primary-color); font-weight: 600;">contact@dsonext.com</a>. We look forward to hearing from you!</p>
                   </div>`;
               chatbotBox.insertAdjacentHTML('beforeend', requestMessage);
               chatbotBox.scrollTop = chatbotBox.scrollHeight;
               chatRequestBtn.disabled = true;
               chatRequestBtn.style.opacity = '0.7';
               chatRequestBtn.style.cursor = 'default';
               chatRequestBtn.textContent = "Please use form or email";

               setTimeout(() => {
                   toggleChat();
                   const ctaSection = document.getElementById('cta');
                   if(ctaSection) {
                      const headerOffset = header?.offsetHeight || 70;
                      const elementPosition = ctaSection.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                   }
               }, 3500);
           });
       }

      const chatStyle = document.createElement('style');
      chatStyle.textContent = `body.chat-open { overflow: hidden; }`;
      document.head.appendChild(chatStyle);

  } else {
      console.warn("Chatbot elements not found.");
  }

   // --- Number Counter Animation ---
  if (counterElements.length > 0) {
      const countUp = (el) => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target)) {
              console.error("Invalid data-target for counter:", el);
              return; // Skip if target is not a number
          }
          const duration = 2000; // Animation duration in ms
          let current = 0;
          const stepTime = Math.abs(Math.floor(duration / target)) || 50; // Calculate step time, ensure minimum
          const increment = target > 0 ? 1 : -1; // Handle potential negative targets? (Unlikely here)

           const timer = setInterval(() => {
              current += increment * Math.max(1, Math.floor(target / (duration / stepTime))); // Dynamic increment
              current = Math.min(current, target); // Don't exceed target

               el.innerText = Math.floor(current); // Display integer part

              if (current >= target) {
                  clearInterval(timer);
                  el.innerText = target; // Ensure final number is exact
              }
          }, stepTime);

          el.classList.add('counted'); // Mark as counted
      };

      const counterObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                  countUp(entry.target);
                  // Keep observing - allows re-trigger if user scrolls up/down past it multiple times
                  // observer.unobserve(entry.target); // Uncomment to animate only once ever
              }
          });
      }, { threshold: 0.5 }); // Trigger when 50% visible

      counterElements.forEach(counter => {
           // Initialize text to 0 or start value if specified
           counter.innerText = '0';
          counterObserver.observe(counter);
      });
  }

  // --- Update Footer Year ---
  if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
  }

}); // End DOMContentLoaded
