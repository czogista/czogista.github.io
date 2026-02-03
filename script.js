// Enhanced JavaScript for Modern Portfolio Website
// Author: Kacper M. (Maleka DEV)

// Global variables and state
let currentSection = 'hero';
let isTransitioning = false;
let typingInterval;

// Animation utilities
const animUtils = {
    ease: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing...');
    initializeWebsite();
});

// Also try window load event as backup
window.addEventListener('load', function() {
    console.log('Window Loaded - Ensuring initialization...');
    if (typeof initializeWebsite === 'function') {
        initializeWebsite();
    }
});

function initializeWebsite() {
    console.log('🚀 Initializing Maleka DEV Portfolio...');
    
    // Initialize components
    initializeAnimations();
    initializeLanguageSystem();
    initializeSkillBars();
    initializeTypingAnimation();
    initializeParticleEffects();
    initializeScrollEffects();
    
    console.log('✨ Portfolio initialized successfully!');
}

// Navigation and Section Management
function showSection(section) {
    console.log(`🔄 showSection called with: ${section}`);
    
    console.log(`📍 Navigating to section: ${section}`);
    
    // Hide hero section and show content sections
    const heroSection = document.getElementById('heroSection');
    const contentSections = document.getElementById('contentSections');
    const contentNavPills = document.getElementById('contentNavPills');
    
    console.log('🔍 Elements found:', {
        heroSection: !!heroSection,
        contentSections: !!contentSections,
        contentNavPills: !!contentNavPills
    });
    
    // Show content sections and nav pills
    if (heroSection) {
        heroSection.style.display = 'none';
    }
    if (contentSections) {
        contentSections.style.display = 'block';
    }
    if (contentNavPills) {
        contentNavPills.style.display = 'flex';
    }
    
    // Show the requested section
    showContentSection(section);
    
    // Update navigation state for both nav sets
    updateNavigationState(section);
    updateContentNavigationState(section);
    
    // Update header style for content view
    updateHeaderForContentView();
}

function showContentSection(section) {
    console.log(`📋 showContentSection called with: ${section}`);
    const sections = ['aboutMe', 'projects', 'contact', 'hireme'];
    
    sections.forEach(s => {
        const sectionElement = document.getElementById(`${s}Section`);
        console.log(`🔍 Section ${s}:`, !!sectionElement);
        
        if (sectionElement) {
            if (s === section) {
                // Show the requested section
                sectionElement.style.display = 'block';
                sectionElement.style.opacity = '1';
                sectionElement.style.transform = 'translateY(0)';
                
                // Initialize section-specific features
                if (s === 'aboutMe') {
                    setTimeout(() => animateSkillBars(), 400);
                }
                console.log(`✅ Showing section: ${s}`);
            } else {
                // Hide all other sections
                sectionElement.style.display = 'none';
            }
        }
    });
    
    currentSection = section;
}

function updateNavigationState(activeSection) {
    console.log(`📍 Updating navigation state for: ${activeSection}`);
    const pills = document.querySelectorAll('.nav-pill:not(.nav-pill-home)');
    pills.forEach(pill => {
        pill.classList.remove('active');
        if (pill.onclick && pill.onclick.toString().includes(activeSection)) {
            pill.classList.add('active');
            console.log('✅ Activated pill for:', activeSection);
        }
    });
}

function updateContentNavigationState(activeSection) {
    console.log(`📍 Updating content navigation state for: ${activeSection}`);
    const contentPills = document.querySelectorAll('#contentNavPills .nav-pill:not(.nav-pill-home)');
    contentPills.forEach(pill => {
        pill.classList.remove('active');
        if (pill.onclick && pill.onclick.toString().includes(activeSection)) {
            pill.classList.add('active');
            console.log('✅ Activated content pill for:', activeSection);
        }
    });
}

function updateHeaderForContentView() {
    const header = document.getElementById('header');
    if (header) {
        header.style.background = 'rgba(10, 10, 11, 0.95)';
        header.style.backdropFilter = 'blur(30px)';
        console.log('✅ Updated header for content view');
    }
}

