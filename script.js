document.getElementById("send-button").addEventListener("click", sendMessage);
document
  .getElementById("user-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const messageText = userInput.value.trim();

  if (messageText !== "") {
    const chatMessages = document.getElementById("chat-messages");

    // Add user message to chat
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("message", "user");
    userMessageDiv.textContent = messageText;
    chatMessages.appendChild(userMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    userInput.value = "";

    // Fetch bot response from API
    try {
      const response = await fetch(
        "https://chatapi-h5ok.onrender.com/api/response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ message: messageText }),
        }
      );

      // save user message online
      await fetch("https://chatapi-h5ok.onrender.com/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ content: messageText }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessageDiv = document.createElement("div");
        botMessageDiv.classList.add("message");
        botMessageDiv.textContent = data;
        // botMessageDiv.textContent = data[0].generated_text;
        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  }
}
