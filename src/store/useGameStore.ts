import { create } from 'zustand';
import type { GameElement, Position, LightSegment } from '@/types/game';
import { levels } from '@/utils/levels';
import { calculateLightPath } from '@/utils/lightEngine';

interface GameStore {
  currentLevel: number;
  elements: GameElement[];
  steps: number;
  isComplete: boolean;
  lightPath: LightSegment[];
  targetHit: boolean;
  unlockedLevels: number[];
  bestSteps: Record<number, number>;
  draggingElement: string | null;
  dragPosition: Position | null;

  initLevel: (levelId: number) => void;
  moveElement: (elementId: string, newPosition: Position) => void;
  rotateMirror: (elementId: string) => void;
  resetLevel: () => void;
  nextLevel: () => void;
  setDragging: (elementId: string | null, position: Position | null) => void;
  recalculateLight: () => void;
  clearLevel: () => void;
}

const loadProgress = () => {
  try {
    const saved = localStorage.getItem('light-puzzle-progress');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load progress', e);
  }
  return { unlockedLevels: [1], bestSteps: {} };
};

const saveProgress = (unlockedLevels: number[], bestSteps: Record<number, number>) => {
  try {
    localStorage.setItem('light-puzzle-progress', JSON.stringify({ unlockedLevels, bestSteps }));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
};

const initialProgress = loadProgress();

export const useGameStore = create<GameStore>((set, get) => ({
  currentLevel: 0,
  elements: [],
  steps: 0,
  isComplete: false,
  lightPath: [],
  targetHit: false,
  unlockedLevels: initialProgress.unlockedLevels,
  bestSteps: initialProgress.bestSteps,
  draggingElement: null,
  dragPosition: null,

  initLevel: (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    if (!level) return;

    const elementsCopy = JSON.parse(JSON.stringify(level.elements));
    const { path, targetHit } = calculateLightPath(elementsCopy, level.gridSize);

    const { unlockedLevels, bestSteps } = get();
    const newUnlockedLevels = [...unlockedLevels];
    const newBestSteps = { ...bestSteps };
    let isComplete = false;

    if (targetHit) {
      isComplete = true;
      const currentBest = bestSteps[levelId];
      if (currentBest === undefined || 0 < currentBest) {
        newBestSteps[levelId] = 0;
      }
      const nextLevelId = levelId + 1;
      if (!newUnlockedLevels.includes(nextLevelId) && levels.some((l) => l.id === nextLevelId)) {
        newUnlockedLevels.push(nextLevelId);
      }
      saveProgress(newUnlockedLevels, newBestSteps);
    }

    set({
      currentLevel: levelId,
      elements: elementsCopy,
      steps: 0,
      isComplete,
      lightPath: path,
      targetHit,
      unlockedLevels: newUnlockedLevels,
      bestSteps: newBestSteps,
    });
  },

  moveElement: (elementId: string, newPosition: Position) => {
    const { elements, currentLevel, steps } = get();
    const level = levels.find((l) => l.id === currentLevel);
    if (!level) return;

    const occupied = elements.some(
      (el) =>
        el.id !== elementId &&
        el.position.x === newPosition.x &&
        el.position.y === newPosition.y
    );
    if (occupied) return;

    if (
      newPosition.x < 0 ||
      newPosition.x >= level.gridSize.width ||
      newPosition.y < 0 ||
      newPosition.y >= level.gridSize.height
    ) {
      return;
    }

    const newElements = elements.map((el) =>
      el.id === elementId ? { ...el, position: { ...newPosition } } : el
    );

    const { path, targetHit } = calculateLightPath(newElements, level.gridSize);
    const newSteps = steps + 1;

    let isComplete = false;
    const { unlockedLevels, bestSteps } = get();
    const newUnlockedLevels = [...unlockedLevels];
    const newBestSteps = { ...bestSteps };

    if (targetHit) {
      isComplete = true;
      const currentBest = bestSteps[currentLevel];
      if (currentBest === undefined || newSteps < currentBest) {
        newBestSteps[currentLevel] = newSteps;
      }
      const nextLevelId = currentLevel + 1;
      if (!newUnlockedLevels.includes(nextLevelId) && levels.some((l) => l.id === nextLevelId)) {
        newUnlockedLevels.push(nextLevelId);
      }
      saveProgress(newUnlockedLevels, newBestSteps);
    }

    set({
      elements: newElements,
      steps: newSteps,
      lightPath: path,
      targetHit,
      isComplete,
      unlockedLevels: newUnlockedLevels,
      bestSteps: newBestSteps,
    });
  },

  rotateMirror: (elementId: string) => {
    const { elements, currentLevel, steps } = get();
    const level = levels.find((l) => l.id === currentLevel);
    if (!level) return;

    const newElements: GameElement[] = elements.map((el) => {
      if (el.id === elementId && el.type === 'mirror') {
        const newOrientation: '/' | '\\' = el.orientation === '/' ? '\\' : '/';
        return {
          ...el,
          orientation: newOrientation,
        };
      }
      return el;
    });

    const { path, targetHit } = calculateLightPath(newElements, level.gridSize);
    const newSteps = steps + 1;

    let isComplete = false;
    const { unlockedLevels, bestSteps } = get();
    const newUnlockedLevels = [...unlockedLevels];
    const newBestSteps = { ...bestSteps };

    if (targetHit) {
      isComplete = true;
      const currentBest = bestSteps[currentLevel];
      if (currentBest === undefined || newSteps < currentBest) {
        newBestSteps[currentLevel] = newSteps;
      }
      const nextLevelId = currentLevel + 1;
      if (!newUnlockedLevels.includes(nextLevelId) && levels.some((l) => l.id === nextLevelId)) {
        newUnlockedLevels.push(nextLevelId);
      }
      saveProgress(newUnlockedLevels, newBestSteps);
    }

    set({
      elements: newElements,
      steps: newSteps,
      lightPath: path,
      targetHit,
      isComplete,
      unlockedLevels: newUnlockedLevels,
      bestSteps: newBestSteps,
    });
  },

  resetLevel: () => {
    const { currentLevel } = get();
    if (currentLevel > 0) {
      get().initLevel(currentLevel);
    }
  },

  nextLevel: () => {
    const { currentLevel } = get();
    const nextId = currentLevel + 1;
    if (levels.some((l) => l.id === nextId)) {
      get().initLevel(nextId);
    }
  },

  setDragging: (elementId: string | null, position: Position | null) => {
    set({ draggingElement: elementId, dragPosition: position });
  },

  recalculateLight: () => {
    const { elements, currentLevel } = get();
    const level = levels.find((l) => l.id === currentLevel);
    if (!level) return;

    const { path, targetHit } = calculateLightPath(elements, level.gridSize);
    set({ lightPath: path, targetHit });
  },

  clearLevel: () => {
    set({
      currentLevel: 0,
      elements: [],
      steps: 0,
      isComplete: false,
      lightPath: [],
      targetHit: false,
      draggingElement: null,
      dragPosition: null,
    });
  },
}));
