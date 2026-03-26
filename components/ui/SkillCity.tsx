"use client";

import { useEffect, useRef, useState } from "react";

/* ══ SKILL DATA ══════════════════════════════════════════════ */
const SKILL_DATA = [
  { x: -24, z: -20, w: 4.5, d: 4.5, h: 8,  label: "Java",             group: "Languages"      },
  { x: -16, z: -22, w: 3.5, d: 3.5, h: 5,  label: "Python",           group: "Languages"      },
  { x:  -8, z: -20, w: 4,   d: 4,   h: 9,  label: "TypeScript",       group: "Languages"      },
  { x:   0, z: -22, w: 3.5, d: 3.5, h: 5,  label: "JavaScript",       group: "Languages"      },
  { x:   8, z: -20, w: 3.5, d: 3.5, h: 6,  label: "SQL",              group: "Languages"      },
  { x:  16, z: -22, w: 4,   d: 4,   h: 7,  label: "Bash",             group: "Languages"      },

  { x: -24, z:  -5, w: 5,   d: 5,   h: 13, label: "React.js",         group: "Frameworks"     },
  { x: -16, z:  -3, w: 3.5, d: 3.5, h: 9,  label: "Node.js",          group: "Frameworks"     },
  { x:  -8, z:  -5, w: 4.5, d: 4.5, h: 11, label: "Next.js",          group: "Frameworks"     },
  { x:   0, z:  -3, w: 3.5, d: 3.5, h: 8,  label: "Spring Boot",      group: "Frameworks"     },
  { x:   8, z:  -5, w: 3.5, d: 3.5, h: 7,  label: "Angular",          group: "Frameworks"     },

  { x:  16, z:  -5, w: 5,   d: 5,   h: 15, label: "PyTorch",          group: "AI / ML"        },
  { x:  24, z:  -5, w: 4,   d: 4,   h: 11, label: "GANs",             group: "AI / ML"        },
  { x:  24, z: -20, w: 4.5, d: 4.5, h: 10, label: "Isolation Forest", group: "AI / ML"        },
  { x:  16, z: -20, w: 3.5, d: 3.5, h: 8,  label: "Scikit-learn",     group: "AI / ML"        },

  { x: -24, z:  13, w: 4.5, d: 4.5, h: 7,  label: "PostgreSQL",       group: "Databases"      },
  { x: -16, z:  11, w: 3.5, d: 3.5, h: 5,  label: "MongoDB",          group: "Databases"      },
  { x:  -8, z:  13, w: 3.5, d: 3.5, h: 8,  label: "MySQL",            group: "Databases"      },
  { x:   0, z:  11, w: 4,   d: 4,   h: 6,  label: "Firebase",         group: "Databases"      },
  { x:   8, z:  13, w: 3.5, d: 3.5, h: 5,  label: "Redis",            group: "Databases"      },

  { x:  16, z:  11, w: 5,   d: 5,   h: 10, label: "AWS",              group: "Cloud & DevOps" },
  { x:  24, z:  13, w: 4,   d: 4,   h: 9,  label: "Docker",           group: "Cloud & DevOps" },
  { x:  24, z:  -2, w: 3.5, d: 3.5, h: 8,  label: "Jenkins",          group: "Cloud & DevOps" },
  { x:  16, z:   3, w: 4,   d: 4,   h: 7,  label: "CI/CD",            group: "Cloud & DevOps" },

  { x:  -8, z:   4, w: 3.5, d: 3.5, h: 6,  label: "ELK Stack",        group: "Analytics"      },
  { x:   0, z:   4, w: 4,   d: 4,   h: 8,  label: "Kibana",           group: "Analytics"      },
  { x:   8, z:   4, w: 3.5, d: 3.5, h: 5,  label: "Tableau",          group: "Analytics"      },
];

const GROUP_HEX: Record<string, string> = {
  "Languages":        "#c8d8ff",
  "Frameworks":       "#80aaff",
  "AI / ML":          "#ffcc66",
  "Databases":        "#44ee88",
  "Cloud & DevOps":   "#cc88ff",
  "Analytics":        "#ff88bb",
};

