// Mobile menu functions
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const hamburger = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('side-menu-close');
    const overlay = document.getElementById('overlay');
    const sideMenuLinks = document.querySelectorAll('.side-menu-link');
    
    // Função para aplicar o efeito de glassmorfismo ao rolar
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('glass-effect');
        } else {
            header.classList.remove('glass-effect');
        }
    }
    
    // Adiciona evento de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Verifica a posição inicial ao carregar a página
    handleScroll();
    
    // Função para abrir o menu lateral
    function openSideMenu() {
        sideMenu.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Função para fechar o menu lateral
    function closeSideMenu() {
        sideMenu.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners
    hamburger.addEventListener('click', openSideMenu);
    closeBtn.addEventListener('click', closeSideMenu);
    overlay.addEventListener('click', closeSideMenu);
    
    // Fechar menu ao clicar em um link
    sideMenuLinks.forEach(link => {
        link.addEventListener('click', closeSideMenu);
    });
    
    // Controle do vídeo de fundo da hero section
    const heroVideo = document.getElementById('hero-video');
    const videoContainer = document.querySelector('.video-container');
    
    if (heroVideo) {
        // Função para iniciar o vídeo com múltiplas abordagens
        function startVideo() {
            console.log('Tentando iniciar o vídeo');
            
            // Mostra o vídeo com fade-in
            videoContainer.classList.add('loaded');
            
            // Tenta várias abordagens para iniciar o vídeo
            // 1. Usando o método play()
            heroVideo.play().catch(error => {
                console.warn('Falha ao usar play():', error);
                
                // 2. Tentativa alternativa: recarregar o vídeo
                heroVideo.load();
                
                // 3. Definir currentTime pode forçar alguns navegadores a iniciar
                heroVideo.currentTime = 0;
                
                // 4. Tentativa final
                setTimeout(() => {
                    heroVideo.play().catch(err => {
                        console.error('Falha final ao iniciar o vídeo:', err);
                    });
                }, 500);
            });
        }
        
        // Verificar se o navegador suporta autorreproduções
        const autoplayAllowed = () => {
            return !(/iPhone|iPad|iPod/i.test(navigator.userAgent));
        };
        
        // Eventos para tentar iniciar o vídeo
        // 1. Quando o vídeo tiver dados suficientes para começar
        heroVideo.addEventListener('canplay', function() {
            console.log('Vídeo pode ser reproduzido');
            startVideo();
        });
        
        // 2. Quando o vídeo estiver totalmente carregado
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Vídeo carregado com sucesso');
            startVideo();
        });
        
        // 3. Quando a página estiver totalmente carregada
        window.addEventListener('load', function() {
            console.log('Página carregada, tentando vídeo');
            startVideo();
        });
        
        // 4. Outra tentativa após um pequeno atraso
        setTimeout(startVideo, 1000);
        
        // Tratamento para caso o vídeo não possa ser carregado
        heroVideo.addEventListener('error', function(e) {
            console.error('Erro ao carregar o vídeo:', e);
            // A imagem de fallback já está visível por padrão
        });
        
        // Em dispositivos móveis, iniciar o vídeo quando houver interação do usuário
        if (!autoplayAllowed()) {
            document.addEventListener('click', startVideo, {once: true});
            document.addEventListener('touchstart', startVideo, {once: true});
        }
    }
    
    // ===== FUNÇÕES PARA OS MODAIS (ADICIONADAS) =====
    
    // Função para abrir modal
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden'; // Impede rolagem do body
        }
    }
    
    // Função para fechar modal
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Aguarda a transição terminar
            document.body.style.overflow = 'auto'; // Permite rolagem do body novamente
        }
    }
    
    // Fechar modal ao clicar fora do conteúdo
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });
    
    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
});

// Implementação de scroll suave com offset para os links do menu
document.addEventListener('DOMContentLoaded', function() {


    // Seleciona todos os elementos com a classe "logo"
    const logoLinks = document.querySelectorAll('.logo');
    
    // Adiciona evento de clique a todos os logos
    logoLinks.forEach(logo => {
        logo.addEventListener('click', function(e) {
            // Previne o comportamento padrão de navegação
            e.preventDefault();
            
            // Rola suavemente para o topo
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Seleciona todos os links que começam com # (links de navegação interna)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Se o link não é apenas "#" (link para o topo)
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Obtém a posição do elemento alvo
                    const targetPosition = targetElement.getBoundingClientRect().top;
                    // Posição atual da página
                    const startPosition = window.pageYOffset;
                    // Offset para não deixar o conteúdo muito colado ao topo
                    const offset = 80; // Ajuste este valor conforme necessário
                    
                    // Calcular a posição final com o offset
                    const targetOffsetPosition = startPosition + targetPosition - offset;
                    
                    window.scrollTo({
                        top: targetOffsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Função para verificar se um elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Função para adicionar animações aos itens da timeline
function animateTimelineItems() {
    const timelineSection = document.querySelector('.timeline');
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Se a seção de timeline estiver visível
    if (isElementInViewport(timelineSection)) {
        // Anima a linha central primeiro
        timelineContainer.classList.add('animate');
        
        // Depois anima cada item com um atraso
        timelineItems.forEach((item, index) => {
            // Adiciona um atraso crescente para cada item
            setTimeout(() => {
                item.classList.add('animate');
            }, 500 + (300 * index)); // 500ms para a linha central + 300ms de atraso entre cada item
        });
        
        // Remove o listener depois que a animação for aplicada
        window.removeEventListener('scroll', animateTimelineItems);
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o evento de scroll para verificar quando a timeline está visível
    window.addEventListener('scroll', animateTimelineItems);
    
    // Verifica também ao carregar a página
    animateTimelineItems();
});


// Adicionar o código para o formulário
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o formulário de contato
    const contactForm = document.querySelector('.contact-form form');
    
    // Corrige o problema com o select de destino
    const destinationSelect = document.getElementById('destination');
    if (destinationSelect) {
        // Atualiza as opções do select para garantir valores corretos
        destinationSelect.innerHTML = `
            <option value="">Selecione...</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
            <option value="Doha">Doha</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Dubai">Dubai</option>
        `;
    }
    
    // Adiciona o evento de envio do formulário
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Previne o comportamento padrão de envio do formulário
            e.preventDefault();
            
            // Captura os dados do formulário
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const destination = document.getElementById('destination').value;
            const message = document.getElementById('message').value;
            
            // Validação básica dos dados
            if (!name || !email || !message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // URL do Google Apps Script
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxbnjao4_3L1OZMHNUYQGBzcsutzoC3OM_QYlgFeXOfo1qtnhJTw9HI8gIFA-5ckKYKxw/exec';
            
            // Prepara os dados para envio
            const formData = new FormData();
            formData.append('nome', name);
            formData.append('email', email);
            formData.append('destino', destination);
            formData.append('mensagem', message);
            
            // Mostra indicador de carregamento ou mensagem
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Enviando...';
            submitButton.disabled = true;
            
            // Para debug - mostra no console os valores sendo enviados
            console.log('Enviando dados:', {
                nome: name,
                email: email,
                destino: destination,
                mensagem: message
            });
            
            // Envia os dados para o Google Apps Script
            fetch(scriptURL, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Mostra mensagem de sucesso
                    contactForm.reset(); // Limpa o formulário
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                } else {
                    // Mostra mensagem de erro
                    alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
            })
            .finally(() => {
                // Restaura o botão ao estado original
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
});
