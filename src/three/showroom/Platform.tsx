import { MeshReflectorMaterial } from '@react-three/drei'

export function Platform() {
  return (
    <group>
      {/* Circular display platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[4.2, 64]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Accent ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[4.15, 4.35, 64]} />
        <meshStandardMaterial
          color="#3b9eff"
          emissive="#1e6fbf"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={0.65}
          roughness={0.85}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#0c0c10"
          metalness={0.55}
          mirror={0.35}
        />
      </mesh>
      {/* Soft backdrop */}
      <mesh position={[0, 4, -12]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#0e0e12" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}