/* ══ COMPONENT ═══════════════════════════════════════════════ */
export function SkillCity() {
  const mountRef   = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const keysRef    = useRef<Set<string>>(new Set());
  const touchRef   = useRef({ active: false, dx: 0, dy: 0, sx: 0, sy: 0 });
  const rafRef     = useRef<number>(0);

  const [started,       setStarted]       = useState(false);
  const [collected,     setCollected]     = useState<Set<string>>(new Set());
  const [nearSkill,     setNearSkill]     = useState<{ label: string; group: string } | null>(null);
  const [justCollected, setJustCollected] = useState<string | null>(null);
  const [speedVal,      setSpeedVal]      = useState(0);
  const total = SKILL_DATA.length;

  useEffect(() => {
    if (!started || !mountRef.current) return;
    const mount = mountRef.current;
    let dead = false;

    (async () => {
      const T = await import("three");
      if (dead || !mountRef.current) return;

      /* ── RENDERER ─────────────────────────────── */
      const W = mount.clientWidth, H = mount.clientHeight;
      const R = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      R.setSize(W, H);
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      R.shadowMap.enabled = true;
      R.shadowMap.type = T.PCFSoftShadowMap;
      R.toneMapping = T.ACESFilmicToneMapping;
      R.toneMappingExposure = 0.75;
      R.outputColorSpace = T.SRGBColorSpace;
      mount.appendChild(R.domElement);

      /* ── SCENE ─────────────────────────────────── */
      const scene = new T.Scene();
      scene.fog = new T.FogExp2(0x04040c, 0.016);

      /* ── SKY DOME (gradient shader) ─────────────── */
      const skyMat = new T.ShaderMaterial({
        side: T.BackSide,
        depthWrite: false,
        uniforms: {
          uTop: { value: new T.Color(0x020208) },
          uHorizon: { value: new T.Color(0x080820) },
          uGlow: { value: new T.Color(0x0a0830) },
        },
        vertexShader: `
          varying vec3 vDir;
          void main(){
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
          }
        `,
        fragmentShader: `
          uniform vec3 uTop;
          uniform vec3 uHorizon;
          uniform vec3 uGlow;
          varying vec3 vDir;
          void main(){
            float y = vDir.y * 0.5 + 0.5;
            float horiz = exp(-y * 4.0);
            float cityGlow = exp(-abs(vDir.y) * 8.0) * 0.6;
            vec3 col = mix(uHorizon, uTop, pow(y, 0.5));
            col = mix(col, uGlow, cityGlow);
            gl_FragColor = vec4(col, 1.);
          }
        `,
      });
      scene.add(new T.Mesh(new T.SphereGeometry(180, 24, 12), skyMat));

      /* ── MOON ─────────────────────────────────── */
      const moonMesh = new T.Mesh(
        new T.SphereGeometry(2.8, 24, 24),
        new T.MeshBasicMaterial({ color: 0xeeeeff })
      );
      moonMesh.position.set(-60, 90, -120);
      scene.add(moonMesh);
      // Soft moon glow halo
      const haloMat = new T.SpriteMaterial({
        map: (() => {
          const c = document.createElement("canvas"); c.width = 128; c.height = 128;
          const cx = c.getContext("2d");
        if (!cx) return null;
          const g = cx.createRadialGradient(64,64,0,64,64,64);
          g.addColorStop(0,"rgba(200,210,255,0.55)");
          g.addColorStop(1,"rgba(0,0,0,0)");
          cx.fillStyle = g; cx.fillRect(0,0,128,128);
          return new T.CanvasTexture(c);
        })(),
        transparent: true, depthWrite: false,
      });
      const halo = new T.Sprite(haloMat);
      halo.scale.set(22, 22, 1);
      halo.position.copy(moonMesh.position);
      scene.add(halo);

      /* ── STARS ─────────────────────────────────── */
      const N_STARS = 1200;
      const sPos = new Float32Array(N_STARS * 3);
      const sSz  = new Float32Array(N_STARS);
      for (let i = 0; i < N_STARS; i++) {
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(1 - Math.random() * 0.9);
        const r  = 160;
        sPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
        sPos[i*3+1] = Math.abs(r * Math.cos(ph)) + 5;
        sPos[i*3+2] = r * Math.sin(ph) * Math.sin(th);
        sSz[i] = 0.18 + Math.random() * 0.55;
      }
      const starGeo = new T.BufferGeometry();
      starGeo.setAttribute("position", new T.BufferAttribute(sPos, 3));
      starGeo.setAttribute("size",     new T.BufferAttribute(sSz, 1));
      scene.add(new T.Points(starGeo, new T.PointsMaterial({
        color: 0xffffff, size: 0.32, transparent: true, opacity: 0.7, sizeAttenuation: true,
      })));

      /* ── ENV MAP ─────────────────────────────────── */
      const pmrem = new T.PMREMGenerator(R);
      const envS  = new T.Scene();
      envS.background = new T.Color(0x060616);
      scene.environment = pmrem.fromScene(envS).texture;
      pmrem.dispose();

      /* ── CAMERA ─────────────────────────────────── */
      const cam = new T.PerspectiveCamera(55, W / H, 0.05, 300);
      cam.position.set(0, 5, 14);

      /* ── LIGHTS ─────────────────────────────────── */
      scene.add(new T.AmbientLight(0x141428, 14));
      // Hemisphere light: sky cool blue from above, warm orange from ground bounce
      const hemi = new T.HemisphereLight(0x223366, 0x221100, 1.8);
      scene.add(hemi);
      const moon = new T.DirectionalLight(0x99aae8, 2.8);
      moon.position.set(-30, 50, 20);
      moon.castShadow = true;
      moon.shadow.mapSize.set(4096, 4096);
      moon.shadow.camera.near = 1; moon.shadow.camera.far = 200;
      moon.shadow.camera.left = -70; moon.shadow.camera.right = 70;
      moon.shadow.camera.top  = 70; moon.shadow.camera.bottom = -70;
      moon.shadow.bias = -0.0003;
      scene.add(moon);

      /* ── GROUND ─────────────────────────────────── */
      // Asphalt base
      const gMat = new T.MeshStandardMaterial({
        color: 0x080810, roughness: 0.88, metalness: 0.12,
      });
      const gnd = new T.Mesh(new T.PlaneGeometry(250, 250, 1, 1), gMat);
      gnd.rotation.x = -Math.PI / 2;
      gnd.receiveShadow = true;
      scene.add(gnd);

      // Wet asphalt reflection overlay
      scene.add(Object.assign(
        new T.Mesh(new T.PlaneGeometry(250, 250),
          new T.MeshStandardMaterial({
            color: 0x0a0820, roughness: 0.02, metalness: 0.0,
            transparent: true, opacity: 0.28, depthWrite: false,
            envMap: scene.environment, envMapIntensity: 1.2,
          })
        ),
        { rotation: { x: -Math.PI / 2, y: 0, z: 0 }, position: { x:0, y:0.01, z:0 } }
      ));

      // Pavement tiles (subtle grid pattern on ground)
      for (let tx = -12; tx <= 12; tx++) {
        for (let tz = -12; tz <= 12; tz++) {
          if ((tx + tz) % 2 === 0) continue;
          const tile = new T.Mesh(
            new T.PlaneGeometry(1.9, 1.9),
            new T.MeshBasicMaterial({ color: 0x060612, transparent: true, opacity: 0.65, depthWrite: false })
          );
          tile.rotation.x = -Math.PI / 2;
          tile.position.set(tx * 2, 0.012, tz * 2);
          scene.add(tile);
        }
      }

      /* ── ROADS ─────────────────────────────────── */
      const roadMat = new T.MeshStandardMaterial({ color: 0x0a0a16, roughness: 0.9, metalness: 0.05 });

      // Road definitions [cx, cz, width, depth]
      const roadDefs: [number,number,number,number][] = [
        [0,  0,   250, 7],    // main horizontal
        [0,  0,   7,   250],  // main vertical
        [-12, 0,  250, 4],    // side horizontal
        [12,  0,  250, 4],
        [0, -12,  4,   250],  // side vertical
        [0,  12,  4,   250],
      ];
      roadDefs.forEach(([rx,rz,rw,rd]) => {
        const r = new T.Mesh(new T.BoxGeometry(rw, 0.08, rd), roadMat);
        r.position.set(rx, 0.02, rz);
        r.receiveShadow = true;
        scene.add(r);
      });

      // Road edge kerb strips
      const kerbMat = new T.MeshStandardMaterial({ color: 0x181828, roughness: 0.8 });
      [[-3.3,0,250,0.6],[ 3.3,0,250,0.6],[0,-3.3,0.6,250],[0,3.3,0.6,250],
       [-13.8,0,250,0.4],[13.8,0,250,0.4],[0,-13.8,0.4,250],[0,13.8,0.4,250]
      ].forEach(([kx,kz,kw,kd]) => {
        const k = new T.Mesh(new T.BoxGeometry(kw,0.1,kd), kerbMat);
        k.position.set(kx,0.04,kz);
        scene.add(k);
      });

      // Lane markings — dashed white centre lines
      const lineMat = new T.MeshBasicMaterial({ color: 0x22223a });
      for (let i = -120; i <= 120; i += 5) {
        [
          [0, i, 0.12, 2.8],  // main H
          [i, 0, 2.8, 0.12],  // main V
        ].forEach(([lx,lz,lw,ld]) => {
          const l = new T.Mesh(new T.BoxGeometry(lw,0.02,ld), lineMat);
          l.position.set(lx,0.05,lz);
          scene.add(l);
        });
      }

      // Zebra crossings
      const zebMat = new T.MeshBasicMaterial({ color: 0x141422 });
      for (let cross = -1; cross <= 1; cross += 2) {
        for (let s = 0; s < 6; s++) {
          const z1 = new T.Mesh(new T.BoxGeometry(0.85,0.03,4.2), zebMat);
          z1.position.set(-5.1 + s*2.2, 0.04, cross*9.5);
          scene.add(z1);
          const z2 = new T.Mesh(new T.BoxGeometry(4.2,0.03,0.85), zebMat);
          z2.position.set(cross*9.5, 0.04, -5.1 + s*2.2);
          scene.add(z2);
        }
      }

      // Puddles (reflective pools)
      for (let p = 0; p < 30; p++) {
        const pw = 0.8 + Math.random() * 3.2;
        const pd = 0.4 + Math.random() * 1.5;
        const pm = new T.MeshStandardMaterial({
          color: 0x0a1030, roughness: 0.0, metalness: 0.0,
          transparent: true, opacity: 0.18 + Math.random() * 0.14,
          depthWrite: false, envMap: scene.environment, envMapIntensity: 2.0,
        });
        const pu = new T.Mesh(new T.PlaneGeometry(pw,pd), pm);
        pu.rotation.x = -Math.PI / 2;
        pu.position.set(
          (Math.random() - 0.5) * 36,
          0.022,
          (Math.random() - 0.5) * 36
        );
        scene.add(pu);
      }

      /* ── SIDEWALK BLOCKS ──────────────────────── */
      const swMat = new T.MeshStandardMaterial({ color: 0x0c0c18, roughness: 0.95 });
      // Sidewalk pads between roads and buildings
      for (let sx = -3; sx <= 2; sx++) {
        for (let sz = -3; sz <= 2; sz++) {
          const bx = sx * 16; const bz = sz * 16;
          const sw = new T.Mesh(new T.BoxGeometry(10, 0.12, 10), swMat);
          sw.position.set(bx, 0.04, bz);
          sw.receiveShadow = true;
          scene.add(sw);
        }
      }

      /* ── BUILDINGS ─────────────────────────────── */
      interface Building {
        label: string; group: string;
        x: number; z: number; h: number; color: string;
        mesh: T.Mesh; roofLight: T.Mesh; glow: T.PointLight;
        collected: boolean; glowTarget: number;
      }
      const buildings: Building[] = [];

      const makeWindowCanvas = (col: string, h: number, lit: boolean) => {
        const rows = Math.max(3, Math.floor(h * 1.2));
        const cols = 4;
        const cw = 128, ch = rows * 28 + 16;
        const cnv = document.createElement("canvas");
        cnv.width = cw; cnv.height = ch;
        const ctx = cnv.getContext("2d");
        if (!ctx) return null;
        ctx.fillStyle = "#07070e";
        ctx.fillRect(0, 0, cw, ch);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const isLit = lit ? Math.random() > 0.15 : Math.random() > 0.55;
            if (!isLit) continue;
            const alpha = lit ? 0.85 + Math.random() * 0.15 : 0.4 + Math.random() * 0.4;
            if (lit) {
              ctx.fillStyle = col + Math.round(alpha * 255).toString(16).padStart(2,"0");
            } else {
              ctx.fillStyle = Math.random() > 0.6 ? `rgba(255,235,190,${alpha*0.6})` : `rgba(160,190,255,${alpha*0.5})`;
            }
            ctx.fillRect(8 + c * 30, 8 + r * 28, 18, 16);
          }
        }
        return new T.CanvasTexture(cnv);
      };

      SKILL_DATA.forEach(b => {
        const col   = GROUP_HEX[b.group] || "#ffffff";
        const threeCol = new T.Color(col);

        // Building body
        const geo = new T.BoxGeometry(b.w, b.h, b.d);
        // Vary building skin per group for visual diversity
        const skinTone = new T.Color(0.044 + Math.random()*0.02, 0.044 + Math.random()*0.02, 0.068 + Math.random()*0.02);
        const mat = new T.MeshStandardMaterial({
          color: skinTone,
          roughness: 0.62 + Math.random()*0.22,
          metalness: 0.18 + Math.random()*0.22,
          map: makeWindowCanvas(col, b.h, false),
          emissive: threeCol.clone().multiplyScalar(0.022),
          envMap: scene.environment,
          envMapIntensity: 0.9,
        });
        const mesh = new T.Mesh(geo, mat);
        mesh.position.set(b.x, b.h / 2, b.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        // Rooftop elements
        // Antenna
        const ant = new T.Mesh(
          new T.CylinderGeometry(0.04, 0.06, b.h * 0.2, 6),
          new T.MeshStandardMaterial({ color: 0x1a1a28, roughness: 0.9 })
        );
        ant.position.set(b.x + b.w*0.3, b.h + b.h*0.1, b.z + b.d*0.3);
        scene.add(ant);

        // Roof trim
        const roofTrim = new T.Mesh(
          new T.BoxGeometry(b.w + 0.3, 0.22, b.d + 0.3),
          new T.MeshStandardMaterial({ color: 0x111122, roughness: 0.8, metalness: 0.3 })
        );
        roofTrim.position.set(b.x, b.h + 0.11, b.z);
        scene.add(roofTrim);

        // Roof glow band
        const roofGlow = new T.Mesh(
          new T.BoxGeometry(b.w + 0.1, 0.06, b.d + 0.1),
          new T.MeshBasicMaterial({ color: threeCol, transparent: true, opacity: 0.28 })
        );
        roofGlow.position.set(b.x, b.h + 0.25, b.z);
        scene.add(roofGlow);

        // Edge wireframe
        const edges = new T.LineSegments(
          new T.EdgesGeometry(geo),
          new T.LineBasicMaterial({ color: threeCol, transparent: true, opacity: 0.09 })
        );
        mesh.add(edges);

        // Neon sign strip on building face (horizontal band near top)
        if (Math.random() > 0.35) {
          const signH = b.h * 0.82;
          const signMat = new T.MeshBasicMaterial({ color: threeCol, transparent: true, opacity: 0.75 });
          const sign = new T.Mesh(new T.BoxGeometry(b.w + 0.05, 0.1, 0.04), signMat);
          sign.position.set(b.x, signH, b.z + b.d/2 + 0.02);
          scene.add(sign);
          // Glow strip light
          const signLight = new T.PointLight(threeCol, 0.8, 6);
          signLight.position.set(b.x, signH, b.z + b.d/2 + 0.5);
          scene.add(signLight);
        }

        // Vertical accent strip on corner
        if (Math.random() > 0.5) {
          const stripMat = new T.MeshBasicMaterial({ color: threeCol, transparent: true, opacity: 0.55 });
          const strip = new T.Mesh(new T.BoxGeometry(0.05, b.h, 0.05), stripMat);
          strip.position.set(b.x + b.w/2 + 0.02, b.h/2, b.z + b.d/2 + 0.02);
          scene.add(strip);
        }

        // Point light above building
        const glow = new T.PointLight(threeCol, 0, 16);
        glow.position.set(b.x, b.h + 2, b.z);
        scene.add(glow);

        buildings.push({
          label: b.label, group: b.group,
          x: b.x, z: b.z, h: b.h, color: col,
          mesh, roofLight: roofGlow, glow,
          collected: false, glowTarget: 0,
        });
      });

      /* ── STREET LAMPS ─────────────────────────── */
      const poleMat = new T.MeshStandardMaterial({ color: 0x141420, roughness: 0.85, metalness: 0.4 });
      const lampPositions: [number,number][] = [];
      for (let i = -5; i <= 4; i++) {
        lampPositions.push([-16, i*14+7], [16, i*14+7], [i*14+7,-16], [i*14+7,16]);
      }
      lampPositions.forEach(([lx,lz]) => {
        // Pole
        const pole = new T.Mesh(new T.CylinderGeometry(0.07,0.1,6,8), poleMat);
        pole.position.set(lx,3,lz);
        pole.castShadow = true;
        scene.add(pole);
        // Curved arm
        const arm = new T.Mesh(new T.CylinderGeometry(0.04,0.04,2,6), poleMat);
        arm.rotation.z = -Math.PI/3;
        arm.position.set(lx+0.75,6.1,lz);
        scene.add(arm);
        // Fixture box
        const fix = new T.Mesh(
          new T.BoxGeometry(0.45,0.18,0.45),
          new T.MeshStandardMaterial({ color: 0x0e0e1c, roughness: 0.7, metalness: 0.5 })
        );
        fix.position.set(lx+1.35,5.7,lz);
        scene.add(fix);
        // Light cone diffuser
        const diff = new T.Mesh(
          new T.ConeGeometry(0.22,0.35,8,1,true),
          new T.MeshBasicMaterial({ color: 0xffe8bb, transparent: true, opacity: 0.85, side: T.DoubleSide })
        );
        diff.position.set(lx+1.35,5.52,lz);
        diff.rotation.x = Math.PI;
        scene.add(diff);
        // Actual light
        const lt = new T.PointLight(0xfff0cc, 2.5, 24);
        lt.position.set(lx+1.35,5.5,lz);
        scene.add(lt);
        // Ground pool
        const pool = new T.Mesh(
          new T.CircleGeometry(3.5,16),
          new T.MeshBasicMaterial({ color: 0x2a1e06, transparent: true, opacity: 0.32, depthWrite: false })
        );
        pool.rotation.x = -Math.PI/2;
        pool.position.set(lx+1.35,0.03,lz);
        scene.add(pool);
      });

      /* ── TREES ─────────────────────────────────── */
      const trunkMat = new T.MeshStandardMaterial({ color: 0x180f08, roughness: 1 });
      const treeSpots: [number,number][] = [
        [-6,-18],[6,-18],[-6,18],[6,18],
        [-6,-6],[6,-6],[-6,6],[6,6],
        [-18,6],[18,6],[-18,-6],[18,-6],
        [-18,18],[18,18],[-18,-18],[18,-18],
        [0,-18],[0,18],[-18,0],[18,0],
      ];
      treeSpots.forEach(([tx,tz]) => {
        const trunk = new T.Mesh(new T.CylinderGeometry(0.14,0.2,2.2,7), trunkMat);
        trunk.position.set(tx,1.1,tz);
        scene.add(trunk);
        // Layered foliage — dark green cones with slight colour variation
        [
          [0.0, 0,  3.0, 2.8],
          [0.3, 1.2,2.2, 2.2],
          [0.5, 2.2,1.5, 1.8],
        ].forEach(([dh,dy,r,ch]) => {
          const shade = 0x0a + Math.round(Math.random()*4);
          const leafM = new T.MeshStandardMaterial({
            color: new T.Color(0,shade/255*0.12,shade/255*0.08),
            roughness: 1, transparent: true, opacity: 0.88,
          });
          const cone = new T.Mesh(new T.ConeGeometry(r,ch,8), leafM);
          cone.position.set(tx,1.1+2.2+dy,tz);
          cone.castShadow = true;
          scene.add(cone);
        });
        // Subtle green ambient under tree
        const treeGlow = new T.PointLight(0x002200,0.4,5);
        treeGlow.position.set(tx,3,tz);
        scene.add(treeGlow);
      });

      /* ── DISTANT CITY BACKDROP ─────────────────── */
      // Far background buildings (very dark, just silhouettes)
      for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2;
        const dist  = 55 + Math.random() * 25;
        const bw    = 3 + Math.random() * 8;
        const bh    = 12 + Math.random() * 42;  // taller for dramatic skyline
        const bd    = 3 + Math.random() * 8;
        const silR = 0.015 + Math.random()*0.015;
        const silG = 0.015 + Math.random()*0.01;
        const silB = 0.03  + Math.random()*0.025;
        const silMat = new T.MeshBasicMaterial({
          color: new T.Color(silR, silG, silB),
        });
        const sil = new T.Mesh(new T.BoxGeometry(bw,bh,bd), silMat);
        sil.position.set(
          Math.cos(angle) * dist,
          bh / 2,
          Math.sin(angle) * dist
        );
        scene.add(sil);
        // Rooftop blink lights on distant buildings
        if (Math.random() > 0.6) {
          const blink = new T.Mesh(
            new T.SphereGeometry(0.15,4,4),
            new T.MeshBasicMaterial({ color: 0xff3333, transparent: true })
          );
          blink.position.set(Math.cos(angle)*dist, bh+0.2, Math.sin(angle)*dist);
          (blink as any)._blinkOffset = Math.random() * Math.PI * 2;
          scene.add(blink);
        }
      }

      /* ── AMBIENT PARTICLES (rain) ─────────────── */
      const N_RAIN = 800;
      const rainPos = new Float32Array(N_RAIN * 3);
      const rainVel = new Float32Array(N_RAIN);
      for (let i = 0; i < N_RAIN; i++) {
        rainPos[i*3]   = (Math.random()-0.5)*70;
        rainPos[i*3+1] = Math.random()*22;
        rainPos[i*3+2] = (Math.random()-0.5)*70;
        rainVel[i]     = 0.06 + Math.random()*0.1;
      }
      const rainGeo = new T.BufferGeometry();
      rainGeo.setAttribute("position", new T.BufferAttribute(rainPos,3));
      const rain = new T.Points(rainGeo, new T.PointsMaterial({
        color: 0x99aadd, size: 0.11, transparent: true, opacity: 0.18, sizeAttenuation: true,
      }));
      scene.add(rain);

      /* ── COLLECTION PARTICLES ─────────────────── */
      interface CP { mesh: T.Mesh; vx:number;vy:number;vz:number;life:number;max:number }
      const cpArr: CP[] = [];
      const burst = (x:number,y:number,z:number,col:string) => {
        const c3 = new T.Color(col);
        for (let i = 0; i < 55; i++) {
          const m = new T.Mesh(
            new T.SphereGeometry(0.07+Math.random()*0.13,4,4),
            new T.MeshBasicMaterial({ color:c3, transparent:true })
          );
          m.position.set(x,y+Math.random()*3,z);
          scene.add(m);
          const th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI;
          const sp=0.06+Math.random()*0.22;
          cpArr.push({ mesh:m, vx:Math.sin(ph)*Math.cos(th)*sp, vy:Math.abs(Math.cos(ph))*sp+0.06, vz:Math.sin(ph)*Math.sin(th)*sp, life:70, max:70 });
        }
      };

      /* ── LABEL SPRITES ─────────────────────────── */
      const labelMap = new Map<string,T.Sprite>();
      buildings.forEach(b => {
        const cnv = document.createElement("canvas");
        cnv.width = 340; cnv.height = 80;
        const ctx = cnv.getContext("2d");
        if (!ctx) return;

        // Pill BG
        const rc = 18;
        ctx.clearRect(0,0,340,80);
        const grad = ctx.createLinearGradient(0,0,0,80);
        grad.addColorStop(0,"rgba(8,8,18,0.92)");
        grad.addColorStop(1,"rgba(5,5,12,0.92)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(4,4,332,72,rc);
        ctx.fill();

        // Category colour border
        ctx.strokeStyle = b.color + "99";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Inner glow line at top
        ctx.strokeStyle = b.color + "44";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(8,6,328,4,4);
        ctx.stroke();

        // Dot
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(26,40,6,0,Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = "bold 24px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#efefef";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(b.label, 42, 40);

        const tex = new T.CanvasTexture(cnv);
        const sp  = new T.Sprite(new T.SpriteMaterial({
          map: tex, transparent:true, opacity:0, depthTest:false, depthWrite:false
        }));
        sp.scale.set(5.2,1.2,1);
        sp.position.set(b.x, b.h+2.4, b.z);
        scene.add(sp);
        labelMap.set(b.label, sp);
      });

      /* ── CAR ───────────────────────────────────── */
      const car = new T.Group();

      // Chassis — slightly arched
      const bodyMat = new T.MeshStandardMaterial({
        color: 0xdde0f0, roughness: 0.12, metalness: 0.98,
        envMap: scene.environment, envMapIntensity: 3.0,
      });
      const body = new T.Mesh(new T.BoxGeometry(1.7,0.38,3.4), bodyMat);
      body.position.y = 0.4; body.castShadow = true;
      car.add(body);

      // Side sills
      [-0.9,0.9].forEach(sx => {
        const sill = new T.Mesh(new T.BoxGeometry(0.12,0.1,3.2),
          new T.MeshStandardMaterial({ color:0x111120, roughness:0.7, metalness:0.4 }));
        sill.position.set(sx,0.22,0);
        car.add(sill);
      });

      // Cabin top
      const cabMat = new T.MeshStandardMaterial({ color:0x0c0c1a, roughness:0.25, metalness:0.5, transparent:true, opacity:0.92 });
      const cab = new T.Mesh(new T.BoxGeometry(1.5,0.42,1.6), cabMat);
      cab.position.set(0,0.82,-0.1); cab.castShadow = true;
      car.add(cab);

      // Windshield
      const wsM = new T.MeshStandardMaterial({ color:0x223344, roughness:0.05, transparent:true, opacity:0.62 });
      const ws = new T.Mesh(new T.PlaneGeometry(1.38,0.42), wsM);
      ws.position.set(0,0.79,0.69); ws.rotation.x = -0.42;
      car.add(ws);
      // Rear screen
      const rs = new T.Mesh(new T.PlaneGeometry(1.38,0.38), wsM);
      rs.position.set(0,0.8,-0.9); rs.rotation.x = 0.35;
      car.add(rs);

      // Bonnet slope
      const bonMat = new T.MeshStandardMaterial({ color:0xdde0f0, roughness:0.12, metalness:0.98, envMap:scene.environment, envMapIntensity:2.5 });
      const bon = new T.Mesh(new T.BoxGeometry(1.65,0.1,1.1), bonMat);
      bon.position.set(0,0.53,1.2); bon.rotation.x = -0.14;
      car.add(bon);

      // Front / rear bumpers
      const bumMat = new T.MeshStandardMaterial({ color:0x0e0e1e, roughness:0.65, metalness:0.3 });
      const fb = new T.Mesh(new T.BoxGeometry(1.72,0.25,0.2), bumMat);
      fb.position.set(0,0.22,1.75); car.add(fb);
      const rb = new T.Mesh(new T.BoxGeometry(1.72,0.25,0.2), bumMat);
      rb.position.set(0,0.22,-1.75); car.add(rb);

      // Grille
      const gMesh = new T.Mesh(new T.BoxGeometry(0.9,0.12,0.06),
        new T.MeshBasicMaterial({ color:0x112233 }));
      gMesh.position.set(0,0.3,1.77); car.add(gMesh);

      // Wheels
      const tyreM = new T.MeshStandardMaterial({ color:0x0b0b0b, roughness:0.95 });
      const rimM  = new T.MeshStandardMaterial({ color:0x4a4a5e, metalness:0.96, roughness:0.08, envMap:scene.environment, envMapIntensity:2.5 });
      const wheelDefs: [number,number,number][] = [
        [-0.96,0.28,1.15],[ 0.96,0.28,1.15],
        [-0.96,0.28,-1.15],[ 0.96,0.28,-1.15],
      ];
      const wheelGrps: T.Group[] = [];
      const steerGrps: T.Group[] = []; // front two for steering visual
      wheelDefs.forEach(([wx,wy,wz],wi) => {
        const wg = new T.Group();
        wg.position.set(wx,wy,wz);
        // Tyre
        const tyre = new T.Mesh(new T.CylinderGeometry(0.32,0.32,0.24,22), tyreM);
        tyre.rotation.z = Math.PI/2;
        wg.add(tyre);
        // Tyre tread rings
        for (let t=0;t<3;t++){
          const tr = new T.Mesh(new T.TorusGeometry(0.32,0.025,6,22),
            new T.MeshStandardMaterial({color:0x141414,roughness:1}));
          tr.rotation.y = Math.PI/2;
          tr.position.x = wx>0 ? -0.07+t*0.07 : 0.07-t*0.07;
          wg.add(tr);
        }
        // Rim
        const rim = new T.Mesh(new T.CylinderGeometry(0.21,0.21,0.25,12), rimM);
        rim.rotation.z = Math.PI/2;
        wg.add(rim);
        // 5 spokes
        for (let s=0;s<5;s++){
          const spoke = new T.Mesh(new T.BoxGeometry(0.055,0.38,0.055),
            new T.MeshStandardMaterial({color:0x555568,metalness:0.9,roughness:0.15}));
          spoke.rotation.z = (s/5)*Math.PI*2;
          spoke.position.x = wx>0 ? 0.13 : -0.13;
          wg.add(spoke);
        }
        // Hub cap
        const hub = new T.Mesh(new T.CylinderGeometry(0.06,0.06,0.26,8),
          new T.MeshBasicMaterial({color:0x9999aa}));
        hub.rotation.z = Math.PI/2;
        wg.add(hub);

        car.add(wg);
        wheelGrps.push(wg);
        if (wi < 2) steerGrps.push(wg);
      });

      // Headlights
      const hlMat = new T.MeshBasicMaterial({ color:0xfff8e0 });
      const tlMat = new T.MeshBasicMaterial({ color:0xff2200 });
      [-0.62,0.62].forEach(hx => {
        const hl = new T.Mesh(new T.BoxGeometry(0.32,0.1,0.06), hlMat);
        hl.position.set(hx,0.42,1.73); car.add(hl);
        // DRL strip
        const drl = new T.Mesh(new T.BoxGeometry(0.28,0.04,0.04), new T.MeshBasicMaterial({color:0xffffff}));
        drl.position.set(hx,0.47,1.74); car.add(drl);
        const tl = new T.Mesh(new T.BoxGeometry(0.28,0.1,0.06), tlMat);
        tl.position.set(hx,0.42,-1.73); car.add(tl);
      });

      // Spotlight beams
      const mkSpot = (ox:number) => {
        const sl = new T.SpotLight(0xfff5e0,12,35,Math.PI/11,0.55,1.8);
        sl.position.set(ox,0.55,1.6);
        sl.target.position.set(ox,-0.5,14);
        car.add(sl); car.add(sl.target);
        return sl;
      };
      mkSpot(-0.55); mkSpot(0.55);

      // Neon underglow
      const neonL = new T.PointLight(0x2244ff,3.5,5);
      neonL.position.set(0,-0.08,0);
      car.add(neonL);
      const neonStrip = new T.Mesh(new T.BoxGeometry(1.5,0.03,3.0),
        new T.MeshBasicMaterial({color:0x1133cc,transparent:true,opacity:0.8}));
      neonStrip.position.set(0,0.01,0);
      car.add(neonStrip);

      car.position.set(0,0,10);
      scene.add(car);

      /* ── PHYSICS STATE ─────────────────────────── */
      const ph = {
        x:0, z:10, angle:0,
        speed:0, angVel:0, steerVis:0,
        susp: [0,0,0,0] as number[],
        suspV:[0,0,0,0] as number[],
      };

      /* KEY PHYSICS — refined for slow cinematic feel */
      const PHYS = {
        maxFwd:    0.032,   // leisurely crawl — like a real city speed limit
        maxRev:    0.015,
        accel:     0.0010,  // very gradual build — feels weighty
        friction:  0.978,   // speed bleeds very slowly, roll feels real
        turnMax:   0.0085,  // half the old value — much calmer steering
        turnDamp:  0.94,    // high damping — turn eases in AND out smoothly
        angCap:    0.011,   // tight cap — absolutely no snap/spin
        suspK:     0.28,    // softer spring = more float
        suspD:     0.68,    // well-damped — no bouncing
      };

      /* ── CAMERA STATE ──────────────────────────── */
      const camPos = new T.Vector3(0,5,14);
      const camLook = new T.Vector3(0,1,0);

      /* ── GAME LOOP ─────────────────────────────── */
      let t = 0;
      const localCol = new Set<string>();

      const tick = () => {
        if (dead) return;
        rafRef.current = requestAnimationFrame(tick);
        t += 0.016;

        /* Input */
        const K = keysRef.current;
        const TC = touchRef.current;
        const fwd  = K.has("ArrowUp")   ||K.has("w")||K.has("W")||(TC.active&&TC.dy<-18);
        const back = K.has("ArrowDown") ||K.has("s")||K.has("S")||(TC.active&&TC.dy>18);
        const lft  = K.has("ArrowLeft") ||K.has("a")||K.has("A")||(TC.active&&TC.dx<-18);
        const rgt  = K.has("ArrowRight")||K.has("d")||K.has("D")||(TC.active&&TC.dx>18);

        /* Speed */
        if (fwd)  ph.speed = Math.min(PHYS.maxFwd,  ph.speed + PHYS.accel);
        if (back) ph.speed = Math.max(-PHYS.maxRev, ph.speed - PHYS.accel);
        ph.speed *= PHYS.friction;

        /* Turn — progressive only at speed, very gentle */
        const speedPct = Math.abs(ph.speed) / PHYS.maxFwd;
        // Gentle cubic — very little turn at low speed, smooth peak, no snap
        // At 10% speed → 2.7% authority. At 50% → 50%. At 100% → 85%.
        const turnAuth = (speedPct * speedPct * (3 - 2 * speedPct)) * 0.85 * PHYS.turnMax;
        const dir = ph.speed >= 0 ? 1 : -1;
        if (lft) ph.angVel += turnAuth * dir;
        if (rgt) ph.angVel -= turnAuth * dir;
        ph.angVel *= PHYS.turnDamp;
        ph.angVel = Math.max(-PHYS.angCap, Math.min(PHYS.angCap, ph.angVel));
        ph.angle += ph.angVel;

        /* Position */
        ph.x += Math.sin(ph.angle) * ph.speed;
        ph.z += Math.cos(ph.angle) * ph.speed;
        ph.x = Math.max(-60, Math.min(60, ph.x));
        ph.z = Math.max(-60, Math.min(60, ph.z));

        /* Suspension */
        for (let w=0;w<4;w++){
          const bump = Math.abs(ph.speed) * (Math.random()-0.5) * 0.06;
          ph.suspV[w] += (-ph.susp[w]*PHYS.suspK) - (ph.suspV[w]*PHYS.suspD) + bump;
          ph.susp[w]  += ph.suspV[w];
          ph.susp[w]   = Math.max(-0.1, Math.min(0.1, ph.susp[w]));
        }
        const avgS = (ph.susp[0]+ph.susp[1]+ph.susp[2]+ph.susp[3])/4;
        const roll = (ph.susp[0]+ph.susp[2]-ph.susp[1]-ph.susp[3])*0.25;
        const pitch= (ph.susp[0]+ph.susp[1]-ph.susp[2]-ph.susp[3])*0.22;

        /* Update car mesh */
        car.position.set(ph.x, 0.02+avgS*0.4, ph.z);
        car.rotation.y = ph.angle;
        car.rotation.z = roll;
        car.rotation.x = pitch + ph.speed*0.06;

        /* Steer visual on front wheels */
        ph.steerVis += ((lft?0.42:rgt?-0.42:0) - ph.steerVis)*0.14;
        steerGrps[0].rotation.y = ph.steerVis;
        steerGrps[1].rotation.y = ph.steerVis;

        /* Wheel spin */
        wheelGrps.forEach(wg => { wg.children[0].rotation.x += ph.speed*5; });

        /* Neon */
        neonL.intensity = 3.2 + Math.sin(t*6)*0.5;
        neonStrip.material.opacity = 0.75 + Math.sin(t*6)*0.12;

        /* Camera — smooth cinematic follow */
        const cd = 9.5 - Math.abs(ph.speed)*120;
        const ch = 4.8 + Math.abs(ph.speed)*90;
        const tx = ph.x - Math.sin(ph.angle)*cd;
        const tz = ph.z - Math.cos(ph.angle)*cd;
        camPos.x += (tx - camPos.x)*0.06;
        camPos.y += (ch - camPos.y)*0.05;
        camPos.z += (tz - camPos.z)*0.06;
        // Camera shake proportional to speed
        const shk = Math.abs(ph.speed)*0.6;
        cam.position.set(
          camPos.x + (Math.random()-0.5)*shk*0.04,
          camPos.y + (Math.random()-0.5)*shk*0.02,
          camPos.z
        );
        const lookTgt = new T.Vector3(
          ph.x + Math.sin(ph.angle)*5.5,
          1.1,
          ph.z + Math.cos(ph.angle)*5.5
        );
        camLook.lerp(lookTgt, 0.07);
        cam.lookAt(camLook);

        /* Speed state for HUD */
        setSpeedVal(Math.abs(ph.speed));

        /* Building logic */
        let nearLabel:string|null=null, nearGroup:string|null=null, nearDist=999;
        buildings.forEach(b => {
          const dx=ph.x-b.x, dz=ph.z-b.z;
          const d=Math.sqrt(dx*dx+dz*dz);

          // Label float + fade
          const sp = labelMap.get(b.label);
          if (sp) {
            const tOp = d<10 ? (1-d/10)*0.98 : 0;
            (sp.material as any).opacity += (tOp-(sp.material as any).opacity)*0.08;
            sp.position.y = b.h+2.4+Math.sin(t*1.1+b.x)*0.18;
          }

          // Glow
          if (!b.collected) {
            b.glowTarget = d<14 ? (1-d/14)*3.5*(0.65+Math.sin(t*2.2+b.z)*0.35) : 0;
          } else {
            b.glowTarget = 2.0+Math.sin(t*1.6+b.x)*0.5;
          }
          b.glow.intensity += (b.glowTarget-b.glow.intensity)*0.1;

          // Roof glow
          if (!b.collected){
            (b.roofLight.material as any).opacity = 0.18+(d<10?(1-d/10)*0.45:0)+Math.sin(t*2+b.x)*0.07;
          } else {
            (b.roofLight.material as any).opacity = 0.75+Math.sin(t*1.5+b.x)*0.18;
          }

          // Nearest uncollected
          if (!b.collected && d<nearDist) { nearDist=d; nearLabel=b.label; nearGroup=b.group; }

          // Collect
          if (!b.collected && d<2.3) {
            b.collected=true; localCol.add(b.label);
            setCollected(new Set(localCol));
            setJustCollected(b.label);
            setTimeout(()=>setJustCollected(null),2400);
            (b.mesh.material as any).emissive = new T.Color(b.color).multiplyScalar(0.22);
            (b.mesh.material as any).color    = new T.Color(b.color).multiplyScalar(0.3);
            b.glow.distance=18;
            burst(b.x, b.h/2, b.z, b.color);
          }
        });
        setNearSkill(nearDist<6 ? {label:nearLabel!,group:nearGroup!} : null);

        /* Collect particles */
        for (let i=cpArr.length-1;i>=0;i--){
          const p=cpArr[i];
          p.mesh.position.x+=p.vx; p.mesh.position.y+=p.vy; p.mesh.position.z+=p.vz;
          p.vy-=0.0035; p.life--;
          (p.mesh.material as any).opacity=p.life/p.max;
          if(p.life<=0){ scene.remove(p.mesh); cpArr.splice(i,1); }
        }

        /* Rain */
        const rp = rainGeo.attributes.position as T.BufferAttribute;
        for (let i=0;i<N_RAIN;i++){
          const y=rp.getY(i)-rainVel[i];
          rp.setY(i, y<0 ? 22 : y);
          rp.setX(i, rp.getX(i)+ph.speed*Math.sin(ph.angle)*0.4);
          rp.setZ(i, rp.getZ(i)+ph.speed*Math.cos(ph.angle)*0.4);
        }
        rp.needsUpdate=true;

        /* Sky glow (city light shifts with speed) */
        (skyMat.uniforms as any).uGlow.value.setHex(0x080828);

        /* Blinking roof lights on distant buildings */
        scene.children.forEach((ch:any) => {
          if (ch._blinkOffset !== undefined) {
            const on = Math.sin(t*2.5+ch._blinkOffset) > 0.6;
            if (ch.material) (ch.material as any).opacity = on ? 1 : 0.05;
          }
        });

        /* Minimap */
        const mc = minimapRef.current;
        if (mc) {
          const ctx = mc.getContext("2d");
          if (ctx) {
            const S=150, sc=S/110;
            mc.width=S; mc.height=S;
            ctx.fillStyle="rgba(4,4,12,0.97)"; ctx.fillRect(0,0,S,S);
            // Roads
            ctx.fillStyle="#0d0d20";
            ctx.fillRect(0,S/2-3.5,S,7); ctx.fillRect(S/2-3.5,0,7,S);
            ctx.fillStyle="#080814";
            [[-12,0],[12,0],[0,-12],[0,12]].forEach(([rx,rz])=>{
              if(rx!==0) ctx.fillRect(0,S/2+rz*sc-2,S,4);
              else ctx.fillRect(S/2+rx*sc-2,0,4,S);
            });
            // Buildings
            SKILL_DATA.forEach(b=>{
              const bx=b.x*sc+S/2, bz=b.z*sc+S/2;
              const col=GROUP_HEX[b.group]||"#fff";
              ctx.fillStyle=localCol.has(b.label)?col+"cc":col+"2a";
              ctx.strokeStyle=localCol.has(b.label)?col:col+"44";
              ctx.lineWidth=0.5;
              ctx.fillRect(bx-b.w*sc/2,bz-b.d*sc/2,b.w*sc,b.d*sc);
              ctx.strokeRect(bx-b.w*sc/2,bz-b.d*sc/2,b.w*sc,b.d*sc);
            });
            // Car arrow
            ctx.save();
            ctx.translate(ph.x*sc+S/2, ph.z*sc+S/2);
            ctx.rotate(-ph.angle);
            ctx.fillStyle="#ffffff";
            ctx.beginPath(); ctx.moveTo(0,-7); ctx.lineTo(-3.5,5); ctx.lineTo(3.5,5); ctx.closePath();
            ctx.fill();
            ctx.restore();
            // Frame
            ctx.strokeStyle="rgba(255,255,255,0.07)"; ctx.lineWidth=1;
            ctx.strokeRect(0,0,S,S);
          }
        }

        R.render(scene,cam);
      };
      tick();

      /* Input */
      const kd=(e:KeyboardEvent)=>{ keysRef.current.add(e.key); if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); };
      const ku=(e:KeyboardEvent)=>keysRef.current.delete(e.key);
      window.addEventListener("keydown",kd,{passive:false});
      window.addEventListener("keyup",ku);
      const resize=()=>{ if(!mountRef.current)return; const w=mountRef.current.clientWidth,h=mountRef.current.clientHeight; cam.aspect=w/h; cam.updateProjectionMatrix(); R.setSize(w,h); };
      window.addEventListener("resize",resize);

      (mount as any)._kill=()=>{ dead=true; cancelAnimationFrame(rafRef.current); window.removeEventListener("keydown",kd); window.removeEventListener("keyup",ku); window.removeEventListener("resize",resize); R.dispose(); if(mount.contains(R.domElement)) mount.removeChild(R.domElement); };
    })();

    return ()=>{ const m=mountRef.current as any; if(m?._kill) m._kill(); };
  }, [started]);

  /* Touch */
  const ts=(e:React.TouchEvent)=>{ const t=e.touches[0]; touchRef.current={active:true,dx:0,dy:0,sx:t.clientX,sy:t.clientY}; };
  const tm=(e:React.TouchEvent)=>{ if(!touchRef.current.active)return; const t=e.touches[0]; touchRef.current.dx=t.clientX-touchRef.current.sx; touchRef.current.dy=t.clientY-touchRef.current.sy; };
  const te=()=>{ touchRef.current={active:false,dx:0,dy:0,sx:0,sy:0}; keysRef.current.clear(); };

  const cnt = collected.size;
  const pct = Math.round((cnt/total)*100);
  const kmh = Math.round(speedVal*900);

  /* ── SPLASH ── */
  if (!started) return (
    <div className="relative w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center"
      style={{ height:580, background:"#030308", border:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"55px 55px", backgroundPosition:"-1px -1px" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 65% 55% at 50% 65%, rgba(40,40,140,0.07) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none" style={{ background:"linear-gradient(to top, rgba(20,20,60,0.18) 0%, transparent 100%)" }} />

      <div className="relative z-10 flex flex-col items-center gap-7 px-8 text-center max-w-lg">
        <div>
          <div className="font-display font-light text-[56px] leading-none mb-1" style={{ letterSpacing:"-0.045em", color:"#efefef" }}>
            Skill<span className="italic text-[#9a9a9a]">City</span>
          </div>
          <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#303030]">Interactive Portfolio</div>
        </div>

        <p className="text-[13.5px] text-[#555] font-light leading-relaxed max-w-sm">
          Drive through a living city at night. Every building holds one of my skills — collect all&nbsp;
          <strong className="text-[#9a9a9a] font-normal">{total}</strong> to light up the skyline.
        </p>

        <div className="flex items-center gap-4">
          {[["W / ↑","Accelerate"],["S / ↓","Brake"],["A D / ←→","Steer"]].map(([k,d])=>(
            <div key={k} className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <kbd className="px-2.5 py-1 rounded text-[11px] font-mono" style={{ background:"#141428", border:"1px solid rgba(255,255,255,0.1)", color:"#9a9a9a" }}>{k}</kbd>
              <span className="text-[10px] text-[#303030]">{d}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(GROUP_HEX).map(([g,col])=>(
            <div key={g} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px]"
              style={{ background:col+"10", border:"1px solid "+col+"28", color:col }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background:col }} />{g}
            </div>
          ))}
        </div>

        <button onClick={()=>setStarted(true)}
          className="group flex items-center gap-3 px-10 py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.977]"
          style={{ background:"#efefef", color:"#030308" }}>
          Start Engine
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <div className="text-[10px] text-[#252535] font-mono">{total} skills hidden in the city</div>
      </div>
    </div>
  );

  /* ── GAME ── */
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height:580, border:"1px solid rgba(255,255,255,0.07)" }}>
      <div ref={mountRef} className="absolute inset-0" onTouchStart={ts} onTouchMove={tm} onTouchEnd={te} />

      {/* Top progress */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/[0.04] z-20">
        <div className="h-full transition-all duration-700" style={{ width:pct+"%", background:"linear-gradient(90deg,#44ee88,#8899ff)" }} />
      </div>

      {/* Top-left HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="px-4 py-3 rounded-2xl" style={{ background:"rgba(3,3,10,0.9)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[8.5px] text-[#252535] font-mono uppercase tracking-widest mb-1">Skills Collected</div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-light text-[28px] text-[#efefef]" style={{ letterSpacing:"-0.045em" }}>{cnt}</span>
            <span className="text-[12px] text-[#252535]">/ {total}</span>
          </div>
          <div className="mt-2 h-0.5 rounded-full overflow-hidden bg-white/[0.05]">
            <div className="h-full rounded-full transition-all duration-500" style={{ width:pct+"%", background:"linear-gradient(90deg,#44ee88,#8899ff)" }} />
          </div>
        </div>

        {/* Speedometer */}
        <div className="px-3.5 py-2.5 rounded-xl flex items-center gap-3" style={{ background:"rgba(3,3,10,0.9)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div className="font-mono text-[20px] font-bold text-[#efefef] leading-none">{kmh}</div>
            <div className="text-[8px] text-[#252535] font-mono uppercase tracking-widest mt-0.5">km/h</div>
          </div>
          <div className="flex gap-0.5 items-end h-5">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="w-1.5 rounded-sm transition-all duration-100"
                style={{ height:4+i*2.5, background: kmh>i*6 ? (kmh>32?"#ff5555":"#44ee88") : "rgba(255,255,255,0.07)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 right-4 z-20 rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.07)", width:150, height:150 }}>
        <canvas ref={minimapRef} width={150} height={150} style={{ display:"block" }} />
        <div className="absolute top-1.5 left-2 text-[7.5px] font-mono text-white/15 uppercase tracking-wider">Map</div>
      </div>

      {/* Near skill */}
      {nearSkill && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{
            background:"rgba(3,3,10,0.94)", backdropFilter:"blur(20px)",
            border:"1px solid "+(GROUP_HEX[nearSkill.group]||"#fff")+"38",
            boxShadow:"0 0 28px "+(GROUP_HEX[nearSkill.group]||"#fff")+"18",
          }}>
            <div className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
              style={{ background:GROUP_HEX[nearSkill.group]||"#fff", boxShadow:"0 0 10px "+(GROUP_HEX[nearSkill.group]||"#fff") }} />
            <div>
              <div className="text-[13px] font-mono font-semibold text-[#efefef]">{nearSkill.label}</div>
              <div className="text-[10px] text-[#555]">{nearSkill.group}</div>
            </div>
            {!collected.has(nearSkill.label) && (
              <div className="text-[10px] font-mono px-2.5 py-1 rounded-lg animate-pulse"
                style={{ background:(GROUP_HEX[nearSkill.group]||"#fff")+"15", color:GROUP_HEX[nearSkill.group]||"#fff", border:"1px solid "+(GROUP_HEX[nearSkill.group]||"#fff")+"28" }}>
                drive through
              </div>
            )}
            {collected.has(nearSkill.label) && <div className="text-[10px] text-[#44ee88]">collected</div>}
          </div>
        </div>
      )}

      {/* Collected toast */}
      {justCollected && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          style={{ animation:"skillToast 2.4s ease-out forwards" }}>
          <div className="text-center px-7 py-4 rounded-2xl" style={{
            background:"rgba(3,3,10,0.92)", backdropFilter:"blur(20px)",
            border:"1px solid rgba(68,238,136,0.25)",
            boxShadow:"0 0 40px rgba(68,238,136,0.15)",
          }}>
            <div className="text-[10px] text-[#44ee88] font-mono uppercase tracking-[0.2em] mb-1">Unlocked</div>
            <div className="font-display font-light text-[24px] text-[#efefef]" style={{ letterSpacing:"-0.03em" }}>{justCollected}</div>
          </div>
        </div>
      )}

      {/* Collected chips */}
      {cnt > 0 && (
        <div className="absolute top-4 right-44 z-20 max-w-[175px]">
          <div className="px-3 py-2.5 rounded-xl" style={{ background:"rgba(3,3,10,0.88)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[8px] text-[#252535] font-mono uppercase tracking-widest mb-2">Recent</div>
            <div className="flex flex-wrap gap-1">
              {Array.from(collected).slice(-9).map(s=>(
                <span key={s} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background:"rgba(68,238,136,0.08)", color:"#44ee88", border:"1px solid rgba(68,238,136,0.18)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-20 text-[8.5px] text-white/12 font-mono">WASD or Arrow Keys</div>

      {/* Victory */}
      {cnt === total && (
        <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ background:"rgba(3,3,10,0.88)", backdropFilter:"blur(14px)" }}>
          <div className="text-center px-12 py-14 rounded-3xl" style={{ background:"rgba(6,6,18,0.97)", border:"1px solid rgba(68,238,136,0.25)", boxShadow:"0 0 80px rgba(68,238,136,0.12)" }}>
            <div className="text-[52px] mb-5">🏙️</div>
            <div className="font-display font-light text-[38px] text-[#efefef] mb-2" style={{ letterSpacing:"-0.04em" }}>City Mastered</div>
            <div className="text-[13px] text-[#9a9a9a] mb-8">{total} skills unlocked across all districts</div>
            <button onClick={()=>{setCollected(new Set());setStarted(false);}}
              className="px-8 py-3 rounded-xl text-[13.5px] font-semibold"
              style={{ background:"#efefef", color:"#030308" }}>
              Drive Again
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes skillToast {
          0%   { opacity:0; transform:translate(-50%,-30%); }
          12%  { opacity:1; transform:translate(-50%,-50%); }
          72%  { opacity:1; transform:translate(-50%,-56%); }
          100% { opacity:0; transform:translate(-50%,-80%); }
        }
      `}</style>
    </div>
  );
}
