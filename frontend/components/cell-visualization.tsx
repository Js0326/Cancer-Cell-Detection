"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useTheme } from "next-themes"

export default function CellVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.innerHTML = ""
    mountRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false

    // Cell nucleus
    const nucleusGeometry = new THREE.SphereGeometry(1, 32, 32)
    const nucleusMaterial = new THREE.MeshPhongMaterial({
      color: theme === "dark" ? 0x5c6bc0 : 0x3949ab,
      emissive: theme === "dark" ? 0x283593 : 0x1a237e,
      specular: 0x101010,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial)
    scene.add(nucleus)

    // Cell membrane
    const membraneGeometry = new THREE.SphereGeometry(1.5, 32, 32)
    const membraneMaterial = new THREE.MeshPhongMaterial({
      color: theme === "dark" ? 0x7986cb : 0x5c6bc0,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    })
    const membrane = new THREE.Mesh(membraneGeometry, membraneMaterial)
    scene.add(membrane)

    // Organelles
    const organelleCount = 20
    const organelles: THREE.Mesh[] = []

    for (let i = 0; i < organelleCount; i++) {
      const size = Math.random() * 0.2 + 0.05
      const geometry = new THREE.SphereGeometry(size, 16, 16)
      const material = new THREE.MeshPhongMaterial({
        color: theme === "dark" ? 0xef5350 : 0xe53935,
        emissive: theme === "dark" ? 0xc62828 : 0xb71c1c,
        specular: 0x101010,
        shininess: 100,
      })

      const organelle = new THREE.Mesh(geometry, material)

      // Position within the cell
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = Math.random() * 0.7 + 0.3

      organelle.position.x = radius * Math.sin(phi) * Math.cos(theta)
      organelle.position.y = radius * Math.sin(phi) * Math.sin(theta)
      organelle.position.z = radius * Math.cos(phi)

      scene.add(organelle)
      organelles.push(organelle)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xffffff, 2)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 1)
    pointLight2.position.set(-10, -10, -10)
    scene.add(pointLight2)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      nucleus.rotation.x += 0.002
      nucleus.rotation.y += 0.003

      membrane.rotation.x -= 0.001
      membrane.rotation.y -= 0.002

      organelles.forEach((organelle) => {
        organelle.rotation.x += 0.01
        organelle.rotation.y += 0.01
      })

      controls.update()
      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      nucleusGeometry.dispose()
      nucleusMaterial.dispose()
      membraneGeometry.dispose()
      membraneMaterial.dispose()

      organelles.forEach((organelle) => {
        ;(organelle.geometry as THREE.BufferGeometry).dispose()
        ;(organelle.material as THREE.Material).dispose()
      })
    }
  }, [theme])

  return <div ref={mountRef} className="absolute inset-0" />
}

