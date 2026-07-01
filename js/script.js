document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    
    if (header) {
        const heroSection = document.getElementById('hero') || document.querySelector('.page-header');
        
        window.addEventListener('scroll', () => {
            let threshold = 50;
            if (heroSection) {
                // Calculate dynamically in case window is resized or CSS loads late
                threshold = heroSection.offsetHeight - header.offsetHeight;
            }
            
            // Add a small 2px buffer to account for sub-pixel rendering and smooth scroll snapping
            if (window.scrollY >= threshold - 2) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Trigger scroll event on page load to set initial state
        window.dispatchEvent(new Event('scroll'));
    }

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Service Modal Logic (Expanding Card Animation via FLIP)
    const serviceCards = document.querySelectorAll('.expandable-service-card');
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop-only';
    document.body.appendChild(backdrop);
    
    let activeCard = null;
    let placeholder = null;

    const closeActiveCard = () => {
        if (!activeCard) return;

        // Fade out expanded content
        activeCard.classList.remove('expanded-content-fade-in');
        activeCard.classList.remove('expanded-content-visible');
        backdrop.classList.remove('active');

        if (placeholder) {
            const phRect = placeholder.getBoundingClientRect();
            activeCard.style.top = phRect.top + 'px';
            activeCard.style.left = phRect.left + 'px';
            activeCard.style.width = phRect.width + 'px';
            activeCard.style.height = phRect.height + 'px';
            activeCard.style.overflowY = 'hidden'; // hide scrollbar while animating back
        }

        const currentCard = activeCard; // Scope for timeout
        
        setTimeout(() => {
            currentCard.style.position = '';
            currentCard.style.top = '';
            currentCard.style.left = '';
            currentCard.style.width = '';
            currentCard.style.height = '';
            currentCard.style.margin = '';
            currentCard.style.zIndex = '';
            currentCard.style.transition = '';
            currentCard.style.overflowY = '';
            currentCard.classList.remove('expanding-active');
            if (placeholder) {
                placeholder.remove();
                placeholder = null;
            }
            if (activeCard === currentCard) {
                activeCard = null;
                document.body.style.overflow = '';
            }
        }, 500); // Wait for CSS transition (0.5s) to finish
    };

    backdrop.addEventListener('click', closeActiveCard);

    serviceCards.forEach(card => {
        // Create a close button for each card
        const closeBtn = document.createElement('button');
        closeBtn.className = 'card-close-btn';
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        card.appendChild(closeBtn);

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeActiveCard();
        });

        // Prevent clicks inside the expanded content from closing the card
        const innerContent = card.querySelector('.service-content-expanded');
        if(innerContent) {
             innerContent.addEventListener('click', (e) => e.stopPropagation());
        }

        card.addEventListener('click', () => {
            if (activeCard) return; // Prevent clicking others while one is active

            activeCard = card;
            const rect = card.getBoundingClientRect();

            // Create placeholder with exact dimensions to keep grid from collapsing
            placeholder = document.createElement('div');
            placeholder.className = 'expandable-service-card card-placeholder';
            placeholder.style.width = rect.width + 'px';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.visibility = 'hidden';
            placeholder.style.margin = '0';
            card.parentNode.insertBefore(placeholder, card);

            // Set initial fixed position for FLIP
            card.style.position = 'fixed';
            card.style.top = rect.top + 'px';
            card.style.left = rect.left + 'px';
            card.style.width = rect.width + 'px';
            card.style.height = rect.height + 'px';
            card.style.margin = '0';
            card.style.zIndex = '2001';
            card.style.transition = 'none'; // CRITICAL: No transition during setup/measurement

            document.body.style.overflow = 'hidden';

            // Force layout
            void card.offsetHeight;

            // 1. MEASUREMENT PHASE
            card.classList.add('expanding-active');
            card.classList.add('expanded-content-visible');

            const targetWidth = Math.min(window.innerWidth * 0.9, 800);
            
            // Allow card to shrink to content for measurement
            card.style.width = targetWidth + 'px';
            card.style.height = 'auto';
            
            void card.offsetHeight; 
            
            // Get the real height of the content
            let targetHeight = card.getBoundingClientRect().height;
            
            const maxHeight = window.innerHeight * 0.9;
            const isScrolling = targetHeight > maxHeight;
            if (isScrolling) targetHeight = maxHeight;

            // 2. REVERT TO TEASER STATE (Pre-Animation)
            card.classList.remove('expanded-content-visible');
            card.style.width = rect.width + 'px';
            card.style.height = rect.height + 'px';

            void card.offsetHeight;

            // 3. START ACTUAL ANIMATION
            card.classList.add('expanded-content-visible');
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            const targetLeft = (window.innerWidth - targetWidth) / 2;
            const targetTop = (window.innerHeight - targetHeight) / 2;

            card.style.top = targetTop + 'px';
            card.style.left = targetLeft + 'px';
            card.style.width = targetWidth + 'px';
            card.style.height = targetHeight + 'px';
            
            card.style.overflowY = isScrolling ? 'auto' : 'hidden';

            backdrop.classList.add('active');

            setTimeout(() => {
                card.classList.add('expanded-content-fade-in');
            }, 150);
        });
    });

    // Form handling via AJAX
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    alert('Thank you! Your message has been sent.');
                    form.reset();
                })
                .catch(error => {
                    alert('Oops! There was a problem submitting your form.');
                })
                .finally(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});
