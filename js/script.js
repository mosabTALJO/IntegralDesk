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
});
