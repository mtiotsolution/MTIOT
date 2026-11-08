// MTIOT Interactive Script - Background Animation & Theme Control
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DYNAMIC MOVING BACKGROUND ANIMATION (CANVAS)
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    let ctx = null;
    let particles = [];
    let animationFrameId = null;
    let mouse = { x: null, y: null, radius: 140 };

    if (canvas) {
        ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Gentle mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }
            }

            draw(isDark) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.45)' : 'rgba(2, 132, 199, 0.35)';
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            // Scale particle count to screen size (min 35, max 75)
            const count = Math.min(75, Math.max(35, Math.floor(canvas.width / 26)));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animateBackground = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.documentElement.classList.contains('dark');
            const maxDistance = 135;

            // Update & Draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(isDark);

                // Connect nearby nodes
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.12);
                        ctx.beginPath();
                        ctx.strokeStyle = isDark
                            ? `rgba(6, 182, 212, ${alpha})`
                            : `rgba(2, 132, 199, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animateBackground);
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        animateBackground();
    }

    // ==========================================
    // 2. THEME CONTROLLER (Light & Dark Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle-btn');
    const htmlElement = document.documentElement;

    const getSavedTheme = () => {
        const saved = localStorage.getItem('mtiot-theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            updateThemeIcons(true);
        } else {
            htmlElement.classList.remove('dark');
            updateThemeIcons(false);
        }
        localStorage.setItem('mtiot-theme', theme);
    };

    const updateThemeIcons = (isDark) => {
        const desktopIcon = document.getElementById('theme-toggle-icon');
        const mobileIcon = document.getElementById('mobile-theme-toggle-icon');
        const textSpan = document.getElementById('theme-toggle-text');

        const iconName = isDark ? 'sun' : 'moon';
        if (desktopIcon) desktopIcon.setAttribute('data-lucide', iconName);
        if (mobileIcon) mobileIcon.setAttribute('data-lucide', iconName);
        if (textSpan) textSpan.textContent = isDark ? 'Light Mode' : 'Dark Mode';

        if (window.lucide) {
            lucide.createIcons();
        }
    };

    // Initialize Theme
    const currentTheme = getSavedTheme();
    applyTheme(currentTheme);

    const toggleTheme = () => {
        const isCurrentlyDark = htmlElement.classList.contains('dark');
        const newTheme = isCurrentlyDark ? 'light' : 'dark';
        applyTheme(newTheme);
        showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    // ==========================================
    // 3. MOBILE DRAWER NAVIGATION
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.remove('opacity-0');
            }, 10);
        });

        const closeMobileMenu = () => {
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        };

        if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
    }

    // ==========================================
    // 4. NAVBAR GLASS SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('main-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('shadow-md', 'backdrop-blur-xl');
        } else {
            navbar.classList.remove('shadow-md', 'backdrop-blur-xl');
        }
    });

    // ==========================================
    // 5. LIVE TELEMETRY SIMULATOR WIDGET
    // ==========================================
    const telemetryTemp = document.getElementById('telemetry-temp');
    const telemetryPackets = document.getElementById('telemetry-packets');
    const telemetryPing = document.getElementById('telemetry-ping');

    if (telemetryTemp && telemetryPackets && telemetryPing) {
        let baseTemp = 24.2;
        let basePackets = 1420;

        setInterval(() => {
            const tempDelta = (Math.random() * 0.4 - 0.2).toFixed(1);
            baseTemp = Math.max(22.0, Math.min(27.0, (parseFloat(baseTemp) + parseFloat(tempDelta)))).toFixed(1);
            telemetryTemp.textContent = `${baseTemp}°C`;

            basePackets += Math.floor(Math.random() * 15 - 5);
            telemetryPackets.textContent = `${basePackets.toLocaleString()}/s`;

            const ping = Math.floor(Math.random() * 8 + 14);
            telemetryPing.textContent = `${ping}ms`;
        }, 2200);
    }

    // ==========================================
    // 6. SERVICE FILTER TABS
    // ==========================================
    const filterBtns = document.querySelectorAll('.service-filter-btn');
    const serviceCards = document.querySelectorAll('.service-card-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-sky-600', 'text-white', 'dark:bg-cyan-500', 'dark:text-black', 'shadow-md');
                b.classList.add('bg-slate-200/80', 'dark:bg-slate-800/80', 'text-slate-700', 'dark:text-slate-300');
            });

            btn.classList.add('bg-sky-600', 'text-white', 'dark:bg-cyan-500', 'dark:text-black', 'shadow-md');
            btn.classList.remove('bg-slate-200/80', 'dark:bg-slate-800/80', 'text-slate-700', 'dark:text-slate-300');

            const filter = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // ==========================================
    // 7. FAQ ACCORDION
    // ==========================================
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('.faq-icon');
            const isOpen = content.classList.contains('open');

            document.querySelectorAll('.faq-content').forEach(c => c.classList.remove('open'));
            document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotated'));

            if (!isOpen) {
                content.classList.add('open');
                if (icon) icon.classList.add('rotated');
            }
        });
    });

    // ==========================================
    // 8. TOAST NOTIFICATION SYSTEM
    // ==========================================
    window.showToast = function(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        if (type === 'success') {
            toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-emerald-500/40 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white shadow-2xl backdrop-blur-md transition-all duration-300 translate-y-0 opacity-100';
            if (toastIcon) toastIcon.setAttribute('data-lucide', 'check-circle-2');
        } else {
            toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-sky-500/40 dark:border-cyan-500/40 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white shadow-2xl backdrop-blur-md transition-all duration-300 translate-y-0 opacity-100';
            if (toastIcon) toastIcon.setAttribute('data-lucide', 'info');
        }

        if (window.lucide) {
            lucide.createIcons();
        }

        setTimeout(() => {
            toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white shadow-2xl backdrop-blur-md transition-all duration-300 translate-y-12 opacity-0 pointer-events-none';
        }, 3500);
    };

    // ==========================================
    // 9. CLIPBOARD COPY UTILITY
    // ==========================================
    window.copyToClipboard = function(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label || 'Email'} copied: ${text}`, 'success');
        }).catch(() => {
            showToast(`Email: ${text}`, 'info');
        });
    };

    // ==========================================
    // 10. SERVICE SELECTOR HELPER
    // ==========================================
    window.selectServiceAndScroll = function(serviceName) {
        const select = document.getElementById('form-service');
        if (select) select.value = serviceName;
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    };

    // ==========================================
    // 11. CONTACT FORM HANDLER
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name')?.value.trim();
            const email = document.getElementById('form-email')?.value.trim();
            const service = document.getElementById('form-service')?.value;
            const message = document.getElementById('form-message')?.value.trim();

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            const subject = encodeURIComponent(`Project Inquiry: ${service} - From ${name}`);
            const body = encodeURIComponent(
                `Hello MTIOT Team,\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Service Needed: ${service}\n\n` +
                `Project Scope & Requirements:\n${message}\n\n` +
                `---\nSubmitted via MTIOT Online Website`
            );

            const mailtoLink = `mailto:mtiotsolution@gmail.com?cc=support@mtiot.in&subject=${subject}&body=${body}`;

            showToast('Opening email client for mtiotsolution@gmail.com...', 'success');

            setTimeout(() => {
                window.location.href = mailtoLink;
            }, 600);

            contactForm.reset();
        });
    }

    if (window.lucide) {
        lucide.createIcons();
    }
});
