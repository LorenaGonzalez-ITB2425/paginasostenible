document.addEventListener("DOMContentLoaded", function() {
    // Modo claro/oscuro
    let savedMode = localStorage.getItem("mode");
    if (savedMode === "dark") {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
    }

    // Mostrar el loader mientras se carga la página
    let loader = document.getElementById("loader");

    // Crear un contenedor de imágenes dentro del loader
    let imagesContainer = document.createElement('div');
    imagesContainer.classList.add('images-container');
    loader.appendChild(imagesContainer);

    // Número de imágenes que quieres mostrar
    let numImages = 20;

    // Generar imágenes aleatorias
    for (let i = 0; i < numImages; i++) {
        let img = document.createElement('img');
        img.src = '../img/carg' + (i % 3 + 1) + '.jpg'; // Cambia las imágenes según la ruta
        img.alt = 'Imagen de carga';

        // Posición aleatoria
        img.style.top = Math.random() * 100 + '%';
        img.style.left = Math.random() * 100 + '%';

        // Añadir la imagen al contenedor
        imagesContainer.appendChild(img);
    }

    // Ocultar la pantalla de carga después de 3 segundos
    setTimeout(function() {
        loader.classList.add("hide");
    }, 3000);  // 3 segundos de espera

    // Mostrar la notificación
    let notification = document.getElementById("notification");
    notification.style.display = "block";

    // Ocultar la notificación después de 3 segundos
    setTimeout(function() {
        notification.classList.add("hide");
    }, 6000);

    // Manejo del botón de toggle para el menú lateral
    document.getElementById("toggle-btn").addEventListener("click", function() {
        let sidebar = document.getElementById("menu");
        if (sidebar.style.left === "0px") {
            sidebar.style.left = "-250px";
        } else {
            sidebar.style.left = "0px";
        }
    });

    // Manejo del botón de cambio de modo claro/oscuro
    document.getElementById("mode-toggle").addEventListener("click", function() {
        let body = document.body;
        body.classList.toggle("dark-mode");
        body.classList.toggle("light-mode");
        let mode = body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("mode", mode);
    });

    // Mostrar el submenú al hacer clic en un elemento de menú
    document.getElementById("menu-point-2").addEventListener("click", function() {
        let submenu = document.getElementById("submenu");
        submenu.classList.toggle("show");
    });

    // Mostrar u ocultar el chat al hacer clic en el botón de preguntas frecuentes
    let faqBtn = document.getElementById("faq-btn");
    let faqChat = document.getElementById("faq-chat");
    let closeChatBtn = document.getElementById("close-chat");

    faqBtn.addEventListener("click", function() {
        faqChat.style.display = "flex";
    });

    closeChatBtn.addEventListener("click", function() {
        faqChat.style.display = "none";
    });

    // Funcionalidad para mover el chat FAQ
    let faqHeader = document.querySelector(".faq-header");
    let isDragging = false;
    let offsetX, offsetY;

    faqHeader.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - faqChat.offsetLeft;
        offsetY = e.clientY - faqChat.offsetTop;
        faqChat.style.transition = "none"; // Desactivar la transición mientras arrastras
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            faqChat.style.left = `${e.clientX - offsetX}px`;
            faqChat.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        faqChat.style.transition = "all 0.3s ease"; // Reactivar la transición cuando ya no estás arrastrando
    });

    // Funcionalidad para manejar las preguntas predeterminadas
    let faqButtons = document.querySelectorAll(".faq-button");

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            let userQuestion = button.textContent;
            let botAnswer = getBotAnswer(userQuestion);
            
            // Crear un mensaje del usuario
            let userMessage = document.createElement("div");
            userMessage.classList.add("faq-message", "user");
            userMessage.textContent = userQuestion;
            document.querySelector(".faq-messages").appendChild(userMessage);
            
            // Crear la respuesta del bot
            let botMessage = document.createElement("div");
            botMessage.classList.add("faq-message", "bot");
            botMessage.textContent = botAnswer;
            document.querySelector(".faq-messages").appendChild(botMessage);
            
            // Hacer scroll al final del chat
            let messages = document.querySelector(".faq-messages");
            messages.scrollTop = messages.scrollHeight;
        });
    });

    // Función que devuelve la respuesta del bot basada en la pregunta
    function getBotAnswer(question) {
        const answers = {
            "¿Cómo puedo cambiar el modo de la página?": "Puedes cambiar el modo claro/oscuro haciendo clic en el ícono de la luna 🌙 en la esquina superior derecha.",
            "¿Qué es este sitio?": "Este sitio es una demostración de cómo usar menús, chats interactivos y más en una página web.",
            "¿Cómo contacto al soporte?": "Puedes contactar al soporte a través de nuestro correo electrónico: soporte@ejemplo.com",
        };
        
        return answers[question] || "Lo siento, no entiendo tu pregunta.";
    }

    // Manejo del botón de enviar para agregar preguntas y respuestas
    let sendBtn = document.getElementById("send-btn");
    let faqInput = document.getElementById("faq-input");
    let faqMessages = document.querySelector(".faq-messages");

    sendBtn.addEventListener("click", function() {
        let userMessage = faqInput.value.trim();

        if (userMessage) {
            // Agregar el mensaje del usuario al chat
            let userMessageElement = document.createElement("div");
            userMessageElement.classList.add("faq-message", "user");
            userMessageElement.textContent = userMessage;
            faqMessages.appendChild(userMessageElement);

            // Limpiar el input
            faqInput.value = "";

            // Responder con una respuesta automática (simulando respuestas predeterminadas)
            setTimeout(function() {
                let botResponse = getBotResponse(userMessage);
                let botMessageElement = document.createElement("div");
                botMessageElement.classList.add("faq-message", "bot");
                botMessageElement.textContent = botResponse;
                faqMessages.appendChild(botMessageElement);
                faqMessages.scrollTop = faqMessages.scrollHeight; // Desplazar hacia abajo
            }, 500);
        }
    });

    // Función para determinar la respuesta del bot según la pregunta
    function getBotResponse(question) {
        const faqs = {
            "¿Qué es este sitio?": "Este sitio es una página para gestionar consumos y trabajos.",
            "¿Cómo puedo cambiar el modo?": "Puedes cambiar el modo claro/oscuro haciendo clic en el ícono del sol o luna en la parte superior.",
            "¿Cómo contacto soporte?": "Puedes enviar un correo a soporte@ejemplo.com para más ayuda.",
            "¿Dónde están los consumos?": "Puedes ver los consumos en el menú lateral, bajo la opción 'Consumos'."
        };

        // Buscar la respuesta en las preguntas frecuentes
        return faqs[question] || "Lo siento, no entiendo esa pregunta. ¿Puedes intentar con otra?";
    }
});