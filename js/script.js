/**
 * PORTFÓLIO PESSOAL – script.js
 * Autor: Seu Nome
 * Descrição: JavaScript puro (sem frameworks) para todas
 *   as interações, validações e funcionalidades do site.
 *
 * Funcionalidades implementadas:
 *  1. Menu hamburguer (mobile)
 *  2. Header com sombra ao rolar
 *  3. Link de navegação ativo ao rolar (Intersection Observer)
 *  4. Efeito de digitação automática (hero title)
 *  5. Cálculo de idade automático
 *  6. Animação de barras de skills ao entrar na viewport
 *  7. Animações de entrada (fade-up) via IntersectionObserver
 *  8. Filtro de projetos por categoria
 *  9. Validação completa do formulário de contato
 * 10. Simulação de envio do formulário + modal de confirmação
 * 11. Contador de caracteres no textarea
 * 12. Alternância de tema claro/escuro (persistido no sessionStorage)
 * 13. Botão "voltar ao topo"
 * 14. Ano atual no footer
 */

/* =============================================
   UTILITÁRIOS
=============================================== */

/**
 * Seleciona um elemento do DOM
 * @param {string} selector - Seletor CSS
 * @returns {Element|null}
 */
const $ = (selector) => document.querySelector(selector);

/**
 * Seleciona múltiplos elementos do DOM
 * @param {string} selector - Seletor CSS
 * @returns {NodeList}
 */
const $$ = (selector) => document.querySelectorAll(selector);

/* =============================================
   1. MENU HAMBURGUER (MOBILE)
   Mostra/esconde o menu em telas pequenas
=============================================== */
const hamburger = $('#hamburger');
const navMenu   = $('#nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');

    // Atualiza atributo ARIA para acessibilidade
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.classList.toggle('open', isOpen);
  });

  // Fecha o menu ao clicar em qualquer link
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =============================================
   2. HEADER COM SOMBRA AO ROLAR
   Adiciona classe .scrolled quando página é rolada
=============================================== */
const header = $('#header');

window.addEventListener('scroll', () => {
  if (header) {
    // Aplica sombra após 10px de scroll
    header.classList.toggle('scrolled', window.scrollY > 10);
  }

  // Mostra/esconde botão "voltar ao topo"
  const backToTop = $('#backToTop');
  if (backToTop) {
    backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
  }
}, { passive: true }); // passive melhora performance de scroll

/* =============================================
   3. LINK ATIVO NA NAVEGAÇÃO (SCROLL SPY)
   Marca o link do menu conforme a seção visível
=============================================== */
const sections  = $$('section[id]');
const navLinks  = $$('.nav-link');

// IntersectionObserver: observa quais seções estão na viewport
const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Remove classe ativa de todos os links
        navLinks.forEach((link) => link.classList.remove('active'));

        // Adiciona classe ativa ao link correspondente
        const activeLink = $(`a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  {
    // Seção é considerada visível quando ocupa 40% da viewport
    threshold: 0.40,
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '70px'} 0px 0px 0px`,
  }
);

sections.forEach((section) => spyObserver.observe(section));

/* =============================================
   4. EFEITO DE DIGITAÇÃO AUTOMÁTICA
   Exibe cargos/descrições na seção hero
=============================================== */
const typingEl = $('#typingText');

// Lista de textos que serão digitados em loop
const phrases = [
  'Estudante de Ciência da Computação 🎓',
  'Desenvolvedor Web em formação 💻',
  'Apaixonado por tecnologia e inovação 🚀',
  'Buscando minha primeira oportunidade em TI 🌱',
];

let phraseIndex  = 0; // índice da frase atual
let charIndex    = 0; // índice do caractere atual
let isDeleting   = false; // está apagando ou escrevendo?

/**
 * Função principal do efeito de digitação
 * Chamada recursivamente com setTimeout
 */
function typeEffect() {
  if (!typingEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // Escreve um caractere por vez
    typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentPhrase.length) {
      // Chegou ao fim da frase: pausa antes de apagar
      isDeleting = true;
      setTimeout(typeEffect, 2000); // espera 2s antes de apagar
      return;
    }
  } else {
    // Apaga um caractere por vez
    typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      // Terminou de apagar: vai para próxima frase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  // Velocidade: mais rápido ao apagar, mais lento ao escrever
  const speed = isDeleting ? 60 : 100;
  setTimeout(typeEffect, speed);
}

// Inicia o efeito após 1 segundo
setTimeout(typeEffect, 1000);

/* =============================================
   5. CÁLCULO DE IDADE AUTOMÁTICO
   Exibe a idade calculada dinamicamente
=============================================== */
const ageDisplay = $('#ageDisplay');

if (ageDisplay) {
  // Altere esta data de nascimento para a sua
  const birthDate = new Date('2004-09-02'); // Data de nascimento de Erik
  const today     = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Verifica se o aniversário já passou este ano
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  ageDisplay.textContent = `${age} anos`;
}

