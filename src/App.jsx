import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { TOOLS, PHASES, GRID_SIZE } from './constants/gameData';
import * as Icons from 'lucide-react';
import './App.css';

// ─── Icon Wrapper ───────────────────────────────────────────────────────────
const IconWrapper = ({ iconName, size = 24, ...props }) => {
  let matchedName = iconName;
  if (iconName === 'ThermometerSnowflake') matchedName = 'Snowflake';
  if (iconName === 'FishSymbol') matchedName = 'Fish';
  if (iconName === 'CheckCircle2') {
    if (Icons.CircleCheck) matchedName = 'CircleCheck';
    else if (Icons.CheckCircle2) matchedName = 'CheckCircle2';
    else matchedName = 'CheckCircle';
  }
  const IconComponent = Icons[matchedName] || Icons.CircleHelp || Icons.Circle;
  if (!IconComponent) return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  return <IconComponent size={size} {...props} />;
};

// ─── Screen: Landing / Cover ─────────────────────────────────────────────────
const LandingScreen = ({ onPlay, onTutorial }) => (
  <div className="landing-screen">
    <div className="landing-bg">
      <div className="bubbles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bubble" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            width: `${8 + Math.random() * 20}px`,
            height: `${8 + Math.random() * 20}px`,
          }} />
        ))}
      </div>
    </div>

    <div className="landing-content">
      <div className="landing-logo">
        <div className="logo-icon-row">
          <Icons.Waves size={48} color="#38bdf8" />
          <Icons.Fish size={42} color="#f43f5e" />
          <Icons.Waves size={48} color="#38bdf8" style={{ transform: 'scaleX(-1)' }} />
        </div>
        <h1 className="landing-title">Cleaning Reefs</h1>
        <p className="landing-subtitle">Restaure o recife de coral e salve o oceano</p>
      </div>

      <div className="landing-badges">
        <span className="badge">🌊 Estratégia</span>
        <span className="badge">🪸 Ecologia</span>
        <span className="badge">♻️ Sustentabilidade</span>
      </div>

      <div className="landing-buttons">
        <button className="btn-primary" onClick={onPlay} id="btn-play">
          <Icons.Play size={20} />
          Jogar
        </button>
        <button className="btn-secondary" onClick={onTutorial} id="btn-tutorial">
          <Icons.BookOpen size={20} />
          Como Jogar
        </button>
      </div>

      <div className="landing-credits-small">
        Criado por Gustavo Franco • Thales Serafin • Davi Jun • Leonardo Brangantini
      </div>
    </div>
  </div>
);

