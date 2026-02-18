import { useEffect, useRef } from 'react';

export default function RotatingText({ text = 'SCROLL DOWN · EXPLORE · ', radius = 50 }) {
    const svgRef = useRef(null);

    useEffect(() => {
        let frame;
        let angle = 0;
        const svg = svgRef.current;
        if (!svg) return;

        const animate = () => {
            angle += 0.3;
            svg.style.transform = `rotate(${angle}deg)`;
            frame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frame);
    }, []);

    const chars = text.split('');
    const total = chars.length;
    const angleStep = 360 / total;
    const size = radius * 2 + 20;

    return (
        <div className="rotating-ring">
            <svg
                ref={svgRef}
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ display: 'block' }}
            >
                {chars.map((char, i) => {
                    const a = (i * angleStep - 90) * (Math.PI / 180);
                    const x = size / 2 + radius * Math.cos(a);
                    const y = size / 2 + radius * Math.sin(a);
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${i * angleStep}, ${x}, ${y})`}
                            style={{
                                fontSize: '8px',
                                fill: 'rgba(240,240,240,0.35)',
                                fontFamily: 'Inter, sans-serif',
                                letterSpacing: '0.1em',
                            }}
                        >
                            {char}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
