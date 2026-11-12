import type { LightingState } from '@/types'

interface ShowroomLightsProps {
  lighting: LightingState
}

export function ShowroomLights({ lighting }: ShowroomLightsProps) {
  const mode = lighting.mode

  const ambientIntensity =
    mode === 'day' ? 0.85 : mode === 'night' ? 0.15 : 0.35
  const keyIntensity = mode === 'day' ? 2.2 : mode === 'night' ? 0.6 : 1.8
  const fillIntensity = mode === 'day' ? 0.8 : mode === 'night' ? 0.2 : 0.9
  const rimIntensity = mode === 'studio' ? 1.4 : mode === 'day' ? 0.5 : 0.8

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={mode === 'night' ? '#334455' : '#ffffff'} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={keyIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        color={mode === 'night' ? '#aabbff' : '#ffffff'}
      />
      <directionalLight position={[-5, 4, -3]} intensity={fillIntensity} color="#cfe0ff" />
      <directionalLight position={[0, 3, -6]} intensity={rimIntensity} color="#3b9eff" />
      {lighting.ambient && (
        <pointLight position={[0, 5, 0]} intensity={mode === 'night' ? 1.5 : 0.6} color="#88aaff" distance={20} />
      )}
      {mode === 'night' && (
        <>
          <spotLight
            position={[0, 8, 0]}
            angle={0.55}
            penumbra={0.6}
            intensity={2.5}
            color="#3b9eff"
            castShadow
          />
          <hemisphereLight args={['#102040', '#050508', 0.4]} />
        </>
      )}
      {mode === 'day' && <hemisphereLight args={['#c8d8ff', '#404040', 0.6]} />}
      {mode === 'studio' && (
        <>
          <spotLight position={[0, 8, 0]} angle={0.7} penumbra={0.5} intensity={2.2} color="#ffffff" />
          <pointLight position={[4, 2, 4]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-4, 2, -4]} intensity={0.6} color="#3b9eff" />
        </>
      )}
    </>
  )
}