/* =============================================
   6. ANO ATUAL NO FOOTER
=============================================== */
const yearEl = $('#currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* =============================================
   7. ANIMAÇÃO DE BARRAS DE SKILLS
   Preenche as barras quando entram na viewport
=============================================== */
const skillBars = $$('.skill-progress');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar      = entry.target;
        const targetW  = bar.getAttribute('data-width'); // % alvo (ex: "90")
        bar.style.width = `${targetW}%`;

        // Para de observar após animar (evita re-animação)
        skillObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.3 }
);

skillBars.forEach((bar) => skillObserver.observe(bar));

/* =============================================
   8. ANIMAÇÕES DE ENTRADA (FADE-UP)
   Elementos com classe .reveal aparecem ao entrar na viewport
=============================================== */

// Adiciona .reveal automaticamente a elementos de seção
$$('.section-header, .timeline-item, .curso-card, .idioma-card, .project-card, .contact-method, .skill-item')
  .forEach((el) => el.classList.add('reveal'));

// Observer que aplica a animação
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // anima apenas uma vez
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

$$('.reveal').forEach((el) => revealObserver.observe(el));

/* =============================================
   9. FILTRO DE PROJETOS
   Filtra os cards por categoria ao clicar nos botões
=============================================== */
const filterBtns   = $$('.filter-btn');
const projectCards = $$('.project-card');
const noProjects   = $('#noProjects');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    // Atualiza estado ativo dos botões
    filterBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Mostra/esconde cards conforme categoria
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Exibe mensagem caso nenhum projeto seja encontrado
    if (noProjects) {
      noProjects.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
});

/* =============================================
   10. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
=============================================== */

/**
 * Exibe mensagem de erro em um campo
 * @param {string} fieldId - ID do input
 * @param {string} message - Mensagem de erro
 */
function showError(fieldId, message) {
  const field = $(`#${fieldId}`);
  const error = $(`#${fieldId}-error`);

  if (field) field.style.borderColor = 'var(--accent)';
  if (error) error.textContent = message;
}

/**
 * Limpa mensagem de erro de um campo
 * @param {string} fieldId - ID do input
 */
function clearError(fieldId) {
  const field = $(`#${fieldId}`);
  const error = $(`#${fieldId}-error`);

  if (field) field.style.borderColor = '';
  if (error) error.textContent = '';
}

/**
 * Valida formato de e-mail usando RegExp
 * Aceita: usuario@dominio.com, nome.sobrenome@empresa.org.br
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

/**
 * Função principal de envio do formulário
 * Chamada pelo botão onclick no HTML
 * Realiza: validação → simulação de envio → feedback ao usuário
 */
function enviarFormulario() {
  // Captura os valores dos campos
  const nome     = $('#nome')?.value.trim()     || '';
  const email    = $('#email')?.value.trim()    || '';
  const mensagem = $('#mensagem')?.value.trim() || '';

  // Limpa erros anteriores
  clearError('nome');
  clearError('email');
  clearError('mensagem');

  let hasError = false;

  /* --- Validação dos campos --- */

  // Valida nome (obrigatório, mínimo 3 caracteres)
  if (nome === '') {
    showError('nome', '⚠️ Por favor, informe seu nome.');
    hasError = true;
  } else if (nome.length < 3) {
    showError('nome', '⚠️ O nome deve ter ao menos 3 caracteres.');
    hasError = true;
  }

  // Valida e-mail (obrigatório + formato válido)
  if (email === '') {
    showError('email', '⚠️ Por favor, informe seu e-mail.');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError('email', '⚠️ Informe um e-mail válido (ex: nome@dominio.com).');
    hasError = true;
  }

  // Valida mensagem (obrigatória, mínimo 10 caracteres)
  if (mensagem === '') {
    showError('mensagem', '⚠️ Por favor, escreva sua mensagem.');
    hasError = true;
  } else if (mensagem.length < 10) {
    showError('mensagem', '⚠️ A mensagem deve ter ao menos 10 caracteres.');
    hasError = true;
  }

  // Se houver erros, não prossegue
  if (hasError) return;

  /* --- Simulação do envio --- */
  const btnText   = $('#btnText');
  const btnLoader = $('#btnLoader');
  const submitBtn = $('#submitBtn');

  // Exibe estado de carregamento no botão
  if (btnText)   btnText.style.display   = 'none';
  if (btnLoader) btnLoader.style.display = 'inline';
  if (submitBtn) submitBtn.disabled      = true;

  // Simula latência de rede (1.5 segundos)
  setTimeout(() => {
    // Restaura botão ao estado inicial
    if (btnText)   btnText.style.display   = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
    if (submitBtn) submitBtn.disabled      = false;

    // Limpa os campos do formulário após envio bem-sucedido
    if ($('#nome'))     $('#nome').value     = '';
    if ($('#email'))    $('#email').value    = '';
    if ($('#mensagem')) $('#mensagem').value = '';

    // Atualiza contador de caracteres
    const counter = $('#charCounter');
    if (counter) counter.textContent = '0 / 500 caracteres';

    // Exibe modal de confirmação
    abrirModal();
  }, 1500);
}

