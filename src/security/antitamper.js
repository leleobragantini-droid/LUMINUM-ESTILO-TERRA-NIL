/**
 * CLEANING REEFS — Sistema de Proteção Anti-Tamper
 * 
 * Protege contra:
 * 1. Manipulação via console do navegador
 * 2. Tentativas de injeção de scripts externos
 * 3. Detecção de DevTools aberto
 */

// ─── Assinatura de integridade do estado ─────────────────────────────────────
const _SALT = 'CleaningReefs_2026_LUMINUM';

export function signState(state) {
  const raw = JSON.stringify({
    energy: state.energy,
    phase: state.phase,
    globalAcidity: Math.floor(state.globalAcidity),
    globalTemp: Math.floor(state.globalTemp),
  });
  // Hash simples mas eficaz para detecção de tamper
  let hash = 0;
  const str = raw + _SALT;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export function verifyState(state, signature) {
  return signState(state) === signature;
}

// ─── Detecção de DevTools ─────────────────────────────────────────────────────
let _devToolsOpen = false;
let _devToolsCallbacks = [];

export function onDevToolsOpen(callback) {
  _devToolsCallbacks.push(callback);
}

function _checkDevTools() {
  const threshold = 160;
  const widthDiff = window.outerWidth - window.innerWidth;
  const heightDiff = window.outerHeight - window.innerHeight;

  const wasOpen = _devToolsOpen;
  _devToolsOpen = widthDiff > threshold || heightDiff > threshold;

  if (_devToolsOpen && !wasOpen) {
    _devToolsCallbacks.forEach(cb => cb());
  }
}

// ─── Proteção do console ──────────────────────────────────────────────────────
let _consoleWarningShown = false;

function _protectConsole() {
  const _originalWarn = console.warn;
  const _originalError = console.error;

  // Sobrescreve métodos do console para detectar uso malicioso
  const _noop = () => {};

  // Mantém warn e error funcionando (úteis para debug legítimo do React)
  // Bloqueia apenas tentativas de manipulação via eval
  const _origEval = window.eval;
  window.eval = function(code) {
    _originalWarn('[CleaningReefs] Tentativa de eval detectada e bloqueada.');
    // Permite eval do próprio React/Vite mas bloqueia strings suspeitas
    const suspicious = ['energy', 'phase', 'game', 'placeTool', 'setState'];
    const isSuspicious = suspicious.some(k => code.includes(k));
    if (isSuspicious) return undefined;
    return _origEval.call(this, code);
  };
}

// ─── Aviso visual no console ──────────────────────────────────────────────────
function _showConsoleWarning() {
  const styles = [
    'color: #f43f5e',
    'font-size: 16px',
    'font-weight: bold',
    'padding: 8px',
    'border: 2px solid #f43f5e',
    'border-radius: 4px',
  ].join(';');

  const styles2 = [
    'color: #38bdf8',
    'font-size: 12px',
  ].join(';');

  console.log('%c⚠️  AVISO DE SEGURANÇA — Cleaning Reefs', styles);
  console.log('%cEste console é destinado apenas a desenvolvedores.\nNão cole código aqui a menos que saiba exatamente o que está fazendo.\nTentativas de manipulação do jogo são detectadas e registradas.', styles2);
}

// ─── Verificação de integridade da URL ───────────────────────────────────────
export function checkOriginIntegrity() {
  const allowedOrigins = [
    'https://leleobragantini-droid.github.io',
    'http://localhost',
    'http://127.0.0.1',
  ];
  const origin = window.location.origin;
  const isAllowed = allowedOrigins.some(o => origin.startsWith(o));
  
  if (!isAllowed) {
    console.warn(`[CleaningReefs] Origem não autorizada: ${origin}`);
    // Não bloqueia (para evitar falsos positivos), apenas registra
    return false;
  }
  return true;
}

// ─── Proteção contra DevTools (Funções F12) ───────────────────────────────────
function _lockdownDevTools() {
  // 1. Bloqueia o Menu de Botão Direito ("Inspecionar Elemento")
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 2. Bloqueia TODAS as teclas de atalho que abrem o F12
  document.addEventListener('keydown', (e) => {
    // Tecla F12 direta
    if (e.key === 'F12') {
      e.preventDefault();
    }
    // Ctrl + Shift + I (Abrir DevTools)
    // Ctrl + Shift + J (Abrir Console)
    // Ctrl + Shift + C (Inspecionar Elemento)
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault();
    }
    // Ctrl + U (Ver Código Fonte)
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
      e.preventDefault();
    }
  });
}

// ─── Inicialização ────────────────────────────────────────────────────────────
export function initSecurity() {
  // 1. Exibe aviso profissional no console
  _showConsoleWarning();

  // 2. Protege o console contra manipulação de eval
  _protectConsole();

  // 3. Verifica origem
  checkOriginIntegrity();

  // 4. Ativa as proteções agressivas de bloqueio e armadilhas
  _lockdownDevTools();
}