function reload() {
    console.log('🔄 Reload function called');
    
    // Smooth transition back to hero
    const heroSection = document.getElementById('heroSection');
    const contentSections = document.getElementById('contentSections');
    const contentNavPills = document.getElementById('contentNavPills');
    const header = document.getElementById('header');
    
    console.log('🔄 Reloading to hero section...');
    
    // Hide content sections and nav pills immediately
    if (contentSections) {
        contentSections.style.display = 'none';
    }
    if (contentNavPills) {
        contentNavPills.style.display = 'none';
    }
    
    // Show hero section
    if (heroSection) {
        heroSection.style.display = 'flex';
    }
    
    // Reset header style
    if (header) {
        header.style.background = 'rgba(10, 10, 11, 0.9)';
        header.style.backdropFilter = 'blur(20px)';
    }
    
    // Reset navigation state
    document.querySelectorAll('.nav-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    
    currentSection = 'hero';
    
    // Restart typing animation
    setTimeout(() => initializeTypingAnimation(), 500);
    
    console.log('✅ Reload completed');
}

// Typing Animation System
function initializeTypingAnimation() {
    const typingElement = document.getElementById('jobTitle');
    const cursor = document.querySelector('.cursor');
    
    if (!typingElement) return;
    
    // Ensure cursor is visible during animation
    if (cursor) {
        cursor.style.display = 'inline-block';
        cursor.style.animation = 'blink 1.5s infinite';
    }
    
    // Clear any existing interval and reset text
    if (typingInterval) clearInterval(typingInterval);
    typingElement.textContent = '';
    
    const texts = [
        'Junior Web Developer',
        'IT Administrator', 
        'Freelance Developer',
        'Problem Solver',
        'Tech Enthusiast',
        'Junior Web Developer<br>IT Administrator'
    ];
    
    const finalText = 'Junior Web Developer<br>IT Administrator';
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    let animationComplete = false;
    
    function typeAnimation() {
        if (animationComplete) return;
        
        const currentText = texts[textIndex];
        
        // Check if we've reached the final text and finished typing it
        if (currentText === finalText && charIndex >= currentText.replace(/<br>/g, '').length && !isDeleting) {
            animationComplete = true;
            typingElement.innerHTML = finalText; // Ensure final HTML is set
            typingElement.style.pointerEvents = 'auto'; // Re-enable pointer events
            if (cursor) {
                cursor.style.display = 'none'; // Hide cursor when done
                cursor.style.animation = 'none';
            }
            return;
        }
        
        if (isWaiting) {
            isWaiting = false;
            // Don't delete the final text
            if (currentText === finalText) {
                animationComplete = true;
                typingElement.style.pointerEvents = 'auto'; // Re-enable pointer events
                if (cursor) {
                    cursor.style.display = 'none';
                    cursor.style.animation = 'none';
                }
                return;
            }
            isDeleting = true;
            setTimeout(() => typeAnimation(), 500);
            return;
        }
        
        if (isDeleting) {
            if (currentText.includes('<br>')) {
                // For HTML content, handle it specially
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = currentText;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                typingElement.innerHTML = textContent.substring(0, charIndex);
            } else {
                typingElement.textContent = currentText.substring(0, charIndex);
            }
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(() => typeAnimation(), 300);
                return;
            }
        } else {
            if (currentText.includes('<br>')) {
                // For HTML content, handle it specially during typing
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = currentText;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                const currentChar = charIndex + 1;
                if (currentChar >= textContent.length) {
                    typingElement.innerHTML = currentText;
                } else {
                    typingElement.textContent = textContent.substring(0, currentChar);
                }
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
            }
            charIndex++;
            
            const targetLength = currentText.includes('<br>') ? 
                (currentText.replace(/<br>/g, '').length) : currentText.length;
            
            if (charIndex === targetLength) {
                if (currentText === finalText) {
                    typingElement.innerHTML = currentText; // Set final HTML
                    animationComplete = true;
                    if (cursor) cursor.style.display = 'none';
                    return;
                }
                isWaiting = true;
                setTimeout(() => typeAnimation(), 2000);
                return;
            }
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(() => typeAnimation(), speed);
    }
    
    // Start typing animation after a short delay
    setTimeout(() => typeAnimation(), 1500);
}

// Skill Bar Animations
function initializeSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => animateSkillBars(), 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const skillsContainer = document.querySelector('.skills-showcase');
    if (skillsContainer) {
        observer.observe(skillsContainer);
    }
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const level = bar.getAttribute('data-level');
            bar.style.width = `${level}%`;
            
            // Add glow effect
            bar.style.boxShadow = `0 0 10px rgba(0, 102, 255, 0.5)`;
            setTimeout(() => {
                bar.style.boxShadow = 'none';
            }, 1000);
        }, index * 200);
    });
}

// Enhanced Interactive Galaxy Background System
function initializeParticleEffects() {
    createInteractiveCanvas();
    createFloatingElements();
}

