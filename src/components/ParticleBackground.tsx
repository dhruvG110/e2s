import { useEffect, useRef } from "react";

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  hue: number;
  angle: number;
  life: number;
  maxLife: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let meteors: Meteor[] = [];
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isSmallScreen = window.innerWidth < 768;
    const maxMeteors = prefersReducedMotion ? 0 : isSmallScreen ? 8 : 14;
    const spawnChance = isSmallScreen ? 0.035 : 0.06;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createMeteor = (): Meteor => {
      const baseAngle = Math.PI / 4;
      const angle = baseAngle + (Math.random() - 0.5) * 0.25;

      return {
        x: Math.random() * canvas.width,
        y: -40 - Math.random() * 120,
        length: 50 + Math.random() * 90,
        speed: 4 + Math.random() * 4,
        opacity: 0,
        hue: Math.random() > 0.5 ? 18 : 38,
        angle,
        life: 0,
        maxLife: 70 + Math.random() * 90,
      };
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < Math.min(10, maxMeteors); i++) {
      const meteor = createMeteor();
      meteor.life = Math.random() * meteor.maxLife;
      meteors.push(meteor);
    }

    const draw = (time = 0) => {
      animId = requestAnimationFrame(draw);

      if (document.hidden || prefersReducedMotion) {
        return;
      }

      if (time - lastFrameTime < frameInterval) {
        return;
      }
      lastFrameTime = time;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (Math.random() < spawnChance && meteors.length < maxMeteors) {
        meteors.push(createMeteor());
      }

      meteors = meteors.filter((meteor) => meteor.life < meteor.maxLife);

      meteors.forEach((meteor) => {
        meteor.life += 1;

        const progress = meteor.life / meteor.maxLife;

        if (progress < 0.15) meteor.opacity = progress / 0.15;
        else if (progress > 0.7) meteor.opacity = (1 - progress) / 0.3;
        else meteor.opacity = 1;

        meteor.opacity *= 0.45;

        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        const gradient = ctx.createLinearGradient(
          tailX,
          tailY,
          meteor.x,
          meteor.y,
        );
        gradient.addColorStop(0, `hsla(${meteor.hue}, 90%, 65%, 0)`);
        gradient.addColorStop(
          1,
          `hsla(${meteor.hue}, 90%, 65%, ${meteor.opacity})`,
        );

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${meteor.hue}, 90%, 75%, ${meteor.opacity})`;
        ctx.shadowColor = `hsla(${meteor.hue}, 90%, 65%, ${meteor.opacity})`;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.32 }}
    />
  );
}
