export type Point = {
  x: number;
  y: number;
};

type GridPoint = {
  col: number;
  row: number;
};

const GRID_CELL_SIZE = 4;
const GRID_MAP_WIDTH = 1536;
const GRID_MAP_HEIGHT = 1024;

const toPoint = ({ col, row }: GridPoint): Point => ({
  x: Math.round(col * GRID_CELL_SIZE),
  y: Math.round(row * GRID_CELL_SIZE),
});

export const MAP_WIDTH = GRID_MAP_WIDTH;
export const MAP_HEIGHT = GRID_MAP_HEIGHT;
export const NAV_GRID_CELL_SIZE = GRID_CELL_SIZE;

const LOCATION_DESTINATIONS_GRID = {
  about: { col: 56.25, row: 68.75 },
  blackjack: { col: 192, row: 97.5 },
  sudoku: { col: 304.5, row: 117.5 },
  nerdle: { col: 98, row: 218.75 },
  "brick-breaker": { col: 192, row: 218.75 },
  resume: { col: 279, row: 218.75 },
} satisfies Record<string, GridPoint>;

export const LOCATION_DESTINATIONS = Object.fromEntries(
  Object.entries(LOCATION_DESTINATIONS_GRID).map(([id, gridPoint]) => [
    id,
    toPoint(gridPoint),
  ]),
) as Record<keyof typeof LOCATION_DESTINATIONS_GRID, Point>;

const NAV_POINTS_GRID = {
  center: { col: 192, row: 115 },
  leftTopSpine: { col: 119, row: 115 },
  leftBottomSpine: { col: 119, row: 218.75 },
  bottomCenter: { col: 192, row: 218.75 },
  rightTopSpine: { col: 263, row: 115 },
  rightBottomSpine: { col: 263, row: 218.75 },
  resumePath: { col: 279, row: 218.75 },
  sudokuPath: { col: 304.5, row: 115 },
  aboutPath: { col: 56.25, row: 115 },
  aboutDoor: { col: 56.25, row: 68.75 },
  blackjackDoor: { col: 192, row: 97.5 },
  sudokuDoor: { col: 312.5, row: 107 },
  nerdlePath: { col: 93.5, row: 218.75 },
  nerdleDoor: { col: 93.5, row: 218.75 },
  brickDoor: { col: 192, row: 218.75 },
  resumeDoor: { col: 279, row: 218.75 },
} as const satisfies Record<string, GridPoint>;

export const NAV_POINTS = Object.fromEntries(
  Object.entries(NAV_POINTS_GRID).map(([id, gridPoint]) => [
    id,
    toPoint(gridPoint),
  ]),
) as Record<keyof typeof NAV_POINTS_GRID, Point>;

type NavNode = keyof typeof NAV_POINTS;

const LOCATION_NODES: Record<string, NavNode> = {
  center: "center",
  projects: "center",
  skills: "center",
  about: "aboutDoor",
  blackjack: "blackjackDoor",
  sudoku: "sudokuDoor",
  nerdle: "nerdleDoor",
  "brick-breaker": "brickDoor",
  experience: "resumeDoor",
  contact: "resumeDoor",
};

const GRAPH_EDGES: Array<[NavNode, NavNode]> = [
  ["aboutDoor", "aboutPath"],
  ["aboutPath", "leftTopSpine"],
  ["leftTopSpine", "center"],
  ["leftTopSpine", "leftBottomSpine"],
  ["leftBottomSpine", "nerdlePath"],
  ["nerdlePath", "nerdleDoor"],
  ["leftBottomSpine", "bottomCenter"],
  ["bottomCenter", "center"],
  ["bottomCenter", "brickDoor"],
  ["bottomCenter", "rightBottomSpine"],
  ["rightBottomSpine", "resumePath"],
  ["resumePath", "resumeDoor"],
  ["rightBottomSpine", "rightTopSpine"],
  ["rightTopSpine", "center"],
  ["rightTopSpine", "sudokuPath"],
  ["sudokuPath", "sudokuDoor"],
  ["center", "blackjackDoor"],
];

const distanceBetween = (a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y);

const NAV_GRAPH = GRAPH_EDGES.reduce(
  (graph, [from, to]) => {
    graph[from].push(to);
    graph[to].push(from);
    return graph;
  },
  Object.keys(NAV_POINTS).reduce(
    (graph, node) => ({ ...graph, [node]: [] }),
    {} as Record<NavNode, NavNode[]>,
  ),
);

const shortestNodePath = (from: NavNode, to: NavNode) => {
  const distances = Object.keys(NAV_POINTS).reduce(
    (next, node) => ({ ...next, [node]: Number.POSITIVE_INFINITY }),
    {} as Record<NavNode, number>,
  );
  const previous = {} as Partial<Record<NavNode, NavNode>>;
  const unvisited = new Set(Object.keys(NAV_POINTS) as NavNode[]);
  distances[from] = 0;

  while (unvisited.size > 0) {
    const current = [...unvisited].reduce((best, node) =>
      distances[node] < distances[best] ? node : best,
    );
    unvisited.delete(current);

    if (current === to) break;

    for (const neighbor of NAV_GRAPH[current]) {
      if (!unvisited.has(neighbor)) continue;

      const candidate =
        distances[current] +
        distanceBetween(NAV_POINTS[current], NAV_POINTS[neighbor]);
      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;
        previous[neighbor] = current;
      }
    }
  }

  const path: NavNode[] = [];
  let current: NavNode | undefined = to;

  while (current) {
    path.unshift(current);
    if (current === from) break;
    current = previous[current];
  }

  return path[0] === from ? path : [from, to];
};

export const START_POSITION = NAV_POINTS.center;

export const buildGuidedRoute = (fromId: string, toId: string) => {
  const fromNode = LOCATION_NODES[fromId] ?? "center";
  const toNode = LOCATION_NODES[toId] ?? "center";
  return shortestNodePath(fromNode, toNode)
    .slice(1)
    .map((node) => NAV_POINTS[node]);
};
