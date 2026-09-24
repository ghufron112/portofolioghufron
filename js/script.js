document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Loading Screen Animation
    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderPercentage = document.querySelector('.loader-percentage');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) progress = 100;
        
        loaderBar.style.width = `${progress}%`;
        loaderPercentage.textContent = `Loading... ${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    initAnimations(); // Start animations after loading
                }, 800);
            }, 500);
        }
    }, 50);

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorText = document.querySelector('.cursor-text');
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorText.style.left = e.clientX + 'px';
            cursorText.style.top = e.clientY + 'px';
        });

        // Hover effect for links and buttons
        const hoverElements = document.querySelectorAll('a, button, .cursor-hover');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('project-hover') || el.classList.contains('view-project-btn')) {
                    cursor.classList.add('view-hover');
                } else {
                    cursor.classList.add('hover');
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursor.classList.remove('view-hover');
            });
        });
    }

    // 3. Navbar Scroll Effect & Mobile Menu
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 4. Typing Animation
    const typedTextSpan = document.querySelector(".typing-text");
    const textArray = [
        "Informatics Engineering Student",
        "Web Developer",
        "Flutter Developer",
        "UI/UX Enthusiast",
        "Creative Developer"
    ];
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, 500);
        }
    }

    // 5. Active Link Update on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if(navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    // 6. Init Animations (called after loader)
    function initAnimations() {
        type();
        
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero Reveal
            gsap.fromTo('.slide-up', 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            );
            
            gsap.fromTo('.fade-in',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
            );

            // Lanyard Physics Animation (Swaying + Interactive Dragging)
            const lanyard = document.getElementById('lanyard');
            const lanyardWrapper = document.querySelector('.lanyard-wrapper');
            let isDragging = false;
            let swayAnimation;

            function startSway() {
                swayAnimation = gsap.to(lanyard, {
                    rotation: 4,
                    transformOrigin: "top center",
                    duration: 3,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }
            
            startSway();

            if (!isMobile) {
                // Dragging mechanics for Lanyard
                lanyard.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    if(swayAnimation) swayAnimation.kill();
                    lanyard.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none'; // prevent text selection while dragging
                });

                window.addEventListener('mousemove', (e) => {
                    if (!isDragging) {
                        // Subtle parallax if not dragging
                        const heroSection = document.getElementById('home');
                        const rect = heroSection.getBoundingClientRect();
                        const x = e.clientX - rect.left - (rect.width/2);
                        // We don't overwrite rotation here to avoid fighting with swayAnimation, 
                        // instead we can just let it sway. Or we use a wrapper for parallax.
                        // For simplicity, we just use the drag interaction now.
                        return;
                    }
                    
                    // Calculate physics-based rotation based on mouse position relative to pivot
                    const wrapperRect = lanyardWrapper.getBoundingClientRect();
                    const pivotX = wrapperRect.left + (wrapperRect.width / 2);
                    const pivotY = wrapperRect.top;
                    
                    const dx = e.clientX - pivotX;
                    const dy = e.clientY - pivotY;
                    
                    let angle = Math.atan2(dx, dy) * (180 / Math.PI);
                    
                    // Limit rotation angle so it doesn't flip completely
                    if (angle > 75) angle = 75;
                    if (angle < -75) angle = -75;
                    
                    gsap.set(lanyard, {
                        rotation: -angle,
                        transformOrigin: "top center"
                    });
                });

                window.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        lanyard.style.cursor = 'grab';
                        document.body.style.userSelect = '';
                        
                        // Elastic release effect (swing back to center then resume swaying)
                        gsap.to(lanyard, {
                            rotation: 0,
                            duration: 2.5,
                            ease: "elastic.out(1, 0.3)",
                            onComplete: startSway
                        });
                    }
                });
                
                // Initial cursor
                lanyard.style.cursor = 'grab';
            }

            // Scroll animations setup
            setupScrollAnimations();
        }
    }

    function setupScrollAnimations() {
        // Elements Reveal
        const revealUps = document.querySelectorAll('.reveal-up');
        revealUps.forEach(el => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                    y: 0, opacity: 1, duration: 0.6, ease: 'power2.out'
                }
            );
        });

        const revealLefts = document.querySelectorAll('.reveal-left');
        revealLefts.forEach(el => {
            gsap.fromTo(el,
                { x: -50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                    x: 0, opacity: 1, duration: 0.8, ease: 'power2.out'
                }
            );
        });

        const revealRights = document.querySelectorAll('.reveal-right');
        revealRights.forEach(el => {
            gsap.fromTo(el,
                { x: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                    x: 0, opacity: 1, duration: 0.8, ease: 'power2.out'
                }
            );
        });

        // Counters Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    const target = +counter.getAttribute('data-target');
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: 'power1.inOut'
                    });
                }
            });
        });
    }

    // 7. Project Modal Logic
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = projectModal.querySelector('.modal-close');
    
    // modal elements
    const mImg = document.getElementById('m-img');
    const mCategory = document.getElementById('m-category');
    const mTitle = document.getElementById('m-title');
    const mDesc = document.getElementById('m-desc');
    const mTech = document.getElementById('m-tech');
    const mFeatures = document.getElementById('m-features');
    const mLink = document.getElementById('m-link');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // allow clicking direct links without opening modal
            if (e.target.closest('.direct-link-btn')) {
                return; // Let the link work naturally
            }
            
            e.preventDefault();
            const id = card.getAttribute('data-id');
            const dataDiv = document.querySelector(`#project-data div[data-id="${id}"]`);
            
            if(dataDiv) {
                mImg.src = dataDiv.querySelector('.d-image').textContent;
                mCategory.textContent = dataDiv.querySelector('.d-category').textContent;
                mTitle.textContent = dataDiv.querySelector('.d-title').textContent;
                mDesc.textContent = dataDiv.querySelector('.d-desc').textContent;
                mTech.textContent = dataDiv.querySelector('.d-tech').textContent;
                
                // Features list
                const featuresText = dataDiv.querySelector('.d-features').textContent;
                const featuresArray = featuresText.split(', ');
                mFeatures.innerHTML = '';
                featuresArray.forEach(feat => {
                    const li = document.createElement('li');
                    li.textContent = feat;
                    mFeatures.appendChild(li);
                });
                
                const link = dataDiv.querySelector('.d-link').textContent;
                mLink.href = link;
                mLink.innerHTML = `${dataDiv.querySelector('.d-btn-text').textContent} <i class="fas fa-external-link-alt"></i>`;
                
                if (link === '#') {
                    mLink.style.pointerEvents = 'none';
                    mLink.style.opacity = '0.5';
                } else {
                    mLink.style.pointerEvents = 'auto';
                    mLink.style.opacity = '1';
                }
                
                // open modal
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeModalBtn.addEventListener('click', closeProjectModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    function closeProjectModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (projectModal.classList.contains('active')) closeProjectModal();
            if (imageModal.classList.contains('active')) closeImageModal();
        }
    });

    // 8. Certificate Modal Logic
    const certCards = document.querySelectorAll('.cert-card');
    const imageModal = document.getElementById('image-modal');
    const fullScreenImg = document.getElementById('fullscreen-img');
    const closeImgModalBtn = imageModal.querySelector('.modal-close');

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.querySelector('img').src;
            fullScreenImg.src = imgSrc;
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeImgModalBtn.addEventListener('click', closeImageModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });

    function closeImageModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 9. Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const formNotif = document.getElementById('form-notif');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation simulation
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
            btn.disabled = true;
            
            setTimeout(() => {
                contactForm.reset();
                formNotif.classList.add('show');
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                setTimeout(() => {
                    formNotif.classList.remove('show');
                }, 5000);
            }, 1500);
        });
    }
});