// ─── Screen: Tutorial ─────────────────────────────────────────────────────────
const TutorialScreen = ({ onBack }) => {
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: "🌊 O que é Cleaning Reefs?",
      content: (
        <div className="tutorial-page">
          <p>Cleaning Reefs é um jogo de estratégia onde você deve <strong>restaurar um recife de coral</strong> destruído pela poluição e aquecimento dos oceanos.</p>
          <div className="tutorial-img-area">
            <Icons.Waves size={64} color="#38bdf8" />
          </div>
          <p>Você tem <strong>4 fases</strong> para completar, cada uma com objetivos específicos. O jogo fica mais difícil conforme a acidez e temperatura sobem rapidamente!</p>
          <div className="tip-box">
            💡 <strong>Dica:</strong> Aja rápido! A acidez e temperatura sobem continuamente. Cada segundo conta.
          </div>
        </div>
      )
    },
    {
      title: "⚡ Recursos — Energia",
      content: (
        <div className="tutorial-page">
          <p>A <strong>Energia Fotossintética</strong> é o seu principal recurso. Você começa com 100 unidades e precisa dela para colocar ferramentas.</p>
          <div className="tutorial-stat-example">
            <Icons.Zap size={32} color="#38bdf8" />
            <div>
              <strong>Como conseguir mais energia:</strong>
              <ul>
                <li>🪸 Coral Cérebro gera +2/tick</li>
                <li>🔥 Coral de Fogo gera +1/tick</li>
                <li>🌀 Coral Leque gera +3/tick</li>
                <li>♻️ Reciclar máquinas devolve +10</li>
              </ul>
            </div>
          </div>
          <div className="tip-box">
            ⚠️ <strong>Cuidado:</strong> Se você ficar sem energia, não poderá colocar novas ferramentas!
          </div>
        </div>
      )
    },
    {
      title: "📊 Acidez e Temperatura",
      content: (
        <div className="tutorial-page">
          <p>A <strong>Acidez</strong> e a <strong>Temperatura</strong> são seus principais inimigos. Se ficarem altas, os corais morrem!</p>
          <div className="tutorial-bars-example">
            <div className="tut-bar-row">
              <Icons.Droplets size={24} color="#bef264" />
              <span>Acidez</span>
              <div className="tut-bar"><div className="tut-fill acid" /></div>
            </div>
            <div className="tut-bar-row">
              <Icons.ThermometerSun size={24} color="#ef4444" />
              <span>Temperatura</span>
              <div className="tut-bar"><div className="tut-fill temp" /></div>
            </div>
          </div>
          <ul className="tutorial-list">
            <li>🔵 Use <strong>Purificadores</strong> para reduzir acidez</li>
            <li>❄️ Use <strong>Resfriadores</strong> para reduzir temperatura</li>
            <li>🌿 <strong>Manguezais</strong> nas bordas ajudam globalmente</li>
          </ul>
          <div className="tip-box">
            💡 Quanto mais purificadores/resfriadores, mais rápido os valores caem!
          </div>
        </div>
      )
    },
    {
      title: "🎮 As 4 Fases do Jogo",
      content: (
        <div className="tutorial-page">
          <div className="phase-list">
            <div className="phase-item">
              <span className="phase-num">1</span>
              <div>
                <strong>Estabilização</strong>
                <p>Reduza Acidez e Temperatura abaixo de 40% usando purificadores e resfriadores.</p>
              </div>
            </div>
            <div className="phase-item">
              <span className="phase-num">2</span>
              <div>
                <strong>Semeadura</strong>
                <p>Plante 10 corais e acumule 200 de energia fotossintética.</p>
              </div>
            </div>
            <div className="phase-item">
              <span className="phase-num">3</span>
              <div>
                <strong>Fauna</strong>
                <p>Introduza 5 animais diferentes (Polvos, Tartarugas, Tubarões).</p>
              </div>
            </div>
            <div className="phase-item">
              <span className="phase-num">4</span>
              <div>
                <strong>Reciclagem</strong>
                <p>Remova TODAS as máquinas do recife para finalizar o jogo!</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🖱️ Como Jogar — Controles",
      content: (
        <div className="tutorial-page">
          <div className="controls-grid">
            <div className="control-item">
              <Icons.MousePointer size={32} color="#38bdf8" />
              <strong>Selecionar Ferramenta</strong>
              <p>Clique em uma ferramenta no painel esquerdo para selecioná-la.</p>
            </div>
            <div className="control-item">
              <Icons.Square size={32} color="#a7f3d0" />
              <strong>Colocar no Grid</strong>
              <p>Clique em uma célula do grid para colocar a ferramenta selecionada.</p>
            </div>
            <div className="control-item">
              <Icons.Info size={32} color="#f59e0b" />
              <strong>Ver Detalhes</strong>
              <p>Passe o mouse sobre células para ver acidez e temperatura local.</p>
            </div>
            <div className="control-item">
              <Icons.Target size={32} color="#f43f5e" />
              <strong>Objetivos</strong>
              <p>Veja o painel direito para acompanhar os objetivos de cada fase!</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="tutorial-screen">
      <div className="tutorial-container glass-panel">
        <div className="tutorial-header">
          <h2>{pages[page].title}</h2>
          <span className="tut-counter">{page + 1} / {pages.length}</span>
        </div>

        <div className="tutorial-body">
          {pages[page].content}
        </div>

        <div className="tutorial-footer">
          <button className="btn-ghost" onClick={onBack} id="tut-back-menu">
            <Icons.Home size={18} /> Menu
          </button>
          <div className="tut-dots">
            {pages.map((_, i) => (
              <span key={i} className={`tut-dot ${i === page ? 'active' : ''}`} onClick={() => setPage(i)} />
            ))}
          </div>
          <div className="tut-nav-btns">
            {page > 0 && (
              <button className="btn-ghost" onClick={() => setPage(p => p - 1)} id="tut-prev">
                <Icons.ChevronLeft size={18} /> Anterior
              </button>
            )}
            {page < pages.length - 1 ? (
              <button className="btn-primary small" onClick={() => setPage(p => p + 1)} id="tut-next">
                Próximo <Icons.ChevronRight size={18} />
              </button>
            ) : (
              <button className="btn-primary small" onClick={onBack} id="tut-finish">
                <Icons.Check size={18} /> Entendido!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Victory / End ────────────────────────────────────────────────────
const VictoryScreen = ({ onRestart }) => (
  <div className="victory-screen">
    <div className="victory-bg">
      <div className="confetti-layer">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="confetti-piece" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            background: ['#38bdf8','#f43f5e','#a7f3d0','#fbbf24','#a855f7','#10b981'][i % 6],
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
          }} />
        ))}
      </div>
    </div>

    <div className="victory-content glass-panel">
      <div className="victory-icon-row">
        <Icons.Trophy size={64} color="#fbbf24" />
      </div>
      <h1 className="victory-title">🎉 Parabéns!</h1>
      <h2 className="victory-subtitle">Você Salvou o Recife!</h2>
      <p className="victory-desc">
        Missão cumprida! O recife de coral foi completamente restaurado. 
        A vida marinha floresce novamente graças ao seu trabalho. 
        O oceano agradece! 🌊🪸🐠
      </p>

      <div className="victory-stats-row">
        <div className="v-stat">
          <Icons.Waves size={28} color="#38bdf8" />
          <span>Recife Restaurado</span>
        </div>
        <div className="v-stat">
          <Icons.Fish size={28} color="#f43f5e" />
          <span>Fauna Reintroduzida</span>
        </div>
        <div className="v-stat">
          <Icons.Recycle size={28} color="#a7f3d0" />
          <span>Máquinas Removidas</span>
        </div>
      </div>

      <div className="credits-box">
        <h3>✨ Créditos</h3>
        <p className="credits-label">Criado por</p>
        <div className="creators-list">
          <div className="creator-item">
            <Icons.User size={20} color="#38bdf8" />
            <span>Gustavo Fernandes Franco</span>
          </div>
          <div className="creator-item">
            <Icons.User size={20} color="#a855f7" />
            <span>Thales Serafin De Sá</span>
          </div>
          <div className="creator-item">
            <Icons.User size={20} color="#f43f5e" />
            <span>Davi Jun Horii Dos Santos</span>
          </div>
          <div className="creator-item">
            <Icons.User size={20} color="#fbbf24" />
            <span>Leonardo Barbosa Brangantini</span>
          </div>
        </div>
      </div>

      <button className="btn-primary large" onClick={onRestart} id="btn-restart">
        <Icons.RotateCcw size={20} />
        Jogar Novamente
      </button>
    </div>
  </div>
);

