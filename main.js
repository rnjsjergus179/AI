/* 사이트 링크 객체 */
const SITE_LINKS = {
  "구글": "https://www.google.com",
  "빙": "https://www.bing.com",
  "네이버": "https://www.naver.com",
  "다음": "https://www.daum.net",
  "유튜브": "https://www.youtube.com",
  "넷플릭스": "https://www.netflix.com",
  "트위치": "https://www.twitch.tv",
  "틱톡": "https://www.tiktok.com",
  "인스타": "https://www.instagram.com",
  "인스타그램": "https://www.instagram.com",
  "페이스북": "https://www.facebook.com",
  "트위터": "https://x.com",
  "엑스": "https://x.com",
  "링크드인": "https://www.linkedin.com",
  "레딧": "https://www.reddit.com",
  "아마존": "https://www.amazon.com",
  "쿠팡": "https://www.coupang.com",
  "11번가": "https://www.11st.co.kr",
  "지마켓": "https://www.gmarket.co.kr",
  "bbc": "https://www.bbc.com",
  "cnn": "https://edition.cnn.com",
  "ytn": "https://www.ytn.co.kr",
  "연합뉴스": "https://www.yna.co.kr",
  "깃허브": "https://github.com",
  "스택오버플로우": "https://stackoverflow.com",
  "mdn": "https://developer.mozilla.org",
  "스포티파이": "https://www.spotify.com",
  "멜론": "https://www.melon.com",
  "벅스": "https://music.bugs.co.kr",
  "imdb": "https://www.imdb.com",
  "유데미": "https://www.udemy.com",
  "코세라": "https://www.coursera.org",
  "칸아카데미": "https://www.khanacademy.org",
  "위키피디아": "https://www.wikipedia.org",
  "네이버지도": "https://map.naver.com",
  "구글맵": "https://www.google.com/maps",
  "지도": "https://www.google.com/maps"
};

/* 전역 키워드 객체 – 자동완성과 채팅 처리용 */
const KEYWORDS = {
  greetings: ["안녕", "안녕하세요", "안녕 하세", "안녕하시오", "안녕한갑네"],
  sleep: ["잘자", "좋은꿈", "좋은 꿈", "잘자요", "잘자시게", "잘자리요", "잘자라니께"],
  weather: ["날씨알려줘", "날씨알려주게", "날씨좀알려줘", "날씨 알려줘", "날씨 좀 알려줘", "날씨 어때", "날씨 맑아"],
  calendar: ["일정 알려줘"],
  time: ["시간 알려줘"],
  delete: ["하루일정 삭제", "하루일과 삭제해줘", "하루일과", "하루일저", "하루 일관"]
};

/* 전역 변수 */
document.addEventListener("contextmenu", event => event.preventDefault());
let blockUntil = 0;
let currentCity = "서울";
let currentWeather = "";
const weatherKey = "2caa7fa4a66f2f8d150f1da93d306261";
const regionMap = {
  "서울": "Seoul",
  "인천": "Incheon",
  "수원": "Suwon",
  "고양": "Goyang",
  "성남": "Seongnam",
  "용인": "Yongin",
  "부천": "Bucheon",
  "안양": "Anyang",
  "의정부": "Uijeongbu",
  "광명": "Gwangmyeong",
  "안산": "Ansan",
  "파주": "Paju",
  "부산": "Busan",
  "대구": "Daegu",
  "광주": "Gwangju",
  "대전": "Daejeon",
  "울산": "Ulsan",
  "제주": "Jeju",
  "전주": "Jeonju",
  "청주": "Cheongju",
  "포항": "Pohang",
  "여수": "Yeosu",
  "김해": "Gimhae"
};
const regionList = Object.keys(regionMap);

document.addEventListener("copy", function(e) {
  e.preventDefault();
  let selectedText = window.getSelection().toString();
  selectedText = selectedText.replace(/2caa7fa4a66f2f8d150f1da93d306261/g, "HIDDEN");
  e.clipboardData.setData("text/plain", selectedText);
  if (Date.now() < blockUntil) return;
  blockUntil = Date.now() + 3600000;
  showSpeechBubbleInChunks("1시간동안 차단됩니다.");
});

