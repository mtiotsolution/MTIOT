// MTIOT Main Interactive Script
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
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

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // 2. Sticky Navbar Glass Effect
    const navbar = document.getElementById('main-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('shadow-lg', 'shadow-cyan-950/20');
        } else {
            navbar.classList.remove('shadow-lg', 'shadow-cyan-950/20');
        }
    });

    // 3. Service Filtering (All, IoT, Web, Software, Mobile)
    const filterBtns = document.querySelectorAll('.service-filter-btn');
    const serviceCards = document.querySelectorAll('.service-card-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-cyan-500', 'text-black', 'font-semibold');
                b.classList.add('bg-slate-800/80', 'text-slate-300');
            });
            btn.classList.add('bg-cyan-500', 'text-black', 'font-semibold');
            btn.classList.remove('bg-slate-800/80', 'text-slate-300');

            const filter = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // 4. FAQ Accordion Toggle
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('.faq-icon');
            const isOpen = content.classList.contains('open');

            // Close all first
            document.querySelectorAll('.faq-content').forEach(c => c.classList.remove('open'));
            document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotated'));

            // If it wasn't open, open it
            if (!isOpen) {
                content.classList.add('open');
                if (icon) icon.classList.add('rotated');
            }
        });
    });

    // 5. Toast Notification System
    window.showToast = function(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        if (type === 'success') {
            toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-emerald-500/40 bg-slate-900/95 text-white shadow-2xl backdrop-blur-md transition-all duration-300 translate-y-0 opacity-100';
            if (toastIcon) toastIcon.setAttribute('data-lucide', 'check-circle-2');
        } else {
            toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-cyan-500/40 bg-slate-900/95 text-white shadow-2xl backdrop-blur-md transition-all duration-300 translate-y-0 opacity-100';
            if (toastIcon) toastIcon.setAttribute('data-lucide', 'info');
        }

        if (window.lucide) {
            lucide.createIcons();
        }

        setTimeout(() => {
            toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-900/95 text-white shadow-2xl backdrop-blur-md transition-all duration-300 translate-y-12 opacity-0 pointer-events-none';
        }, 4000);
    };

    // 6. Copy Email Helper
    window.copyToClipboard = function(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label || 'Email'} copied to clipboard!`, 'success');
        }).catch(() => {
            showToast(`Could not copy, email is: ${text}`, 'info');
        });
    };

    // 7. Contact Form Submission
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

            // Construct mailto link
            const subject = encodeURIComponent(`Project Inquiry: ${service} - From ${name}`);
            const body = encodeURIComponent(
                `Hello MTIOT Team,\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Selected Service: ${service}\n\n` +
                `Project Details:\n${message}\n\n` +
                `---\nSent from MTIOT Online Website Contact Form`
            );

            // Open user's email client directly directed to mtiotsolution@gmail.com and CC support@mtiot.in
            const mailtoLink = `mailto:mtiotsolution@gmail.com?cc=support@mtiot.in&subject=${subject}&body=${body}`;
            
            showToast('Opening your email client to send message...', 'success');
            
            setTimeout(() => {
                window.location.href = mailtoLink;
            }, 600);

            contactForm.reset();
        });
    }

    // 8. Pre-select service in form when clicking "Inquire" buttons
    window.selectServiceAndScroll = function(serviceName) {
        const select = document.getElementById('form-service');
        if (select) {
            select.value = serviceName;
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Initialize Lucide icons if available
    if (window.lucide) {
        lucide.createIcons();
    }
});
