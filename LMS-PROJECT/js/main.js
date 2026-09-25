/* 
   ================================================================
   main.js - Interactive behaviors for the Landing Page
   ================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger / close icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Smooth Scrolling & Active State ---
    const sections = document.querySelectorAll('section, header.hero');
    const navItems = document.querySelectorAll('.nav a:not(.btn)');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add offset for the sticky navbar
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Check if href is an anchor link like #courses or index.html (which points to hero implicitly)
            if (href === `#${current}` || (href === 'index.html' && scrollY < window.innerHeight / 2)) {
                link.classList.add('active');
            }
        });
    });

    // Handle closing mobile menu on link click
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Close menu on resize back to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});
