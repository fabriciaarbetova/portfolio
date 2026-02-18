import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const w = mount.clientWidth;
        const h = mount.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // Geometry: abstract fluid-like mesh
        const geometry = new THREE.IcosahedronGeometry(2, 8);
        const posAttr = geometry.attributes.position;
        const originalPos = new Float32Array(posAttr.array);

        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.15,
            wireframe: false,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Wireframe overlay
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0xc8b89a,
            wireframe: true,
            transparent: true,
            opacity: 0.06,
        });
        const wireMesh = new THREE.Mesh(geometry, wireMat);
        scene.add(wireMesh);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xc8b89a, 2, 20);
        pointLight1.position.set(4, 4, 4);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4a6fa5, 1.5, 20);
        pointLight2.position.set(-4, -2, 2);
        scene.add(pointLight2);

        // Mouse
        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Resize
        const handleResize = () => {
            const w2 = mount.clientWidth;
            const h2 = mount.clientHeight;
            camera.aspect = w2 / h2;
            camera.updateProjectionMatrix();
            renderer.setSize(w2, h2);
        };
        window.addEventListener('resize', handleResize);

        // Animation
        let animId;
        const clock = new THREE.Clock();

        const animate = () => {
            animId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Morph vertices
            for (let i = 0; i < posAttr.count; i++) {
                const ox = originalPos[i * 3];
                const oy = originalPos[i * 3 + 1];
                const oz = originalPos[i * 3 + 2];
                const noise = Math.sin(ox * 1.5 + t * 0.6) * Math.cos(oy * 1.5 + t * 0.4) * Math.sin(oz + t * 0.5);
                const scale = 1 + noise * 0.18;
                posAttr.setXYZ(i, ox * scale, oy * scale, oz * scale);
            }
            posAttr.needsUpdate = true;
            geometry.computeVertexNormals();

            // Rotation
            mesh.rotation.x += (mouseY * 0.3 - mesh.rotation.x) * 0.04;
            mesh.rotation.y += (mouseX * 0.3 - mesh.rotation.y) * 0.04;
            mesh.rotation.y += 0.002;
            wireMesh.rotation.copy(mesh.rotation);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="hero-canvas" />;
}
