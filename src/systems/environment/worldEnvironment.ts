/**
 * World environment — one responsibility: what surfaces remember.
 *
 * Reflections in this dimension must reflect *this* dimension. Instead
 * of an HDR photograph of Earth, a tiny procedural scene — the void, a
 * cold-blue horizon of energy, one distant white source — is rendered
 * once through PMREM and becomes `scene.environment`.
 *
 * Zero network requests. A few milliseconds at boot. Every metallic
 * and glassy surface then carries the same sky in its skin.
 */

import * as THREE from 'three';

export function installWorldEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
  const env = new THREE.Scene();

  // The void with a faint vertical gradient — darkness is never flat.
  const gradient = new THREE.Mesh(
    new THREE.SphereGeometry(10, 16, 16),
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color: new THREE.Color('#05050a'),
    }),
  );
  env.add(gradient);

  // A cold band of civilization-light along one horizon.
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 2.4, 32, 1, true),
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color: new THREE.Color('#1d2b52'),
    }),
  );
  band.position.y = -1.5;
  env.add(band);

  // One distant white source — the same light the journey travels toward.
  const key = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#c7cde0') }),
  );
  key.position.set(-4, 4, -6);
  key.lookAt(0, 0, 0);
  env.add(key);

  // A faint warm counter-glint: the gold accent, present but rare.
  const counter = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 1.4),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#4a3c1c') }),
  );
  counter.position.set(5, -2, 4);
  counter.lookAt(0, 0, 0);
  env.add(counter);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.06);
  scene.environment = target.texture;

  // The tiny scene has served its purpose.
  env.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  pmrem.dispose();
}
