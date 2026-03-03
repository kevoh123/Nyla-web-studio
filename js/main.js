// ==========================================================================
// Main JavaScript File
// ==========================================================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initNavigation();
    initSmoothScroll();
    initScrollEffects();
    initCounters();
    initTestimonials();
    initForm();
    initNewsletter();
});

// ==========================================================================
// Preloader
// ==========================================================================

function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    });
}

// ==========================================================================
// Navigation
// ==========================================================================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================================================
// Scroll Effects
// ==========================================================================

function initScrollEffects() {
    // Reveal animations
    const revealElements = document.querySelectorAll(
        '.service-card, .work-item, .insight-card, .about-content, .stat-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        revealObserver.observe(el);
    });
}

// ==========================================================================
// Counters Animation
// ==========================================================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, stepTime);
}

// ==========================================================================
// Testimonials Slider
// ==========================================================================

function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    // Auto advance
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

// ==========================================================================
// Form Handling
// ==========================================================================

function initForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate
            if (!validateForm(data)) return;

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you! We\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

function validateForm(data) {
    if (!data.firstName || data.firstName.trim() === '') {
        showNotification('Please enter your first name', 'error');
        return false;
    }

    if (!data.lastName || data.lastName.trim() === '') {
        showNotification('Please enter your last name', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    if (!data.projectType) {
        showNotification('Please select a project type', 'error');
        return false;
    }

    if (!data.message || data.message.trim() === '') {
        showNotification('Please enter your message', 'error');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
 

// show notification
const NotificationSystem = {
    container: null,
    // Whitelist allowed notification types
    ALLOWED_TYPES: ['info', 'success', 'error', 'warning'],
    // Max message length to prevent DOM attacks
    MAX_MESSAGE_LENGTH: 500,
    
    init() {
        if (!this.container) {
            this.container = document.getElementById('notification-system');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'notification-system';
                document.body.appendChild(this.container);
            }
        }
    },
    
    show(message, type = 'info', duration = 5000) {
        this.init();
        
        // SECURITY: Validate type against whitelist
        if (!this.ALLOWED_TYPES.includes(type)) {
            type = 'info';
        }
        
        // SECURITY: Limit message length to prevent DOM attacks
        if (message && message.length > this.MAX_MESSAGE_LENGTH) {
            message = message.substring(0, this.MAX_MESSAGE_LENGTH);
        }
        
        // SECURITY: Sanitize message using textContent (prevents XSS)
        const sanitizedMessage = this.escapeHtml(message);
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Create icon (Font Awesome icons with validated type)
        const icon = document.createElement('i');
        const iconMap = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        icon.className = `fas ${iconMap[type]}`;
        icon.style.fontSize = '1.5rem';
        
        // Create message (SAFE: using textContent prevents HTML/JS injection)
        const text = document.createElement('span');
        text.style.flex = '1';
        text.textContent = sanitizedMessage;
        
        // Assemble notification
        notification.appendChild(icon);
        notification.appendChild(text);
        
        // Click to dismiss
        notification.onclick = () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        };
        
        this.container.appendChild(notification);
        
        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.3s ease forwards';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
    },
    
    escapeHtml(text) {
        // SECURITY: Proper HTML escaping using element creation
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// THIS IS YOUR ORIGINAL FUNCTION NAME - KEEP IT EXACTLY THE SAME!
function showNotification(message, type = 'info') {
    // Call the new system but keep your original function signature
    NotificationSystem.show(message, type);
}

// Optional: Add warning type if you want
function showWarning(message) {
    NotificationSystem.show(message, 'warning');
}

// ==========================================================================
// Newsletter Form
// ==========================================================================

function initNewsletter() {
    const form = document.querySelector('.newsletter-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const email = input.value;

            if (email && isValidEmail(email)) {
                showNotification('Thanks for subscribing!', 'success');
                input.value = '';
            } else {
                showNotification('Please enter a valid email', 'error');
            }
        });
    }
}

// ==========================================================================
// Parallax Effect
// ==========================================================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.hero-shape');

    shapes.forEach((shape, index) => {
        const speed = 0.1 * (index + 1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==========================================================================
// Console Welcome Message
// ==========================================================================

console.log('%c👋 Welcome to Nyla Web Studio', 'font-size: 20px; color: #64ffda;');
console.log('%cLet\'s create something amazing together!', 'font-size: 16px; color: #0a192f;');