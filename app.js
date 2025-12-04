// Small helper utils
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

// Theme toggle persist
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
root.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'light' ? 'Dark' : 'Light';
themeToggle.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', cur);
    localStorage.setItem('theme', cur);
    themeToggle.textContent = cur === 'light' ? 'Dark' : 'Light';
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Simple reveal on scroll
const reveals = $$('.reveal');
const showReveal = () => {
    const top = window.innerHeight;
    reveals.forEach(r => {
        const rect = r.getBoundingClientRect();
        if (rect.top < top - 60) r.classList.add('show');
    });
};
window.addEventListener('scroll', showReveal);
window.addEventListener('load', showReveal);

// Hide Tech & Tools panel when user scrolls down, show on scroll up
// We find the panel by matching the heading text 'Tech & Tools' so HTML doesn't need changes
const techPanel = Array.from($$('.panel')).find(p => (p.querySelector('h3') || {}).textContent?.trim().toLowerCase().includes('tech'));
if (techPanel) {
    // ensure panel starts on top so it fully covers underlying content
    techPanel.classList.add('is-on-top');
    let lastY = window.scrollY;
    let ticking = false;
    const onScrollDirection = () => {
        const currentY = window.scrollY;
        // ignore tiny moves
        if (Math.abs(currentY - lastY) < 8) { ticking = false; return; }
        if (currentY > lastY) {
            // scrolling down -> hide
            techPanel.classList.add('hide-tech');
            techPanel.classList.remove('is-on-top');
        } else {
            // scrolling up -> show
            techPanel.classList.remove('hide-tech');
            techPanel.classList.add('is-on-top');
        }
        lastY = currentY;
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScrollDirection);
            ticking = true;
        }
    }, { passive: true });
}

// Project filtering
const filterBtns = $$('.filter-btn');
const projectsGrid = $('#projectsGrid');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        const items = $$('.project', projectsGrid);
        items.forEach(it => {
            const tags = it.getAttribute('data-tags');
            if (f === 'all' || tags.toLowerCase().includes(f.toLowerCase())) {
                it.style.display = '';
            } else it.style.display = 'none';
        });
    });
});

// Project modal + dynamic content (you can extend this with real repo/demo links)
const modal = $('#modal'), closeModal = $('#closeModal');
$$('.project', projectsGrid).forEach(proj => {
    proj.addEventListener('click', () => openProject(proj));
    proj.addEventListener('keyup', (e) => { if (e.key === 'Enter') openProject(proj); });
});

function openProject(el) {
    const title = el.getAttribute('data-title') || el.querySelector('h4')?.textContent;
    const desc = el.querySelector('p')?.textContent || '';
    const tags = el.getAttribute('data-tags') || '';
    const repo = el.getAttribute('data-repo') || '#';
    const demo = el.getAttribute('data-demo') || '';
    $('#modalTitle').textContent = title;
    $('#modalContent').textContent = desc + ' — More technical details, architecture diagrams, and links can be added here.';
    $('#modalMeta').textContent = 'Tags: ' + tags.split(' ').join(', ');
    // set repo and demo links from data attributes
    $('#modalRepo').href = repo;
    $('#modalDemo').href = demo;
    // hide demo button if no demo link available
    $('#modalDemo').style.display = demo && demo !== '#' ? '' : 'none';
    modal.style.display = 'flex';
}
closeModal.addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none' });

// Contact form — uses mailto (no backend)
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const msg = $('#message').value.trim();
    const to = 'your-email@example.com'; // <<< change this
    const subject = encodeURIComponent(`Portfolio contact from ${name || email}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    // open default mail client
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

// Accessibility: allow escape to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.style.display = 'none';
});
