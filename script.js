document.addEventListener('DOMContentLoaded', function() {

    // ── Mobile Menu Toggle ──
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
        });
        
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navList.contains(event.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
            }
        });
        
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
            });
        });
    }
    
    // ── Copyright Year ──
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ── Header Scroll Effect ──
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ── Scroll Reveal (Intersection Observer) ──
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function(el) {
            el.classList.add('revealed');
        });
    }

    // ── Animated Number Counters ──
    const counterElements = document.querySelectorAll('[data-counter]');
    if (counterElements.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(function(el) {
            counterObserver.observe(el);
        });
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ── Back to Top Button ──
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── In-page Section Navigation (profile + portfolio) ──
    const sectionNavLinks = document.querySelectorAll('.profile-section-link, .portfolio-nav-link');
    if (sectionNavLinks.length > 0) {
        const sections = Array.from(sectionNavLinks).map(link => {
            const id = link.getAttribute('href').replace('#', '');
            return document.getElementById(id);
        });

        sectionNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').replace('#', '');
                const target = document.getElementById(targetId);
                if (target) {
                    const headerOffset = 110;
                    const rect = target.getBoundingClientRect();
                    const offsetTop = rect.top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });

        window.addEventListener('scroll', function() {
            let activeIndex = 0;
            sections.forEach((section, index) => {
                if (!section) return;
                const rect = section.getBoundingClientRect();
                if (rect.top <= 140 && rect.bottom > 140) {
                    activeIndex = index;
                }
            });

            sectionNavLinks.forEach((link, index) => {
                if (index === activeIndex) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }, { passive: true });
    }
    
    // ── Modern Interactive Slider for Course Module ──
    const sliderModern = document.querySelector('.slider-modern');
    if (sliderModern) {
        const slides = sliderModern.querySelectorAll('.slide-modern');
        const indicators = sliderModern.querySelectorAll('.indicator');
        const prevBtn = sliderModern.querySelector('.prev-btn');
        const nextBtn = sliderModern.querySelector('.next-btn');
        const prevBtnTop = sliderModern.querySelector('.prev-btn-top');
        const nextBtnTop = sliderModern.querySelector('.next-btn-top');
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoPlayInterval = null;

        function showSlide(index) {
            if (index < 0) {
                currentSlide = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }

            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === currentSlide) {
                    setTimeout(() => { slide.classList.add('active'); }, 50);
                }
            });

            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentSlide);
            });

            if (prevBtn) prevBtn.disabled = false;
            if (nextBtn) nextBtn.disabled = false;
            if (prevBtnTop) prevBtnTop.disabled = false;
            if (nextBtnTop) nextBtnTop.disabled = false;
        }

        function navigate(dir) {
            showSlide(currentSlide + dir);
            resetAutoPlay();
        }

        if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
        if (prevBtnTop) prevBtnTop.addEventListener('click', () => navigate(-1));
        if (nextBtnTop) nextBtnTop.addEventListener('click', () => navigate(1));

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                showSlide(index);
                resetAutoPlay();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (sliderModern.contains(document.activeElement) || 
                document.activeElement === document.body) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    navigate(-1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    navigate(1);
                }
            }
        });

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => navigate(1), 8000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        sliderModern.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        sliderModern.addEventListener('mouseleave', () => startAutoPlay());

        showSlide(0);
    }
});
