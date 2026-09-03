/* =====================================================
   Bhaskar Bhardwaj — Projects Page
   Cursor, Lenis, GSAP reveals, mobile menu, magnetic
   buttons, and the Bento grid render + filter logic
   ===================================================== */

(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);
    lucide.createIcons();

    /* ============ PROJECT DATA ============ */
    // Real projects only. To add a new one, copy an object below and
    // change the values. "size" controls the Bento tile: 'feature' for
    // a wider highlighted tile, 'standard' for a regular tile.
    // Recommended image export: 1200x900px (4:3 ratio) JPG, ~150-250KB.
    const PROJECTS = [
        {
            name: 'Edot Solutions',
            category: 'WordPress',
            tag: 'Business Website',
            note: 'Corporate business website built on WordPress with custom theming.',
            stack: ['WordPress', 'PHP', 'Custom Theme'],
            url: 'https://edotsolutions.in/home/',
            img: 'images/project-edotsolutions.jpg',
            size: 'feature'
        },
        {
            name: 'True Marketing Talk',
            category: 'WordPress',
            tag: 'Marketing Website',
            note: 'Marketing-focused website built and optimized on WordPress.',
            stack: ['WordPress', 'SEO', 'Performance'],
            url: 'https://truemarketingtalk.com/',
            img: 'images/project-truemarketingtalk.jpg',
            size: 'standard'
        },
        {
            name: 'Chahana Jewel Co.',
            category: 'Shopify',
            tag: 'Jewellery E-commerce',
            note: 'Shopify storefront built for a jewellery brand, from catalog to checkout.',
            stack: ['Shopify', 'Liquid', 'E-commerce'],
            url: 'https://chahanajewelco.com/',
            img: 'images/project-chahanajewelco.jpg',
            size: 'standard'
        },
        {
            name: 'Noorvyaa',
            category: 'Shopify',
            tag: 'Jewellery E-commerce',
            note: 'Shopify e-commerce build with a custom storefront experience.',
            stack: ['Shopify', 'Liquid', 'E-commerce'],
            url: 'https://noorvyaa.com/',
            img: 'images/project-noorvyaa.jpg',
            size: 'standard'
        }

        // Add more projects here by copying an object above.
    ];

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
        trigger: document.body,
        start: 'top -40',
        end: 99999,
        toggleClass: { targets: '#main-nav', className: 'nav-scrolled' }
    });

    /* ============ CUSTOM CURSOR ============ */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorCircle = document.getElementById('cursor-circle');
    let mouseX = -100, mouseY = -100;
    let circleX = -100, circleY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
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
    let menuOpen = false;
    let menuAnimating = false;

    gsap.set(menuLinks, { y: 24, opacity: 0 });
    gsap.set(menuFooterEl, { opacity: 0 });

    function openMobileMenu() {
        if (menuOpen || menuAnimating || !menuToggle) return;
        menuAnimating = true;
        menuOpen = true;
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
        menuAnimating = true;
        menuOpen = false;
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

    /* ============ SCROLLTRIGGER SECTION REVEALS ============ */
    function bindReveals() {
        document.querySelectorAll('.reveal-group').forEach((group) => {
            const els = group.querySelectorAll('.reveal-el');
            if (!els.length || group.dataset.revealBound) return;
            group.dataset.revealBound = 'true';
            gsap.from(els, {
                y: 30,
                opacity: 0,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: group, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });
    }

    /* ============ BENTO GRID: RENDER ============ */
    const bentoContainer = document.getElementById('projects-bento');

    function buildCard(p) {
        const isFeature = p.size === 'feature';
        const stackHtml = p.stack.map((s) => `<span class="bento-card__pill">${s}</span>`).join('');
        return (
            `<a href="${p.url}" target="_blank" rel="noopener" class="bento-card${isFeature ? ' is-feature' : ''}" data-category="${p.category}">` +
                `<div class="bento-card__image">` +
                    `<img src="${p.img}" alt="${p.name} website screenshot" loading="lazy">` +
                    `<div class="bento-card__overlay"></div>` +
                `</div>` +
                `<div class="bento-card__content">` +
                    `<span class="bento-card__tag">${p.tag}</span>` +
                    `<h3 class="bento-card__title">${p.name}</h3>` +
                    `<p class="bento-card__note">${p.note}</p>` +
                    `<div class="bento-card__stack">${stackHtml}</div>` +
                    `<span class="bento-card__link">Visit Site <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i></span>` +
                `</div>` +
            `</a>`
        );
    }

    function renderBento() {
        if (!bentoContainer) return;
        bentoContainer.innerHTML = PROJECTS.map(buildCard).join('');
        lucide.createIcons();
        bindCursorHoverTargets();
        bindMagneticButtons();
        bindReveals();
    }

    /* ============ BENTO GRID: FILTER ============ */
    function bindFilters() {
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                chips.forEach((c) => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                const filter = chip.getAttribute('data-filter');
                const cards = document.querySelectorAll('.bento-card');

                cards.forEach((card) => {
                    const matches = filter === 'all' || card.getAttribute('data-category') === filter;
                    if (matches) {
                        card.classList.remove('is-hidden');
                        gsap.fromTo(card, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
                    } else {
                        gsap.to(card, {
                            opacity: 0, y: 12, duration: 0.25, ease: 'power2.in',
                            onComplete: () => card.classList.add('is-hidden')
                        });
                    }
                });
            });
        });
    }

    /* ============ INIT ============ */
    renderBento();
    bindFilters();
    bindCursorHoverTargets();
    bindMagneticButtons();
    bindReveals();

    gsap.from('body', { opacity: 0, duration: 0.5, ease: 'power1.out' });

})();