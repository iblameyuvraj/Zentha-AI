const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");
const voiceInputBtn = document.querySelector("#voice-input-btn");
const stopResponseBtn = document.querySelector("#stop-response-btn");

const API_KEY = "AIzaSyDwW6rOBR46czH-pwovGDNcrdwVRmXiUA0";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;




let controller, typingInterval;
const chatHistory = [];

const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const scrollToBottom = () =>
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });

const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = "";
  let index = 0;
  typingInterval = setInterval(() => {
    if (index < text.length) {
      textElement.textContent += text[index++];
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      botMsgDiv.classList.remove("loading");
      document.body.classList.remove("bot-responding");
    }
  }, 40);
};

const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();
  const userInput = promptInput.value.trim();
  if (!userInput) return;

  chatHistory.push({ role: "user", parts: [{ text: userInput }] });

  try {
    document.body.classList.add("bot-responding");
    botMsgDiv.classList.add("loading");

    // First, ask Gemini if this is a creator-related question
    const originCheckResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: `Is the following prompt asking about the chatbot's creator or how it was made? Respond only with yes or no.\nPrompt: "${userInput}"`
          }]
        }]
      }),
      signal: controller.signal,
    });

    const originCheckData = await originCheckResponse.json();
    const isOriginPrompt = originCheckData?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase().includes("yes");

    let responseText;

    if (isOriginPrompt) {
      responseText = "I was developed by zentha.";
    } else {
      // Proceed with regular Gemini API call
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userInput }] }]
        }),
        signal: controller.signal,
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) throw new Error(data.error?.message || "Unknown error");

      responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    }

    typingEffect(responseText, textElement, botMsgDiv);
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });

  } catch (error) {
    console.error("API Error:", error);
    textElement.textContent = error.name === "AbortError" ? "Response stopped." : error.message;
    textElement.style.color = "#d62939";
  } finally {
    botMsgDiv.classList.remove("loading");
    document.body.classList.remove("bot-responding");
    scrollToBottom();
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains("bot-responding")) return;

  document.body.classList.add("chats-active", "bot-responding");

  // Hide welcome message
  document.querySelector(".default-text")?.classList.add("hide");

  const userMsgDiv = createMessageElement(`<p class="message-text"></p>`, "user-message");
  userMsgDiv.querySelector(".message-text").textContent = userMessage;

  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();

  setTimeout(() => {
    promptInput.value = "";
  }, 1000);

  setTimeout(() => {
    const botMsgHTML = `<img class="avatar" src="/FRONTEND/assests/Zentha.jpg" /> <p class="message-text">Just a sec...</p>`;
    const botMsgDiv = createMessageElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);
  }, 600);
};

stopResponseBtn.addEventListener("click", () => {
  if (controller) {
    controller.abort();
    clearInterval(typingInterval);
  }
  const loadingBotMsg = chatsContainer.querySelector(".bot-message.loading");
  if (loadingBotMsg) loadingBotMsg.classList.remove("loading");
  document.body.classList.remove("bot-responding");
});

themeToggleBtn.addEventListener("click", () => {
  const isLightTheme = document.body.classList.toggle("light-theme");
  localStorage.setItem("themeColor", isLightTheme ? "light_mode" : "dark_mode");
  themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";
});

document.querySelector("#delete-chats-btn").addEventListener("click", () => {
  chatHistory.length = 0;
  chatsContainer.innerHTML = "";
  document.body.classList.remove("chats-active", "bot-responding");

  // Show welcome text again after deleting chats
  document.querySelector(".default-text")?.classList.remove("hide");
});

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  voiceInputBtn.addEventListener("click", () => {
    recognition.start();
    voiceInputBtn.classList.add("listening");
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    promptInput.value = transcript;
  };

  recognition.onend = () => {
    voiceInputBtn.classList.remove("listening");
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
} else {
  voiceInputBtn.style.display = "none";
}

promptForm.addEventListener("submit", handleFormSubmit);

document.addEventListener("DOMContentLoaded", function () {
  function typeEffect(element, text, speed, callback) {
    let i = 0;
    function typing() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      } else if (callback) {
        setTimeout(callback, 500);
      }
    }
    typing();
  }

  const heading = document.querySelector(".heading");
  const subHeading = document.querySelector(".sub-heading");

  heading.innerHTML = "";
  subHeading.innerHTML = "";

  typeEffect(heading, "Hello, there!", 150, function () {
    typeEffect(subHeading, "How can I help you today?", 120);
  });
});
