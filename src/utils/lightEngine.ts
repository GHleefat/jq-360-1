import type { Position, Direction, GameElement, LightSegment } from '@/types/game';

const directionVectors: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function reflectDirection(direction: Direction, orientation: '/' | '\\'): Direction {
  if (orientation === '/') {
    switch (direction) {
      case 'right': return 'up';
      case 'left': return 'down';
      case 'up': return 'right';
      case 'down': return 'left';
    }
  } else {
    switch (direction) {
      case 'right': return 'down';
      case 'left': return 'up';
      case 'up': return 'left';
      case 'down': return 'right';
    }
  }
}

function getElementAt(elements: GameElement[], position: Position): GameElement | undefined {
  return elements.find(
    (el) => el.position.x === position.x && el.position.y === position.y
  );
}

function isWithinBounds(position: Position, width: number, height: number): boolean {
  return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height;
}

function traceSingleLight(
  elements: GameElement[],
  gridSize: { width: number; height: number },
  startPos: Position,
  startDir: Direction
): { path: LightSegment[]; targetHit: boolean } {
  const path: LightSegment[] = [];
  let currentPos = { ...startPos };
  let currentDir = startDir;
  let targetHit = false;
  const maxSteps = 100;
  let steps = 0;

  const visited = new Set<string>();

  while (steps < maxSteps) {
    const vector = directionVectors[currentDir];
    const nextPos = {
      x: currentPos.x + vector.x,
      y: currentPos.y + vector.y,
    };

    if (!isWithinBounds(nextPos, gridSize.width, gridSize.height)) {
      path.push({ from: { ...currentPos }, to: { ...nextPos } });
      break;
    }

    const stateKey = `${nextPos.x},${nextPos.y},${currentDir}`;
    if (visited.has(stateKey)) {
      path.push({ from: { ...currentPos }, to: { ...nextPos } });
      break;
    }
    visited.add(stateKey);

    const element = getElementAt(elements, nextPos);

    if (element) {
      if (element.type === 'blocker') {
        path.push({ from: { ...currentPos }, to: { ...nextPos } });
        break;
      } else if (element.type === 'target') {
        path.push({ from: { ...currentPos }, to: { ...nextPos } });
        targetHit = true;
        break;
      } else if (element.type === 'mirror' && element.orientation) {
        path.push({ from: { ...currentPos }, to: { ...nextPos } });
        currentDir = reflectDirection(currentDir, element.orientation);
        currentPos = { ...nextPos };
        steps++;
        continue;
      }
    }

    path.push({ from: { ...currentPos }, to: { ...nextPos } });
    currentPos = { ...nextPos };
    steps++;
  }

  return { path, targetHit };
}

export function calculateLightPath(
  elements: GameElement[],
  gridSize: { width: number; height: number }
): { path: LightSegment[]; targetHit: boolean } {
  const lightSources = elements.filter((el) => el.type === 'light' && el.direction);
  if (lightSources.length === 0) {
    return { path: [], targetHit: false };
  }

  const allPaths: LightSegment[] = [];
  let anyTargetHit = false;

  for (const source of lightSources) {
    if (!source.direction) continue;
    const result = traceSingleLight(elements, gridSize, source.position, source.direction);
    allPaths.push(...result.path);
    if (result.targetHit) {
      anyTargetHit = true;
    }
  }

  return { path: allPaths, targetHit: anyTargetHit };
}
