import { Center, ContactShadows, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Gerobak({ position, rotation, scale }: any) {
    const woodColor = "#2A2631";
    const accentColor = "#99FF33";
    const wheelColor = "#111111";
    
    const groupRef = useRef<THREE.Group>(null);
    const wheelsRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        // Smooth forward and backward looping motion on X axis only
        const move = Math.sin(t * 1.2) * 0.3;
        groupRef.current.position.x = position[0] + move;
        
        if (wheelsRef.current) {
            // Wheels rotate based on movement
            wheelsRef.current.rotation.z = -move * 1.5;
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            {/* Main Body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3, 1.5, 1.5]} />
                <meshStandardMaterial color={woodColor} roughness={0.8} />
            </mesh>

            {/* Top Display Area */}
            <mesh position={[0, 1.25, 0.25]}>
                <boxGeometry args={[2.8, 1, 1]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.1} roughness={0.1} />
            </mesh>
            
            {/* Display Frame / Pillars */}
            <mesh position={[-1.35, 1.25, 0.7]}><boxGeometry args={[0.1, 1, 0.1]} /><meshStandardMaterial color={woodColor} /></mesh>
            <mesh position={[1.35, 1.25, 0.7]}><boxGeometry args={[0.1, 1, 0.1]} /><meshStandardMaterial color={woodColor} /></mesh>
            <mesh position={[-1.35, 1.25, -0.2]}><boxGeometry args={[0.1, 1, 0.1]} /><meshStandardMaterial color={woodColor} /></mesh>
            <mesh position={[1.35, 1.25, -0.2]}><boxGeometry args={[0.1, 1, 0.1]} /><meshStandardMaterial color={woodColor} /></mesh>

            {/* Roof / Awning with Accent Trim all around */}
            <group position={[0, 1.8, 0.25]} rotation={[-0.1, 0, 0]}>
                <mesh>
                    <boxGeometry args={[3.2, 0.1, 1.6]} />
                    <meshStandardMaterial color={woodColor} roughness={0.9} />
                </mesh>
                {/* Accents around the edges */}
                <mesh position={[0, 0.01, 0.8]}><boxGeometry args={[3.2, 0.12, 0.1]} /><meshStandardMaterial color={accentColor} /></mesh>
                <mesh position={[0, 0.01, -0.8]}><boxGeometry args={[3.2, 0.12, 0.1]} /><meshStandardMaterial color={accentColor} /></mesh>
                <mesh position={[-1.55, 0.01, 0]}><boxGeometry args={[0.1, 0.12, 1.5]} /><meshStandardMaterial color={accentColor} /></mesh>
                <mesh position={[1.55, 0.01, 0]}><boxGeometry args={[0.1, 0.12, 1.5]} /><meshStandardMaterial color={accentColor} /></mesh>
            </group>

            {/* Wheels Group */}
            <group ref={wheelsRef} position={[0, -0.8, 0]}>
                {/* Wheels */}
                <mesh position={[-1, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                    <meshStandardMaterial color={wheelColor} roughness={0.9} />
                </mesh>
                <mesh position={[1, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                    <meshStandardMaterial color={wheelColor} roughness={0.9} />
                </mesh>
                <mesh position={[-1, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                    <meshStandardMaterial color={wheelColor} roughness={0.9} />
                </mesh>
                <mesh position={[1, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
                    <meshStandardMaterial color={wheelColor} roughness={0.9} />
                </mesh>
                
                {/* Wheel Axles */}
                <mesh position={[-1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
                    <meshStandardMaterial color="#555555" roughness={0.5} metalness={0.8} />
                </mesh>
                <mesh position={[1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
                    <meshStandardMaterial color="#555555" roughness={0.5} metalness={0.8} />
                </mesh>
            </group>

            {/* Handle to push */}
            <mesh position={[-1.6, 0.2, 0]}>
                <boxGeometry args={[0.2, 0.1, 1.2]} />
                <meshStandardMaterial color={woodColor} roughness={0.8} />
            </mesh>

            {/* Glowing Hanging Lamp */}
            <group position={[0, 1.5, 0.8]}>
                <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                <mesh position={[0, -0.05, 0]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={2} />
                </mesh>
                <pointLight color={accentColor} intensity={0.5} distance={3} />
            </group>

            {/* Products in display */}
            <mesh position={[-0.8, 0.9, 0.4]}><boxGeometry args={[0.4, 0.3, 0.4]} /><meshStandardMaterial color="#dddddd" /></mesh>
            <mesh position={[-0.2, 0.85, 0.2]}><cylinderGeometry args={[0.15, 0.15, 0.2, 16]} /><meshStandardMaterial color={accentColor} /></mesh>
            <mesh position={[0.5, 0.95, 0.5]}><boxGeometry args={[0.3, 0.4, 0.3]} /><meshStandardMaterial color="#888888" /></mesh>
            <mesh position={[1.0, 0.85, 0.3]}><boxGeometry args={[0.2, 0.2, 0.2]} /><meshStandardMaterial color={accentColor} /></mesh>
        </group>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VendorCharacter({ position, rotation, scale }: any) {
    const headRef = useRef<THREE.Mesh>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        
        // Confused looking around animation
        if (headRef.current) {
            headRef.current.rotation.y = Math.sin(t * 1.5) * 0.5;
            headRef.current.rotation.z = Math.sin(t * 2) * 0.1;
        }

        // Scratching head animation
        if (rightArmRef.current) {
            // Oscillate arm up and down slowly near the head
            rightArmRef.current.rotation.z = 2.5 + Math.sin(t * 3) * 0.2;
            rightArmRef.current.rotation.x = -0.5;
        }
    });

    // We align the vendor character so local y=0 is exactly at the bottom of the feet.
    // The cylinder legs are 0.7 height. So their center is at 0.35.
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Body */}
            <mesh position={[0, 1.05, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 1.4, 16]} />
                <meshStandardMaterial color="#333333" roughness={0.8} />
            </mesh>
            
            {/* Head */}
            <mesh ref={headRef} position={[0, 1.95, 0]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#ffccaa" roughness={0.6} />
                {/* Traditional Hat (Peci/Cap) */}
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.26, 0.26, 0.15, 16]} />
                    <meshStandardMaterial color="#111111" roughness={0.9} />
                </mesh>
            </mesh>

            {/* Left Arm (Resting) */}
            <group position={[0.4, 1.55, 0]} rotation={[0, 0, -0.3]}>
                <mesh position={[0, -0.35, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
                    <meshStandardMaterial color="#333333" roughness={0.8} />
                </mesh>
            </group>

            {/* Right Arm (Scratching Head) */}
            <group ref={rightArmRef} position={[-0.4, 1.55, 0]}>
                <mesh position={[0, -0.35, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
                    <meshStandardMaterial color="#333333" roughness={0.8} />
                </mesh>
            </group>

            {/* Legs (bottom is at y=0) */}
            <mesh position={[-0.15, 0.35, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
                <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
            <mesh position={[0.15, 0.35, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.7, 8]} />
                <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
        </group>
    );
}

// A simple ground line to anchor the scene
function GroundLine({ y }: { y: number }) {
    return (
        <group position={[0, y, 0]}>
            <mesh position={[0, 0, 0.5]}>
                <boxGeometry args={[15, 0.02, 0.1]} />
                <meshStandardMaterial color="#99FF33" roughness={0.5} transparent opacity={0.3} />
            </mesh>
            {/* Subtle secondary line */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[20, 0.01, 2]} />
                <meshStandardMaterial color="#222222" roughness={1} />
            </mesh>
        </group>
    );
}

export default function Scene() {
    // The cart's wheel radius is 0.5, and they are positioned at y=-0.8 locally. 
    // This means the bottom of the cart in local space is at y = -1.3.
    // If the cart is scaled by 1.2, its bottom in world space is y = -1.3 * 1.2 = -1.56.
    const groundLevel = -1.56;

    return (
        <>
            <color attach="background" args={['#1E1B26']} />
            
            {/* Soft Ambient Lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#99FF33" />
            
            <Environment preset="city" />

            {/* Entire scene is moved slightly higher to avoid overlapping text UI */}
            <group position={[0, 1.2, 0]}>
                <Center position={[0, 0, 0]} disableY>
                    <group position={[0, 0, 0]}>
                        <Gerobak position={[0, 0, 0]} rotation={[0.2, -0.4, 0]} scale={1.2} />
                        {/* Align vendor's feet exactly on the ground level */}
                        <VendorCharacter position={[-3, groundLevel, -0.5]} rotation={[0, 0.5, 0]} scale={1.2} />
                    </group>
                </Center>

                {/* Ground plane/lines to anchor the objects */}
                <GroundLine y={groundLevel} />

                {/* Soft Ground Shadow right at the ground level */}
                <ContactShadows 
                    position={[0, groundLevel, 0]} 
                    opacity={0.6} 
                    scale={15} 
                    blur={2.5} 
                    far={4.5} 
                    color="#000000" 
                />
            </group>
        </>
    );
}
