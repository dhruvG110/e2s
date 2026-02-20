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
  const fromTop = Math.random() > 0.5;

  // 45° from top (↘), 135° from bottom (↗)
  const baseAngle = fromTop
    ? Math.PI / 4            // 45°
    : (3 * Math.PI) / 4;    // 135°

  const angle = baseAngle + (Math.random() - 0.5) * 0.25; // small natural variation

  return {
    x: Math.random() * canvas.width,
    y: fromTop
      ? -40 - Math.random() * 120
      : canvas.height + 40 + Math.random() * 120,
    length: 50 + Math.random() * 90,
    speed: 4 + Math.random() * 4,
    opacity: 0,
    hue: Math.random() > 0.5 ? 25 : 270,
    angle,
    life: 0,
    maxLife: 70 + Math.random() * 90,
  };
};
    // Initial burst
    for (let i = 0; i < 14; i++) {
      const m = createMeteor();
      m.life = Math.random() * m.maxLife;
      meteors.push(m);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn rate ↑↑
      if (Math.random() < 0.08 && meteors.length < 18) {
        meteors.push(createMeteor());
      }

      meteors = meteors.filter((m) => m.life < m.maxLife);

      meteors.forEach((m) => {
        m.life++;

        const progress = m.life / m.maxLife;

        // Smooth fade in / out
        if (progress < 0.15) m.opacity = progress / 0.15;
        else if (progress > 0.7) m.opacity = (1 - progress) / 0.3;
        else m.opacity = 1;

        m.opacity *= 0.45;

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        // Gradient tail
        const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        gradient.addColorStop(0, `hsla(${m.hue}, 90%, 65%, 0)`);
        gradient.addColorStop(
          1,
          `hsla(${m.hue}, 90%, 65%, ${m.opacity})`,
        );

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${m.hue}, 90%, 75%, ${m.opacity})`;
        ctx.shadowColor = `hsla(${m.hue}, 90%, 65%, ${m.opacity})`;
        ctx.shadowBlur = 12;
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
      style={{ opacity: 0.75 }}
    />
  );
}