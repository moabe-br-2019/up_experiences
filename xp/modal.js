import { getTranslation } from './locale/translate.js';

// Função utilitária para pegar parâmetro da URL
function getUrlParam(param) {
    const url = new URL(window.location.href);
    return url.searchParams.get(param) || '';
}

// Cria e exibe o modal
export function openContactModal({ experienceName, experienceId }) {
    // Remove modal antigo se existir
    const oldModal = document.getElementById('contact-modal');
    if (oldModal) oldModal.remove();

    // Modal HTML
    const modal = document.createElement('div');
    modal.id = 'contact-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fade-in">
        <button id="close-modal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 class="text-2xl font-bold mb-4">${getTranslation('contato-whatsapp')}</h2>
        <form id="contact-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1" for="contact-name">${getTranslation('nome')}</label>
            <input id="contact-name" name="name" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
          </div>
          <div>
            <label class="block text-gray-700 mb-1" for="contact-whatsapp">WhatsApp</label>
            <input id="contact-whatsapp" name="whatsapp" type="tel" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="(99) 99999-9999">
          </div>
          <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
            <i class="fab fa-whatsapp text-xl"></i> ${getTranslation('enviar-mensagem')}
          </button>
        </form>
        <div id="modal-error" class="text-red-600 mt-2 hidden"></div>
      </div>
    `;
    document.body.appendChild(modal);

    // Fechar modal
    modal.querySelector('#close-modal').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };

    // Submissão do formulário
    modal.querySelector('#contact-form').onsubmit = async function(e) {
      e.preventDefault();
      const name = modal.querySelector('#contact-name').value.trim();
      const whatsapp = modal.querySelector('#contact-whatsapp').value.trim();
      if (!name || !whatsapp) {
        showError('Preencha todos os campos.');
        return;
      }
      // POST para Baserow
      const cupom = getUrlParam('cupom');
      const body = {
        Name: name,
        Whatsapp: whatsapp,
        Experiências: [Number(experienceId)]
      };
      if (cupom) {
        body.Parceiro_id = cupom;
      }
      try {
        const response = await fetch('https://api.baserow.io/api/database/rows/table/592260/?user_field_names=true', {
          method: 'POST',
          headers: {
            'Authorization': 'Token B1DXUzsApnrWG5NVa4KVTLloCaenctec',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
          console.error('Erro Baserow:', data);
          showError('Erro ao enviar. Tente novamente.');
          return;
        }
      } catch (err) {
        showError('Erro ao enviar. Tente novamente.');
        return;
      }
      // Monta mensagem WhatsApp
      let msg = `Olá, estou interessada no passeio ${experienceName}\nMe chamo ${name}\nTelefone ${whatsapp}`;
      if (cupom) {
        msg += `\nCupom de desconto ${cupom}`;
      }
      window.open(`https://wa.me/5521987838986?text=${encodeURIComponent(msg)}`, '_blank');
      modal.remove();
    };

    function showError(msg) {
      const err = modal.querySelector('#modal-error');
      err.textContent = msg;
      err.classList.remove('hidden');
    }
} 