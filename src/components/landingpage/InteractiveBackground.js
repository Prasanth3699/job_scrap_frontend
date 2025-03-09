import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useRef, useState } from "react";

const StarField = (props) => {
  const ref = useRef();
  const [positions] = useState(() => {
    const positions = new Float32Array(5000 * 3); // Proper array size for 5000 points
    return random.inSphere(positions, { radius: 3 }); // Increased radius for better visibility
  });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={positions}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#3B82F6"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const InteractiveBackground = () => (
  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 to-black">
    <Canvas
      camera={{
        position: [0, 0, 3],
        fov: 75,
        near: 0.1,
        far: 100,
      }}
    >
      <StarField />
      {/* Add ambient light for better visibility */}
      <ambientLight intensity={0.5} />
    </Canvas>
  </div>
);
