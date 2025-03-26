// Mobile menu functions
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('side-menu-close');
    const overlay = document.getElementById('overlay');
    const sideMenuLinks = document.querySelectorAll('.side-menu-link');
    
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
});