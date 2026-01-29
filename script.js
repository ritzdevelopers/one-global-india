// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Animation loop
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Navbar Elements
    const navbar = document.getElementById('navbar');
    const mobileNavbar = document.getElementById('mobile-navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    // Navbar Scroll Background Change
    function handleNavbarScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        // Desktop Navbar
        if (navbar) {
            if (scrollY > 0) {
                navbar.classList.add('bg-black');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('bg-black');
                navbar.classList.add('bg-transparent');
            }
        }

        // Mobile Navbar
        if (mobileNavbar) {
            if (scrollY > 0) {
                mobileNavbar.classList.add('bg-black');
                mobileNavbar.classList.remove('bg-transparent');
            } else {
                mobileNavbar.classList.remove('bg-black');
                mobileNavbar.classList.add('bg-transparent');
            }
        }
    }

    // Listen to Lenis scroll events
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        handleNavbarScroll();
    });

    // Also listen to window scroll as fallback
    window.addEventListener('scroll', handleNavbarScroll);

    // Initial check on page load
    handleNavbarScroll();

    // CTA buttons: scroll to section on click (Explore Projects → Flagship, Enquire Now → Contact form)
    document.querySelectorAll('[data-scroll-to]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-scroll-to');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                e.preventDefault();
                lenis.scrollTo(targetSection, {
                    offset: -80,
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    immediate: false,
                });
            }
        });
    });

    // Mobile Menu Toggle
    let isMenuOpen = false;

    // Set initial state for mobile menu on page load
    if (mobileMenu) {
        mobileMenu.style.display = 'none';
        gsap.set(mobileMenu, { y: '-100%' });
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;

            if (isMenuOpen) {
                // Open menu - animate from top to bottom
                mobileMenu.style.display = 'block';
                gsap.to(mobileMenu, {
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });

                // Toggle icons
                if (menuIcon) menuIcon.classList.add('hidden');
                if (closeIcon) closeIcon.classList.remove('hidden');

                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            } else {
                // Close menu - animate from bottom to top
                gsap.to(mobileMenu, {
                    y: '-100%',
                    duration: 0.6,
                    ease: 'power3.in',
                    onComplete: () => {
                        mobileMenu.style.display = 'none';
                    }
                });

                // Toggle icons
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');

                // Restore body scroll
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu and smooth scroll when clicking on a link
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a[href^="#"]');
    if (mobileMenuLinks) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const targetId = href === '#' ? null : href.slice(1);
                const targetSection = targetId ? document.getElementById(targetId) : null;

                if (targetSection) {
                    lenis.scrollTo(targetSection, {
                        offset: -80,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        immediate: false,
                    });
                }

                if (isMenuOpen) {
                    isMenuOpen = false;
                    gsap.to(mobileMenu, {
                        y: '-100%',
                        duration: 0.6,
                        ease: 'power3.in',
                        onComplete: () => {
                            mobileMenu.style.display = 'none';
                        }
                    });

                    if (menuIcon) menuIcon.classList.remove('hidden');
                    if (closeIcon) closeIcon.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Banner Slider Functionality
    const bannerSliderWrapper = document.querySelector('.banner-slider-wrapper');
    const paginationDots = document.querySelectorAll('.banner-pagination-dot');
    let currentSlide = 0;
    const totalSlides = 3;
    let autoSlideInterval;

    if (bannerSliderWrapper && paginationDots.length > 0) {
        // Set initial position
        gsap.set(bannerSliderWrapper, { x: 0 });

        // Function to update pagination dots
        function updatePaginationDots(activeIndex) {
            paginationDots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.remove('bg-[#BFBFBF]');
                    dot.classList.add('bg-white');
                } else {
                    dot.classList.remove('bg-white');
                    dot.classList.add('bg-[#BFBFBF]');
                }
            });
        }

        // Function to go to specific slide
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            const translateX = -(slideIndex * (100 / totalSlides));

            gsap.to(bannerSliderWrapper, {
                x: `${translateX}%`,
                duration: 0.8,
                ease: 'power2.inOut'
            });

            updatePaginationDots(currentSlide);
        }

        // Function to go to next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }

        // Auto-slide every 5 seconds
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        }

        // Stop auto-slide (useful when user interacts)
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }

        // Make pagination dots clickable
        paginationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(index);
                startAutoSlide(); // Restart auto-slide after manual interaction
            });
        });

        // Initialize pagination
        updatePaginationDots(0);

        // Start auto-slide
        startAutoSlide();

        // Pause auto-slide on hover (optional enhancement)
        const sliderContainer = document.querySelector('.banner-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
    }
});


const img1 = document.getElementById('1');
const absDiv1 =  document.getElementById('absDiv1');
const img2 = document.getElementById('2');
const absDiv2 = document.getElementById('absDiv2');
const img3 = document.getElementById('3');
const absDiv3 = document.getElementById('absDiv3');
const img4 = document.getElementById('4');
const absDiv4 = document.getElementById('absDiv4');
let activeImg = img1;
let imgIdArray = [img1, img2, img3, img4];
let absDivArray = [absDiv1, absDiv2, absDiv3, absDiv4];

// Initialize: on desktop (sm+) first card visible, rest hidden; on mobile all visible via CSS
function initLeadershipCards() {
    const isMobile = window.innerWidth < 640;
    if (isMobile) return; // on mobile, CSS shows all details
    absDivArray.forEach((div) => {
        if (div) gsap.set(div, { opacity: 0 });
    });
    if (absDiv1) {
        absDiv1.classList.remove('hidden');
        absDiv1.classList.add('absolute');
        gsap.set(absDiv1, { opacity: 1 });
    }
}
initLeadershipCards();
window.addEventListener('resize', initLeadershipCards);

function handleImageClick(imageId) {
    if (window.innerWidth < 640) return; // on mobile, no click-to-expand
    activeImg = imageId;
    imgIdArray.forEach((img, idx) => {
        if (img == activeImg) {
            // Remove collapsed width classes (responsive) - keep w-full, only remove responsive overrides
            img.classList.remove('sm:w-[120px]', 'md:w-[135px]', 'lg:w-[145px]', 'w-[145px]');
            // Add expanded width classes (responsive)
            img.classList.add('sm:w-[250px]', 'md:w-[300px]', 'lg:w-[355px]');
            setTimeout(() => {
                const currentDiv = absDivArray[idx];
                if (currentDiv) {
                    currentDiv.classList.remove('hidden');
                    currentDiv.classList.add('absolute');
                    // Fade in animation
                    gsap.to(currentDiv, {
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            }, 1000);
        } else {
            // Remove expanded width classes (responsive) - keep w-full, only remove responsive overrides
            img.classList.remove('sm:w-[250px]', 'md:w-[300px]', 'lg:w-[355px]', 'w-[355px]');
            // Add collapsed width classes (responsive)
            img.classList.add('sm:w-[120px]', 'md:w-[135px]', 'lg:w-[145px]');
            const currentDiv = absDivArray[idx];
            if (currentDiv) {
                // Fade out animation
                gsap.to(currentDiv, {
                    opacity: 0,
                    duration: 0,
                    ease: 'power2.in',
                    onComplete: () => {
                        currentDiv.classList.add('hidden');
                        currentDiv.classList.remove('absolute');
                    }
                });
            }
        }
    })

}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-nav');
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            lenis.scrollTo(targetSection, {
                offset: -100,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                immediate: false, 
            });
        }
    });
});