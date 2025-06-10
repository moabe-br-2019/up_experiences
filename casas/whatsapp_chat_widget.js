// Widget de Chat WhatsApp
(function() {
    'use strict';
    
    // Configurações
    const CONFIG = {
        phoneNumber: '5521987838986', // Substitua pelo seu número do WhatsApp (com código do país)
        welcomeMessage: 'Olá! 👋 Como posso ajudá-lo hoje?',
        notificationText: 'Nova mensagem!',
        placeholder: 'Digite sua mensagem...',
        sendButtonText: 'Enviar'
    };
    
    // Criar estilos CSS
    const styles = `
        .whatsapp-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        
        .whatsapp-button {
            width: 60px;
            height: 60px;
            background: #25D366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .whatsapp-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        .whatsapp-button svg {
            width: 32px;
            height: 32px;
            fill: white;
        }
        
        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .chat-balloon {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 320px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            transition: all 0.3s ease;
            pointer-events: none;
        }
        
        .chat-balloon.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }
        
        .chat-header {
            background: #000000;
            color: white;
            padding: 15px;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .chat-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-body {
            padding: 20px;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .message {
            background: #f0f0f0;
            padding: 12px 15px;
            border-radius: 18px 18px 18px 4px;
            margin-bottom: 15px;
            font-size: 14px;
            line-height: 1.4;
            animation: messageSlide 0.5s ease;
        }
        
        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .message-input {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 12px 15px;
            font-size: 14px;
            outline: none;
            resize: none;
            min-height: 20px;
            max-height: 80px;
            box-sizing: border-box;
        }
        
        .message-input:focus {
            border-color: #25D366;
        }
        
        .send-btn {
            width: 100%;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 12px;
            margin-top: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.3s ease;
        }
        
        .send-btn:hover {
            background: #128C7E;
        }
        
        .send-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            padding: 10px 0;
            font-size: 12px;
            color: #666;
        }
        
        .typing-dots {
            display: flex;
            margin-left: 5px;
        }
        
        .typing-dots span {
            width: 4px;
            height: 4px;
            background: #666;
            border-radius: 50%;
            margin: 0 1px;
            animation: typingBounce 1.4s infinite;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typingBounce {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }
        
        @media (max-width: 480px) {
            .chat-balloon {
                width: calc(100vw - 40px);
                right: -10px;
            }
        }
    `;
    
    // Adicionar estilos ao documento
    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // Criar widget HTML
    function createWidget() {
        const widget = document.createElement('div');
        widget.className = 'whatsapp-widget';
        widget.innerHTML = `
            <div class="whatsapp-button" id="whatsapp-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"/>
                </svg>
                <div class="notification-badge" id="notification-badge" style="display: none;">1</div>
            </div>
            
            <div class="chat-balloon" id="chat-balloon">
                <div class="chat-header">
                    <h3>UpExperiences</h3>
                    <button class="close-btn" id="close-btn">×</button>
                </div>
                <div class="chat-body">
                    <div class="message" id="welcome-message">${CONFIG.welcomeMessage}</div>
                    <div class="typing-indicator" id="typing-indicator" style="display: none;">
                        Digitando
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <textarea class="message-input" id="message-input" placeholder="${CONFIG.placeholder}" rows="1"></textarea>
                    <button class="send-btn" id="send-btn">${CONFIG.sendButtonText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        return widget;
    }
    
    // Auto-resize textarea
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
    }
    
    // Mostrar notificação inicial
    function showInitialNotification() {
        setTimeout(() => {
            const badge = document.getElementById('notification-badge');
            const balloon = document.getElementById('chat-balloon');
            
            badge.style.display = 'flex';
            
            setTimeout(() => {
                balloon.classList.add('active');
                badge.style.display = 'none';
            }, 3000);
        }, 2000);
    }
    
    // Simular digitação do atendente
    function showTypingIndicator(callback) {
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.style.display = 'flex';
        
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            callback();
        }, 1500);
    }
    
    // Enviar mensagem para WhatsApp
    function sendToWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${CONFIG.phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
    
    // Configurar eventos
    function setupEventListeners() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const chatBalloon = document.getElementById('chat-balloon');
        const closeBtn = document.getElementById('close-btn');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        
        // Toggle chat balloon
        whatsappBtn.addEventListener('click', () => {
            const isActive = chatBalloon.classList.contains('active');
            if (isActive) {
                chatBalloon.classList.remove('active');
            } else {
                chatBalloon.classList.add('active');
                messageInput.focus();
            }
        });
        
        // Fechar chat
        closeBtn.addEventListener('click', () => {
            chatBalloon.classList.remove('active');
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            autoResizeTextarea(this);
            
            // Habilitar/desabilitar botão enviar
            sendBtn.disabled = this.value.trim() === '';
        });
        
        // Enviar mensagem (Enter)
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (this.value.trim() !== '') {
                    sendMessage();
                }
            }
        });
        
        // Enviar mensagem (botão)
        sendBtn.addEventListener('click', sendMessage);
        
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message === '') return;
            
            // Limpar campo
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendBtn.disabled = true;
            
            // Fechar chat e abrir WhatsApp
            setTimeout(() => {
                chatBalloon.classList.remove('active');
                sendToWhatsApp(message);
            }, 300);
        }
        
        // Fechar ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.whatsapp-widget')) {
                chatBalloon.classList.remove('active');
            }
        });
    }
    
    // Inicializar widget
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addStyles();
                createWidget();
                setupEventListeners();
                showInitialNotification();
            });
        } else {
            addStyles();
            createWidget();
            setupEventListeners();
            showInitialNotification();
        }
    }
    
    // Executar
    init();
})();