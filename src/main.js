import './style.css'
import { Vortex } from './vortex.js';

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const navLogo = document.getElementById('nav-logo');
const footerLogo = document.getElementById('footer-logo');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Update logos based on initial theme
updateLogos(currentTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Update logos
  updateLogos(newTheme);

  // Update vortex theme
  updateVortexTheme(newTheme);
});

function updateLogos(theme) {
  const logoSrc = theme === 'dark'
    ? '/assets/white-no-bg.png'
    : '/assets/black-no-bg.png';

  if (navLogo) navLogo.src = logoSrc;
  if (footerLogo) footerLogo.src = logoSrc;
}

// Initialize Vortex in Hero Section
let vortexInstance = null;

function updateVortexTheme(theme) {
  if (vortexInstance) {
    vortexInstance.destroy();
  }
  initializeVortex(theme);
}

function initializeVortex(theme = 'light') {
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    vortexInstance = new Vortex(heroSection, {
      isDark: theme === 'dark'
    });
  }
}

// Initialize on page load
initializeVortex(currentTheme);

// Hero content fade-out on scroll
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    // Calculate opacity based on scroll position
    // Fade out completely by the time user scrolls 50% of hero height
    const fadePoint = heroHeight * 0.5;
    const opacity = Math.max(0, 1 - (scrollPosition / fadePoint));

    // Also add slight upward movement for parallax effect
    const translateY = scrollPosition * 0.5;

    heroContent.style.opacity = opacity;
    heroContent.style.transform = `translateY(-${translateY}px)`;
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Code copy functionality
const copyButton = document.querySelector('.code-copy');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const codeBlock = document.querySelector('.code-block code');
    if (codeBlock) {
      const text = codeBlock.textContent;
      try {
        await navigator.clipboard.writeText(text);

        // Visual feedback
        const originalHTML = copyButton.innerHTML;
        copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        copyButton.style.color = '#10B981';

        setTimeout(() => {
          copyButton.innerHTML = originalHTML;
          copyButton.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  });
}

// Intersection Observer for fade-in animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe quick start section
const quickStart = document.querySelector('.quick-start-content');
if (quickStart) {
  quickStart.style.opacity = '0';
  quickStart.style.transform = 'translateY(30px)';
  quickStart.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(quickStart);
}
