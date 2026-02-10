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

    let animId: number;
    let meteors: Meteor[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createMeteor = (): Meteor => {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45deg with slight variation
      return {
        x: Math.random() * canvas.width * 1.2,
        y: -20 - Math.random() * 100,
        length: 40 + Math.random() * 80,
        speed: 1.5 + Math.random() * 2,
        opacity: 0,
        hue: Math.random() > 0.5 ? 270 : 330,
        angle,
        life: 0,
        maxLife: 120 + Math.random() * 180,
      };
    };

    // Start with a few
    for (let i = 0; i < 3; i++) {
      const m = createMeteor();
      m.life = Math.random() * m.maxLife * 0.5;
      meteors.push(m);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new meteors occasionally
      if (Math.random() < 0.012 && meteors.length < 6) {
        meteors.push(createMeteor());
      }

      meteors = meteors.filter((m) => m.life < m.maxLife);

      meteors.forEach((m) => {
        m.life++;
        // Fade in then fade out
        const progress = m.life / m.maxLife;
        if (progress < 0.1) {
          m.opacity = progress / 0.1;
        } else if (progress > 0.7) {
          m.opacity = (1 - progress) / 0.3;
        } else {
          m.opacity = 1;
        }
        m.opacity *= 0.35;

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        // Glow
        const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        gradient.addColorStop(0, `hsla(${m.hue}, 80%, 65%, 0)`);
        gradient.addColorStop(1, `hsla(${m.hue}, 80%, 65%, ${m.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${m.hue}, 80%, 75%, ${m.opacity * 0.8})`;
        ctx.shadowColor = `hsla(${m.hue}, 80%, 65%, ${m.opacity})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
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
      style={{ opacity: 0.7 }}
    />
  );
}
