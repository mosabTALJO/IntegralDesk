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

    // Service Modal Logic
    const modal = document.getElementById('service-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    const serviceCards = document.querySelectorAll('.expandable-service-card');

    if (modal && modalBody) {
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                // Extract content from the clicked card
                const title = card.querySelector('h3').outerHTML;
                const subtitleEl = card.querySelector('.service-subtitle');
                const subtitle = subtitleEl ? subtitleEl.outerHTML : '';
                const normalContent = card.querySelector('.service-content-normal').innerHTML;
                const expandedContent = card.querySelector('.service-content-expanded').innerHTML;

                // Populate modal body
                modalBody.innerHTML = `
                    ${title}
                    ${subtitle}
                    <div class="service-content-normal" style="margin-bottom: 1.5rem; color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">${normalContent}</div>
                    <div class="service-content-expanded" style="display: block; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1.5rem; color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">${expandedContent}</div>
                `;

                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close modal on close button click
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
