// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

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
});