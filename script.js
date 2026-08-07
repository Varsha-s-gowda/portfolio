// --- Particle Background Canvas ---
const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let particlesArray = [];
const colors = ['rgba(193, 255, 0, 0.4)', 'rgba(255, 255, 255, 0.2)', 'rgba(163, 230, 53, 0.3)'];

const mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 1.5;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 1.5;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 1.5;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 1.5;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = Math.min((canvas.width * canvas.height) / 12000, 100);
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                opacityValue = 1 - (distance / 120);
                ctx.strokeStyle = `rgba(193, 255, 0, ${opacityValue * 0.1})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

init();
animate();

// Reseed on resize
window.addEventListener('resize', function() {
    resizeCanvas();
    init();
});

// --- Dynamic Interactive Behavior Setup ---
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Mobile Navigation ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navButtons = navLinks.querySelectorAll('a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Custom Cursor ---
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';
        document.body.appendChild(cursor);
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            dotX += (mouseX - dotX) * 0.2;
            dotY += (mouseY - dotY) * 0.2;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .skill-item, .stat-card, .expertise-card, .learning-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });

        // Active state for clicks
        document.addEventListener('mousedown', () => {
            cursor.classList.add('active');
        });
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('active');
        });
    }

    // --- Typing Effect ---
    const words = ["Web Developer", "Full-Stack Builder", "Creative Designer", "Tech Enthusiast"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById("typing-text");

    function type() {
        if (!typingElement) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1500; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Brief pause before typing next
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // --- Active Nav Link Highlight ---
    const navButtons = document.querySelectorAll('.nav-links button');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // --- Projects Category Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    if (window.AOS) {
                        setTimeout(() => AOS.refresh(), 200);
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Projects Detail Modal Data ---
    const projectDetailsData = {
        lernova: {
            title: "Lernova AI",
            category: "Full-Stack",
            image: "lernova.png",
            description: "Lernova is a full-stack e-learning platform that enables users to explore, enroll in, and manage online courses through an intuitive interface. Built using the MERN stack, it features secure user authentication, course management, and responsive design for a seamless learning experience. The application provides personalized dashboards, progress tracking, and efficient backend APIs for scalable course delivery.",
            features: [
                "Secure authentication and authorization using JSON Web Tokens (JWT)",
                "Dynamic course dashboard with interactive progress tracking",
                "Responsive dashboard interface tailored for both instructors and learners",
                "Personalized user dashboards with customizable profiles",
                "Robust RESTful APIs for course catalog management"
            ],
            tags: ["MongoDB", "Express.js", "React", "Node.js", "Redux", "Tailwind CSS"]
        },
        careeriq: {
            title: "CareerIQ Platform",
            category: "Full-Stack",
            image: "careeriq.png",
            description: "Developed a MERN web platform evaluating student employability. Features a custom scoring engine for job-readiness metrics, recruiter dashboards, personalized analytics, candidate ranking, and profile management.",
            features: [
                "Custom evaluation scoring engine for student job-readiness",
                "Recruiter dashboard for filtering, reviewing, and hiring candidates",
                "Personalized student dashboard with skill gap analytics",
                "Secure portfolio and profile builder with document hosting",
                "Advanced search and filter engine for candidates matching specific job descriptions"
            ],
            tags: ["MERN Stack", "Scoring Engine", "Analytics", "React", "Node.js", "MongoDB"]
        },
        mediscan: {
            title: "Mediscan AI",
            category: "AI & ML",
            image: "mediscan.png",
            description: "AI-powered healthcare platform for pneumonia detection using chest X-ray images. Integrates a PyTorch-based ResNet-50 model with Flask APIs, OCR-enabled report analysis, and a React dashboard.",
            features: [
                "Pneumonia detection utilizing custom trained ResNet-50 architecture",
                "Interactive dashboard for viewing medical predictions in real time",
                "OCR-enabled scanning tool to parse medical reports and generate summaries",
                "Secure authentication and patient record storage pipelines",
                "Clean visual dashboard with analytics graphs built in Chart.js"
            ],
            tags: ["React", "PyTorch", "Flask API", "Tailwind CSS", "ResNet-50", "OCR"]
        },
        sikshasethu: {
            title: "Siksha-Sethu",
            category: "Web Scraping",
            image: "sikshasethu.png",
            description: "Full-stack MERN platform aggregating scholarship and internship opportunities. Powered by automated web scraping pipelines using Puppeteer and Cheerio, with secure JWT authentication and filters.",
            features: [
                "Automated scraping tasks to fetch scholarships and internships daily",
                "Intelligent parser handling various HTML formats cleanly into MongoDB",
                "Advanced discovery filters by category, deadline, eligibility, and type",
                "Email notification system for matching scholarship alerts",
                "Responsive layout with intuitive user bookmarking features"
            ],
            tags: ["MERN Stack", "Puppeteer", "Cheerio", "JWT", "MongoDB", "Express.js"]
        }
    };

    // --- Modal Controller ---
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = modal ? modal.querySelector('.modal-close-btn') : null;
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    function openModal(projectId) {
        const data = projectDetailsData[projectId];
        if (!data || !modal) return;

        document.getElementById('modal-project-img').style.backgroundImage = `url('${data.image}')`;
        document.getElementById('modal-project-category').textContent = data.category;
        document.getElementById('modal-project-title').textContent = data.title;
        document.getElementById('modal-project-desc').textContent = data.description;

        const featuresList = document.getElementById('modal-project-features');
        featuresList.innerHTML = '';
        data.features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            featuresList.appendChild(li);
        });

        const tagsContainer = document.getElementById('modal-project-tags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'project-tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- Smooth Scrolling & Active Nav Highlighting ---
    const scrollProgress = document.querySelector('.scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Scroll progress indicator
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // Active nav highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.querySelector('button').classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.querySelector('button').classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Expertise Section Scroll Animation ---
    const expertiseCards = document.querySelectorAll('.expertise-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const expertiseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    expertiseCards.forEach(card => {
        expertiseObserver.observe(card);
    });

    // --- Contact Form Interactive Feedback ---
    const contactForm = document.querySelector('.contact1');
    if (contactForm) {
        const btn = contactForm.querySelector('button');
        if (btn) {
            btn.addEventListener('click', (e) => {
                const nameInput = contactForm.querySelector('.name');
                const emailInput = contactForm.querySelector('.email');
                const textInput = contactForm.querySelector('textarea');
                
                if (nameInput.value.trim() && emailInput.value.trim() && textInput.value.trim()) {
                    e.preventDefault();
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
                        btn.style.background = '#c1ff00'; // Lime green success
                        btn.style.color = '#000';
                        nameInput.value = '';
                        emailInput.value = '';
                        textInput.value = '';
                        
                        setTimeout(() => {
                            btn.innerHTML = 'Send Message';
                            btn.style.background = '';
                            btn.style.color = '';
                            btn.style.pointerEvents = 'auto';
                            btn.style.opacity = '1';
                        }, 3000);
                    }, 1500);
                }
            });
        }
    }
});
