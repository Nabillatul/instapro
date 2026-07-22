"use client";

import { motion } from "framer-motion";

const connections = [
  { from: { x: 200, y: 150 }, to: { x: 400, y: 100 } },
  { from: { x: 400, y: 100 }, to: { x: 600, y: 180 } },
  { from: { x: 600, y: 180 }, to: { x: 800, y: 200 } },
  { from: { x: 500, y: 350 }, to: { x: 600, y: 180 } },
  { from: { x: 500, y: 350 }, to: { x: 350, y: 480 } },
  { from: { x: 200, y: 150 }, to: { x: 500, y: 350 } },
  { from: { x: 350, y: 480 }, to: { x: 200, y: 150 } },
  { from: { x: 800, y: 200 }, to: { x: 500, y: 350 } },
];

const nodes = [
  { x: 200, y: 150, label: "Institusi", delay: 0.2, color: "text-navy-500" },
  { x: 400, y: 100, label: "Tata Kelola", delay: 0.4, color: "text-brand-500" },
  { x: 600, y: 180, label: "Sistem Digital", delay: 0.6, color: "text-navy-500" },
  { x: 800, y: 200, label: "Desa Mandiri", delay: 0.8, color: "text-brand-500" },
  { x: 500, y: 350, label: "Organisasi", delay: 1.0, color: "text-navy-500" },
  { x: 350, y: 480, label: "Kapasitas SDM", delay: 1.2, color: "text-brand-500" },
];

export default function NodeNetwork() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="w-full h-full opacity-[0.25]"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Connecting Lines */}
        {connections.map((conn, idx) => (
          <motion.line
            key={idx}
            x1={conn.from.x}
            y1={conn.from.y}
            x2={conn.to.x}
            y2={conn.to.y}
            stroke="#4A151D"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              delay: idx * 0.1,
            }}
          />
        ))}

        {/* Dynamic Nodes and Text Labels */}
        {nodes.map((node, idx) => (
          <g key={idx}>
            {/* Outer animated ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="10"
              fill="none"
              stroke={node.color.includes("brand") ? "#D0264C" : "#4A151D"}
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: node.delay,
              }}
            />
            {/* Inner solid node dot */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="5"
              fill={node.color.includes("brand") ? "#D0264C" : "#4A151D"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                delay: node.delay,
              }}
            />
            {/* Node label text */}
            <motion.text
              x={node.x}
              y={node.y + 24}
              textAnchor="middle"
              className="text-[11px] font-bold fill-navy-500 font-sans tracking-wide uppercase"
              initial={{ opacity: 0, y: node.y + 30 }}
              animate={{ opacity: 0.75, y: node.y + 24 }}
              transition={{
                duration: 0.6,
                delay: node.delay + 0.2,
              }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
}
