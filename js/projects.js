/* =====================================================
   Bhaskar Bhardwaj — Projects Page
   Cursor, Lenis, GSAP reveals, mobile menu, magnetic
   buttons, desktop hover-reveal bento grid + infinite
   scroll, and the mobile swipe slider (no text on image)
   ===================================================== */

(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);
    lucide.createIcons();

    /* ============ PROJECT DATA ============ */
    // Real projects, in the exact sequence requested: the 5 homepage
    // projects first, then the additional project-page-only entries.
    // "category" drives the filter chips: 'Real Estate' | 'E-commerce' | 'Marketing'
    // Recommended image export: PNG, same crop for every project (top of the
    // site, hero + nav visible). Uniform aspect ratio = clean grid, no glitches.
    const PROJECTS = [
        { name: 'Noorvyaa', category: 'E-commerce', tag: 'Jewellery Brand', note: 'Shopify storefront for a jewellery brand, from catalog to checkout.', stack: ['Shopify', 'E-commerce'], url: 'https://noorvyaa.com/', img: 'images/project-noorvyaa.png' },
        { name: 'True Marketing Talk', category: 'Marketing', tag: 'Digital Marketing Agency', note: 'Marketing agency website built and optimized on WordPress.', stack: ['WordPress', 'Marketing'], url: 'https://truemarketingtalk.com/', img: 'images/project-truemarketing.png' },
        { name: 'Chahana Jewel Co.', category: 'E-commerce', tag: 'Jewellery Brand', note: 'Shopify e-commerce build for a jewellery brand.', stack: ['Shopify', 'E-commerce'], url: 'https://chahanajewelco.com/', img: 'images/project-chahana.png' },
        { name: 'Edot Solutions', category: 'Marketing', tag: 'Real Estate Digital Marketing', note: 'Corporate website for a real estate digital marketing company.', stack: ['WordPress', 'Marketing'], url: 'https://edotsolutions.in/home/', img: 'images/project-edot.png' },
        { name: 'AJTB Bengal', category: 'Real Estate', tag: 'Real Estate Project', note: 'Real estate project website built on WordPress.', stack: ['WordPress', 'Real Estate'], url: 'https://ajtbengal.com/', img: 'images/project-ajtbengal.png' },

        { name: 'Somani Realtors', category: 'Real Estate', tag: 'Real Estate Company', note: 'Corporate real estate company website.', stack: ['WordPress', 'Real Estate'], url: 'https://somanirealtors.com/', img: 'images/project-somani.png' },
        { name: 'Innara Vista', category: 'Real Estate', tag: 'Real Estate Landing Page', note: 'High-conversion landing page for a real estate project.', stack: ['WordPress', 'Real Estate'], url: 'https://dazzlerealty.in/innara-vista/', img: 'images/project-innara.png' },
        { name: 'Dazzle Realty', category: 'Real Estate', tag: 'Real Estate Commercial Site', note: 'Commercial website for a real estate firm.', stack: ['WordPress', 'Real Estate'], url: 'https://dazzlerealty.in/', img: 'images/project-dazzle.png' },
        { name: 'Suryadoy Realty', category: 'Real Estate', tag: 'Real Estate Firm', note: 'Website for a real estate firm.', stack: ['WordPress', 'Real Estate'], url: 'https://suryadoyrealty.com/index.php', img: 'images/project-suryadoreality.png' },
        { name: 'Shristi Complex Maheshtala', category: 'Real Estate', tag: 'Real Estate Landing Page', note: 'Landing page for a real estate complex.', stack: ['WordPress', 'Real Estate'], url: 'https://shristicomplexmaheshtala.in/home/', img: 'images/project-shristi.png' },
        { name: 'Manor Garden', category: 'Real Estate', tag: 'Real Estate Landing Page', note: 'Landing page for a real estate project.', stack: ['WordPress', 'Real Estate'], url: 'https://manorrealty.in/manorgarden/', img: 'images/project-manor.png' },
        { name: 'Somani Realtors — Dubai', category: 'Real Estate', tag: 'Real Estate Landing Page', note: 'Dubai-market landing page for Somani Realtors.', stack: ['WordPress', 'Real Estate'], url: 'https://somanirealtors.com/city/dubai', img: 'images/project-somani-dubai-landingpage.png' }

        // Add more projects here by copying an object above.
    ];

    const BATCH_SIZE = 6;
    let activeList = PROJECTS.slice();
    let loadedCount = 0;
    let isLoadingBatch = false;
    let mobileSwiper = null;

    /* ============ LENIS SMOOTH SCROLL ============ */
    const lenis = new Lenis({
        duration: 0.7,
        easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - t * 0.2),
        smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const target = a.getAttribute('href');
            if (target && target.length > 1 && document.querySelector(target)) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: 0 });
            }
        });
    });
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) backToTop.addEventListener('click', () => lenis.scrollTo(0));

    /* ============ SCROLL-AWARE NAVIGATION ============ */
    ScrollTrigger.create({
        trigger: document.body, start: 'top -40', end: 99999,
        toggleClass: { targets: '#main-nav', className: 'nav-scrolled' }
    });

    /* ============ CUSTOM CURSOR ============ */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorCircle = document.getElementById('cursor-circle');
    let mouseX = -100, mouseY = -100, circleX = -100, circleY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });
    function animateCursor() {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        const size = cursorCircle.classList.contains('cursor-hover') ? 32 : 20;
        cursorCircle.style.transform = `translate(${circleX - size}px, ${circleY - size}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    function bindCursorHoverTargets() {
        document.querySelectorAll('a, button, .bento-card').forEach((el) => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = 'true';
            el.addEventListener('mouseenter', () => cursorCircle.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorCircle.classList.remove('cursor-hover'));
        });
    }

    /* ============ MAGNETIC BUTTONS ============ */
    function bindMagneticButtons() {
        document.querySelectorAll('.magnetic-btn').forEach((btn) => {
            if (btn.dataset.magneticBound) return;
            btn.dataset.magneticBound = 'true';
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    /* ============ MOBILE HAMBURGER MENU ============ */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBackdrop = document.getElementById('mobile-menu-backdrop');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');
    const menuFooterEl = document.querySelector('.mobile-menu-footer');
    let menuOpen = false, menuAnimating = false;

    gsap.set(menuLinks, { y: 24, opacity: 0 });
    gsap.set(menuFooterEl, { opacity: 0 });

    function openMobileMenu() {
        if (menuOpen || menuAnimating || !menuToggle) return;
        menuAnimating = true; menuOpen = true;
        menuToggle.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.remove('pointer-events-none');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        gsap.timeline({ onComplete: () => { menuAnimating = false; } })
            .to(menuBackdrop, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
            .to(menuLinks, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, 0.15)
            .to(menuFooterEl, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.4);
    }
    function closeMobileMenu() {
        if (!menuOpen || menuAnimating || !menuToggle) return;
        menuAnimating = true; menuOpen = false;
        menuToggle.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        gsap.timeline({
            onComplete: () => {
                mobileMenu.classList.add('pointer-events-none');
                mobileMenu.setAttribute('aria-hidden', 'true');
                menuAnimating = false;
            }
        })
            .to(menuFooterEl, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
            .to(menuLinks, { y: 24, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.in' }, 0)
            .to(menuBackdrop, { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, 0.08);
    }
    if (menuToggle) {
        menuToggle.addEventListener('click', () => { menuOpen ? closeMobileMenu() : openMobileMenu(); });
        menuLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMobileMenu(); });
    }

    /* ============ SCROLLTRIGGER REVEALS ============ */
    function bindReveals() {
        document.querySelectorAll('.reveal-group').forEach((group) => {
            const els = group.querySelectorAll('.reveal-el');
            if (!els.length || group.dataset.revealBound) return;
            group.dataset.revealBound = 'true';
            gsap.from(els, {
                y: 30, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: group, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });
    }

    /* ============ DESKTOP: HOVER-REVEAL BENTO CARD ============ */
    function buildDesktopCard(p) {
        const stackHtml = p.stack.map((s) => `<span class="bento-card__pill">${s}</span>`).join('');
        return (
            `<a href="${p.url}" target="_blank" rel="noopener" class="bento-card" data-category="${p.category}">` +
                `<img src="${p.img}" alt="${p.name} website screenshot" loading="lazy">` +
                `<div class="bento-card__overlay"></div>` +
                `<div class="bento-card__content">` +
                    `<span class="bento-card__tag">${p.tag}</span>` +
                    `<h3 class="bento-card__title">${p.name}</h3>` +
                    `<p class="bento-card__note">${p.note}</p>` +
                    `<div class="bento-card__stack">${stackHtml}</div>` +
                    `<span class="bento-card__link">Visit Site <i data-lucide="arrow-up-right" class="w-3 h-3"></i></span>` +
                `</div>` +
            `</a>`
        );
    }

    const bentoContainer = document.getElementById('projects-bento');
    const sentinel = document.getElementById('load-more-sentinel');
    let observer = null;

    function resetDesktopGrid() {
        if (!bentoContainer) return;
        bentoContainer.innerHTML = '';
        loadedCount = 0;
        isLoadingBatch = false;
        loadNextBatch();
    }

    function loadNextBatch() {
        if (!bentoContainer || isLoadingBatch) return;
        if (loadedCount >= activeList.length) {
            if (sentinel) sentinel.style.display = 'none';
            return;
        }
        isLoadingBatch = true;
        const nextItems = activeList.slice(loadedCount, loadedCount + BATCH_SIZE);
        const frag = document.createElement('div');
        frag.innerHTML = nextItems.map(buildDesktopCard).join('');
        const newCards = Array.from(frag.children);
        newCards.forEach((card) => bentoContainer.appendChild(card));
        loadedCount += nextItems.length;

        lucide.createIcons();
        bindCursorHoverTargets();
        bindMagneticButtons();

        gsap.fromTo(newCards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' });

        if (sentinel) sentinel.style.display = loadedCount >= activeList.length ? 'none' : 'flex';
        isLoadingBatch = false;
    }

    function setupInfiniteScroll() {
        if (!sentinel) return;
        if (observer) observer.disconnect();
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isLoadingBatch && loadedCount < activeList.length) {
                    setTimeout(loadNextBatch, 350);
                }
            });
        }, { rootMargin: '200px' });
        observer.observe(sentinel);
    }

    /* ============ MOBILE: SWIPE SLIDER (no text) ============ */
    function buildMobileSlide(p) {
        return (
            `<div class="swiper-slide mobile-project-slide" data-category="${p.category}">` +
                `<a href="${p.url}" target="_blank" rel="noopener" class="mobile-project-card">` +
                    `<img src="${p.img}" alt="${p.name} website screenshot" loading="lazy">` +
                    `<span class="mobile-project-badge"><i data-lucide="arrow-up-right" class="w-4 h-4"></i></span>` +
                `</a>` +
            `</div>`
        );
    }

    function rebuildMobileSlider() {
        const wrapper = document.getElementById('mobileProjectsWrapper');
        if (!wrapper) return;
        wrapper.innerHTML = activeList.map(buildMobileSlide).join('');
        lucide.createIcons();

        if (mobileSwiper) { mobileSwiper.destroy(true, true); mobileSwiper = null; }
        mobileSwiper = new Swiper('.mobile-projects-swiper', {
            slidesPerView: 'auto',
            centeredSlides: false,
            spaceBetween: 16,
            grabCursor: true,
            pagination: { el: '.mobile-projects-pagination', clickable: true }
        });
    }

    /* ============ FILTERS ============ */
    function bindFilters() {
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                chips.forEach((c) => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                const filter = chip.getAttribute('data-filter');
                activeList = filter === 'all' ? PROJECTS.slice() : PROJECTS.filter((p) => p.category === filter);
                resetDesktopGrid();
                setupInfiniteScroll();
                rebuildMobileSlider();
            });
        });
    }

    /* ============ INIT ============ */
    resetDesktopGrid();
    setupInfiniteScroll();
    rebuildMobileSlider();
    bindFilters();
    bindCursorHoverTargets();
    bindMagneticButtons();
    bindReveals();

    window.addEventListener('resize', () => { if (mobileSwiper) mobileSwiper.update(); });

    gsap.from('body', { opacity: 0, duration: 0.5, ease: 'power1.out' });

})();