/* =============================================
   11. CONTADOR DE CARACTERES (TEXTAREA)
=============================================== */
const mensagemField = $('#mensagem');
const charCounter   = $('#charCounter');
const MAX_CHARS     = 500;

if (mensagemField && charCounter) {
  mensagemField.addEventListener('input', () => {
    const count = mensagemField.value.length;
    charCounter.textContent = `${count} / ${MAX_CHARS} caracteres`;

    // Aviso visual quando próximo do limite
    charCounter.style.color = count > MAX_CHARS * 0.9
      ? 'var(--accent)'
      : 'var(--text-muted)';

    // Impede ultrapassar o limite
    if (count > MAX_CHARS) {
      mensagemField.value = mensagemField.value.substring(0, MAX_CHARS);
      charCounter.textContent = `${MAX_CHARS} / ${MAX_CHARS} caracteres`;
    }
  });
}

/* =============================================
   12. MODAL DE CONFIRMAÇÃO
   Abre e fecha o modal de sucesso
=============================================== */

/**
 * Abre o modal de confirmação de envio
 */
function abrirModal() {
  const modal = $('#modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Bloqueia scroll do fundo
  }
}

/**
 * Fecha o modal de confirmação
 * (chamada pelo botão dentro do modal)
 */
function fecharModal() {
  const modal = $('#modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restaura scroll
  }
}

// Fecha o modal clicando fora da caixa (no overlay)
$('#modal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) fecharModal();
});

// Fecha o modal com a tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharModal();
});

/* =============================================
   13. ALTERNÂNCIA DE TEMA CLARO / ESCURO
   Persiste escolha no sessionStorage
=============================================== */
const body        = document.getElementById('body');
const themeToggle = $('#themeToggle');
const themeIcon   = $('#themeIcon');

// Constantes para os temas
const THEME_DARK  = 'dark-theme';
const THEME_LIGHT = 'light-theme';

/**
 * Aplica o tema ao body e atualiza o ícone
 * @param {string} theme - 'dark-theme' ou 'light-theme'
 */
function applyTheme(theme) {
  body.classList.remove(THEME_DARK, THEME_LIGHT);
  body.classList.add(theme);

  // Alterna o ícone do botão
  if (themeIcon) {
    themeIcon.textContent = theme === THEME_DARK ? '☀️' : '🌙';
  }

  // Persiste preferência no sessionStorage
  sessionStorage.setItem('erik-portfolio-theme', theme);
}

// Restaura tema salvo ao carregar a página
const savedTheme = sessionStorage.getItem('erik-portfolio-theme');
if (savedTheme) {
  applyTheme(savedTheme);
}

// Alterna entre temas ao clicar no botão
themeToggle?.addEventListener('click', () => {
  const isDark = body.classList.contains(THEME_DARK);
  applyTheme(isDark ? THEME_LIGHT : THEME_DARK);
});

/* =============================================
   14. VALIDAÇÃO INLINE (UX: feedback em tempo real)
   Valida campos ao sair do foco (evento blur)
=============================================== */

// Valida o campo nome ao sair
$('#nome')?.addEventListener('blur', function () {
  const val = this.value.trim();
  if (val === '')          showError('nome', '⚠️ Nome obrigatório.');
  else if (val.length < 3) showError('nome', '⚠️ Mínimo de 3 caracteres.');
  else                     clearError('nome');
});

// Valida o e-mail ao sair
$('#email')?.addEventListener('blur', function () {
  const val = this.value.trim();
  if (val === '')              showError('email', '⚠️ E-mail obrigatório.');
  else if (!isValidEmail(val)) showError('email', '⚠️ Formato inválido.');
  else                         clearError('email');
});

// Valida a mensagem ao sair
$('#mensagem')?.addEventListener('blur', function () {
  const val = this.value.trim();
  if (val === '')         showError('mensagem', '⚠️ Mensagem obrigatória.');
  else if (val.length < 10) showError('mensagem', '⚠️ Mínimo de 10 caracteres.');
  else                    clearError('mensagem');
});

// Limpa erro ao focar no campo (usuário percebe o feedback)
['nome', 'email', 'mensagem'].forEach((id) => {
  $(`#${id}`)?.addEventListener('focus', () => clearError(id));
});

/* =============================================
   LOG DE INICIALIZAÇÃO (somente em desenvolvimento)
=============================================== */
console.log('%c✅ Portfólio de Erik Nascimento carregado!', 'color:#2D6A4F; font-size:14px; font-weight:bold;');
console.log('%cHTML5 + CSS3 + JavaScript puro – sem frameworks', 'color:#52B788; font-size:11px;');
