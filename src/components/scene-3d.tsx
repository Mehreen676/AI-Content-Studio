'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Box, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function FloatingCoin({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Torus ref={meshRef} args={[0.4, 0.15, 16, 32]} position={position}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.3} />
      </Torus>
    </Float>
  )
}

function GlowingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
  })
  return (
    <Sphere ref={meshRef} args={[0.5, 32, 32]} position={position}>
      <MeshDistortMaterial color={color} speed={3} distort={0.4} radius={1} metalness={0.6} roughness={0.3} emissive={color} emissiveIntensity={0.2} />
    </Sphere>
  )
}

function FloatingCard({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
  })
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Box ref={meshRef} args={[0.8, 1.1, 0.05]} position={position}>
        <MeshWobbleMaterial color={color} factor={0.1} speed={1} metalness={0.5} roughness={0.4} emissive={color} emissiveIntensity={0.15} />
      </Box>
    </Float>
  )
}

function Particles() {
  const count = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return pos
  }, [])

  const pointsRef = useRef<THREE.Points>(null!)
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a855f7" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#a855f7" />
        <directionalLight position={[-5, 3, 3]} intensity={0.5} color="#ec4899" />
        <pointLight position={[0, 0, 3]} intensity={1} color="#7c3aed" />

        <FloatingCoin position={[-2.5, 1.5, 0]} color="#a855f7" speed={1.2} />
        <FloatingCoin position={[2.5, -1, -1]} color="#ec4899" speed={0.8} />
        <FloatingCoin position={[0, 2, -2]} color="#f97316" speed={1} />

        <GlowingSphere position={[-1.5, -1, -1]} color="#7c3aed" />
        <GlowingSphere position={[2, 1.5, -1.5]} color="#ec4899" />

        <FloatingCard position={[1.5, -0.5, 0]} color="#8b5cf6" />
        <FloatingCard position={[-2, 0, -1]} color="#f472b6" />

        <Particles />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  )
}