/* 기억 학습을 위한 데이터 저장소 */
const memoryStorage = {
  save: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  load: function(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};

/* NLP 처리를 위한 간단한 키워드 매칭 함수 */
function processNLP(input) {
  const lowerInput = input.toLowerCase();
  const emotions = {
    positive: ["좋아", "행복", "기쁘", "즐거", "최고"],
    negative: ["슬프", "우울", "짜증", "화나", "피곤"]
  };

  let detectedEmotion = null;
  for (let mood in emotions) {
    if (emotions[mood].some(keyword => lowerInput.includes(keyword))) {
      detectedEmotion = mood;
      break;
    }
  }

  if (detectedEmotion === "positive") {
    return "기분이 좋으시다니 저도 기쁘네요! 오늘 하루가 더 즐거워지길 바랍니다.";
  } else if (detectedEmotion === "negative") {
    return "마음이 힘드시다니 안타깝네요. 제가 위로가 될 수 있기를 바랍니다.";
  } else if (lowerInput.includes("뭐해") || lowerInput.includes("무엇을")) {
    return "저는 여기서 당신과 대화하고 있어요. 당신은 뭐하고 계신가요?";
  } else {
    return null; // 기본 키워드 처리로 넘김
  }
}

/* 음성 출력 함수 */
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

/* 캘린더, 파일 저장 관련 함수들 */
function saveCalendar() {
  const daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
  const calendarData = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const eventDiv = document.getElementById(`event-${currentYear}-${currentMonth+1}-${d}`);
    if (eventDiv && eventDiv.textContent.trim() !== "") {
      calendarData[`${currentYear}-${currentMonth+1}-${d}`] = eventDiv.textContent;
    }
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calendarData, null, 2));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "calendar_events.json");
  dlAnchorElem.style.display = "none";
  document.body.appendChild(dlAnchorElem);
  dlAnchorElem.click();
  document.body.removeChild(dlAnchorElem);
}

function deleteCalendarEvent(day) {
  const eventDiv = document.getElementById(`event-${currentYear}-${currentMonth+1}-${day}`);
  if (eventDiv) {
    eventDiv.textContent = "";
    const calendarData = JSON.parse(localStorage.getItem("calendarEvents") || "{}");
    delete calendarData[`${currentYear}-${currentMonth+1}-${day}`];
    localStorage.setItem("calendarEvents", JSON.stringify(calendarData));
    return `${currentYear}-${currentMonth+1}-${day} 일정이 삭제되었습니다.`;
  } else {
    return "해당 날짜에 일정이 없습니다.";
  }
}

function getCalendarEvents(dateStr = null) {
  const calendarData = JSON.parse(localStorage.getItem("calendarEvents") || "{}");
  if (!Object.keys(calendarData).length) {
    return "저장된 일정이 없습니다. 먼저 캘린더를 저장해주세요.";
  }
  
  if (dateStr) {
    if (calendarData[dateStr]) {
      return `${dateStr}의 일정: ${calendarData[dateStr]}`;
    } else {
      return `${dateStr}에는 일정이 없습니다.`;
    }
  } else {
    const currentMonthStr = `${currentYear}-${currentMonth+1}`;
    let events = [];
    for (let key in calendarData) {
      if (key.startsWith(currentMonthStr)) {
        events.push(`${key}: ${calendarData[key]}`);
      }
    }
    if (events.length) {
      return `현재 월(${currentMonthStr})의 일정:\n${events.join("\n")}`;
    } else {
      return `현재 월(${currentMonthStr})에는 일정이 없습니다.`;
    }
  }
}

function updateMap() {
  const englishCity = regionMap[currentCity] || "Seoul";
  document.getElementById("map-iframe").src = `https://www.google.com/maps?q=${encodeURIComponent(englishCity)}&output=embed`;
}

