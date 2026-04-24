import { useEffect, useRef } from "react";

export default function Confetti({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#c8a84b", "#4a7c59", "#4a90d9", "#8b0000", "#fff", "#ffd700", "#ff6b6b", "#6bcaff"];
    const pts = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 7 + 3,
      d: Math.random() * 150,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: 0,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      speed: Math.random() * 3 + 1,
    }));
    let angle = 0, raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;
      pts.forEach(p => {
        p.tiltAngle += p.tiltSpeed;
        p.y += p.speed;
        p.x += Math.sin(angle + p.d) * 1.5;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        if (p.y > canvas.height + 20) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 6000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }}
    />
  );
}
