import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color?: string;
}

export const AudioVisualizer = ({ isPlaying, color = 'hsl(var(--primary))' }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
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

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color.replace(')', ', 0.3)').replace('hsl', 'hsla'));

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
  }, [isPlaying, color]);

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
