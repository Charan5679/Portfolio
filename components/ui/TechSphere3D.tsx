"use client";

import { useEffect, useRef, useState } from "react";
import { SphereSkeleton } from "@/components/ui/SphereSkeleton";

const SKILLS = [
  "React.js","Java","Node.js","Python","Spring Boot","TypeScript",
  "MongoDB","AWS","Docker","Next.js","PyTorch","PostgreSQL",
  "REST APIs","Jenkins","ELK Stack","Kibana",
];

const VERT = `
  uniform float uTime;
  uniform float uDistort;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vNoise;

  vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;i=mod289v3(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*(ns.z*ns.z));vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vNormal = normalize(normalMatrix * normal);
    float n = snoise(position * 1.8 + uTime * 0.15) * uDistort;
    vec3 displaced = position + normal * n;
    vNoise = n;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRAG = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vNoise;

  void main(){
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.2);
    vec3 base = vec3(0.06, 0.06, 0.08);
    vec3 rim  = vec3(0.75, 0.82, 1.0) * fresnel * 1.4;
    float shimmer = (vNoise + 1.0) * 0.5;
    vec3 shimmerCol = vec3(0.5, 0.6, 0.8) * shimmer * 0.18;
    vec3 col = base + rim + shimmerCol;
    float alpha = 0.55 + fresnel * 0.45;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function TechSphere3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let dead = false;

    (async () => {
      const THREE = await import("three");
      if (dead || !mountRef.current) return;

      const W = mount.clientWidth  || 500;
      const H = mount.clientHeight || 500;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 100);
      camera.position.set(0, 0, 3.2);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.1));
      const pt1 = new THREE.PointLight(0x8899ff, 0.6);
      pt1.position.set(4, 4, 4);
      scene.add(pt1);
      const pt2 = new THREE.PointLight(0xffffff, 0.3);
      pt2.position.set(-4, -2, -4);
      scene.add(pt2);

      // Sphere with GLSL shader
      const uniforms = {
        uTime:    { value: 0 },
        uDistort: { value: 0.18 },
        cameraPosition: { value: camera.position },
      };
      const sphereGeo = new THREE.IcosahedronGeometry(1.0, 6);
      const sphereMat = new THREE.ShaderMaterial({
        vertexShader:   VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      // Inner wireframe
      const wire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.72, 3),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 })
      );
      wire.rotation.set(0.3, 0.5, 0.1);
      scene.add(wire);

      // Orbit rings
      [1.28, 1.5, 1.7].forEach((r, i) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.002, 2, 200),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 - i * 0.02 })
        );
        ring.rotation.set(Math.PI / (2.5 + i * 0.8), i * 0.4, i * 0.3);
        scene.add(ring);
      });

      // Orbiting dots
      const dotGroup = new THREE.Group();
      const dotMeshes: { mesh: THREE.Mesh; angle: number; radius: number; speed: number; tiltX: number; tiltZ: number }[] = [];
      SKILLS.forEach((_, i) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
        );
        dotGroup.add(mesh);
        dotMeshes.push({
          mesh,
          angle:  (i / SKILLS.length) * Math.PI * 2,
          radius: 1.25 + (i % 3) * 0.12,
          speed:  0.12 + (i % 5) * 0.03,
          tiltX:  (i % 3 - 1) * 0.6,
          tiltZ:  (i % 4 - 1.5) * 0.3,
        });
      });
      scene.add(dotGroup);

      // Skill label sprites
      const labelSprites: THREE.Sprite[] = [];
      SKILLS.forEach((text, i) => {
        const c = document.createElement("canvas");
        c.width = 320; c.height = 72;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, 320, 72);
        ctx.font = "600 22px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(220,230,255,0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 160, 36);
        const tex = new THREE.CanvasTexture(c);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(1.0, 0.22, 1);
        const angle = (i / SKILLS.length) * Math.PI * 2;
        const radius = 1.55 + (i % 3) * 0.08;
        sprite.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        sprite.userData = { angle, radius };
        scene.add(sprite);
        labelSprites.push(sprite);
      });

      // Sparkles (simple point cloud)
      const sparkCount = 200;
      const sparkPos = new Float32Array(sparkCount * 3);
      for (let i = 0; i < sparkCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 1.4 + Math.random() * 1.4;
        sparkPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        sparkPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        sparkPos[i*3+2] = r * Math.cos(phi);
      }
      const sparkGeo = new THREE.BufferGeometry();
      sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
      const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({
        color: 0xaabbff, size: 0.04, transparent: true, opacity: 0.35,
        sizeAttenuation: true,
      }));
      scene.add(sparks);

      // Mouse
      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        const r = mount.getBoundingClientRect();
        mouse.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        mouse.y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      setReady(true);

      // Animate
      let t = 0;
      const tick = () => {
        if (dead) return;
        rafRef.current = requestAnimationFrame(tick);
        t += 0.016;

        uniforms.uTime.value = t;
        sphere.rotation.y += 0.004;
        sphere.rotation.x += (mouse.y * 0.12 - sphere.rotation.x) * 0.05;
        sphere.rotation.z += (mouse.x * 0.08 - sphere.rotation.z) * 0.05;

        // Float
        sphere.position.y  = Math.sin(t * 0.8) * 0.08;
        sphere.position.y += Math.sin(t * 0.3) * 0.04;

        wire.rotation.y += 0.002;
        dotGroup.rotation.y += 0.04 * 0.016;

        dotMeshes.forEach(d => {
          d.angle += d.speed * 0.016;
          const tilt = Math.cos(d.angle * 0.5) * d.tiltX;
          d.mesh.position.set(
            d.radius * Math.cos(d.angle),
            d.radius * Math.sin(d.angle) * Math.cos(tilt) * 0.5,
            d.radius * Math.sin(d.angle) * Math.sin(tilt + d.tiltZ)
          );
        });

        labelSprites.forEach((sp, i) => {
          const a = sp.userData.angle + t * 0.08;
          const r = sp.userData.radius;
          sp.position.x = Math.cos(a) * r;
          sp.position.z = Math.sin(a) * r;
          sp.position.y = Math.sin(t * 0.4 + sp.userData.angle) * 0.15;
          const depth = sp.position.z;
          (sp.material as THREE.SpriteMaterial).opacity =
            0.15 + Math.max(0, (depth / r + 1) * 0.4);
        });

        sparks.rotation.y += 0.001;

        renderer.render(scene, camera);
      };
      tick();

      (mount as any)._cleanup = () => {
        dead = true;
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      dead = true;
      const m = mountRef.current as any;
      if (m?._cleanup) m._cleanup();
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      {!ready && <SphereSkeleton />}
      <div ref={mountRef} className="w-full h-full"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }} />
    </div>
  );
}
