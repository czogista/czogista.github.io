// ===== Smooth Scrolling and Navigation ===== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Generate Stars Dynamically =====
function generateStars() {
    const starsContainer = document.querySelector('.stars');
    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'fixed';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * window.innerHeight + 'px';
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.zIndex = '1';
        
        // Twinkle animation
        const duration = Math.random() * 3 + 2;
        star.style.animation = `twinkle ${duration}s infinite`;
        
        starsContainer.appendChild(star);
    }
}

// Call generateStars on page load
window.addEventListener('load', generateStars);

// ===== Contact Form Handling =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simulate form submission
        console.log('Zpráva odeslána:', { name, email, message });
        
        // Show success message
        alert(`Děkujeme, ${name}! Tvá zpráva byla odeslána. Brzy ti odpovíme na ${email}.`);
        
        // Reset form
        this.reset();
    });
}

// ===== Pricing Button Interactions =====
const pricingButtons = document.querySelectorAll('.pricing-btn');
pricingButtons.forEach(button => {
    button.addEventListener('click', function() {
        const cardType = this.closest('.pricing-card').querySelector('h3').textContent;
        console.log('Výběr balíčku:', cardType);
        
        // Scroll to contact form
        const contactSection = document.querySelector('#kontakt');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Add Parallax Effect to Glow Spheres =====
document.addEventListener('mousemove', function(e) {
    const glowSpheres = document.querySelectorAll('.glow-sphere');
    
    glowSpheres.forEach(sphere => {
        const x = (e.clientX / window.innerWidth) * 50;
        const y = (e.clientY / window.innerHeight) * 50;
        
        sphere.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===== Animated Counter for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature cards and pricing cards
document.querySelectorAll('.feature-card, .pricing-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(10, 14, 39, 0.98)';
        header.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.2)';
    } else {
        header.style.backgroundColor = 'rgba(10, 14, 39, 0.9)';
        header.style.boxShadow = 'none';
    }
});

// ===== CTA Button Ripple Effect =====
document.querySelectorAll('.cta-button, .pricing-btn, .btn-primary, .btn-secondary, .btn-submit').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Ripple CSS (added dynamically) =====
const style = document.createElement('style');
style.innerHTML = `
    .feature-card, .pricing-card, .btn-primary, .btn-secondary, .cta-button, .pricing-btn, .btn-submit {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Mobile Menu Toggle (Optional) =====
// If you add a hamburger menu, you can use this
function createMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Check if mobile
    if (window.innerWidth <= 768) {
        const menuToggle = document.createElement('button');
        menuToggle.classList.add('menu-toggle');
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            background: none;
            border: none;
            color: var(--primary-green);
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
        `;
        
        if (!navbar.querySelector('.menu-toggle')) {
            navbar.appendChild(menuToggle);
        }
    }
}

window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// ===== Scroll to Top Button =====
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.id = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #00ff00, #00ffff);
        color: #000;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
    
    button.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    button.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    });
}

window.addEventListener('load', createScrollToTopButton);

// ===== Log Welcome Message =====
console.log('%cWelcome to StartupWeb! 🚀', 'color: #00ff00; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff00');
console.log('%cTvůj startup si zaslouží moderní web. Pojď si to nenechat ujít!', 'color: #00ffff; font-size: 14px');
