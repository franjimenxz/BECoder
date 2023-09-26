const socket = io();

socket.on("messageLogs", (data) => {
  console.log(data);
  let log = document.getElementById("chat");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user}: ${message.message} </br>`;
  });

  log.innerHTML = messages;
});

document.getElementById("formChat").addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target.message.value;
  let user = e.target.user.value;
  socket.emit("message", { user, message });
});
