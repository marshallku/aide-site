import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

import mark from "#assets/aide/mark.svg?raw";

export function mountHeroScene(canvas: HTMLCanvasElement, options: { onFail: () => void }): { dispose(): void } {
    let disposed = false;
    let frame = 0;
    let visible = false;
    let elapsed = 0;
    let firstFrame = true;
    let previousTime = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let pmrem: THREE.PMREMGenerator | undefined;
    let environment: THREE.WebGLRenderTarget | undefined;
    let resize: ResizeObserver | undefined;
    let intersection: IntersectionObserver | undefined;
    let themeObserver: MutationObserver | undefined;
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const instances: THREE.InstancedMesh[] = [];
    const pointer = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.z = 12;

    const dispose = () => {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(frame);
        resize?.disconnect();
        intersection?.disconnect();
        themeObserver?.disconnect();
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", updateLoop);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        instances.forEach((mesh) => mesh.dispose());
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        environment?.dispose();
        pmrem?.dispose();
        renderer?.dispose();
        renderer?.forceContextLoss();
    };
    const fail = () => {
        if (disposed) return;
        dispose();
        options.onFail();
    };
    function onContextLost(event: Event) {
        event.preventDefault();
        fail();
    }
    function onPointer(event: PointerEvent) {
        const bounds = canvas.getBoundingClientRect();
        pointer.set(
            THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1),
            THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * 2, -1, 1),
        );
    }
    function updateLoop() {
        cancelAnimationFrame(frame);
        previousTime = 0;
        if (!disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
    }
    let render: (time: number) => void = () => {};

    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        environment = pmrem.fromScene(room, 0.04);
        room.dispose();
        scene.environment = environment.texture;
        const key = new THREE.DirectionalLight(0xffffff, 3);
        key.position.set(-3, 5, 6);
        scene.add(key);

        const shapes = new SVGLoader().parse(mark).paths.flatMap((path) => path.toShapes());
        const shieldGeometry = new THREE.ExtrudeGeometry(shapes, {
            depth: 76,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 1,
            bevelSize: 10,
            bevelThickness: 10,
            curveSegments: 32,
        });
        shieldGeometry.center();
        // SVG coordinates point down; normalize the mark to 2.4 scene units tall.
        shieldGeometry.scale(2.4 / 950, -2.4 / 950, -2.4 / 950);
        shieldGeometry.computeVertexNormals();
        geometries.push(shieldGeometry);
        const shieldMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#5856d6").lerp(new THREE.Color("#2b2d52"), 0.3),
            clearcoat: 1,
            roughness: 0.25,
            metalness: 0.1,
            iridescence: 0.15,
        });
        materials.push(shieldMaterial);
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        scene.add(shield);

        const cardGeometry = new THREE.ExtrudeGeometry(
            new THREE.Shape()
                .moveTo(-0.12, -0.08)
                .lineTo(0.12, -0.08)
                .quadraticCurveTo(0.15, -0.08, 0.15, -0.05)
                .lineTo(0.15, 0.05)
                .quadraticCurveTo(0.15, 0.08, 0.12, 0.08)
                .lineTo(-0.12, 0.08)
                .quadraticCurveTo(-0.15, 0.08, -0.15, 0.05)
                .lineTo(-0.15, -0.05)
                .quadraticCurveTo(-0.15, -0.08, -0.12, -0.08),
            { depth: 0.012, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 },
        );
        geometries.push(cardGeometry);
        const count = 40;
        const alpha = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
        cardGeometry.setAttribute("instanceAlpha", alpha);
        const cardMaterial = new THREE.MeshPhysicalMaterial({
            transparent: true,
            depthWrite: false,
            roughness: 0.45,
            metalness: 0.05,
        });
        cardMaterial.onBeforeCompile = (shader) => {
            shader.vertexShader =
                `attribute float instanceAlpha; varying float cardAlpha;\n${shader.vertexShader}`.replace(
                    "#include <begin_vertex>",
                    "#include <begin_vertex>\ncardAlpha = instanceAlpha;",
                );
            shader.fragmentShader = `varying float cardAlpha;\n${shader.fragmentShader}`.replace(
                "#include <opaque_fragment>",
                "diffuseColor.a *= cardAlpha;\n#include <opaque_fragment>",
            );
        };
        materials.push(cardMaterial);
        const cards = new THREE.InstancedMesh(cardGeometry, cardMaterial, count);
        instances.push(cards);
        cards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        cards.frustumCulled = false;
        scene.add(cards);
        const palette = ["#ffffff", "#0a84ff", "#ff9f0a", "#30d158", "#bf5af2"];
        const applyTheme = () => {
            const dark = document.documentElement.dataset.theme === "dark";
            cardMaterial.emissive.set(dark ? "#36364f" : "#000000");
            cardMaterial.emissiveIntensity = dark ? 0.45 : 0;
            for (let i = 0; i < count; i++) {
                const color = new THREE.Color(palette[i % 5]);
                if (!dark) color.multiplyScalar(i % 5 === 0 ? 0.88 : 0.95);
                cards.setColorAt(i, color);
            }
            if (cards.instanceColor) cards.instanceColor.needsUpdate = true;
        };
        applyTheme();
        themeObserver = new MutationObserver(applyTheme);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        const dummy = new THREE.Object3D();
        render = (time) => {
            if (disposed) return;
            const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
            previousTime = time;
            elapsed += delta;
            shield.position.y = Math.sin(elapsed * 0.65) * 0.075;
            const damping = 1 - Math.exp(-delta * 4);
            shield.rotation.x += (-0.08 + pointer.y * 0.105 - shield.rotation.x) * damping;
            shield.rotation.y +=
                (0.22 + Math.sin(elapsed * 0.35) * 0.04 + pointer.x * 0.105 - shield.rotation.y) * damping;
            for (let i = 0; i < count; i++) {
                const progress = (elapsed / (8 + (i % 7)) + i / count) % 1;
                const radius = 0.25 + (1 - progress) * 4.4;
                const angle = i * 2.39996 + progress * 2.1;
                dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.65, -0.5 - progress * 0.3);
                dummy.rotation.set(0.1, Math.sin(angle) * 0.2, angle * 0.15);
                dummy.scale.setScalar((i % 5 > 1 ? 0.65 : 1) * (1 - progress * 0.85));
                dummy.updateMatrix();
                cards.setMatrixAt(i, dummy.matrix);
                alpha.setX(i, Math.min(progress * 8, 1) * (1 - progress) * (i % 5 === 1 ? 0.45 : 0.8));
            }
            cards.instanceMatrix.needsUpdate = true;
            alpha.needsUpdate = true;
            try {
                renderer?.render(scene, camera);
                if (firstFrame) {
                    firstFrame = false;
                    canvas.dispatchEvent(new Event("hero-scene-ready"));
                }
            } catch {
                fail();
                return;
            }
            frame = requestAnimationFrame(render);
        };
        resize = new ResizeObserver(() => {
            const parent = canvas.parentElement;
            if (!parent || !renderer) return;
            const { width, height } = parent.getBoundingClientRect();
            if (!width || !height) return;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        });
        resize.observe(canvas.parentElement ?? canvas);
        intersection = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            updateLoop();
        });
        intersection.observe(canvas);
        window.addEventListener("pointermove", onPointer, { passive: true });
        document.addEventListener("visibilitychange", updateLoop);
        canvas.addEventListener("webglcontextlost", onContextLost);
    } catch {
        fail();
    }
    return { dispose };
}
