export interface Position {
  x: number;
  y: number;
}

export type ElementType = 'light' | 'target' | 'mirror' | 'blocker';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type MirrorOrientation = '/' | '\\';

export interface GameElement {
  id: string;
  type: ElementType;
  position: Position;
  direction?: Direction;
  orientation?: MirrorOrientation;
  movable: boolean;
}

export interface Level {
  id: number;
  name: string;
  gridSize: { width: number; height: number };
  elements: GameElement[];
  bestSteps: number;
}

export interface LightSegment {
  from: Position;
  to: Position;
}

export interface GameState {
  currentLevel: number;
  elements: GameElement[];
  steps: number;
  isComplete: boolean;
  lightPath: LightSegment[];
  targetHit: boolean;
}
