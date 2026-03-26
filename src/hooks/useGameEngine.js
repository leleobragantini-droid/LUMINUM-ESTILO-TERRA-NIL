import { useState, useEffect, useCallback } from 'react';
import { GRID_SIZE, INITIAL_ENERGY, TOOLS } from '../constants/gameData';

const generateInitialGrid = () => {
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      // 20% chance of dead coral (harder start)
      const isDeadCoral = Math.random() < 0.2;
      row.push({
        x, y,
        type: isDeadCoral ? 'dead_coral' : 'empty',
        acidLevel: 85 + Math.random() * 15,   // 85-100 (harder)
        tempLevel: 85 + Math.random() * 15,   // 85-100 (harder)
        contentId: null,
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
    globalAcidity: 92,   // Start high (harder)
    globalTemp: 92,
    biodiversity: 0,
    gameOver: false,   // 'win' when game is complete
  }));

  // Main game tick
  useEffect(() => {
    if (gameState.gameOver) return;

    const timer = setInterval(() => {
      setGameState(prevState => {
        if (prevState.gameOver) return prevState;

        let newEnergyGen = 0;
        let activePurifiers = 0;
        let activeCoolers = 0;
        let activeMangroves = 0;
        let coralCount = 0;
        let machineCount = 0;

        // First pass: count active structures
        prevState.grid.forEach(row => row.forEach(cell => {
          if (cell.type === 'machine') {
            machineCount++;
            if (cell.contentId === 'purifier') activePurifiers++;
            if (cell.contentId === 'cooler') activeCoolers++;
          }
          if (cell.type === 'mangrove') activeMangroves++;
          if (cell.type === 'coral') coralCount++;
        }));

        // Second pass: update cells
        const nextGrid = prevState.grid.map(row => row.map(cell => {
          let updatedCell = { ...cell };

          if (cell.type === 'coral') {
            if (cell.contentId === 'brain_coral') newEnergyGen += 2;
            if (cell.contentId === 'fire_coral') newEnergyGen += 1;
            if (cell.contentId === 'fan_coral') newEnergyGen += 3;

            // Bleaching thresholds (tighter = harder)
            let bleachThresholdT = cell.contentId === 'fire_coral' ? 75 : 55;
            let bleachThresholdA = cell.contentId === 'fan_coral' ? 35 : 55;

            if (cell.tempLevel > bleachThresholdT || cell.acidLevel > bleachThresholdA) {
              updatedCell.type = 'dead_coral';
              updatedCell.contentId = null;
            }
          }

          // Environmental decay — faster (harder)
          updatedCell.acidLevel = Math.min(100, updatedCell.acidLevel + 0.8);
          updatedCell.tempLevel = Math.min(100, updatedCell.tempLevel + 0.8);

          return updatedCell;
        }));

        // Third pass: apply machine & mangrove effects to all cells
        let totalAcid = 0;
        let totalTemp = 0;

        const finalGrid = nextGrid.map(row => row.map(cell => {
          let finalCell = { ...cell };

          // Purifiers reduce acidity per cell
          if (activePurifiers > 0) {
            finalCell.acidLevel = Math.max(0, finalCell.acidLevel - (activePurifiers * 4));
          }
          // Coolers reduce temperature per cell
          if (activeCoolers > 0) {
            finalCell.tempLevel = Math.max(0, finalCell.tempLevel - (activeCoolers * 4));
          }

          // Mangroves & corals give a small global relief
          finalCell.acidLevel = Math.max(0, finalCell.acidLevel - (activeMangroves * 0.8) - (coralCount * 0.08));

          totalAcid += finalCell.acidLevel;
          totalTemp += finalCell.tempLevel;

          return finalCell;
        }));

        // Compute global averages (THIS IS THE FIX for the acidity bar)
        const totalCells = GRID_SIZE * GRID_SIZE;
        let newGlobalAcidity = totalAcid / totalCells;
        let newGlobalTemp = totalTemp / totalCells;

        const newEnergy = Math.min(9999, Math.floor(prevState.energy + newEnergyGen));

        // Phase progression
        let newPhase = prevState.phase;
        if (newPhase === 1 && newGlobalAcidity < 40 && newGlobalTemp < 40) newPhase = 2;
        if (newPhase === 2 && coralCount >= 10 && newEnergy >= 200) newPhase = 3;
        if (newPhase === 3 && prevState.biodiversity >= 5) newPhase = 4;

        // Win condition: phase 4 + all machines removed
        let newGameOver = prevState.gameOver;
        if (newPhase === 4 && machineCount === 0 && prevState.phase === 4) {
          newGameOver = 'win';
        }

        return {
          ...prevState,
          grid: finalGrid,
          globalAcidity: newGlobalAcidity,
          globalTemp: newGlobalTemp,
          energy: newEnergy,
          phase: newPhase,
          gameOver: newGameOver,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameOver]);

  const placeTool = useCallback((x, y, toolId) => {
    setGameState(prevState => {
      const tool = TOOLS[toolId];
      if (!tool || prevState.energy < tool.cost) return prevState;

      const newGrid = prevState.grid.map(r => [...r]);
      const cell = { ...newGrid[y][x] };

      let newEnergy = prevState.energy;
      let newBiodiversity = prevState.biodiversity;

      if (tool.type === 'machine' && cell.type === 'empty') {
        cell.type = 'machine';
        cell.contentId = tool.id;
      } else if (tool.type === 'coral' && (cell.type === 'empty' || cell.type === 'dead_coral')) {
        cell.type = 'coral';
        cell.contentId = tool.id;
      } else if (tool.type === 'mangrove' && cell.type === 'empty' &&
        (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1)) {
        cell.type = 'mangrove';
        cell.contentId = tool.id;
      } else if (tool.type === 'fauna' && (cell.type === 'empty' || cell.type === 'coral' || cell.type === 'mangrove')) {
        cell.type = 'fauna';
        cell.contentId = tool.id;
        newBiodiversity += 1;
      } else if (tool.id === 'recycler' && cell.type === 'machine') {
        cell.type = 'empty';
        cell.contentId = null;
        newGrid[y][x] = cell;
        return { ...prevState, grid: newGrid, energy: newEnergy + 10 };
      } else if ((tool.id === 'algae_seeder' || tool.id === 'bio_cement') && cell.type === 'dead_coral') {
        cell.type = 'coral';
        cell.contentId = 'brain_coral';
      } else {
        return prevState;
      }

      newGrid[y][x] = cell;
      return {
        ...prevState,
        grid: newGrid,
        energy: newEnergy - tool.cost,
        biodiversity: newBiodiversity,
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    setGameState({
      grid: generateInitialGrid(),
      energy: INITIAL_ENERGY,
      phase: 1,
      globalAcidity: 92,
      globalTemp: 92,
      biodiversity: 0,
      gameOver: false,
    });
  }, []);

  return {
    ...gameState,
    placeTool,
    restartGame,
  };
};
