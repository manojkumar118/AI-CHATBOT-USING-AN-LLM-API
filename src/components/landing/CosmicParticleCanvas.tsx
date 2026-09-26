import React, { useEffect, useRef } from 'react';

interface CosmicParticleCanvasProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
}

export const CosmicParticleCanvas: React.FC<CosmicParticleCanvasProps> = ({
  className = '',
  intensity = 'vibrant',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate cosmic particle field
    const particleCount = intensity === 'vibrant' ? 120 : 60;
    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      radius: number;
      speed: number;
      angle: number;
      color: string;
      alpha: number;
      phase: number;
    }

    const particles: Particle[] = [];
    const colors = [
      '#38BDF8', // Cyan
      '#818CF8', // Indigo
      '#C084FC', // Violet
      '#60A5FA', // Sky Blue
      '#F472B6', // Soft Pink
    ];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: Math.random() * 2.2 + 0.6,
        speed: Math.random() * 0.4 + 0.15,
        angle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Nebula Wave Points
    const wavePoints = 48;
    let time = 0;

    const render = () => {
      time += 0.012;
      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing ambient nebula background gradients
      const gradCenterY = height * 0.58 + (mouseY - height / 2) * 0.08;
      const gradCenterX = width * 0.5 + (mouseX - width / 2) * 0.08;

      const radialGrad = ctx.createRadialGradient(
        gradCenterX,
        gradCenterY,
        40,
        gradCenterX,
        gradCenterY,
        width * 0.6
      );
      radialGrad.addColorStop(0, 'rgba(99, 102, 241, 0.16)');
      radialGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.09)');
      radialGrad.addColorStop(0.7, 'rgba(192, 132, 252, 0.04)');
      radialGrad.addColorStop(1, 'rgba(7, 7, 9, 0)');

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw organic fluid nebula wave lines (matching video)
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const waveBaseY = height * 0.62 + w * 28;
        const waveColor =
          w === 0
            ? 'rgba(56, 189, 248, 0.32)'
            : w === 1
            ? 'rgba(129, 140, 248, 0.28)'
            : 'rgba(192, 132, 252, 0.22)';

        ctx.strokeStyle = waveColor;
        ctx.lineWidth = w === 0 ? 2 : 1.5;

        for (let i = 0; i <= wavePoints; i++) {
          const x = (width / wavePoints) * i;
          const distFromMouse = Math.abs(x - mouseX);
          const mouseLift = Math.max(0, 1 - distFromMouse / 300) * 35;
          const y =
            waveBaseY +
            Math.sin(i * 0.22 + time * 1.5 + w) * 22 +
            Math.cos(i * 0.12 - time * 0.8) * 16 -
            mouseLift;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 3. Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += 0.008 * p.speed;
        p.phase += 0.02;

        const oscillation = Math.sin(p.phase) * 12;
        p.x = p.baseX + Math.cos(p.angle) * 24 + (mouseX - width / 2) * 0.04;
        p.y = p.baseY + Math.sin(p.angle) * 18 + oscillation + (mouseY - height / 2) * 0.04;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.fill();

        // Subtle glow on larger particles
        if (p.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.15;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
