let socket = new WebSocket("ws://localhost:8080");

socket.onopen = (ev) => {
  console.log("[open] conexión aceptada");
  
  // Envía el nombre del usuario al servidor cuando se establece la conexión
  const userName = prompt("Ingresa tu nombre de usuario:");
  socket.send(JSON.stringify({ type: "username", data: userName }));
}

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  // Verifica el tipo de mensaje recibido
  switch (message.type) {
    case "connectionResponse":
      console.log("[message] respuesta de conexión:", message.data);
      // Actualiza la interfaz para mostrar el chat después de recibir la respuesta del servidor
      showChatInterface();
      break;
    case "userMessage":
      console.log("[message] mensaje de usuario:", message.data);
      // Actualiza la interfaz para mostrar el mensaje del usuario en el chat
      addMessageToChat(message.data);
      break;
    case "userLeft":
      console.log("[message] usuario abandonó la conversación:", message.data);
      // Actualiza la interfaz para mostrar que un usuario abandonó la conversación
      showUserLeftMessage(message.data);
      break;
    default:
      console.log("[message] mensaje desconocido:", message);
      break;
  }
};

const btn = document.getElementById("btncito");
const inputtext = document.getElementById("txt");

btn.addEventListener("click", () => {
  const userMessage = inputtext.value;
  socket.send(JSON.stringify({ type: "userMessage", data: userMessage }));
});

// Función para mostrar la interfaz del chat
function showChatInterface() {
  const connectForm = document.getElementById("connect-form");
  const chatContainer = document.getElementById("chat-container");

  connectForm.style.display = "none";
  chatContainer.style.display = "block";
}

// Función para agregar un mensaje del usuario al chat
function addMessageToChat(message) {
  const chatMessages = document.getElementById("chat-messages");
  const messageItem = document.createElement("li");
  messageItem.textContent = message;
  chatMessages.appendChild(messageItem);
  inputtext.value = ""; // Limpiar el campo de texto de entrada
}

// Función para mostrar un mensaje cuando un usuario abandona la conversación
function showUserLeftMessage(username) {
  const chatMessages = document.getElementById("chat-messages");
  const messageItem = document.createElement("li");
  messageItem.textContent = `El usuario ${username} ha abandonado la conversación.`;
  messageItem.classList.add("user-left");
  chatMessages.appendChild(messageItem);
}
