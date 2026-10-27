import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';

export interface RoadmapPoint {
  x: number;
  y: number;
}

interface ConnectingRoadmapProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.RefObject<(HTMLElement | null)[]>;
  completedCount: number; // number of completed lessons (0 to 5)
}

function getBezierPoint(
  p0: RoadmapPoint,
  cp1: RoadmapPoint,
  cp2: RoadmapPoint,
  p1: RoadmapPoint,
  t: number
): RoadmapPoint {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const a = mt2 * mt;
  const b = 3 * mt2 * t;
  const c = 3 * mt * t2;
  const d = t2 * t;
  return {
    x: a * p0.x + b * cp1.x + c * cp2.x + d * p1.x,
    y: a * p0.y + b * cp1.y + c * cp2.y + d * p1.y,
  };
}

export const ConnectingRoadmap: React.FC<ConnectingRoadmapProps> = ({
  containerRef,
  itemRefs,
  completedCount,
}) => {
  const [points, setPoints] = useState<RoadmapPoint[]>([]);

  const measurePositions = useCallback(() => {
    if (!containerRef.current || !itemRefs.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const newPoints: RoadmapPoint[] = [];

    itemRefs.current.forEach((el) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        // Calculate center of element relative to container
        const x = rect.left + rect.width / 2 - parentRect.left;
        const y = rect.top + rect.height / 2 - parentRect.top;
        newPoints.push({ x, y });
      }
    });

    if (newPoints.length >= 2) {
      setPoints(newPoints);
    }
  }, [containerRef, itemRefs]);

  useLayoutEffect(() => {
    measurePositions();
  }, [measurePositions]);

  useEffect(() => {
    measurePositions();

    const handleResize = () => {
      measurePositions();
    };

    window.addEventListener('resize', handleResize);

    // Also observe container size changes
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(() => {
        measurePositions();
      });
      observer.observe(containerRef.current);
    }

    // Small delay to ensure children layout is settled
    const timer = setTimeout(measurePositions, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      clearTimeout(timer);
    };
  }, [measurePositions, containerRef]);

  if (points.length < 2) {
    return null;
  }

  // Generate Bezier segment data
  interface Segment {
    p0: RoadmapPoint;
    p1: RoadmapPoint;
    cp1: RoadmapPoint;
    cp2: RoadmapPoint;
    d: string;
    isCompleted: boolean;
    stones: { x: number; y: number; isCompleted: boolean }[];
  }

  // Mapping checkpoint index to whether that segment is completed
  // Checkpoint indexes:
  // 0: Lesson 1
  // 1: Lesson 2
  // 2: Mid Chest
  // 3: Lesson 3
  // 4: Lesson 4
  // 5: Lesson 5
  // 6: Boss Chest
  const isSegmentCompleted = (segIdx: number): boolean => {
    if (segIdx === 0) return completedCount >= 1; // from lesson 1 to lesson 2
    if (segIdx === 1) return completedCount >= 2; // from lesson 2 to mid chest
    if (segIdx === 2) return completedCount >= 2; // from mid chest to lesson 3
    if (segIdx === 3) return completedCount >= 3; // from lesson 3 to lesson 4
    if (segIdx === 4) return completedCount >= 4; // from lesson 4 to lesson 5
    if (segIdx === 5) return completedCount >= 5; // from lesson 5 to trophy boss chest
    return false;
  };

  const segments: Segment[] = [];
  let fullPathD = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dy = p1.y - p0.y;
    const cp1 = { x: p0.x, y: p0.y + dy * 0.5 };
    const cp2 = { x: p1.x, y: p1.y - dy * 0.5 };
    const d = `M ${p0.x} ${p0.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p1.x} ${p1.y}`;
    fullPathD += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p1.x} ${p1.y}`;

    const segCompleted = isSegmentCompleted(i);

    // 3 stepping stones along each segment curve
    const stones = [0.26, 0.5, 0.74].map((t) => {
      const pt = getBezierPoint(p0, cp1, cp2, p1, t);
      return {
        x: pt.x,
        y: pt.y,
        isCompleted: segCompleted,
      };
    });

    segments.push({
      p0,
      p1,
      cp1,
      cp2,
      d,
      isCompleted: segCompleted,
      stones,
    });
  }

  // Active path up to the active completed segments
  const activeSegments = segments.filter((s) => s.isCompleted);
  const activePathD = activeSegments.map((s) => s.d).join(' ');

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        {/* Glow effect for completed active path */}
        <filter id="activeRoadGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#1cb0f6" floodOpacity="0.7" />
        </filter>

        {/* Gradient for vibrant active learning trail */}
        <linearGradient id="activeTrailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#1cb0f6" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Gradient for base road bed */}
        <linearGradient id="baseRoadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#162a52" />
          <stop offset="50%" stopColor="#122345" />
          <stop offset="100%" stopColor="#0f1d3a" />
        </linearGradient>
      </defs>

      {/* 1. Road Bed Deep Shadow / Underlayer */}
      <path
        d={fullPathD}
        fill="none"
        stroke="#070e1c"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* 2. Main Road Bed */}
      <path
        d={fullPathD}
        fill="none"
        stroke="url(#baseRoadGradient)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Road Bed Inner Trim Border */}
      <path
        d={fullPathD}
        fill="none"
        stroke="#1c3769"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. Road Centerline Guides (Dotted Trail) */}
      <path
        d={fullPathD}
        fill="none"
        stroke="#274d8f"
        strokeWidth="3.5"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />

      {/* 5. Active Mastered Learning Trail (if any segments completed) */}
      {activePathD && (
        <>
          <path
            d={activePathD}
            fill="none"
            stroke="url(#activeTrailGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#activeRoadGlow)"
          />
          <path
            d={activePathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
            opacity="0.85"
          />
        </>
      )}

      {/* 6. Stepping Stone Pavers Along the Trail */}
      {segments.map((seg, sIdx) => (
        <g key={`seg-stones-${sIdx}`}>
          {seg.stones.map((st, pIdx) => (
            <g key={`stone-${sIdx}-${pIdx}`}>
              {/* Stepping stone shadow */}
              <circle
                cx={st.x}
                cy={st.y + 1.5}
                r="6.5"
                fill="#070e1c"
                opacity="0.6"
              />
              {/* Stepping stone body */}
              <circle
                cx={st.x}
                cy={st.y}
                r="5.5"
                fill={st.isCompleted ? '#38bdf8' : '#172f5c'}
                stroke={st.isCompleted ? '#ffffff' : '#274b88'}
                strokeWidth={st.isCompleted ? '1.5' : '1.5'}
              />
              {/* Inner highlight */}
              <circle
                cx={st.x - 1}
                cy={st.y - 1}
                r="2"
                fill={st.isCompleted ? '#ffffff' : '#2e5699'}
                opacity={st.isCompleted ? '0.8' : '0.4'}
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
};
