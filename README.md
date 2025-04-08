<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>HUD 채팅창 UI</title>
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
    <div class="chat-messages">
      <div class="message user">
        <div class="message-content">안녕하세요!</div>
      </div>
      <div class="message bot">
        <div class="message-content">반갑습니다. 무엇을 도와드릴까요?</div>
      </div>
    </div>
    <!-- 입력창 -->
    <div class="chat-input">
      <input type="text" placeholder="메시지를 입력하세요..." />
      <button type="button">전송</button>
    </div>
  </div>
</body>
</html>
