document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userText = input.value.trim();

  if (!userText) return;

  // Display user's message
  const userBubble = document.createElement("div");
  userBubble.className = "message user";
  userBubble.textContent = userText;
  chatBox.appendChild(userBubble);

  // Create assistant bubble
  const assistantBubble = document.createElement("div");
  assistantBubble.className = "message assistant";
  chatBox.appendChild(assistantBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  input.value = "";

  try {
    const response = await fetch("/.netlify/functions/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userText }) // ✅ FIXED key
    });

    const data = await response.json();

    if (data.reply) {
      typeText(assistantBubble, data.reply);
    } else {
      assistantBubble.textContent = "Error: No reply received.";
    }
  } catch (err) {
    assistantBubble.textContent = "Error talking to ChatGPT.";
    console.error(err);
  }
});

function typeText(element, text, index = 0) {
  if (index < text.length) {
    element.textContent += text.charAt(index);
    setTimeout(() => typeText(element, text, index + 1), 20);
  }
}