async function getWeather() {
  try {
    const englishCity = regionMap[currentCity] || "Seoul";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(englishCity)}&appid=${weatherKey}&units=metric&lang=kr`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("날씨 API 호출 실패");
    const data = await res.json();
    currentWeather = data.weather[0].description;
    const message = `오늘 ${currentCity}의 날씨는 ${data.weather[0].description}이고, 기온은 ${data.main.temp}°C입니다.`;
    return { message };
  } catch (error) {
    console.error(error);
    currentWeather = "";
    return { message: "날씨 정보를 가져오는데 실패했습니다." };
  }
}

function updateWeatherEffects() {
  if (!currentWeather) return;
  if (currentWeather.includes("비") || currentWeather.includes("소나기")) {
    rainGroup.visible = true;
    cloudRainGroup.visible = true;
  } else {
    rainGroup.visible = false;
    cloudRainGroup.visible = false;
  }
  if (currentWeather.includes("구름") || currentWeather.includes("흐림")) {
    houseCloudGroup.visible = true;
  } else {
    houseCloudGroup.visible = false;
  }
}

function updateLightning() {
  if (currentWeather.includes("번개") || currentWeather.includes("뇌우")) {
    if (Math.random() < 0.001) {
      lightningLight.intensity = 5;
      setTimeout(() => { lightningLight.intensity = 0; }, 100);
    }
  }
}

async function updateWeatherAndEffects(sendMessage = true) {
  const weatherData = await getWeather();
  if (sendMessage) {
    showSpeechBubbleInChunks(weatherData.message);
  }
  updateWeatherEffects();
}

function changeRegion(value) {
  currentCity = value;
  updateMap();
  updateWeatherAndEffects();
  const englishCity = regionMap[currentCity] || "Seoul";
  const message = `지역이 ${currentCity} (${englishCity})로 변경되었습니다.`;
  showSpeechBubbleInChunks(message);
}

function startSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.trim();
    document.getElementById("chat-input").value = transcript;
    sendChat(); // 음성 입력 후 바로 처리
  };
  recognition.onerror = function(event) {
    console.error("음성 인식 오류:", event.error);
  };
}

async function sendChat() {
  const inputEl = document.getElementById("chat-input");
  const input = inputEl.value.trim();
  if (Date.now() < blockUntil) {
    showSpeechBubbleInChunks("1시간동안 차단됩니다.");
    inputEl.value = "";
    return;
  }
  if (!input) return;
  let response = "";
  const lowerInput = input.toLowerCase();
  
  // SITE_LINKS 처리
  for (let site in SITE_LINKS) {
    if (lowerInput.includes(site)) {
      response = `${site} 사이트로 이동합니다! 잠시만 기다려 주세요.`;
      showSpeechBubbleInChunks(response);
      setTimeout(() => { window.location.href = SITE_LINKS[site]; }, 2000);
      inputEl.value = "";
      return;
    }
  }

  // NLP 처리 먼저 시도
  const nlpResponse = processNLP(input);
  if (nlpResponse) {
    response = nlpResponse;
  }

  // 기존 로직 (NLP 및 사이트 이동에서 응답이 없을 경우)
  if (!response) {
    if (lowerInput.includes("파일 저장해줘") || lowerInput.includes("캘린더 저장해줘")) {
      saveCalendar();
      speakText("캘린더를 저장했습니다.");
      inputEl.value = "";
      return;
    }
    
    if (lowerInput.startsWith("지역 ")) {
      const newCity = lowerInput.replace("지역", "").trim();
      if (newCity) {
        if (regionList.includes(newCity)) {
          currentCity = newCity;
          document.getElementById("region-select").value = newCity;
          response = `좋아요, 지역을 ${newCity}(으)로 변경할게요!`;
          updateMap();
          await updateWeatherAndEffects();
        } else {
          response = "죄송해요, 그 지역은 지원하지 않아요. 드롭다운 메뉴에서 선택해주세요.";
        }
      } else {
        response = "변경할 지역을 입력해 주세요.";
      }
    } else if (regionList.includes(input)) {
      currentCity = input;
      document.getElementById("region-select").value = input;
      response = `좋아요, 지역을 ${input}(으)로 변경할게요!`;
      updateMap();
      await updateWeatherAndEffects();
    }
    
    if (!response && KEYWORDS.delete.some(keyword => lowerInput.includes(keyword))) {
      const dayStr = prompt("삭제할 하루일정의 날짜(일)를 입력하세요 (예: 15):");
      if (dayStr) {
        const dayNum = parseInt(dayStr);
        response = deleteCalendarEvent(dayNum);
      } else {
        response = "삭제할 날짜를 입력하지 않으셨습니다.";
      }
    }
    
    if (!response && KEYWORDS.greetings.some(keyword => lowerInput.includes(keyword))) {
      response = "안녕하세요! 만나서 반갑습니다. 오늘 하루 어떠셨나요?";
    }
    if (!response && KEYWORDS.sleep.some(keyword => lowerInput.includes(keyword))) {
      response = "편안한 밤 되세요, 좋은 꿈 꾸세요~";
    }
    if (!response && KEYWORDS.weather.some(keyword => lowerInput.includes(keyword))) {
      await updateWeatherAndEffects();
      inputEl.value = "";
      return;
    }
    if (!response && lowerInput.includes("일정") && lowerInput.includes("알려줘")) {
      const dateMatch = input.match(/\d{4}-\d{1,2}-\d{1,2}/);
      if (dateMatch) {
        const dateStr = dateMatch[0];
        response = getCalendarEvents(dateStr);
      } else {
        response = getCalendarEvents();
      }
    }
    if (!response && KEYWORDS.time.some(keyword => lowerInput.includes(keyword))) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      response = `현재 시간은 ${hours}시 ${minutes}분입니다.`;
    }
    
    // OpenAI API 호출 (기존 응답이 없을 경우)
    if (!response) {
      try {
        const res = await fetch("http://localhost:5000/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt: input })
        });
        const data = await res.json();
        if (data.error) {
          response = "오류: " + data.error;
        } else {
          response = data.response;
        }
      } catch (error) {
        response = "서버 연결 오류: " + error.message;
      }
    }
  }

  // 기억 학습 데이터 저장
  memoryStorage.save('lastInput', input);
  memoryStorage.save('lastResponse', response);

  showSpeechBubbleInChunks(response);
  inputEl.value = "";
}

function showSpeechBubbleInChunks(text, chunkSize = 15, delay = 3000) {
  const bubble = document.getElementById("speech-bubble");
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  let index = 0;
  function showNextChunk() {
    if (index < chunks.length) {
      bubble.textContent = chunks[index];
      bubble.style.display = "block";
      speakText(chunks[index]);
      index++;
      setTimeout(showNextChunk, delay);
    } else {
      setTimeout(() => { bubble.style.display = "none"; }, 3000);
    }
  }
  showNextChunk();
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7).normalize();
scene.add(directionalLight);
scene.add(new THREE.AmbientLight(0x333333));

const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xff9900, transparent: true, opacity: 0 });
const sun = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), sunMaterial);
scene.add(sun);

const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, emissive: 0x222222, transparent: true, opacity: 1 });
const moon = new THREE.Mesh(new THREE.SphereGeometry(1.2, 64, 64), moonMaterial);
scene.add(moon);

const stars = [], fireflies = [];
for (let i = 0; i < 200; i++) {
  const star = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  star.position.set((Math.random()-0.5)*100, (Math.random()-0.5)*60, -20);
  scene.add(star);
  stars.push(star);
}
for (let i = 0; i < 60; i++) {
  const firefly = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffff99 }));
  firefly.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*20, -10);
  scene.add(firefly);
  fireflies.push(firefly);
}

const floorGeometry = new THREE.PlaneGeometry(400, 400, 128, 128);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 1, metalness: 0 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI/2;
floor.position.y = -2;
scene.add(floor);

const backgroundGroup = new THREE.Group();
scene.add(backgroundGroup);
function createBuilding(width, height, depth, color) {
  const buildingGroup = new THREE.Group();
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7, metalness: 0.1 });
  const building = new THREE.Mesh(geometry, material);
  buildingGroup.add(building);
  
  const windowMat = new THREE.MeshStandardMaterial({ color: 0x87CEEB });
  for (let y = 3; y < height - 1; y += 2) {
    for (let x = -width/2 + 0.5; x < width/2; x += 1) {
      const window = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.1), windowMat);
      window.position.set(x, y - height/2, depth/2 + 0.01);
      buildingGroup.add(window);
    }
  }
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.1), doorMat);
  door.position.set(0, -height/2 + 1, depth/2 + 0.01);
  buildingGroup.add(door);
  
  return buildingGroup;
}
function createHouse(width, height, depth, baseColor, roofColor) {
  const houseGroup = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth),
                              new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.8 }));
  base.position.y = -2 + height/2;
  houseGroup.add(base);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(width * 0.8, height * 0.6, 4),
                              new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.8 }));
  roof.position.y = -2 + height + (height * 0.6)/2;
  roof.rotation.y = Math.PI/4;
  houseGroup.add(roof);
  
  const windowMat = new THREE.MeshStandardMaterial({ color: 0xFFFFE0 });
  const window1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), windowMat);
  window1.position.set(-width/4, -2 + height/2, depth/2 + 0.01);
  const window2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), windowMat);
  window2.position.set(width/4, -2 + height/2, depth/2 + 0.01);
  houseGroup.add(window1, window2);
  
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.1), doorMat);
  door.position.set(0, -2 + height/4, depth/2 + 0.01);
  houseGroup.add(door);
  
  return houseGroup;
}
for (let i = 0; i < 20; i++) {
  const width = Math.random() * 4 + 4;
  const height = Math.random() * 20 + 20/hear
  const depth = Math.random() * 4 + 4;
  const building = createBuilding(width, height, depth, 0x555555);
  const col = i % 10;
  const row = Math.floor(i / 10);
  const x = -50 + col * 10;
  const z = -30 - row * 20;
  building.position.set(x, -2 + height/2, z);
  backgroundGroup.add(building);
}
for (let i = 0; i < 10; i++) {
  const width = Math.random() * 4 + 6;
  const height = Math.random() * 4 + 6;
  const depth = Math.random() * 4 + 6;
  const house = createHouse(width, height, depth, 0xa0522d, 0x8b0000);
  const x = -40 + i * 10;
  const z = -10;
  house.position.set(x, 0, z);
  backgroundGroup.add(house);
}
function createStreetlight() {
  const lightGroup = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8),
                                new THREE.MeshBasicMaterial({ color: 0x333333 }));
  pole.position.y = 2;
  lightGroup.add(pole);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8),
                                new THREE.MeshBasicMaterial({ color: 0xffcc00 }));
  lamp.position.y = 4.2;
  lightGroup.add(lamp);
  const lampLight = new THREE.PointLight(0xffcc00, 1, 10);
  lampLight.position.set(0, 4.2, 0);
  lightGroup.add(lampLight);
  return lightGroup;
}
const characterStreetlight = createStreetlight();
characterStreetlight.position.set(1, -2, 0);
scene.add(characterStreetlight);

let rainGroup = new THREE.Group();
scene.add(rainGroup);
function initRain() {
  const rainCount = 2000;
  const rainGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    positions[i * 3] = Math.random() * 200 - 100;
    positions[i * 3 + 1] = Math.random() * 100;
    positions[i * 3 + 2] = Math.random() * 200 - 100;
  }
  rainGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const rainMaterial = new THREE.PointsMaterial({ color: 0xaaaaee, size: 0.1, transparent: true, opacity: 0.6 });
  const rainParticles = new THREE.Points(rainGeometry, rainMaterial);
  rainGroup.add(rainParticles);
}
initRain();
rainGroup.visible = false;

let houseCloudGroup = new THREE.Group();
scene.add(houseCloudGroup);
function createHouseCloud() {
  const cloud = new THREE.Group();
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), cloudMat);
  sphere1.position.set(0, 0, 0);
  const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), cloudMat);
  sphere2.position.set(0.6, 0.2, 0);
  const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), cloudMat);
  sphere3.position.set(-0.6, 0.1, 0);
  cloud.add(sphere1, sphere2, sphere3);
  cloud.scale.set(2, 2, 2);
  cloud.userData.initialPos = cloud.position.clone();
  return cloud;
}
const singleCloud = createHouseCloud();
houseCloudGroup.add(singleCloud);
houseCloudGroup.position.set(0, 2, 0);

let cloudRainGroup = new THREE.Group();
function initCloudRain() {
  const cloudRainCount = 100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(cloudRainCount * 3);
  for (let i = 0; i < cloudRainCount; i++) {
    positions[i * 3] = (Math.random()-0.5) * 1.5;
    positions[i * 3 + 1] = Math.random() * 0.2;
    positions[i * 3 + 2] = (Math.random()-0.5) * 1.5;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xaaaaee, size: 0.05, transparent: true, opacity: 0.8 });
  const particles = new THREE.Points(geometry, material);
  cloudRainGroup.add(particles);
}
initCloudRain();
cloudRainGroup.visible = false;
houseCloudGroup.add(cloudRainGroup);

function updateHouseClouds() {
  const headWorldPos = new THREE.Vector3();
  head.getWorldPosition(headWorldPos);
  houseCloudGroup.position.x = headWorldPos.x + Math.sin(Date.now() * 0.001) * 1;
  houseCloudGroup.position.y = headWorldPos.y + 2.5;
  houseCloudGroup.position.z = headWorldPos.z;
}

let lightningLight = new THREE.PointLight(0xffffff, 0, 500);
lightningLight.position.set(0, 50, 0);
scene.add(lightningLight);

const characterGroup = new THREE.Group();
const charBody = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.5),
                                new THREE.MeshStandardMaterial({ color: 0x00cc66 }));
const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32),
                            new THREE.MeshStandardMaterial({ color: 0xffcc66 }));
head.position.y = 1.2;
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), eyeMat);
const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), eyeMat);
leftEye.position.set(-0.2, 1.3, 0.45);
rightEye.position.set(0.2, 1.3, 0.45);
const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.05),
                             new THREE.MeshStandardMaterial({ color: 0xff3366 }));
mouth.position.set(0, 1.1, 0.51);
const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.05), eyeMat);
const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.05), eyeMat);
leftBrow.position.set(-0.2, 1.45, 0.45);
rightBrow.position.set(0.2, 1.45, 0.45);
const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 0.2), charBody.material);
const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 0.2), charBody.material);
leftArm.position.set(-0.7, 0.4, 0);
rightArm.position.set(0.7, 0.4, 0);
const legMat = new THREE.MeshStandardMaterial({ color: 0x3366cc });
const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3), legMat);
const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1, 0.3), legMat);
leftLeg.position.set(-0.35, -1, 0);
rightLeg.position.set(0.35, -1, 0);
characterGroup.add(charBody, head, leftEye, rightEye, mouth, leftBrow, rightBrow, leftArm, rightArm, leftLeg, rightLeg);
characterGroup.position.y = -1;
scene.add(characterGroup);
const characterLight = new THREE.PointLight(0xffee88, 1, 15);
scene.add(characterLight);

function createTree() {
  const treeGroup = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 16),
                                 new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
  trunk.position.y = -1;
  const foliage = new THREE.Mesh(new THREE.ConeGeometry(1, 3, 16),
                                   new THREE.MeshStandardMaterial({ color: 0x228B22 }));
  foliage.position.y = 0.5;
  treeGroup.add(trunk, foliage);
  return treeGroup;
}

for (let i = 0; i < 10; i++) {
  const tree = createTree();
  tree.position.set(-50 + i * 10, -2, -15);
  scene.add(tree);
}

function animate() {
  requestAnimationFrame(animate);
  
  const now = new Date();
  const headWorldPos = new THREE.Vector3();
  head.getWorldPosition(headWorldPos);
  const totalMin = now.getHours() * 60 + now.getMinutes();
  const angle = (totalMin / 1440) * Math.PI * 2;
  const radius = 3;
  const sunPos = new THREE.Vector3(
    headWorldPos.x + Math.cos(angle) * radius,
    headWorldPos.y + Math.sin(angle) * radius,
    headWorldPos.z
  );
  sun.position.copy(sunPos);
  
  const moonAngle = angle + Math.PI;
  const moonPos = new THREE.Vector3(
    headWorldPos.x + Math.cos(moonAngle) * radius,
    headWorldPos.y + Math.sin(moonAngle) * radius,
    headWorldPos.z
  );
  moon.position.copy(moonPos);
  
  const t = now.getHours() + now.getMinutes() / 60;
  let sunOpacity = 0, moonOpacity = 0;
  if (t < 6) { sunOpacity = 0; moonOpacity = 1; }
  else if (t < 7) { let factor = (t - 6); sunOpacity = factor; moonOpacity = 1 - factor; }
  else if (t < 17) { sunOpacity = 1; moonOpacity = 0; }
  else if (t < 18) { let factor = (t - 17); sunOpacity = 1 - factor; moonOpacity = factor; }
  else { sunOpacity = 0; moonOpacity = 1; }
  sun.material.opacity = sunOpacity;
  moon.material.opacity = moonOpacity;
  
  const isDay = (t >= 7 && t < 17);
  scene.background = new THREE.Color(isDay ? 0x87CEEB : 0x000033);
  stars.forEach(s => s.visible = !isDay);
  fireflies.forEach(f => f.visible = !isDay);
  
  characterStreetlight.traverse(child => {
    if (child instanceof THREE.PointLight) { child.intensity = isDay ? 0 : 1; }
  });
  characterLight.position.copy(characterGroup.position).add(new THREE.Vector3(0, 5, 0));
  characterLight.intensity = isDay ? 0 : 1;
  characterGroup.position.y = -1;
  characterGroup.rotation.x = 0;
  
  updateWeatherEffects();
  updateHouseClouds();
  updateLightning();
  characterStreetlight.position.set(characterGroup.position.x + 1, -2, characterGroup.position.z);
  updateBubblePosition();
  
  if (cloudRainGroup.visible) {
    const particles = cloudRainGroup.children[0];
    let positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i+1] -= 0.02;
      if (positions[i+1] < -0.3) {
        positions[i+1] = Math.random() * 0.2;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }
  
  renderer.render(scene, camera);
}
animate();

let currentYear, currentMonth;
function initCalendar() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();
  populateYearSelect();
  renderCalendar(currentYear, currentMonth);
  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentYear, currentMonth);
  });
  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentYear, currentMonth);
  });
  document.getElementById("year-select").addEventListener("change", (e) => {
    currentYear = parseInt(e.target.value);
    renderCalendar(currentYear, currentMonth);
  });
  document.getElementById("delete-day-event").addEventListener("click", () => {
    const dayStr = prompt("삭제할 하루일정의 날짜(일)를 입력하세요 (예: 15):");
    if (dayStr) {
      const dayNum = parseInt(dayStr);
      const eventDiv = document.getElementById(`event-${currentYear}-${currentMonth+1}-${dayNum}`);
      if (eventDiv) {
        eventDiv.textContent = "";
        const message = `${currentYear}-${currentMonth+1}-${dayNum} 일정이 삭제되었습니다. 다시 입력할 수 있습니다.`;
        alert(message);
        speakText(message);
      }
    }
  });
  document.getElementById("save-calendar").addEventListener("click", () => {
    saveCalendar();
    speakText("캘린더를 바탕화면에 저장했습니다.");
  });
}

function populateYearSelect() {
  const yearSelect = document.getElementById("year-select");
  yearSelect.innerHTML = "";
  for (let y = 2020; y <= 2070; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    if (y === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }
}

function renderCalendar(year, month) {
  const monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  document.getElementById("month-year-label").textContent = `${year}년 ${monthNames[month]}`;
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";
  const daysOfWeek = ["일","월","화","수","목","금","토"];
  daysOfWeek.forEach((day) => {
    const th = document.createElement("div");
    th.style.fontWeight = "bold";
    th.style.textAlign = "center";
    th.textContent = day;
    th.style.color = "#00ffcc";
    th.style.textShadow = "0 0 3px #00ffcc";
    grid.appendChild(th);
  });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.innerHTML = `<div class="day-number">${d}</div>
                      <div class="event" id="event-${year}-${month+1}-${d}"></div>`;
    cell.addEventListener("click", () => {
      const eventText = prompt(`${year}-${month+1}-${d} 일정 입력:`);
      if (eventText) {
        const eventDiv = document.getElementById(`event-${year}-${month+1}-${d}`);
        if (eventDiv.textContent) {
          eventDiv.textContent += "; " + eventText;
        } else {
          eventDiv.textContent = eventText;
        }
        speakText(`${year}-${month+1}-${d}에 ${eventText} 일정을 추가했습니다.`);
      }
    });
    grid.appendChild(cell);
  }
}

function updateBubblePosition() {
  const bubble = document.getElementById("speech-bubble");
  const headWorldPos = new THREE.Vector3();
  head.getWorldPosition(headWorldPos);
  const screenPos = headWorldPos.project(camera);
  bubble.style.left = ((screenPos.x * 0.5 + 0.5) * window.innerWidth) + "px";
  bubble.style.top = ((1 - (screenPos.y * 0.5 + 0.5)) * window.innerHeight - 50) + "px";
}

window.addEventListener("DOMContentLoaded", function() {
  const chatInput = document.getElementById("chat-input");
  chatInput.setAttribute("list", "chat-keywords");
  const autoCompleteList = document.createElement("datalist");
  autoCompleteList.id = "chat-keywords";
  const allKeywords = Object.values(KEYWORDS).flat().concat(Object.keys(SITE_LINKS));
  allKeywords.forEach(kw => {
    const option = document.createElement("option");
    option.value = kw;
    autoCompleteList.appendChild(option);
  });
  document.body.appendChild(autoCompleteList);
  
  document.getElementById("chat-input").addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendChat();
  });
  
  const regionSelect = document.getElementById("region-select");
  regionList.forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = `${region} (${regionMap[region]})`;
    if (region === currentCity) option.selected = true;
    regionSelect.appendChild(option);
  });
});

window.addEventListener("resize", function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("load", async () => {
  initCalendar();
  updateMap();
  await updateWeatherAndEffects();
});