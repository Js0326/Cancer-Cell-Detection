"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Custom shader for fluid surface animation
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  
  //
  // Description : Array and textureless GLSL 2D/3D/4D simplex 
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : stegu
  //     Lastmod : 20110822 (ijm)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  // 

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i); 
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Create fluid-like displacement
    float displacement = snoise(vec3(position.x * 2.0, position.y * 2.0, time * 0.2)) * 0.3;
    vec3 newPosition = position + normal * displacement;
    
    vPosition = newPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

// Custom shader for fluid surface animation with blue tint
const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    // Create a frosted glass effect with blue tint
    vec3 baseColor = vec3(0.2, 0.3, 0.8); // Deep blue base
    vec3 lightPos = vec3(2.0 * sin(time * 0.5), 2.0 * cos(time * 0.5), 4.0);
    vec3 lightDir = normalize(lightPos - vPosition);
    
    // Calculate fresnel effect for glass appearance
    float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(-vPosition)), 3.0);
    
    // Add subtle iridescence with blue dominance
    vec3 iridescence = vec3(
      sin(fresnel * 10.0 + time) * 0.2 + 0.4,
      sin(fresnel * 10.0 + time + 2.0) * 0.3 + 0.5,
      sin(fresnel * 10.0 + time + 4.0) * 0.4 + 0.8
    );
    
    // Combine effects
    vec3 finalColor = mix(baseColor, iridescence, 0.5);
    finalColor += vec3(0.1, 0.2, 0.4) * pow(max(dot(lightDir, vNormal), 0.0), 32.0);
    finalColor *= 0.8 + fresnel * 0.4;
    
    gl_FragColor = vec4(finalColor, 0.9);
  }
`

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const frameIdRef = useRef<number>(0)
  const mountedRef = useRef<boolean>(false)

  useEffect(() => {
    if (!containerRef.current || mountedRef.current) return

    mountedRef.current = true

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x000000)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    cameraRef.current = camera
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1

    // Create cell geometry
    const geometry = new THREE.IcosahedronGeometry(2, 4)

    // Create material with custom shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    })
    materialRef.current = material

    // Create mesh
    const cell = new THREE.Mesh(geometry, material)
    scene.add(cell)

    // Add point light for the red dot effect
    const redLight = new THREE.PointLight(0xff0000, 2, 10)
    redLight.position.set(1, 1, 2)
    scene.add(redLight)

    // Animation loop
    let animationFrameId: number
    const animate = (time: number) => {
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = time * 0.001
      }

      if (controlsRef.current) {
        controlsRef.current.update()
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationFrameId = requestAnimationFrame(animate)
      frameIdRef.current = animationFrameId
    }
    animate(0)

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameIdRef.current)
      
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose()
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose())
              } else {
                object.material.dispose()
              }
            }
          }
        })
      }

      // Reset refs
      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      materialRef.current = null
      controlsRef.current = null
      mountedRef.current = false
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-black">
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-4xl">
          <h1 className="text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            AI-Powered Cancer Cell
            <br />
            Detection
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl">
            Upload histopathological images and get real-time classification results using our advanced Swin Transformer-based model.
            </p>
          </div>
          </div>
    </div>
  )
}

