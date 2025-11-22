/**
 * Sparkles Background Effect
 * Based on Aceternity UI Sparkles
 * https://ui.aceternity.com/components/sparkles
 */

export class Vortex {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.options = {
            isDark: options.isDark || false,
            particleCount: 120,
            minSize: 0.5,
            maxSize: 1.5,
            ...options
        };

        this.particles = [];
        this.animationId = null;

        this.init();
    }

    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';

        this.container.style.position = 'relative';
        this.container.insertBefore(this.canvas, this.container.firstChild);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.createParticles();
        this.animate();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        const { particleCount, minSize, maxSize } = this.options;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: minSize + Math.random() * (maxSize - minSize),
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }

    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;

        // Twinkle effect
        particle.twinklePhase += particle.twinkleSpeed;
    }

    drawParticle(particle) {
        const { ctx } = this;
        const isDark = this.options.isDark;

        // Calculate twinkle opacity
        const twinkle = Math.sin(particle.twinklePhase) * 0.3 + 0.7;
        const finalOpacity = particle.opacity * twinkle;

        // Draw sparkle as a star shape
        ctx.save();
        ctx.translate(particle.x, particle.y);

        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 4);
        if (isDark) {
            gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.8})`);
            gradient.addColorStop(0.3, `rgba(147, 197, 253, ${finalOpacity * 0.4})`);
            gradient.addColorStop(1, 'transparent');
        } else {
            gradient.addColorStop(0, `rgba(37, 99, 235, ${finalOpacity * 0.6})`);
            gradient.addColorStop(0.3, `rgba(59, 130, 246, ${finalOpacity * 0.3})`);
            gradient.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${finalOpacity})`
            : `rgba(37, 99, 235, ${finalOpacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    animate() {
        const { ctx, canvas } = this;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw all particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resize());
    }
}
