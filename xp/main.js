import { loadTranslations, getTranslation } from './locale/translate.js';
import { openContactModal } from './modal.js';

const BASEROW_TOKEN = 'B1DXUzsApnrWG5NVa4KVTLloCaenctec';
const API_URL = 'https://api.baserow.io/api/database/rows/table/583812/?user_field_names=true';

function getUrlLang() {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam) {
        if (langParam.toLowerCase() === 'en_us') return 'en-us';
        if (langParam.toLowerCase() === 'pt_br') return 'pt-br';
    }
    return 'pt-br';
}

let currentLang = getUrlLang();
let cachedData = null;
let translations = {};

async function fetchData() {
    const res = await fetch(API_URL, {
        headers: {
            'Authorization': 'Token ' + BASEROW_TOKEN
        }
    });
    if (!res.ok) throw new Error('Erro ao buscar dados');
    return res.json();
}

function renderData(data) {
    const container = document.getElementById('dynamicData');
    container.innerHTML = '';
    data.results.forEach(item => {
        const name = currentLang === 'en-us' ? item.Name_en_us : item.Name_pt_br;
        const desc = currentLang === 'en-us' ? item.Description_en_us : item.Description_pt_br;
        const imgUrl = item.Image && item.Image[0] && item.Image[0].thumbnails && item.Image[0].thumbnails.card_cover ? item.Image[0].thumbnails.card_cover.url : '';
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center';
        card.innerHTML = `
            ${imgUrl ? `<img src="${imgUrl}" alt="${name}" class="w-full sm:max-w-xs rounded-lg object-cover shadow-md">` : ''}
            <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">${name}</h2>
                <p class="text-gray-700 whitespace-pre-line">${desc}</p>
                <button type="button" class="open-whatsapp inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold mt-4 transition" data-experience-id="${item.id}" data-experience-name="${name}">
                    <i class='fab fa-whatsapp text-xl'></i>
                    ${getTranslation('whatsapp')}
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    // Adiciona evento aos botões
    container.querySelectorAll('.open-whatsapp').forEach(btn => {
        btn.onclick = () => {
            openContactModal({
                experienceName: btn.getAttribute('data-experience-name'),
                experienceId: btn.getAttribute('data-experience-id')
            });
        };
    });
}

function updateLangLabels() {
    document.getElementById('hero-title').textContent = getTranslation('heroTitle');
    document.getElementById('hero-cta').textContent = getTranslation('heroCta');
}

async function init() {
    translations = await loadTranslations(currentLang);
    try {
        cachedData = await fetchData();
        renderData(cachedData);
        updateLangLabels();
    } catch (e) {
        document.getElementById('dynamicData').innerHTML = `<div class="text-red-600">${getTranslation('error')}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Define o valor do select conforme o idioma detectado
    document.getElementById('langSelect').value = currentLang;
    document.getElementById('langSelect').addEventListener('change', async function(e) {
        currentLang = e.target.value;
        translations = await loadTranslations(currentLang);
        if (cachedData) renderData(cachedData);
        updateLangLabels();
    });
    // Scroll suave para o botão hero-cta
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            const target = document.getElementById('tours');
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    init();
});

export { currentLang, translations }; 