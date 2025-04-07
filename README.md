
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js 3D 도시 풍경 (현실감 추가)</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #87CEEB; /* 하늘색 배경 */
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <!-- Three.js 라이브러리 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
  <!-- OrbitControls (카메라 컨트롤) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/examples/js/controls/OrbitControls.js"></script>
  <script>
    // 렌더러 생성 및 그림자 활성화
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // 씬과 포그 추가
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87CEEB, 100, 300);

    // 카메라 설정
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    // OrbitControls로 카메라 조작 가능하게
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // 환경맵 (CubeTexture) 추가로 현실감 부여
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const envMap = cubeTextureLoader.load([
      'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
    ]);
    scene.background = envMap;
    scene.environment = envMap;

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // 1. 콘크리트 (평면 바닥, 그림자 받기)
    const concreteGeometry = new THREE.PlaneGeometry(200, 200);
    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: 0xA9A9A9,
      roughness: 0.8,
      metalness: 0.2
    });
    const concrete = new THREE.Mesh(concreteGeometry, concreteMaterial);
    concrete.rotation.x = -Math.PI / 2;
    concrete.position.y = -10;
    concrete.receiveShadow = true;
    scene.add(concrete);

    // 2. 잔디 (평면, 그림자 받기)
    const grassGeometry = new THREE.PlaneGeometry(150, 150);
    const grassMaterial = new THREE.MeshStandardMaterial({
      color: 0x00FF00,
      roughness: 1.0
      // 고해상도 텍스처 적용 시 주석 해제
      // map: new THREE.TextureLoader().load('잔디_텍스처_URL')
    });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -9.9;
    grass.receiveShadow = true;
    scene.add(grass);

    // 3. 고해상도 집 (박스 + 지붕, 그림자 처리)
    const houseBodyGeometry = new THREE.BoxGeometry(20, 20, 20);
    const houseBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.7
      // 집 벽 텍스처 사용 시 주석 해제
      // map: new THREE.TextureLoader().load('집_벽_텍스처_URL')
    });
    const houseBody = new THREE.Mesh(houseBodyGeometry, houseBodyMaterial);
    houseBody.position.set(-30, 0, 0);
    houseBody.castShadow = true;
    houseBody.receiveShadow = true;
    scene.add(houseBody);

    const roofGeometry = new THREE.ConeGeometry(15, 10, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF0000,
      roughness: 0.6
      // 지붕 텍스처 사용 시 주석 해제
      // map: new THREE.TextureLoader().load('지붕_텍스처_URL')
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(-30, 15, 0);
    roof.castShadow = true;
    roof.receiveShadow = true;
    scene.add(roof);

    // 4. 고해상도 가로등 (기둥 + 불빛, 그림자 처리)
    const poleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 30, 32);
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.5
      // 가로등 기둥 텍스처 사용 시 주석 해제
      // map: new THREE.TextureLoader().load('가로등_기둥_텍스처_URL')
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(30, 5, 0);
    pole.castShadow = true;
    pole.receiveShadow = true;
    scene.add(pole);

    // 가로등 불빛 (Emissive 속성을 사용해 빛나는 효과)
    const lightGeometry = new THREE.SphereGeometry(2, 32, 32);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFF00,
      emissive: 0xFFFF00,
      emissiveIntensity: 1
    });
    const lampLight = new THREE.Mesh(lightGeometry, lightMaterial);
    lampLight.position.set(30, 20, 0);
    lampLight.castShadow = true;
    scene.add(lampLight);

    // 애니메이션 루프
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // 창 크기 조정 처리
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
