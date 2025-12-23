class ChatApp {
    constructor() {
        this.MSG_KEY = "CHAT_MESSAGES";
        this.USER_KEY = "CHAT_USERS";

        this.messages = JSON.parse(localStorage.getItem(this.MSG_KEY)) || [];
        this.users = JSON.parse(localStorage.getItem(this.USER_KEY)) || {};

        this.currentUser = null;
    }

    save() {
        localStorage.setItem(this.MSG_KEY, JSON.stringify(this.messages));
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.users));
    }

    login() {
        const name = document.getElementById("loginName").value.trim();
        if (!name) return alert("Enter name");

        this.currentUser = name;

        if (!this.users[name]) {
            this.users[name] = { online: true };
            this.messages.push({ sender: "System", text: `${name} joined the chat` });
        } else {
            this.users[name].online = true;
            this.messages.push({ sender: "System", text: `${name} reconnected` });
        }

        this.save();

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("chatPage").classList.remove("hidden");
        document.getElementById("currentUser").innerText = "Logged in as: " + name;

        this.render();
    }

    logout() {
        this.users[this.currentUser].online = false;
        this.messages.push({ sender: "System", text: `${this.currentUser} left the chat` });
        this.save();
        location.reload();
    }

    sendMessage() {
        const input = document.getElementById("messageInput");
        const text = input.value.trim();
        if (!text) return;

        if (!this.users[this.currentUser].online) {
            this.messages.push({
                sender: "System",
                text: `${this.currentUser} is offline`
            });
            this.render();
            return;
        }

        this.messages.push({ sender: this.currentUser, text });
        input.value = "";
        this.save();
        this.render();
    }

    goOffline() {
        this.users[this.currentUser].online = false;
        this.messages.push({ sender: "System", text: `${this.currentUser} went OFFLINE` });
        this.save();
        this.render();
    }

    goOnline() {
        this.users[this.currentUser].online = true;
        this.messages.push({ sender: "System", text: `${this.currentUser} is ONLINE` });
        this.save();
        this.render();
    }

    render() {
        const chatBox = document.getElementById("chatBox");
        const statusBar = document.getElementById("statusBar");

        chatBox.innerHTML = "";

        this.messages.forEach(m => {
            const p = document.createElement("p");
            p.className = m.sender === "System" ? "system" : "message";
            p.textContent = `${m.sender}: ${m.text}`;
            chatBox.appendChild(p);
        });

        statusBar.innerHTML =
            "<b>Users:</b> " +
            Object.keys(this.users)
                .map(u => `${u} (${this.users[u].online ? "Online" : "Offline"})`)
                .join(", ");

        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

const chatApp = new ChatApp();

function login() { chatApp.login(); }
function logout() { chatApp.logout(); }
function sendMessage() { chatApp.sendMessage(); }
function goOffline() { chatApp.goOffline(); }
function goOnline() { chatApp.goOnline(); }
