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
  const [grid, setGrid] = useState(generateInitialGrid);
  const [energy, setEnergy] = useState(INITIAL_ENERGY);
  const [phase, setPhase] = useState(1);
  const [globalAcidity, setGlobalAcidity] = useState(100);
  const [globalTemp, setGlobalTemp] = useState(100);
  const [biodiversity, setBiodiversity] = useState(0);

  // The main Game Loop tick
  useEffect(() => {
    const timer = setInterval(() => {
      setGrid(currentGrid => {
        let newEnergyGen = 0;
        let activePurifiers = 0;
        let activeCoolers = 0;
        let activeMangroves = 0;
        let coralCount = 0;

        const nextGrid = currentGrid.map(row => row.map(cell => {
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

        // Apply global effects from machines
        let newGlobalAcidity = Math.max(0, globalAcidity - (activePurifiers * 0.5) - (activeMangroves * 1) - (coralCount * 0.1));
        let newGlobalTemp = Math.max(0, globalTemp - (activeCoolers * 0.5));

        // Let global impact local
        const finalGrid = nextGrid.map(row => row.map(cell => {
           let finalCell = {...cell};
           if (activePurifiers > 0) finalCell.acidLevel = Math.max(0, finalCell.acidLevel - 5); // simplified aura
           if (activeCoolers > 0) finalCell.tempLevel = Math.max(0, finalCell.tempLevel - 5);
           return finalCell;
        }));

        setGlobalAcidity(newGlobalAcidity);
        setGlobalTemp(newGlobalTemp);
        setEnergy(e => Math.min(9999, Math.floor(e + newEnergyGen)));
        
        // Auto progress phases based on global stats
        setPhase(currentPhase => {
          if (currentPhase === 1 && newGlobalAcidity < 40 && newGlobalTemp < 40) return 2;
          if (currentPhase === 2 && coralCount >= 10 && e > 200) return 3;
          if (currentPhase === 3 && biodiversity >= 5) return 4;
          return currentPhase;
        });

        return finalGrid;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [globalAcidity, globalTemp, biodiversity]);

  const placeTool = useCallback((x, y, toolId) => {
    const tool = TOOLS[toolId];
    if (!tool || energy < tool.cost) return false;

    setGrid(currentGrid => {
      const newGrid = [...currentGrid];
      const row = [...newGrid[y]];
      const cell = { ...row[x] };

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
         setBiodiversity(b => b + 1);
      } else if (tool.id === 'recycler' && cell.type === 'machine') {
         cell.type = 'empty';
         cell.contentId = null;
         setEnergy(e => e + 10);
         return currentGrid; // return early to not deduct cost
      } else if (tool.id === 'algae_seeder' && cell.type === 'dead_coral') {
         cell.type = 'coral';
         cell.contentId = 'brain_coral'; // default revive
      } else {
        return currentGrid; // invalid placement
      }

      row[x] = cell;
      newGrid[y] = row;
      setEnergy(e => e - tool.cost);
      return newGrid;
    });
    return true;
  }, [energy]);

  return {
    grid,
    energy,
    phase,
    globalAcidity,
    globalTemp,
    biodiversity,
    placeTool
  };
};