// ─── Main Game UI ─────────────────────────────────────────────────────────────
function GameUI({ game }) {
  const { grid, energy, phase, globalAcidity, globalTemp, biodiversity, placeTool } = game;
  const [selectedTool, setSelectedTool] = useState(null);
  const [isAFK, setIsAFK] = useState(false);

  React.useEffect(() => {
    const checkAFK = () => {
      setIsAFK(document.hidden || !document.hasFocus());
    };
    
    // Verifica logica inicial e adiciona os event listeners
    checkAFK();
    window.addEventListener('focus', checkAFK);
    window.addEventListener('blur', checkAFK);
    document.addEventListener('visibilitychange', checkAFK);

    return () => {
      window.removeEventListener('focus', checkAFK);
      window.removeEventListener('blur', checkAFK);
      document.removeEventListener('visibilitychange', checkAFK);
    };
  }, []);

  const handleCellClick = (x, y) => {
    if (selectedTool) placeTool(x, y, selectedTool);
  };

  const currentPhaseInfo = PHASES[phase] || PHASES[4];
  const availableTools = Object.values(TOOLS).filter(t => t.phase === null || t.phase <= phase);
  const machineCount = grid.flat().filter(c => c.type === 'machine').length;

  return (
    <div className="app-container">
      <div className="ocean-bg">
        <div className="sun-rays"></div>
      </div>

      <header className="glass-panel top-header">
        <div className="game-title gradient-text">
          <h1>Cleaning Reefs</h1>
          <span className="phase-badge">Fase {phase}: {currentPhaseInfo.name}</span>
        </div>
        <div className="global-stats">
          <div className="stat-item" title="Energia Fotossintética">
            <Icons.Zap size={20} color="var(--energy)" />
            <span>{energy}</span>
          </div>
          <div className="stat-item" title={`Acidez Global: ${Math.floor(globalAcidity)}%`}>
            <Icons.Droplets size={20} color="var(--acidity-color)" />
            <span>{Math.floor(globalAcidity)}%</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${globalAcidity}%`, backgroundColor: 'var(--acidity-color)' }}></div>
            </div>
          </div>
          <div className="stat-item" title={`Temperatura Global: ${Math.floor(globalTemp)}°C`}>
            <Icons.ThermometerSun size={20} color="var(--temp-color)" />
            <span>{Math.floor(globalTemp)}°</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${globalTemp}%`, backgroundColor: 'var(--temp-color)' }}></div>
            </div>
          </div>
          <div className="stat-item" title="Biodiversidade">
            <Icons.Sprout size={20} color="#a7f3d0" />
            <span>{biodiversity}/5</span>
          </div>
          {phase === 4 && (
            <div className="stat-item" title="Máquinas restantes">
              <Icons.Recycle size={20} color="#f97316" />
              <span>{machineCount} máq.</span>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {isAFK && (
          <div className="afk-overlay" onClick={() => window.focus()}>
            <Icons.PauseCircle size={64} color="#fcd34d" />
            <h2>Jogo Pausado (AFK)</h2>
            <p>O tempo e a energia pararam de rolar.</p>
            <p className="afk-small">Clique aqui para voltar a jogar!</p>
          </div>
        )}

        <aside className="sidebar glass-panel">
          <h2>Ferramentas</h2>
          <div className="tools-list">
            {availableTools.map(tool => (
              <button
                key={tool.id}
                id={`tool-${tool.id}`}
                className={`tool-btn ${selectedTool === tool.id ? 'active' : ''} ${energy < tool.cost ? 'disabled' : ''}`}
                onClick={() => setSelectedTool(tool.id === selectedTool ? null : tool.id)}
                disabled={energy < tool.cost}
              >
                <div className="tool-icon">
                  <IconWrapper iconName={tool.icon} size={20} />
                </div>
                <div className="tool-info">
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-cost"><Icons.Zap size={12} /> {tool.cost}</span>
                </div>
              </button>
            ))}
          </div>
          {selectedTool && TOOLS[selectedTool] && (
            <div className="tool-details">
              <h4>{TOOLS[selectedTool].name}</h4>
              <p>{TOOLS[selectedTool].desc}</p>
            </div>
          )}
        </aside>

        <section className="grid-container">
          <div className="game-grid">
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`grid-cell type-${cell.type}`}
                  onClick={() => handleCellClick(x, y)}
                  title={`Acid: ${Math.floor(cell.acidLevel)}% | Temp: ${Math.floor(cell.tempLevel)}%`}
                >
                  {cell.type !== 'empty' && cell.contentId && (
                    <div className={`cell-content content-${cell.contentId}`}>
                      <IconWrapper iconName={TOOLS[cell.contentId]?.icon || 'Circle'} size={20} />
                    </div>
                  )}
                  {cell.type === 'dead_coral' && !cell.contentId && (
                    <div className="cell-content dead">
                      <Icons.Skull size={16} opacity={0.5} />
                    </div>
                  )}
                  {(cell.acidLevel > 70 || cell.tempLevel > 70) && cell.type === 'empty' && (
                    <div className="danger-overlay" style={{ opacity: Math.max(0, (Math.max(cell.acidLevel, cell.tempLevel) - 70) / 30) * 0.5 }}></div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="right-panel glass-panel">
          <h2>Fase Atual</h2>
          <p className="phase-desc">{currentPhaseInfo.description}</p>

          <div className="phase-progress">
            <h3>Objetivos</h3>
            {phase === 1 && (
              <ul className="objectives">
                <li className={globalAcidity < 40 ? 'done' : ''}><IconWrapper iconName="CheckCircle2" size={16} /> Acidez {'<'} 40% (atual: {Math.floor(globalAcidity)}%)</li>
                <li className={globalTemp < 40 ? 'done' : ''}><IconWrapper iconName="CheckCircle2" size={16} /> Temp {'<'} 40% (atual: {Math.floor(globalTemp)}%)</li>
              </ul>
            )}
            {phase === 2 && (
              <ul className="objectives">
                <li className={energy >= 200 ? 'done' : ''}><IconWrapper iconName="CheckCircle2" size={16} /> 200 Energia (atual: {energy})</li>
                <li className={grid.flat().filter(c => c.type === 'coral').length >= 10 ? 'done' : ''}><IconWrapper iconName="CheckCircle2" size={16} /> 10 Corais (atual: {grid.flat().filter(c => c.type === 'coral').length})</li>
              </ul>
            )}
            {phase === 3 && (
              <ul className="objectives">
                <li className={biodiversity >= 5 ? 'done' : ''}><IconWrapper iconName="CheckCircle2" size={16} /> Biodiversidade 5 (atual: {biodiversity})</li>
              </ul>
            )}
            {phase === 4 && (
              <ul className="objectives">
                <li className={machineCount === 0 ? 'done' : ''}><IconWrapper iconName="CheckCircle2" size={16} /> Remover todas as máquinas ({machineCount} restantes)</li>
              </ul>
            )}
          </div>

          <div className="phase-indicators">
            {[1, 2, 3, 4].map(p => (
              <div key={p} className={`phase-dot ${p < phase ? 'completed' : ''} ${p === phase ? 'current' : ''}`}>
                {p < phase ? <Icons.Check size={12} /> : p}
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'tutorial' | 'game' | 'victory'
  const game = useGameEngine();

  // Watch for win condition
  React.useEffect(() => {
    if (game.gameOver === 'win' && screen === 'game') {
      setScreen('victory');
    }
  }, [game.gameOver, screen]);

  const handlePlay = () => {
    game.restartGame();
    setScreen('game');
  };

  const handleRestart = () => {
    game.restartGame();
    setScreen('landing');
  };

  if (screen === 'landing') return <LandingScreen onPlay={handlePlay} onTutorial={() => setScreen('tutorial')} />;
  if (screen === 'tutorial') return <TutorialScreen onBack={() => setScreen('landing')} />;
  if (screen === 'victory') return <VictoryScreen onRestart={handleRestart} />;
  return <GameUI game={game} />;
}

export default App;
