import { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color?: string;
}

export const AudioVisualizer = ({ isPlaying, color = 'hsl(var(--primary))' }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [computedColor, setComputedColor] = useState<string>('');

  // Resolve CSS variable to actual color
  useEffect(() => {
    if (color.includes('var(')) {
      // Get computed color from CSS variable
      const tempDiv = document.createElement('div');
      tempDiv.style.color = color;
      document.body.appendChild(tempDiv);
      const computed = window.getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      setComputedColor(computed);
    } else {
      setComputedColor(color);
    }
  }, [color]);

  useEffect(() => {
    if (!computedColor) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bars = 60;
    const barWidth = canvas.width / bars;
    
    let phase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2 + phase;
        const barHeight = isPlaying 
          ? (Math.sin(angle * 3) * 0.3 + Math.sin(angle * 5) * 0.2 + Math.sin(angle * 7) * 0.1 + 0.5) * (canvas.height / 2)
          : 10;

        const x = i * barWidth;
        const y = canvas.height / 2 - barHeight / 2;

        // Create gradient for bars using computed color
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, computedColor);
        
        // Create semi-transparent version for bottom
        const rgbaMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (rgbaMatch) {
          const [, r, g, b] = rgbaMatch;
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.3)`);
        } else {
          gradient.addColorStop(1, computedColor);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

      if (isPlaying) {
        phase += 0.05;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, computedColor]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full h-full"
      />
    </div>
  );
};
