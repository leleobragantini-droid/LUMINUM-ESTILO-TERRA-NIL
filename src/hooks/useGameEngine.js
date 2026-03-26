import { useState, useEffect, useCallback } from 'react';
import { GRID_SIZE, INITIAL_ENERGY, TOOLS } from '../constants/gameData';

// Helper to create the initial grid
const generateInitialGrid = () => {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      // 10% chance of being a dead coral initially
      const isDeadCoral = Math.random() < 0.1;
      row.push({
        x, y,
        type: isDeadCoral ? 'dead_coral' : 'empty', // empty, dead_coral, coral, machine, mangrove, fauna
        acidLevel: 80 + Math.random() * 20, // 80-100 high acidity
        tempLevel: 80 + Math.random() * 20, // 80-100 high temp
        contentId: null, // the tool id used here
      });
    }
    grid.push(row);
  }
  return grid;
};

export const useGameEngine = () => {
  const [gameState, setGameState] = useState(() => ({
    grid: generateInitialGrid(),
    energy: INITIAL_ENERGY,
    phase: 1,
    globalAcidity: 100,
    globalTemp: 100,
    biodiversity: 0
  }));

  // The main Game Loop tick
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prevState => {
        let newEnergyGen = 0;
        let activePurifiers = 0;
        let activeCoolers = 0;
        let activeMangroves = 0;
        let coralCount = 0;

        const nextGrid = prevState.grid.map(row => row.map(cell => {
          let updatedCell = { ...cell };
          
          if (cell.type === 'machine') {
            if (cell.contentId === 'purifier') activePurifiers++;
            if (cell.contentId === 'cooler') activeCoolers++;
          }
          if (cell.type === 'mangrove') activeMangroves++;
          if (cell.type === 'coral') {
            coralCount++;
            // Generate energy based on coral type
            if (cell.contentId === 'brain_coral') newEnergyGen += 2;
            if (cell.contentId === 'fire_coral') newEnergyGen += 1;
            if (cell.contentId === 'fan_coral') newEnergyGen += 3;
            
            // Check for bleaching (if local temp/acidity is too high for that coral)
            // Fire coral is resistant to temp. Fan coral is sensitive to acid.
            let bleachThresholdT = cell.contentId === 'fire_coral' ? 80 : 60;
            let bleachThresholdA = cell.contentId === 'fan_coral' ? 40 : 60;

            if (cell.tempLevel > bleachThresholdT || cell.acidLevel > bleachThresholdA) {
               // Oh no, coral bleaches (stops generating, turns to dead_coral)
               updatedCell.type = 'dead_coral';
            }
          }

          // Local environmental decay/fixes
          // Without purifiers, acid slowly creeps back up unless corals/mangroves handle it
          updatedCell.acidLevel = Math.min(100, updatedCell.acidLevel + 0.5);
          updatedCell.tempLevel = Math.min(100, updatedCell.tempLevel + 0.5);

          return updatedCell;
        }));

        let totalAcid = 0;
        let totalTemp = 0;

        // Apply global effects from machines and recalculate local averages
        const finalGrid = nextGrid.map(row => row.map(cell => {
           let finalCell = {...cell};
           if (activePurifiers > 0) finalCell.acidLevel = Math.max(0, finalCell.acidLevel - (activePurifiers * 5)); 
           if (activeCoolers > 0) finalCell.tempLevel = Math.max(0, finalCell.tempLevel - (activeCoolers * 5));
           
           // Mangroves and coral provide an across-the-board minimal relief
           finalCell.acidLevel = Math.max(0, finalCell.acidLevel - (activeMangroves * 1) - (coralCount * 0.1));

           totalAcid += finalCell.acidLevel;
           totalTemp += finalCell.tempLevel;
           return finalCell;
        }));

        let newGlobalAcidity = totalAcid / (GRID_SIZE * GRID_SIZE);
        let newGlobalTemp = totalTemp / (GRID_SIZE * GRID_SIZE);

        const newEnergy = Math.min(9999, Math.floor(prevState.energy + newEnergyGen));
        
        // Auto progress phases based on global stats
        let newPhase = prevState.phase;
        if (newPhase === 1 && newGlobalAcidity < 40 && newGlobalTemp < 40) newPhase = 2;
        if (newPhase === 2 && coralCount >= 10 && newEnergy >= 200) newPhase = 3;
        if (newPhase === 3 && prevState.biodiversity >= 5) newPhase = 4;

        return {
          ...prevState,
          grid: finalGrid,
          globalAcidity: newGlobalAcidity,
          globalTemp: newGlobalTemp,
          energy: newEnergy,
          phase: newPhase
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const placeTool = useCallback((x, y, toolId) => {
    setGameState(prevState => {
      const tool = TOOLS[toolId];
      if (!tool || prevState.energy < tool.cost) return prevState;

      const newGrid = [...prevState.grid];
      const row = [...newGrid[y]];
      const cell = { ...row[x] };

      let newEnergy = prevState.energy;
      let newBiodiversity = prevState.biodiversity;

      // Tool placement rules
      if (tool.type === 'machine' && cell.type === 'empty') {
         cell.type = 'machine';
         cell.contentId = tool.id;
      } else if (tool.type === 'coral' && (cell.type === 'empty' || cell.type === 'dead_coral')) {
         cell.type = 'coral';
         cell.contentId = tool.id;
      } else if (tool.type === 'mangrove' && cell.type === 'empty' && (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1)) {
         cell.type = 'mangrove';
         cell.contentId = tool.id;
      } else if (tool.type === 'fauna' && cell.type !== 'machine') {
         cell.type = 'fauna';
         cell.contentId = tool.id;
         newBiodiversity += 1;
      } else if (tool.id === 'recycler' && cell.type === 'machine') {
         cell.type = 'empty';
         cell.contentId = null;
         row[x] = cell;
         newGrid[y] = row;
         return { ...prevState, grid: newGrid, energy: newEnergy + 10 }; // devolve 10 de energia
      } else if ((tool.id === 'algae_seeder' || tool.id === 'bio_cement') && cell.type === 'dead_coral') {
         cell.type = 'coral';
         cell.contentId = 'brain_coral'; // default revive
      } else {
        return prevState; // invalid placement
      }

      row[x] = cell;
      newGrid[y] = row;
      return { 
        ...prevState, 
        grid: newGrid, 
        energy: newEnergy - tool.cost, 
        biodiversity: newBiodiversity 
      };
    });
    return true;
  }, []);

  return {
    ...gameState,
    placeTool
  };
};
