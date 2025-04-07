<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Three.js 태양 예제</title>
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <!-- Three.js와 포스트 프로세싱 스크립트 로드 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r150/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/postprocessing/EffectComposer.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/postprocessing/RenderPass.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/postprocessing/UnrealBloomPass.js"></script>
  <script>
    // 기본 씬, 카메라, 렌더러 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 50;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 태양 Mesh 생성 (빛나는 재질 사용)
    const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xFDB813,           // 태양의 기본 색상 (주황빛)
      emissive: 0xFDB813,        // 발광 색상
      emissiveIntensity: 2,       // 발광 강도
      roughness: 0.3,
      metalness: 0.1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // 태양 위치에 PointLight 추가 (주변 밝기 효과)
    const sunLight = new THREE.PointLight(0xFDB813, 2, 200);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 포스트 프로세싱: 블룸 효과 적용
    const composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0;
    composer.addPass(bloomPass);
    
    // 애니메이션 루프 (태양이 서서히 회전)
    function animate() {
      requestAnimationFrame(animate);
      sun.rotation.y += 0.005;
      composer.render();
    }
    animate();
    
    // 창 크기 변경 대응
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
