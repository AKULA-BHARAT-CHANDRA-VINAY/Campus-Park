import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const gridConfig = {
      size: 30,
      lineColor: 'rgba(6, 182, 212, 0.1)',
      glowColor: 'rgba(6, 182, 212, 0.05)',
    };
    
    let animationFrameId: number;

    const drawGrid = () => {
        if(!ctx) return;
        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = gridConfig.lineColor;
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= width; x += gridConfig.size) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y += gridConfig.size) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    };

    const drawGlows = () => {
        if(!ctx) return;
        const time = Date.now() * 0.0005;
        const glowCount = Math.floor( (width * height) / 100000); // Responsive glow count

        for(let i=0; i< glowCount; i++) {
            const x = (Math.sin(time + i * 2.1) + 1) * 0.5 * width;
            const y = (Math.cos(time + i * 1.5) + 1) * 0.5 * height;
            const radius = Math.sin(time + i) * 100 + 150;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, gridConfig.glowColor);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
    }


    const animate = () => {
      drawGrid();
      drawGlows();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default AnimatedBackground;
