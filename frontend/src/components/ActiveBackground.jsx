import React, { useEffect, useRef } from 'react';

const ActiveBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, radius: 150 });
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.density = Math.random() * 30 + 1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        // Floating motion
        this.baseX += this.speedX;
        this.baseY += this.speedY;

        // Wrap around edges
        if (this.baseX > width + 50) this.baseX = -50;
        if (this.baseX < -50) this.baseX = width + 50;
        if (this.baseY > height + 50) this.baseY = -50;
        if (this.baseY < -50) this.baseY = height + 50;

        // Mouse repulsion effect
        const mouse = mouseRef.current;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.baseX;
          const dy = mouse.y - this.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * -1;
          const directionY = forceDirectionY * force * this.density * -1;

          if (distance < mouse.radius) {
            this.x = this.baseX + directionX;
            this.y = this.baseY + directionY;
          } else {
            // Smooth return
            this.x += (this.baseX - this.x) * 0.1;
            this.y += (this.baseY - this.y) * 0.1;
          }
        } else {
          this.x += (this.baseX - this.x) * 0.1;
          this.y += (this.baseY - this.y) * 0.1;
        }

        // Twinkling
        this.currentOpacity = this.opacity + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, this.currentOpacity)})`;
        ctx.fill();
      }
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const numberOfParticles = Math.min((width * height) / 6000, 400);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    // Draw connections between nearby particles
    const drawConnections = () => {
      const particles = particlesRef.current;
      const maxDistance = 120;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Draw mouse glow
    const drawMouseGlow = () => {
      const mouse = mouseRef.current;
      if (mouse.x !== null && mouse.y !== null) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.01)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    // Animation loop
    const animate = (time) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(time);
        particle.draw();
      });

      drawConnections();
      drawMouseGlow();

      animationRef.current = requestAnimationFrame(animate);
    };

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    // Mouse handlers
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Touch handlers for mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Initialize
    canvas.width = width;
    canvas.height = height;
    initParticles();
    animate(0);

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: '#000000',
      }}
    />
  );
};

export default ActiveBackground;
