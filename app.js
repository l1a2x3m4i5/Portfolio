const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

document.querySelectorAll('.fade').forEach(el => observer.observe(el));

document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.repo-toggle');
  if (!btn) return;

 
  e.preventDefault();
  e.stopPropagation();

  const project = btn.closest('article') || btn.closest('.project');
  if (!project) return;

  const repo = project.dataset && project.dataset.repo;
  const panel = project.querySelector('.repo-panel');
  const link = panel && panel.querySelector('.repo-link');

 
  document.querySelectorAll('.repo-panel.open').forEach(p => {
    if (p !== panel) {
      p.classList.remove('open');
      p.setAttribute('aria-hidden', 'true');
    }
  });

  if (!panel || !link) return;

  if (repo) {
    // store repo on the link but don't set href to avoid automatic navigation
    link.dataset.repo = repo;
    panel.classList.toggle('open');
    const isOpen = panel.classList.contains('open');
    panel.setAttribute('aria-hidden', String(!isOpen));
  } else {
    delete link.dataset.repo;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
});

// Open repository only when the repository link is explicitly clicked.
document.addEventListener('click', (e) => {
  const repoLink = e.target.closest && e.target.closest('.repo-link');
  if (!repoLink) return;
  e.preventDefault();
  e.stopPropagation();
  const repo = repoLink.dataset && repoLink.dataset.repo;
  if (repo) {
    window.open(repo, '_blank', 'noopener');
    // close the panel immediately after opening the repo
    const panel = repoLink.closest('.repo-panel');
    if (panel) {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    }
    // remove stored repo to avoid stale data
    delete repoLink.dataset.repo;
  }
});
