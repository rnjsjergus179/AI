<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>HUD 채팅창 UI + API 키 로드</title>
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
  <div class="hud">HUD 채팅창</div>
  
  <!-- 채팅창 컨테이너 -->
  <div class="chat-container">
    <!-- 메시지 영역 -->
    <div class="chat-messages" id="chatMessages">
      <div class="message user">
        <div class="message-content">안녕하세요!</div>
      </div>
      <div class="message bot">
        <div class="message-content">환영합니다. 필요한 작업을 입력해 주세요.</div>
      </div>
    </div>
    <!-- 채팅 입력 영역 -->
    <div class="chat-input">
      <input type="text" id="messageInput" placeholder="메시지를 입력하세요..." />
      <button type="button" onclick="processInput()">전송</button>
    </div>
  </div>
  
  <script>
    // 전역 변수 (API 키는 기본적으로 빈 문자열)
    let apiKey = "";
    // OpenAI API 엔드포인트 (직접 호출)
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    
    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    
    // 채팅창에 메시지 추가 함수
    function appendMessage(role, text) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", role);
      
      const contentDiv = document.createElement("div");
      contentDiv.classList.add("message-content");
      contentDiv.textContent = text;
      
      messageDiv.appendChild(contentDiv);
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 사용자의 입력 처리: 특별 명령어이면 API 키 파일을 로드하고, 아니면 일반 API 호출
    async function processInput() {
      const userText = messageInput.value.trim();
      if (!userText) return;
      
      appendMessage("user", userText);
      messageInput.value = "";
      
      // 만약 사용자가 특정 명령어를 입력하면 서버에 호스팅된 텍스트 파일에서 API 키를 불러오기
      if (userText === "다운로드 파일에 있는 텍스트에있는 키 가져와줘") {
        // 예를 들어, 서버의 /downloads/apikey.txt 위치에 파일이 있어야 함.
        try {
          const response = await fetch("/downloads/apikey.txt");
          if (!response.ok) {
            throw new Error("파일을 불러올 수 없습니다.");
          }
          const keyText = await response.text();
          apiKey = keyText.trim();
          appendMessage("bot", "API 키가 성공적으로 로드되었습니다.");
        } catch (error) {
          console.error("API 키 로드 오류:", error);
          appendMessage("bot", "API 키 로드 실패: " + error.message);
        }
        return;
      }
      
      // API 호출: 만약 명령어가 아니라면 OpenAI API 호출 수행
      if (!apiKey) {
        appendMessage("bot", "먼저 API 키를 로드해 주세요 (\"다운로드 파일에 있는 텍스트에있는 키 가져와줘\")");
        return;
      }
      
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
    
    // 엔터키 입력 시 처리
    messageInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        processInput();
      }
    });
  </script>
</body>
</html>
