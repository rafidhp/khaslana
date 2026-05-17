import { motion } from 'framer-motion';

export default function Illustration() {
    return (
        <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden">
            {/* BACKGROUND GLOW */}
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#99FF33]/10 blur-3xl" />

                <div className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-[#99FF33]/10 blur-2xl" />

                <div className="absolute bottom-[10%] right-[10%] h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            </div>

            {/* GRID */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, white 1px, transparent 1px),
                            linear-gradient(to bottom, white 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <svg
                viewBox="0 0 900 700"
                className="relative z-10 h-full w-full max-w-[800px]"
            >
                {/* FLOATING ELEMENTS */}
                <motion.circle
                    cx="150"
                    cy="120"
                    r="10"
                    fill="#99FF33"
                    opacity="0.5"
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                    }}
                />

                <motion.circle
                    cx="760"
                    cy="180"
                    r="8"
                    fill="white"
                    opacity="0.4"
                    animate={{
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                    }}
                />

                {/* MAIN GLOW */}
                <circle
                    cx="470"
                    cy="330"
                    r="220"
                    fill="#99FF33"
                    opacity="0.08"
                />

                {/* GROUND */}
                <ellipse
                    cx="450"
                    cy="540"
                    rx="300"
                    ry="45"
                    fill="black"
                    opacity="0.25"
                />

                {/* ================= CART ================= */}
                <motion.g
                    initial={{ opacity: 0, x: -40, y: 28 }}
                    animate={{ opacity: 1, x: 0, y: 28 }}
                    transition={{ duration: 1 }}
                >
                    {/* CART SHADOW (Outside floating group so it stays on ground) */}
                    <motion.ellipse
                        cx="500"
                        cy="512"
                        rx="150"
                        ry="24"
                        fill="black"
                        opacity="0.3"
                        animate={{ opacity: [0.3, 0.2, 0.3], scale: [1, 0.97, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    
                    <motion.g
                        animate={{
                            y: [0, -6, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* CART BODY */}
                        <rect
                            x="360"
                            y="270"
                            width="260"
                            height="170"
                            rx="28"
                            fill="#1F1F24"
                        />

                        {/* TOP ROOF */}
                        <path
                            d="
                            M340 220
                            Q490 120 640 220
                            L620 250
                            Q490 170 360 250
                            Z
                            "
                            fill="#24242B"
                        />

                        {/* GREEN ACCENT */}
                        <path
                            d="
                            M350 220
                            Q490 145 630 220
                            "
                            stroke="#99FF33"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />

                        {/* COUNTER */}
                        <rect
                            x="390"
                            y="330"
                            width="180"
                            height="18"
                            rx="10"
                            fill="#99FF33"
                        />

                        {/* ITEMS */}
                        <circle
                            cx="430"
                            cy="300"
                            r="22"
                            fill="#99FF33"
                            opacity="0.9"
                        />

                        <rect
                            x="470"
                            y="275"
                            width="45"
                            height="45"
                            rx="10"
                            fill="white"
                            opacity="0.15"
                        />

                        <circle
                            cx="550"
                            cy="300"
                            r="18"
                            fill="white"
                            opacity="0.2"
                        />

                        {/* WHEELS */}
                        <g>
                            <circle
                                cx="430"
                                cy="470"
                                r="42"
                                fill="#111"
                            />

                            <circle
                                cx="430"
                                cy="470"
                                r="28"
                                fill="#232329"
                            />

                            <circle
                                cx="430"
                                cy="470"
                                r="10"
                                fill="#99FF33"
                            />
                        </g>

                        <g>
                            <circle
                                cx="580"
                                cy="470"
                                r="42"
                                fill="#111"
                            />

                            <circle
                                cx="580"
                                cy="470"
                                r="28"
                                fill="#232329"
                            />

                            <circle
                                cx="580"
                                cy="470"
                                r="10"
                                fill="#99FF33"
                            />
                        </g>

                        {/* LAMP */}
                        <motion.g
                            animate={{
                                rotate: [-4, 4, -4],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            style={{
                                originX: '620px',
                                originY: '230px',
                            }}
                        >
                            <line
                                x1="620"
                                y1="230"
                                x2="620"
                                y2="280"
                                stroke="#666"
                                strokeWidth="3"
                            />

                            <circle
                                cx="620"
                                cy="295"
                                r="16"
                                fill="#99FF33"
                            />

                            <circle
                                cx="620"
                                cy="295"
                                r="35"
                                fill="#99FF33"
                                opacity="0.15"
                            />
                        </motion.g>
                    </motion.g>
                </motion.g>

                {/* ================= CHARACTER ================= */}
                <motion.g
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    {/* SHADOW (Outside floating group) */}
                    <motion.ellipse
                        cx="260"
                        cy="540"
                        rx="60"
                        ry="16"
                        fill="black"
                        opacity="0.25"
                        animate={{ opacity: [0.25, 0.15, 0.25], scale: [1, 0.95, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <motion.g
                        animate={{
                            y: [0, -5, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* LEGS */}
                        <path
                            d="M240 470 L225 540"
                            stroke="#1A1A1A"
                            strokeWidth="18"
                            strokeLinecap="round"
                        />

                        <path
                            d="M280 470 L295 540"
                            stroke="#1A1A1A"
                            strokeWidth="18"
                            strokeLinecap="round"
                        />

                        {/* BODY */}
                        <rect
                            x="215"
                            y="320"
                            width="90"
                            height="150"
                            rx="40"
                            fill="#25252B"
                        />

                        {/* APRON */}
                        <rect
                            x="235"
                            y="360"
                            width="50"
                            height="90"
                            rx="20"
                            fill="#99FF33"
                        />

                        {/* LEFT ARM */}
                        <path
                            d="M220 350 Q170 390 185 440"
                            stroke="#25252B"
                            strokeWidth="18"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* RIGHT ARM */}
                        <motion.path
                            d="M300 350 Q350 310 320 250"
                            stroke="#25252B"
                            strokeWidth="18"
                            strokeLinecap="round"
                            fill="none"
                            animate={{
                                d: [
                                    'M300 350 Q350 310 320 250',
                                    'M300 350 Q360 320 330 240',
                                    'M300 350 Q350 310 320 250',
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                        />

                        {/* HEAD */}
                        <motion.g
                            style={{
                                originX: '260px',
                                originY: '250px',
                            }}
                        >
                            <ellipse
                                cx="260"
                                cy="280"
                                rx="48"
                                ry="52"
                                fill="#FFD7B8"
                            />

                            {/* HAIR / PECI */}
                            <path
                                d="
                                M215 275
                                Q260 210 305 275
                                L300 245
                                Q260 205 220 245
                                Z
                                "
                                fill="#121212"
                            />

                            {/* EYES */}
                            <circle
                                cx="245"
                                cy="285"
                                r="4"
                                fill="#111"
                            />

                            <circle
                                cx="275"
                                cy="285"
                                r="4"
                                fill="#111"
                            />

                            {/* MOUTH */}
                            <path
                                d="M248 308 Q260 318 272 308"
                                stroke="#111"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </motion.g>

                        {/* FLOATING ICON */}
                        <motion.g
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        >
                            <circle
                                cx="350"
                                cy="180"
                                r="28"
                                fill="#99FF33"
                                opacity="0.15"
                            />

                            <text
                                x="340"
                                y="190"
                                fill="#99FF33"
                                fontSize="30"
                                fontWeight="bold"
                            >
                                $
                            </text>
                        </motion.g>
                    </motion.g>
                </motion.g>
            </svg>
        </div>
    );
}