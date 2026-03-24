import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { TOOLS, PHASES, GRID_SIZE } from './constants/gameData';
import * as Icons from 'lucide-react';
import './App.css';

const IconWrapper = ({ iconName, size = 24, ...props }) => {
  // Map our custom icon names to lucide react if needed
  let matchedName = iconName;
  if (iconName === 'ThermometerSnowflake') matchedName = 'Snowflake';
  if (iconName === 'FishSymbol') matchedName = 'Fish';
  
  const IconComponent = Icons[matchedName] || Icons.HelpCircle;
  return <IconComponent size={size} {...props} />;
};

function App() {
  const {
    grid, energy, phase, globalAcidity, globalTemp, biodiversity, placeTool
  } = useGameEngine();

  const [selectedTool, setSelectedTool] = useState(null);

  const handleCellClick = (x, y) => {
    if (selectedTool) {
      placeTool(x, y, selectedTool);
    }
  };

  const currentPhaseInfo = PHASES[phase] || PHASES[4];

  // Group tools by type or phase
  const availableTools = Object.values(TOOLS).filter(t => t.phase === null || t.phase <= phase);

  return (
    <div className="app-container">
      {/* Background layer */}
      <div className="ocean-bg">
        <div className="sun-rays"></div>
      </div>

      <header className="glass-panel top-header">
        <div className="game-title gradient-text">
          <h1>Reefs & Rainforests</h1>
          <span className="phase-badge">Fase {phase}: {currentPhaseInfo.name}</span>
        </div>
        <div className="global-stats">
          <div className="stat-item" title="Energia Fotossintética">
            <Icons.Zap size={20} color="var(--energy)" />
            <span>{energy}</span>
          </div>
          <div className="stat-item" title="Acidez Global">
            <Icons.Droplets size={20} color="var(--acidity-color)" />
            <span>{Math.floor(globalAcidity)}%</span>
            <div className="stat-bar"><div className="stat-fill" style={{width: `${globalAcidity}%`, backgroundColor: 'var(--acidity-color)'}}></div></div>
          </div>
          <div className="stat-item" title="Temperatura Global">
            <Icons.ThermometerSun size={20} color="var(--temp-color)" />
            <span>{Math.floor(globalTemp)}°C</span>
            <div className="stat-bar"><div className="stat-fill" style={{width: `${globalTemp}%`, backgroundColor: 'var(--temp-color)'}}></div></div>
          </div>
          <div className="stat-item" title="Biodiversidade">
            <Icons.Sprout size={20} color="#a7f3d0" />
            <span>{biodiversity}</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar glass-panel">
          <h2>Ferramentas</h2>
          <div className="tools-list">
            {availableTools.map(tool => (
              <button 
                key={tool.id}
                className={`tool-btn ${selectedTool === tool.id ? 'active' : ''} ${energy < tool.cost ? 'disabled' : ''}`}
                onClick={() => setSelectedTool(tool.id === selectedTool ? null : tool.id)}
                disabled={energy < tool.cost}
              >
                <div className="tool-icon">
                  <IconWrapper iconName={tool.icon} size={20} />
                </div>
                <div className="tool-info">
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-cost"><Icons.Zap size={12}/> {tool.cost}</span>
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
            {grid.map((row, y) => (
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`grid-cell type-${cell.type}`}
                  onClick={() => handleCellClick(x, y)}
                  title={`Acid: ${Math.floor(cell.acidLevel)} | Temp: ${Math.floor(cell.tempLevel)}`}
                >
                  {cell.type !== 'empty' && cell.contentId && (
                     <div className={`cell-content content-${cell.contentId}`}>
                       <IconWrapper iconName={TOOLS[cell.contentId]?.icon || 'Circle'} size={24} />
                     </div>
                  )}
                  {cell.type === 'dead_coral' && !cell.contentId && (
                    <div className="cell-content dead">
                       <Icons.Skull size={20} opacity={0.5}/>
                    </div>
                  )}
                  
                  {/* Visual warning for high local bleach risk */}
                  {(cell.acidLevel > 70 || cell.tempLevel > 70) && cell.type === 'empty' && (
                    <div className="danger-overlay" style={{ opacity: Math.max(0, (Math.max(cell.acidLevel, cell.tempLevel) - 70) / 30) * 0.5}}></div>
                  )}
                </div>
              ))
            ))}
          </div>
        </section>

        <aside className="right-panel glass-panel">
           <h2>Fase Atual</h2>
           <p className="phase-desc">{currentPhaseInfo.description}</p>
           
           <div className="phase-progress">
             <h3>Objetivos</h3>
             {phase === 1 && (
               <ul className="objectives">
                 <li className={globalAcidity < 40 ? 'done' : ''}><Icons.CheckCircle2 size={16}/> Acidez &lt; 40%</li>
                 <li className={globalTemp < 40 ? 'done' : ''}><Icons.CheckCircle2 size={16}/> Temp &lt; 40%</li>
               </ul>
             )}
             {phase === 2 && (
               <ul className="objectives">
                 <li className={energy >= 200 ? 'done' : ''}><Icons.CheckCircle2 size={16}/> 200 Energia</li>
                 <li className={grid.flat().filter(c => c.type === 'coral').length >= 10 ? 'done' : ''}><Icons.CheckCircle2 size={16}/> 10 Corais</li>
               </ul>
             )}
             {phase === 3 && (
               <ul className="objectives">
                 <li className={biodiversity >= 5 ? 'done' : ''}><Icons.CheckCircle2 size={16}/> Biodiversidade: 5</li>
               </ul>
             )}
             {phase === 4 && (
               <ul className="objectives">
                 <li className={grid.flat().filter(c => c.type === 'machine').length === 0 ? 'done' : ''}><Icons.CheckCircle2 size={16}/> Remover Máquinas</li>
               </ul>
             )}
           </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
