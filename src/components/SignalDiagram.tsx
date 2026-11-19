"use client";

import type { DiagramNode, DiagramSpec } from "@/types/project";

interface SignalDiagramProps {
  diagram: DiagramSpec;
  accent: string;
  faultActive: boolean;
  statusNote: string;
  onToggleFault?: () => void;
}

function edgePath(from: DiagramNode, to: DiagramNode, idx: number): string {
  const isHorizontal = Math.abs(from.y - to.y) < 4;
  const isVertical = Math.abs(from.x - to.x) < 4;
  if (isHorizontal || isVertical) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  const offset = idx % 2 === 0 ? 18 : -18;
  const cx = (from.x + to.x) / 2 + offset;
  const cy = (from.y + to.y) / 2 - offset;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

export default function SignalDiagram({
  diagram,
  accent,
  faultActive,
  statusNote,
  onToggleFault,
}: SignalDiagramProps) {
  const nodeMap = new Map(diagram.nodes.map((node) => [node.id, node]));
  const activeMode = faultActive ? "fault" : "normal";

  return (
    <div className="diagram-card">
      <div className="diagram-head">
        <span className="mono">{diagram.title}</span>
        <span className={`diagram-state ${faultActive ? "is-fault" : "is-normal"}`}>
          {faultActive ? "Ruta de falla / defensa" : "Flujo nominal"}
        </span>
      </div>

      <svg
        className="diagram-svg"
        viewBox="0 0 420 220"
        role="img"
        aria-label={`${diagram.title}: ${faultActive ? diagram.faultCaption : diagram.normalCaption}`}
      >
        <defs>
          <pattern id="diag-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#d4d4d8" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="420" height="220" fill="url(#diag-dots)" />

        {diagram.edges.map((edge, idx) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) {
            return null;
          }
          const isActive = edge.mode === activeMode;
          const d = edgePath(from, to, idx);
          const stroke = isActive ? (faultActive ? "#b45309" : accent) : "#d4d4d8";
          const isVertical = Math.abs(from.x - to.x) < 4;
          const midX = (from.x + to.x) / 2 + (isVertical ? (from.x > 210 ? -42 : 42) : 0);
          const midY = (from.y + to.y) / 2 + (isVertical ? 4 : -8);

          return (
            <g key={`${edge.from}-${edge.to}-${edge.mode}`}>
              <path d={d} className="diag-edge-base" />
              {isActive ? (
                <>
                  <path d={d} className="diag-edge-active" stroke={stroke} />
                  <path
                    d={d}
                    className="diag-pulse"
                    pathLength={100}
                    stroke={stroke}
                  />
                </>
              ) : null}
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="var(--f-mono)"
                paintOrder="stroke"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinejoin="round"
                fill={isActive ? stroke : "#71717a"}
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {diagram.nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x - 62}
              y={node.y - 23}
              width="124"
              height="46"
              rx="2"
              className={`diag-node-rect ${node.kind === "guard" ? "is-guard" : ""}`}
              style={
                faultActive && node.kind === "guard"
                  ? { stroke: "#b45309", strokeWidth: 2 }
                  : undefined
              }
            />
            <text
              x={node.x}
              y={node.y - 4}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="var(--f-display)"
              fill="#0a0a0a"
            >
              {node.label}
            </text>
            <text
              x={node.x}
              y={node.y + 12}
              textAnchor="middle"
              fontSize="9.5"
              fontFamily="var(--f-mono)"
              fill="#52525b"
            >
              {node.sub}
            </text>
          </g>
        ))}
      </svg>

      <p className="diag-caption">{statusNote}</p>
      {onToggleFault ? (
        <div className="hero-actions" style={{ marginTop: 10 }}>
          <button type="button" className="pulse-ping-btn" onClick={onToggleFault}>
            {faultActive ? "Volver a ruta nominal" : "Probar ruta de falla"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
