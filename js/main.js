/* =====================================================
   Bhaskar Bhardwaj — WordPress & Web Engineer
   Loader, Cursor, Canvas, Marquee, GSAP reveals,
   Lenis smooth scroll, AI Terminal, Magnetic buttons
   ===================================================== */

(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);
    lucide.createIcons();

    /* ============ LENIS SMOOTH SCROLL ============ */
    // duration 0.7, easing approximating cubic-bezier(0.25, 0.8, 0.25, 1)
    const lenis = new Lenis({
        duration: 0.7,
        easing: (t) => 1 - Math.pow(1 - t, 3) * (1 - t * 0.2), // smooth ease-out curve ~ cubic-bezier(0.25, 0.8, 0.25, 1)
        smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Anchor links via Lenis
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
    if (backToTop) {
        backToTop.addEventListener('click', () => lenis.scrollTo(0));
    }

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

    // Cursor switches dot <-> circle emphasis on interactive elements
    const hoverTargets = 'a, button, input, .project-card, .quick-prompt';
    document.querySelectorAll(hoverTargets).forEach((el) => {
        el.addEventListener('mouseenter', () => cursorCircle.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursorCircle.classList.remove('cursor-hover'));
    });

    /* ============ HERO SPLIT TEXT ============ */
    // Character-specific split: each char starts blur(12px), y:20, opacity:0
    document.querySelectorAll('[data-split]').forEach((line) => {
        const text = line.getAttribute('data-split');
        line.textContent = '';
        text.split('').forEach((ch) => {
            const span = document.createElement('span');
            span.className = 'hero-char';
            span.textContent = ch;
            line.appendChild(span);
        });
    });

    /* ============ HERO CANVAS PARTICLES ============ */
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let canvasW, canvasH;

    function resizeCanvas() {
        canvasW = canvas.width = canvas.offsetWidth;
        canvasH = canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function initParticles() {
        particles = [];
        const count = Math.min(90, Math.floor((canvasW * canvasH) / 18000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvasW,
                y: Math.random() * canvasH,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5
            });
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function drawParticles() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvasW) p.vx *= -1;
            if (p.y < 0 || p.y > canvasH) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(17, 17, 17, 0.25)';
            ctx.fill();

            // connecting lines
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(17, 17, 17, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    /* ============ SECTION 1: LOADER ============ */
    const loaderState = { value: 0 };
    const loaderText = document.getElementById('loader-text');
    const loaderBar = document.getElementById('loader-bar');

    const loaderTl = gsap.timeline({
        onComplete: () => {
            document.getElementById('loader').style.pointerEvents = 'none';
        }
    });

    loaderTl
        .to(loaderState, {
            value: 100,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate: () => {
                const v = Math.round(loaderState.value);
                loaderText.textContent = v + '%';
                loaderBar.style.width = v + '%';
            }
        })
        .to('#loader', {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
            delay: 0.2
        })
        // Hero char reveal triggers AFTER the loader timeline completes
        .to('.hero-char', {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power3.out'
        }, '-=0.3')
        .to('#hero-badge', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5')
        .to('#hero-sub', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .to('#hero-sub2', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .to('#hero-cta', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');

    /* ============ SCROLLTRIGGER SECTION REVEALS ============ */
    // y: 30, opacity: 0, stagger 0.05
    document.querySelectorAll('.reveal-group').forEach((group) => {
        const els = group.querySelectorAll('.reveal-el');
        if (!els.length) return;
        gsap.from(els, {
            y: 30,
            opacity: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

        /* ============ MAGNETIC BUTTONS ============ */
    // Move element 20% toward cursor
    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
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

    /* ============ MOBILE HAMBURGER MENU ============ */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBackdrop = document.getElementById('mobile-menu-backdrop');
    const menuPanel = document.getElementById('mobile-menu-panel');
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
        menuToggle.addEventListener('click', () => {
            menuOpen ? closeMobileMenu() : openMobileMenu();
        });
        menuLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOpen) closeMobileMenu();
        });
    }

    /* ============ SECTION 5: AI TERMINAL ============ */
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');

    // Real project data — used only by the `projects` command.
    // Keep in sync with the Selected Work section; do not invent entries.
        const PROJECTS = [
        { name: 'True Marketing Talk', url: 'https://truemarketingtalk.com/', note: 'Marketing website — WordPress', img: 'images/project-truemarketingtalk.jpg' },
        { name: 'Edot Solutions', url: 'https://edotsolutions.in/home/', note: 'Business website — WordPress', img: 'images/project-edotsolutions.jpg' },
        { name: 'Chahana Jewel Co.', url: 'https://chahanajewelco.com/', note: 'Jewellery e-commerce — Shopify', img: 'images/project-chahanajewelco.jpg' },
        { name: 'Noorvyaa', url: 'https://noorvyaa.com/', note: 'Jewellery e-commerce — Shopify', img: 'images/project-noorvyaa.jpg' }
    ];

    /* ============ SECTION 4: PROJECTS COVERFLOW SLIDER ============ */
    function buildProjectSlides() {
        var wrapper = document.getElementById('projectSwiperWrapper');
        if (!wrapper) return;

        var slidesHtml = PROJECTS.map(function (p, i) {
            var num = String(i + 1).padStart(2, '0');
            return (
                '<a href="' + p.url + '" target="_blank" rel="noopener" class="swiper-slide project-slide">' +
                    '<div class="project-slide__image">' +
                        '<img src="' + p.img + '" alt="' + p.name + ' website" loading="lazy">' +
                        '<div class="project-slide__overlay"></div>' +
                    '</div>' +
                    '<div class="project-slide__content">' +
                        '<span class="project-slide__num">' + num + '</span>' +
                        '<h3 class="project-slide__title">' + p.name + '</h3>' +
                        '<p class="project-slide__note">' + p.note + '</p>' +
                        '<span class="project-slide__link">Visit Site <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i></span>' +
                    '</div>' +
                '</a>'
            );
        }).join('');

        // Repeat 3x — real duplicated DOM slides, not Swiper's own loop-clone
        // mechanism. With only 4 real projects and slidesPerView:3, Swiper's
        // loop needs roughly 2x slidesPerView real slides to work reliably;
        // tripling guarantees that on every breakpoint.
        wrapper.innerHTML = slidesHtml + slidesHtml + slidesHtml;
    }

        function initProjectSwiper() {
        var el = document.getElementById('projectSwiper');
        if (!el || el.swiper) return;

        buildProjectSlides();
        lucide.createIcons();

        new Swiper(el, {
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            loopAdditionalSlides: PROJECTS.length,
            speed: 600,
            watchSlidesProgress: true,
            grabCursor: true,
            spaceBetween: 14,
            breakpoints: {
                640:  { spaceBetween: 20 },
                1024: { spaceBetween: 24 }
            },
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            navigation: {
                nextEl: '.project-next',
                prevEl: '.project-prev'
            },
            keyboard: { enabled: true, onlyInViewport: true },
            a11y: { enabled: true },
            on: {
                progress: function () {
                    var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        var slideEl = swiper.slides[i];
                        var p = slideEl.progress;

                        var absP = Math.min(Math.abs(p), 3);
                        var scale = 1.12 - absP * 0.26;
                        var rotateY = p * -16;
                        var translateX = p * -6;
                        var opacity = 1 - absP * 0.32;
                        var z = 100 - Math.round(absP * 10);

                        slideEl.style.transform =
                            'translateX(' + translateX + 'px) rotateY(' + rotateY + 'deg) scale(' + Math.max(scale, 0.55) + ')';
                        slideEl.style.opacity = Math.max(opacity, 0.35);
                        slideEl.style.zIndex = z;
                    }
                },
                setTransition: function (swiper, duration) {
                    for (var i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].style.transitionDuration = duration + 'ms';
                    }
                }
            }
        });
    }

    initProjectSwiper();

    const COMMAND_LIST = ['help', 'skills', 'experience', 'projects', 'contact', 'about', 'clear'];

    const RESPONSES = {
        skills: 'WordPress, PHP, JavaScript, WooCommerce, Shopify, REST APIs, HTML, CSS, Git, performance optimization, Core Web Vitals, technical SEO, custom themes, custom plugins and API integrations.',
        experience: '4+ years of experience in web development, with a strong focus on WordPress, WooCommerce, Shopify, PHP, JavaScript, responsive development, integrations, performance optimization and troubleshooting.',
        contact: 'LinkedIn: https://www.linkedin.com/in/bhaskar-bhardwaj-/',
        about: "Bhaskar Bhardwaj — WordPress & Web Engineer. Web Developer with 4+ years of experience building, customizing and maintaining WordPress, WooCommerce, Shopify and business websites, with experience in PHP, JavaScript, HTML, CSS, API integrations, website performance, Core Web Vitals, technical SEO, responsive development, troubleshooting and website maintenance.",
        help: 'Available commands: help, skills, experience, projects, contact, about, clear.',
        projects: PROJECTS.map((p, i) => `${i + 1}. ${p.name} — ${p.note} — ${p.url}`).join('\n')
    };

    function appendLine(html, className) {
        const div = document.createElement('div');
        div.className = className || '';
        div.innerHTML = html;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        return div;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function linkify(str) {
        return str.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" class="text-accent underline hover:opacity-70">$1</a>');
    }

    // Preserve newlines (used by the `projects` response) as <br> after escaping/linkifying.
    function formatForDisplay(str) {
        return linkify(escapeHtml(str)).replace(/\n/g, '<br>');
    }

    function typeResponse(text, el) {
        el.innerHTML = '';
        let i = 0;
        const interval = setInterval(() => {
            i += 2;
            el.innerHTML = formatForDisplay(text.slice(0, i));
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            if (i >= text.length) {
                clearInterval(interval);
                el.innerHTML = formatForDisplay(text);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }, 15);
    }

    function handleCommand(cmd) {
        const clean = cmd.trim().toLowerCase();
        if (!clean) return;

        // echo the command with the terminal prompt — this line also
        // stays in terminalOutput after the fact, which is what gives the
        // session its command history (nothing is ever cleared except by
        // the explicit `clear` command below).
        appendLine('<span class="text-accent">bhaskar@portfolio:~$</span> ' + escapeHtml(cmd), 'text-white');

        // simulated delay + "Processing..." state
        const processing = appendLine('Processing<span class="processing-dots">...</span>', 'text-white/40 italic');

        setTimeout(() => {
            processing.remove();
            const responseEl = appendLine('', 'text-white/80');

            let response;
            if (clean === 'help' || clean === '?') {
                response = RESPONSES.help;
            } else if (clean.includes('project')) {
                response = RESPONSES.projects;
            } else if (clean.includes('skill')) {
                response = RESPONSES.skills;
            } else if (clean.includes('experience') || clean.includes('work')) {
                response = RESPONSES.experience;
            } else if (clean.includes('contact') || clean.includes('email') || clean.includes('linkedin')) {
                response = RESPONSES.contact;
            } else if (clean.includes('about') || clean.includes('who')) {
                response = RESPONSES.about;
            } else if (clean.includes('hello') || clean.includes('hi')) {
                response = "Hello! I'm Bhaskar's terminal. Try: help, skills, experience, projects, contact or about.";
            } else if (clean.includes('clear')) {
                terminalOutput.innerHTML = '';
                responseEl.remove();
                return;
            } else {
                response = `Command not recognized: "${cmd}". Type help to see available commands.`;
            }

            typeResponse(response, responseEl);
        }, 800 + Math.random() * 600);
    }

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleCommand(terminalInput.value);
            terminalInput.value = '';
        }
    });

    document.querySelectorAll('.quick-prompt').forEach((btn) => {
        btn.addEventListener('click', () => {
            handleCommand(btn.getAttribute('data-prompt'));
        });
    });

})();