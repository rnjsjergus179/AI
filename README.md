
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>API 키 파일 호출 + HUD 채팅창 UI</title>
  <style>
    /* 전역 스타일 */
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    /* 상단 헤더(HUD) 스타일 */
    .hud {
      background-color: #333;
      color: #fff;
      padding: 15px 20px;
      text-align: center;
      font-size: 20px;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hud .title {
      flex: 1;
    }
    .hud .apikey-load {
      display: flex;
      align-items: center;
    }
    .hud .apikey-load label {
      margin-right: 10px;
      font-size: 14px;
    }
    /* 채팅창 전체 컨테이너 */
    .chat-container {
      margin-top: 70px; /* HUD 높이 만큼 여백 추가 */
      max-width: 600px;
      height: calc(100vh - 70px);
      background-color: #fff;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    /* 채팅 메시지 영역 */
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
    /* 개별 메시지 스타일 */
    .message {
      margin-bottom: 15px;
      display: flex;
    }
    .message.user {
      justify-content: flex-end;
    }
    .message.bot {
      justify-content: flex-start;
    }
    .message-content {
      max-width: 70%;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 15px;
      line-height: 1.4;
    }
    .message.user .message-content {
      background-color: #0084ff;
      color: #fff;
    }
    .message.bot .message-content {
      background-color: #e9e9eb;
      color: #333;
    }
    /* 채팅 입력 영역 */
    .chat-input {
      display: flex;
      border-top: 1px solid #ddd;
    }
    .chat-input input {
      flex: 1;
      padding: 15px;
      font-size: 16px;
      border: none;
      outline: none;
    }
    .chat-input button {
      padding: 15px 20px;
      font-size: 16px;
      border: none;
      background-color: #333;
      color: #fff;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HUD(상단 헤더) -->
  <div class="hud">
    <div class="title">HUD 채팅창</div>
    <!-- 로컬 파일에 있는 API 키를 호출하기 위한 파일 입력 -->
    <div class="apikey-load">
      <label for="apikeyFile">API 키 파일:</label>
      <input type="file" id="apikeyFile" accept=".txt" />
    </div>
  </div>
  
  <!-- 채팅창 컨테이너 -->
  <div class="chat-container">
    <!-- 메시지 영역 -->
    <div class="chat-messages" id="chatMessages">
      <div class="message user">
        <div class="message-content">안녕하세요!</div>
      </div>
      <div class="message bot">
        <div class="message-content">반갑습니다. API 키가 로드되었는지 확인해 주세요.</div>
      </div>
    </div>
    <!-- 채팅 입력 영역 -->
    <div class="chat-input">
      <input type="text" id="messageInput" placeholder="메시지를 입력하세요..." />
      <button type="button" onclick="sendMessage()">전송</button>
    </div>
  </div>
  
  <script>
    // 전역 변수에 API 키 저장 (초기값은 빈 문자열)
    let apiKey = "";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    const apiKeyFileInput = document.getElementById("apikeyFile");

    // 파일 선택 시 API 키를 파일에서 읽어오기 위한 이벤트 처리
    apiKeyFileInput.addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          apiKey = e.target.result.trim();  // 파일 내용 (API 키)을 저장하고 양쪽 공백 제거
          // API 키가 성공적으로 로드되면 간단한 메시지 표시 (실제 운영환경에서는 UI 개선 필요)
          appendMessage("bot", "API 키가 성공적으로 로드되었습니다.");
        };
        reader.readAsText(file);
      }
    });

    // 채팅 메시지 추가 함수
    function appendMessage(role, text) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", role);
      
      const contentDiv = document.createElement("div");
      contentDiv.classList.add("message-content");
      contentDiv.textContent = text;
      
      messageDiv.appendChild(contentDiv);
      chatMessages.appendChild(messageDiv);
      
      // 스크롤 최하단으로 자동 이동
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 메시지 전송 및 OpenAI API 호출 함수
    async function sendMessage() {
      const userText = messageInput.value.trim();
      if (!userText) return;

      // API 키가 아직 로드되지 않았으면 경고 후 종료
      if (!apiKey) {
        appendMessage("bot", "먼저 API 키 파일을 로드해 주세요.");
        return;
      }
      
      appendMessage("user", userText);
      messageInput.value = "";
      
      const requestPayload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userText }]
      };
      
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey
          },
          body: JSON.stringify(requestPayload)
        });
        
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          const botReply = data.choices[0].message.content;
          appendMessage("bot", botReply);
        } else {
          appendMessage("bot", "응답을 받을 수 없습니다.");
        }
      } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "에러 발생: " + error.message);
      }
    }
    
    // 엔터키 입력 시 메시지 전송 처리
    messageInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  </script>
</body>
</html>
