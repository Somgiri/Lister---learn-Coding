function enterSite() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainSite = document.getElementById('main-site');
    
    welcomeScreen.classList.add('fade-out');
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        mainSite.classList.remove('hidden');
        document.body.style.overflow = 'auto';
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });

    const learnBtns = document.querySelectorAll('.learn-btn');
    learnBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.textContent = 'Coming Soon!';
            setTimeout(() => {
                btn.textContent = 'Start Course';
            }, 2000);
        });
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            if (target === '#courses') {
                document.querySelector('.courses').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });
});