function createInteractiveCanvas() {
    // Create canvas for interactive effects
    const canvas = document.createElement('canvas');
    canvas.id = 'galaxy-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let mouse = { x: 0, y: 0 };
    let particles = [];
    let waves = [];
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse tracking for star attraction only
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // Wave ripples only on click with star displacement
    document.addEventListener('click', (e) => {
        const ripple = {
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            maxRadius: 100,
            alpha: 0.8,
            speed: 3,
            force: 15 // Force strength for pushing stars
        };
        waves.push(ripple);
        
        // Apply initial displacement to nearby stars
        particles.forEach(particle => {
            const dx = particle.x - ripple.x;
            const dy = particle.y - ripple.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) { // Slightly larger than max ripple for pre-displacement
                const force = (120 - distance) / 120;
                const pushStrength = force * ripple.force;
                
                // Add momentum to star
                if (!particle.momentum) particle.momentum = { x: 0, y: 0 };
                const angle = Math.atan2(dy, dx);
                particle.momentum.x += Math.cos(angle) * pushStrength;
                particle.momentum.y += Math.sin(angle) * pushStrength;
            }
        });
    });
    
    // Particle class for galaxy stars
    class GalaxyParticle {
        constructor() {
            this.reset();
            this.life = Math.random();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 3 + 0.3; // More size variety
            this.alpha = Math.random() * 0.8 + 0.2;
            this.twinkle = Math.random() * Math.PI * 2;
            this.momentum = { x: 0, y: 0 }; // Initialize momentum
        }
        
        update() {
            // Initialize momentum if not exists
            if (!this.momentum) this.momentum = { x: 0, y: 0 };
            
            // Check for ripple wave displacement
            waves.forEach(wave => {
                const dx = this.x - wave.x;
                const dy = this.y - wave.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If star is at the expanding ripple edge, get pushed
                if (Math.abs(distance - wave.radius) < 15 && wave.radius > 0) {
                    const force = (15 - Math.abs(distance - wave.radius)) / 15;
                    const pushStrength = force * (wave.force || 10) * 0.3;
                    
                    const angle = Math.atan2(dy, dx);
                    this.momentum.x += Math.cos(angle) * pushStrength;
                    this.momentum.y += Math.sin(angle) * pushStrength;
                }
            });
            
            // Enhanced mouse attraction with varied responses
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Different interaction zones (reduced when momentum is high)
            const momentumMagnitude = Math.sqrt(this.momentum.x * this.momentum.x + this.momentum.y * this.momentum.y);
            const interactionReduction = Math.min(momentumMagnitude * 0.1, 0.8);
            
            if (distance < 150 && interactionReduction < 0.5) {
                const force = (150 - distance) / 150 * (1 - interactionReduction);
                const attractionStrength = this.size > 1.5 ? 0.03 : 0.015; // Larger stars move more
                this.x += dx * force * attractionStrength;
                this.y += dy * force * attractionStrength;
                
                // Add orbital motion around cursor
                const angle = Math.atan2(dy, dx);
                const orbitalForce = force * 0.01;
                this.x += Math.cos(angle + Math.PI/2) * orbitalForce * this.size;
                this.y += Math.sin(angle + Math.PI/2) * orbitalForce * this.size;
            } else if (distance < 300 && interactionReduction < 0.3) {
                // Gentle long-range attraction
                const force = (300 - distance) / 300 * 0.005 * (1 - interactionReduction);
                this.x += dx * force;
                this.y += dy * force;
            } else {
                // Return to base position
                this.x += (this.baseX - this.x) * 0.015;
                this.y += (this.baseY - this.y) * 0.015;
            }
            
            // Apply momentum with realistic physics
            this.x += this.momentum.x;
            this.y += this.momentum.y;
            
            // Momentum decay (friction)
            this.momentum.x *= 0.95;
            this.momentum.y *= 0.95;
            
            // Enhanced drift with size-based variation
            const driftMultiplier = 2 - this.size * 0.5; // Smaller stars drift more
            this.x += this.vx * driftMultiplier;
            this.y += this.vy * driftMultiplier;
            this.baseX += this.vx * 0.3;
            this.baseY += this.vy * 0.3;
            
            // Wrap around edges
            if (this.baseX < 0) this.baseX = canvas.width;
            if (this.baseX > canvas.width) this.baseX = 0;
            if (this.baseY < 0) this.baseY = canvas.height;
            if (this.baseY > canvas.height) this.baseY = 0;
            
            // Enhanced twinkling with distance-based intensity
            this.twinkle += 0.015 + (this.size * 0.01);
            const distanceEffect = distance < 200 ? (200 - distance) / 200 * 0.3 : 0;
            this.alpha = 0.3 + Math.sin(this.twinkle) * (0.4 + distanceEffect);
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize more particles for richer galaxy effect
    for (let i = 0; i < 200; i++) {
        particles.push(new GalaxyParticle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Update and draw waves
        waves = waves.filter(wave => {
            wave.radius += wave.speed;
            wave.alpha *= 0.995;
            
            if (wave.radius < wave.maxRadius && wave.alpha > 0.01) {
                ctx.save();
                ctx.globalAlpha = wave.alpha;
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                return true;
            }
            return false;
        });
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
}

function createFloatingElements() {
    const container = document.querySelector('.floating-particles');
    if (!container) return;
    
    // Create fewer but more dynamic elements
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-orb';
        const size = Math.random() * 4 + 2;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.6), rgba(0, 212, 255, 0.1));
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: galaxyFloat ${15 + Math.random() * 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 10}s;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        `;
        container.appendChild(particle);
    }
    
    // Add enhanced CSS animations
    if (!document.querySelector('#galaxy-styles')) {
        const style = document.createElement('style');
        style.id = 'galaxy-styles';
        style.textContent = `
            @keyframes galaxyFloat {
                0%, 100% {
                    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
                    opacity: 0.6;
                }
                25% {
                    transform: translate3d(100px, -50px, 0) rotate(90deg) scale(1.2);
                    opacity: 1;
                }
                50% {
                    transform: translate3d(-50px, -100px, 0) rotate(180deg) scale(0.8);
                    opacity: 0.4;
                }
                75% {
                    transform: translate3d(-100px, 50px, 0) rotate(270deg) scale(1.1);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function createMouseFollowEffect() {
    // This is now handled by the canvas system
}

// Scroll Effects and Parallax
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        // Parallax effect for background orbs
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
        });
        
        // Header background opacity
        const header = document.getElementById('header');
        if (header) {
            const opacity = Math.min(scrolled / 100, 0.95);
            header.style.background = `rgba(10, 10, 11, ${0.9 + opacity * 0.05})`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Initialize general animations
function initializeAnimations() {
    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.project-card, .contact-card, .service-item, .about-paragraph').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Language System Enhancement
function initializeLanguageSystem() {
    // Create translations object with proper string escaping
    const translations = {};
    
    // English translations
    translations.en = {
        titleBy: 'by ',
        jobTitle: 'Junior Web Developer & IT Administrator',
        heroDescription: 'Passionate developer crafting digital experiences with clean code and innovative solutions. Specialized in web development, IT infrastructure, and creating seamless user experiences.',
        logoRequestHTML: 'I am seeking an individual with a background in computer graphics.<br>If you are interested in creating my brand logo, please send me your previous projects and a description of your experience via email.',
        navigation: {
            about: 'About',
            projects: 'Projects', 
            contact: 'Contact',
            hireme: 'Hire me'
        },
        buttons: { 
            about: 'About me', 
            projects: 'My projects', 
            contact: 'Get in touch', 
            hireme: 'IT Support / Hire me' 
        },
        about: {
            titleHTML: 'Hi, I\'m <span class="highlight">Kacper</span> 👋',
            p1: 'I\'m a tech enthusiast with a strong background in web development, design, and IT solutions. My programming journey began at the age of 12, starting with Scratch during school IT classes, and has since grown into a deep passion for creating and managing websites, web applications, and databases. In 2022, I successfully passed the <strong>EE.08</strong> / <strong>INF.02</strong> professional qualification exams, further solidifying my technical skills.',
            p2: 'Since November 2024, I have been part of the <a href="https://rybizak.cz" target="_blank" class="link-highlight">Rybízák</a> team as a sales stand operator, where I take care of customers, handle transactions, prepare documentation for stock replenishment, and ensure smooth daily operations. Alongside this, I work at <a href="https://globus.cz" target="_blank" class="link-highlight">Globus</a> as a cashier, operating both staffed and self-service checkouts, assisting customers, managing store opening and closing procedures, and training new colleagues when needed.',
            p3: 'Outside my formal roles, I frequently help friends and neighbors with small tech-related tasks — whether it\'s reinstalling Windows, setting up applications, configuring security cameras, or troubleshooting everyday PC issues. These experiences have sharpened my problem-solving abilities and taught me the value of clear communication with both technical and non-technical users.',
            p4: 'I am fluent in Polish (native) and communicate effectively in English and Czech at an upper-intermediate level (ILR scale 3–4). When I\'m not coding or working, I enjoy gaming, running my online community, exploring new technologies, and spending time with friends.',
            footer: 'That\'s me in a nutshell. Thanks for stopping by 💙'
        },
        projects: {
            title: 'My projects?',
            intro: 'While I\'m still growing as a developer, I have several projects I\'m proud of and would like to share.',
            nnsDescHTML: 'NoName Squad is a <a href="https://discord.nnamesquad.top" target="_blank" style="color: var(--nns);">Discord</a> community I founded in 2019. Over the years, it has grown over 50 active members, with its invite link used more than 1,000 times. I also developed its dedicated <a href="https://nnamesquad.top" target="_blank" style="color: var(--nns);">website</a>, which serves as a hub for members to connect and stay updated.',
            flagbarDescHTML: 'FlagBar is a browser extension that adds the colors of various LGBTQ+ flags to YouTube for a personalized, visually appealing experience. I created it initially as a fun project inspired by a friend in the LGBTQ+ community, and soon realized it could be enjoyed by everyone. You can learn more and try it at <a href="https://flagbar.nnamesquad.top" target="_blank" style="color: var(--flagbar);">flagbar.nnamesquad.top</a>.',
            footerText: '<strong>Perhaps more in the future..</strong><br>until then, you can support me and buy me a coffee if you like my work!'
        },
        contact: {
            title: 'Contact',
            messageHTML: 'Feel free to contact me anytime at <a href="mailto:contact@maleka.dev" class="contact-link">contact@maleka.dev</a>.',
            footer: 'I will reply as soon as possible, though my response may come from my personal address for convenience.'
        },
        hire: {
            title: 'Small Tech Jobs & Web Projects',
            p1: 'I am available for a wide range of tech-related work, from website and web app development to database setup, IT equipment installation, and general PC support. Whether you need help troubleshooting an issue, setting up a system, or building a new online presence, I provide reliable, personalized assistance tailored to your needs.',
            p2: 'I hold a professional qualification in <strong>EE.08</strong> and <strong>INF.02</strong> (Web Development, Applications, and Database Management), passed in 2022. This certification ensures that my work meets recognized professional standards, whether for personal projects or professional engagements.',
            p3: 'My services include developing and managing websites, installing and configuring software, setting up networks or security devices, and providing general IT support. If you have a project in mind or a tech issue that needs solving, please get in touch via the <span class="highlight">"Contact"</span> tab, and I will respond promptly.'
        }
    };
    
    // Czech translations
    translations.cs = {
        titleBy: 'od ',
        jobTitle: 'Junior webový vývojář a IT administrátor',
        heroDescription: 'Vášnivý vývojář tvořící digitální zážitky s čistým kódem a inovativními řešeními. Specializuji se na vývoj webů, IT infrastrukturu a vytváření bezproblémových uživatelských rozhraní.',
        logoRequestHTML: 'Hledám člověka se zkušenostmi s počítačovou grafikou.<br>Pokud máte zájem vytvořit moje značkové logo, pošlete prosím své předchozí projekty a popis zkušeností e‑mailem.',
        navigation: {
            about: 'O mně',
            projects: 'Projekty', 
            contact: 'Kontakt',
            hireme: 'Najměte mě'
        },
        buttons: { 
            about: 'O mně', 
            projects: 'Moje projekty', 
            contact: 'Kontaktujte mě', 
            hireme: 'IT podpora / Najměte mě' 
        },
        about: {
            titleHTML: 'Ahoj, jsem <span class="highlight">Kacper</span> 👋',
            p1: 'Jsem nadšenec do technologií se silným zaměřením na vývoj webů, design a IT řešení. S programováním jsem začal ve 12 letech ve škole na hodinách informatiky se Scratch a postupně se z toho stala vášeň pro tvorbu a správu webů, webových aplikací a databází. V roce 2022 jsem úspěšně složil profesní kvalifikace <strong>EE.08</strong> / <strong>INF.02</strong>, které dále posílily mé technické dovednosti.',
            p2: 'Od listopadu 2024 jsem součástí týmu <a href="https://rybizak.cz" target="_blank" class="link-highlight">Rybízák</a> jako obsluha prodejního stánku, kde se starám o zákazníky, vyřizuji platby, připravuji podklady pro doplnění zboží a zajišťuji plynulý chod provozu. Vedle toho pracuji v <a href="https://globus.cz" target="_blank" class="link-highlight">Globus</a> jako pokladní – obsluhuji jak klasické, tak samoobslužné pokladny, pomáhám zákazníkům, zajišťuji otevření a uzavření prodejny a v případě potřeby zaučuji nové kolegy.',
            p3: 'Mimo formální pracovní role často pomáhám přátelům a sousedům s menšími IT úkoly — ať už jde o přeinstalaci Windows, instalaci aplikací, nastavení kamerových systémů, nebo řešení běžných problémů s PC. Díky tomu jsem si zlepšil schopnost řešit problémy a naučil se srozumitelně komunikovat s technickými i netechnickými uživateli.',
            p4: 'Plynně mluvím polsky (rodilý jazyk) a anglicky i česky komunikuji na vyšší středně pokročilé úrovni (ILR 3–4). Když zrovna neprogramuji ani nepracuji, rád hraji hry, starám se o svou online komunitu, zkouším nové technologie a trávím čas s přáteli.',
            footer: 'To jsem já v kostce. Díky za návštěvu 💙'
        },
        projects: {
            title: 'Moje projekty?',
            intro: 'I když se jako vývojář stále posouvám, mám několik projektů, na které jsem hrdý a rád se o ně podělím.',
            nnsDescHTML: 'NoName Squad je komunita na <a href="https://discord.nnamesquad.top" target="_blank" style="color: var(--nns);">Discordu</a>, kterou jsem založil v roce 2019. Během let vyrostla přes 50 aktivních členů a její pozvánka byla použita více než 1,000×. Vytvořil jsem také její <a href="https://nnamesquad.top" target="_blank" style="color: var(--nns);">web</a>, který slouží jako centrum pro spojení členů a novinky.',
            flagbarDescHTML: 'FlagBar je rozšíření prohlížeče, které přidává barvy různých LGBTQ+ vlajek do YouTube pro osobnější a vizuálně příjemný zážitek. Původně jsem ho vytvořil jako zábavný projekt inspirovaný kamarádem z LGBTQ+ komunity a brzy jsem zjistil, že si ho může užít každý. Více informací najdete na <a href="https://flagbar.nnamesquad.top" target="_blank" style="color: var(--flagbar);">flagbar.nnamesquad.top</a>.',
            footerText: '<strong>Možná časem více…</strong><br>do té doby mě můžete podpořit a koupit mi kávu, pokud se vám má práce líbí!'
        },
        contact: {
            title: 'Kontakt',
            messageHTML: 'Neváhejte mě kdykoli kontaktovat na <a href="mailto:contact@maleka.dev" class="contact-link">contact@maleka.dev</a>.',
            footer: 'Odpovím co nejdříve; pro pohodlí mohu odepsat ze své osobní adresy.'
        },
        hire: {
            title: 'Menší IT práce a webové projekty',
            p1: 'Nabízím široké spektrum IT služeb – od vývoje webů a webových aplikací přes zřizování databází až po instalaci IT vybavení a obecnou podporu pro PC. Ať už potřebujete vyřešit problém, nastavit systém, nebo vybudovat novou online prezentaci, poskytnu spolehlivou a osobní pomoc na míru.',
            p2: 'Mám profesní kvalifikace <strong>EE.08</strong> a <strong>INF.02</strong> (Tvorba webů, aplikací a správa databází), které jsem složil v roce 2022. Díky tomu moje práce splňuje uznávané profesionální standardy – ať už jde o osobní či firemní projekty.',
            p3: 'Mezi mé služby patří vývoj a správa webů, instalace a konfigurace softwaru, zřizování sítí nebo bezpečnostních zařízení a obecná IT podpora. Pokud máte projekt nebo problém k vyřešení, kontaktujte mě prosím přes záložku <span class="highlight">„Kontakt"</span> a ozvu se co nejdříve.'
        }
    };
    
    // Polish translations
    translations.pl = {
        titleBy: 'autor: ',
        jobTitle: 'Młodszy Web Developer i Administrator IT',
        heroDescription: 'Pasjonat programowania tworzący cyfrowe doświadczenia z czystym kodem i innowacyjnymi rozwiązaniami. Specjalizuję się w tworzeniu stron internetowych, infrastrukturze IT i projektowaniu płynnych interfejsów użytkownika.',
        logoRequestHTML: 'Szukam osoby ze znajomością grafiki komputerowej.<br>Jeśli jesteś zainteresowany(a) stworzeniem mojego logo marki, wyślij proszę swoje wcześniejsze projekty oraz opis doświadczenia na e‑mail.',
        navigation: {
            about: 'O mnie',
            projects: 'Projekty', 
            contact: 'Kontakt',
            hireme: 'Zatrudnij mnie'
        },
        buttons: { 
            about: 'O mnie', 
            projects: 'Moje projekty', 
            contact: 'Skontaktuj się', 
            hireme: 'Wsparcie IT / Zatrudnij mnie' 
        },
        about: {
            titleHTML: 'Cześć, jestem <span class="highlight">Kacper</span> 👋',
            p1: 'Jestem pasjonatem technologii ze solidnym doświadczeniem w tworzeniu stron, projektowaniu i rozwiązaniach IT. Swoją przygodę z programowaniem zacząłem w wieku 12 lat na zajęciach informatyki od Scratcha i od tego czasu rozwinęła się we mnie silna pasja do tworzenia i zarządzania stronami WWW, aplikacjami internetowymi oraz bazami danych. W 2022 roku zdałem z powodzeniem kwalifikacje zawodowe <strong>EE.08</strong> / <strong>INF.02</strong>, co ugruntowało moje umiejętności techniczne.',
            p2: 'Od listopada 2024 roku jestem częścią zespołu <a href="https://rybizak.cz" target="_blank" class="link-highlight">Rybízák</a> jako obsługa stoiska sprzedażowego – dbam o klientów, realizuję transakcje, przygotowuję dokumentację do uzupełnień towaru i czuwam nad sprawnym przebiegiem dnia. Równolegle pracuję w <a href="https://globus.cz" target="_blank" class="link-highlight">Globus</a> jako kasjer – obsługuję zarówno kasy tradycyjne, jak i samoobsługowe, pomagam klientom, zajmuję się otwarciem i zamknięciem sklepu oraz w razie potrzeby szkolę nowych współpracowników.',
            p3: 'Poza formalnymi rolami często pomagam znajomym i sąsiadom w drobnych zadaniach IT — od reinstalacji Windows, przez konfigurację aplikacji, ustawienia kamer, po rozwiązywanie codziennych problemów z komputerem. Te doświadczenia rozwinęły moje umiejętności rozwiązywania problemów i nauczyły mnie jasnej komunikacji zarówno z osobami technicznymi, jak i nietechnicznymi.',
            p4: 'Posługuję się biegle językiem polskim (ojczysty), a po angielsku i czesku komunikuję się na poziomie wyższym średnio zaawansowanym (ILR 3–4). Poza pracą i kodowaniem lubię gry, prowadzenie społeczności online, poznawanie nowych technologii i czas spędzany ze znajomymi.',
            footer: 'To ja w pigułce. Dzięki za odwiedziny 💙'
        },
        projects: {
            title: 'Moje projekty?',
            intro: 'Choć wciąż się rozwijam jako programista, mam kilka projektów, z których jestem dumny i chętnie je pokażę.',
            nnsDescHTML: 'NoName Squad to społeczność na <a href="https://discord.nnamesquad.top" target="_blank" style="color: var(--nns);">Discordzie</a>, którą założyłem w 2019 roku. Z czasem urosła do ponad 50 aktywnych członków, a link zaproszenia był użyty ponad 1,000 razy. Stworzyłem też dedykowaną <a href="https://nnamesquad.top" target="_blank" style="color: var(--nns);">stronę</a>, która jest centrum informacji i łączności dla członków.',
            flagbarDescHTML: 'FlagBar to rozszerzenie przeglądarki, które dodaje kolory różnych flag LGBTQ+ do YouTube, tworząc spersonalizowane, atrakcyjne wizualnie wrażenia. Powstało jako zabawny projekt zainspirowany znajomą osobą z społeczności LGBTQ+, a szybko okazało się, że może spodobać się każdemu. Więcej informacji: <a href="https://flagbar.nnamesquad.top" target="_blank" style="color: var(--flagbar);">flagbar.nnamesquad.top</a>.',
            footerText: '<strong>Być może w przyszłości więcej…</strong><br>do tego czasu możesz mnie wesprzeć i postawić mi kawę, jeśli podoba Ci się moja praca!'
        },
        contact: {
            title: 'Kontakt',
            messageHTML: 'Zapraszam do kontaktu pod adresem <a href="mailto:contact@maleka.dev" class="contact-link">contact@maleka.dev</a>.',
            footer: 'Odpowiem najszybciej jak to możliwe; dla wygody wiadomość może przyjść z mojego prywatnego adresu.'
        },
        hire: {
            title: 'Drobne zlecenia IT i projekty webowe',
            p1: 'Jestem dostępny do szerokiego zakresu prac IT – od tworzenia stron i aplikacji webowych, przez konfigurację baz danych, instalację sprzętu IT, po ogólne wsparcie komputerowe. Niezależnie, czy potrzebujesz rozwiązać problem, uruchomić system, czy zbudować nową obecność w sieci, zapewnię rzetelną, spersonalizowaną pomoc.',
            p2: 'Posiadam kwalifikacje zawodowe <strong>EE.08</strong> i <strong>INF.02</strong> (Tworzenie stron, aplikacji i zarządzanie bazami danych), zdane w 2022 roku. Dzięki temu moja praca spełnia uznane standardy zawodowe – zarówno przy projektach prywatnych, jak i komercyjnych.',
            p3: 'W zakres moich usług wchodzi tworzenie i utrzymanie stron, instalacja i konfiguracja oprogramowania, konfiguracja sieci lub urządzeń zabezpieczających oraz ogólne wsparcie IT. Jeśli masz projekt lub problem do rozwiązania, skontaktuj się przez zakładkę <span class="highlight">„Kontakt"</span>, a odezwę się niezwłocznie.'
        }
    };

    function setActiveLangButton(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    function applyLanguage(lang) {
        const t = translations[lang] || translations.en;
        console.log(`🌐 Applying language: ${lang}`);
        
        // Root lang attribute
        document.documentElement.setAttribute('lang', lang);

        // Header/title area
        const elements = {
            'titleBy': t.titleBy,
            'heroDescription': t.heroDescription,
            'logoRequest': t.logoRequestHTML
        };

        Object.entries(elements).forEach(([id, content]) => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'logoRequest' || id === 'heroDescription') {
                    el.innerHTML = content;
                } else {
                    el.textContent = content;
                }
            }
        });

        // Navigation pills
        const navElements = {
            'aboutMeNavText': t.navigation.about,
            'projectsNavText': t.navigation.projects,
            'contactNavText': t.navigation.contact,
            'hiremeNavText': t.navigation.hireme
        };

        Object.entries(navElements).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Buttons
        const buttonElements = {
            'aboutMeButton': t.buttons.about,
            'contactButton': t.buttons.contact
        };

        Object.entries(buttonElements).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) {
                const textSpan = el.querySelector('.btn-text');
                if (textSpan) textSpan.textContent = text;
                else el.textContent = text;
            }
        });

        // About me section
        const aboutElements = {
            'aboutMeTitle': t.about.titleHTML,
            'aboutMeP1': t.about.p1,
            'aboutMeP2': t.about.p2,
            'aboutMeP3': t.about.p3,
            'aboutMeP4': t.about.p4
        };

        Object.entries(aboutElements).forEach(([id, content]) => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'aboutMeTitle') {
                    el.innerHTML = content;
                } else {
                    const p = el.querySelector('p');
                    if (p) p.innerHTML = content;
                }
            }
        });

        const aboutFooter = document.getElementById('aboutMeFooter');
        if (aboutFooter) {
            const footerText = aboutFooter.querySelector('.footer-text');
            if (footerText) footerText.textContent = t.about.footer;
        }

        // Projects section
        const projectElements = {
            'projectsTitle': t.projects.title,
            'projectsIntro': t.projects.intro,
            'nnsDesc': t.projects.nnsDescHTML,
            'flagbarDesc': t.projects.flagbarDescHTML,
            'projectsFooterText': t.projects.footerText
        };

        Object.entries(projectElements).forEach(([id, content]) => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'projectsTitle' || id === 'projectsIntro') {
                    el.textContent = content;
                } else {
                    if (id === 'nnsDesc' || id === 'flagbarDesc') {
                        const p = el.querySelector('p');
                        if (p) p.innerHTML = content;
                        else el.innerHTML = content;
                    } else {
                        el.innerHTML = content;
                    }
                }
            }
        });

        // Contact section
        const contactElements = {
            'contactTitle': t.contact.title,
            'contactMsg': t.contact.messageHTML,
            'contactFooter': t.contact.footer
        };

        Object.entries(contactElements).forEach(([id, content]) => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'contactTitle') {
                    el.textContent = content;
                } else {
                    el.innerHTML = content;
                }
            }
        });

        // Hire me section
        const hireElements = {
            'hiremeTitle': t.hire.title,
            'hiremeP1': t.hire.p1,
            'hiremeP2': t.hire.p2,
            'hiremeP3': t.hire.p3
        };

        Object.entries(hireElements).forEach(([id, content]) => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'hiremeTitle') {
                    el.textContent = content;
                } else {
                    const p = el.querySelector('p');
                    if (p) p.innerHTML = content;
                }
            }
        });

        setActiveLangButton(lang);
        
        // Save language preference
        try { 
            localStorage.setItem('maleka_lang', lang); 
        } catch (e) { 
            console.warn('Could not save language preference:', e); 
        }
    }

    function initLanguage() {
        // Get saved language or default to English
        const saved = (function(){
            try { 
                return localStorage.getItem('maleka_lang') || 'en'; 
            } catch (e) { 
                return 'en'; 
            }
        })();

        // Add click event listeners
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                applyLanguage(lang);
                
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });

            // Add hover effects
            btn.addEventListener('mouseenter', () => showHoverInfo(btn));
            btn.addEventListener('mouseleave', () => hideHoverInfo());
        });

        // Apply saved language
        applyLanguage(saved);
    }

    function showHoverInfo(btn) {
        const box = document.getElementById('langInfo');
        if (!box) return;
        
        const lang = btn.dataset.lang;
        let text;
        
        switch (lang) {
            case 'en':
                text = 'English version available.';
                break;
            case 'cs':
                text = 'Čeština aktivní.';
                break;
            case 'pl':
                text = 'Polski aktywny.';
                break;
            default:
                text = 'Language info';
        }
        
        box.textContent = text;
        box.style.display = 'block';
        box.style.opacity = '1';
    }

    function hideHoverInfo() {
        const box = document.getElementById('langInfo');
        if (!box) return;
        
        box.style.opacity = '0';
        setTimeout(() => { 
            if (box.style.opacity === '0') box.style.display = 'none'; 
        }, 200);
    }

    // Initialize language system
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguage);
    } else {
        initLanguage();
    }
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.warn('JavaScript Error:', e.error);
});

// Log successful initialization
console.log('✅ Maleka DEV Portfolio - Enhanced JavaScript Loaded');

// Export functions for debugging
window.MalekaDev = {
    showSection,
    reload,
    initializeTypingAnimation,
    animateSkillBars,
    currentSection: () => currentSection
};