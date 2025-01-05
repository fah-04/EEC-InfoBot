const API_URL = 'https://askeec-1.onrender.com/api/message'; // Your API endpoint

const chatbox = document.querySelector('.chat-body');
const messageInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.chat-input button');

// Helper to append messages to the chatbox
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar');
  
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(document.createTextNode(content));
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}

// Send message to the API
async function sendMessage() {
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Add the user's message to the chatbox
  addMessage(userMessage, true);
  messageInput.value = ''; // Clear input

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        session_id: `session_${Date.now()}`, // Generate a session ID dynamically
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Add the bot's response to the chatbox
      addMessage(data.response || 'No response from bot.');
    } else {
      addMessage(`Error: ${data.error || 'Failed to communicate with the bot.'}`);
    }
  } catch (error) {
    addMessage(`Error: Unable to reach the bot service.`);
    console.error('Send Message Error:', error);
  }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
