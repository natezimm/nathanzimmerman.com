import backgroundMap from "@/assets/background.webp";
import idleFrontSprite from "@/assets/sprites/idle.png";
import walkDown1Sprite from "@/assets/sprites/walk_down_1.png";
import walkDown2Sprite from "@/assets/sprites/walk_down_2.png";
import walkLeft1Sprite from "@/assets/sprites/walk_left_1.png";
import walkLeft2Sprite from "@/assets/sprites/walk_left_2.png";
import walkRight1Sprite from "@/assets/sprites/walk_right_1.png";
import walkRight2Sprite from "@/assets/sprites/walk_right_2.png";
import walkUp1Sprite from "@/assets/sprites/walk_up_1.png";
import walkUp2Sprite from "@/assets/sprites/walk_up_2.png";
import {
  LOCATION_DESTINATIONS,
  MAP_HEIGHT,
  MAP_WIDTH,
  NAV_GRID_CELL_SIZE,
  NAV_POINTS,
  START_POSITION,
  buildGuidedNodeRoute,
  getLocationNode,
  getNextNavNode,
  type NavDirection,
  type NavNode,
  type Point,
} from "@/data/navigationMap";
import {
  mapLocations,
  projectEntries,
  type ProjectEntry,
  type SectionId,
  type ViewMode,
} from "@/data/portfolioData";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  CornerDownLeft,
  ExternalLink,
  FileText,
  Github,
  MapPin,
  SkipForward,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type HeroProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

type Direction = NavDirection;

type PlayerState = Point & {
  direction: Direction;
  moving: boolean;
  frame: number;
};

type MapPoint = {
  id: string;
  kind: "section" | "project";
  title: string;
  subtitle: string;
  left: string;
  top: string;
  width: string;
  height: string;
  destination: Point;
};

type RouteStep = {
  node: NavNode;
  point: Point;
};

const CENTER_POINT = START_POSITION;
const PLAYER_SPEED = 420;
const SPRITE_SIZE = 50;
const SPRITE_WIDTH_PERCENT = (SPRITE_SIZE / MAP_WIDTH) * 100;
const SPRITE_HEIGHT_PERCENT = (SPRITE_SIZE / MAP_HEIGHT) * 100;
const FRAME_TICK_MS = 110;
const ARRIVAL_DISTANCE = 5;
const ARRIVAL_PAUSE_MS = 1000;
const IS_TEST_ENV = import.meta.env.MODE === "test";

const WALK_SPRITES: Record<Direction, string[]> = {
  up: [walkUp1Sprite, walkUp2Sprite],
  down: [walkDown1Sprite, walkDown2Sprite],
  left: [walkLeft1Sprite, walkLeft2Sprite],
  right: [walkRight1Sprite, walkRight2Sprite],
};

const sectionPointOverrides: Record<
  SectionId,
  Partial<MapPoint> & { destination: Point }
> = {
  about: {
    title: "HOMESTEAD",
    subtitle: "About Me",
    left: "16%",
    top: "29%",
    width: "18%",
    height: "20%",
    destination: LOCATION_DESTINATIONS.about,
  },
  projects: {
    title: "PROJECT CROSSROADS",
    subtitle: "Featured Projects",
    left: "50%",
    top: "45%",
    width: "14%",
    height: "13%",
    destination: CENTER_POINT,
  },
  experience: {
    title: "RESUME KEEP",
    subtitle: "Experience",
    left: "79.5%",
    top: "76%",
    width: "18%",
    height: "18%",
    destination: LOCATION_DESTINATIONS.resume,
  },
  skills: {
    title: "TOWN SQUARE",
    subtitle: "Skills & Tech",
    left: "50%",
    top: "45%",
    width: "14%",
    height: "13%",
    destination: CENTER_POINT,
  },
  contact: {
    title: "RESUME KEEP",
    subtitle: "Contact",
    left: "79.5%",
    top: "76%",
    width: "18%",
    height: "18%",
    destination: LOCATION_DESTINATIONS.resume,
  },
};

const projectMapPoints: MapPoint[] = [
  {
    id: "blackjack",
    kind: "project",
    title: "CASINO OF CHANCE",
    subtitle: "Blackjack",
    left: "50%",
    top: "29%",
    width: "18%",
    height: "22%",
    destination: LOCATION_DESTINATIONS.blackjack,
  },
  {
    id: "sudoku",
    kind: "project",
    title: "LOGIC LIGHT TEMPLE",
    subtitle: "Sudoku",
    left: "79.5%",
    top: "32%",
    width: "17%",
    height: "21%",
    destination: LOCATION_DESTINATIONS.sudoku,
  },
  {
    id: "nerdle",
    kind: "project",
    title: "LETTER WIZARD TOWER",
    subtitle: "Nerdle",
    left: "18.5%",
    top: "72%",
    width: "18%",
    height: "27%",
    destination: LOCATION_DESTINATIONS.nerdle,
  },
  {
    id: "brick-breaker",
    kind: "project",
    title: "ARCADE DISTRICT",
    subtitle: "Brick Breaker Resume",
    left: "50%",
    top: "75%",
    width: "20%",
    height: "25%",
    destination: LOCATION_DESTINATIONS["brick-breaker"],
  },
];

const distanceBetween = (a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y);

const directionFromDelta = (
  dx: number,
  dy: number,
  fallback: Direction,
): Direction => {
  if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? "right" : "left";
  if (Math.abs(dy) > 0.001) return dy >= 0 ? "down" : "up";
  return fallback;
};

const buildRoute = (fromNode: NavNode, toId: string) => {
  const route = buildGuidedNodeRoute(fromNode, toId).map((node) => ({
    node,
    point: NAV_POINTS[node],
  }));

  return route.filter(
    (step, index) =>
      index === 0 ||
      distanceBetween(step.point, route[index - 1].point) > ARRIVAL_DISTANCE,
  );
};

type MobileViewToggleProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

const MobileViewToggle = ({
  viewMode,
  onViewModeChange,
}: MobileViewToggleProps) => (
  <div className="mt-4 inline-flex w-full max-w-sm overflow-hidden rounded-sm border border-cyan-300/35 md:hidden">
    <button
      onClick={() => onViewModeChange("map")}
      aria-label="Switch to map view"
      aria-pressed={viewMode === "map"}
      className={cn(
        "retro-ui flex-1 px-3 py-2 text-[10px] transition",
        viewMode === "map"
          ? "bg-emerald-500/25 text-emerald-50"
          : "bg-slate-900/70 text-slate-200 hover:bg-slate-800/80",
      )}
    >
      MAP VIEW
    </button>
    <button
      onClick={() => onViewModeChange("grid")}
      aria-label="Switch to resume view"
      aria-pressed={viewMode === "grid"}
      className={cn(
        "retro-ui flex-1 border-l border-cyan-300/35 px-3 py-2 text-[10px] transition",
        viewMode === "grid"
          ? "bg-cyan-500/25 text-cyan-50"
          : "bg-slate-900/70 text-slate-200 hover:bg-slate-800/80",
      )}
    >
      RESUME VIEW
    </button>
  </div>
);

const Hero = ({ viewMode, onViewModeChange }: HeroProps) => {
  const routeRef = useRef<RouteStep[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastAnimationTimeRef = useRef<number | null>(null);
  const frameClockRef = useRef(0);
  const currentNodeRef = useRef<NavNode>("center");
  const pendingArrivalRef = useRef<(() => void) | null>(null);
  const finalDestinationRef = useRef<Point>(START_POSITION);
  const finalNodeRef = useRef<NavNode>("center");
  const arrivalTimeoutRef = useRef<number | null>(null);
  const projectDialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [player, setPlayer] = useState<PlayerState>({
    ...START_POSITION,
    direction: "down",
    moving: false,
    frame: 0,
  });
  const [activeProject, setActiveProject] = useState<ProjectEntry | null>(null);
  const [travelLabel, setTravelLabel] = useState<string | null>(null);
  const [travelStatus, setTravelStatus] = useState<"walking" | "opening">(
    "walking",
  );
  const [hoveredMapPoint, setHoveredMapPoint] = useState<MapPoint | null>(null);
  const [currentNode, setCurrentNode] = useState<NavNode>("center");
  const debugNavGridVisible = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("debugNavGrid");
  }, []);

  const sectionMapPoints = useMemo<MapPoint[]>(
    () =>
      mapLocations.map((location) => {
        const override = sectionPointOverrides[location.id];
        return {
          id: location.id,
          kind: "section",
          title: override.title ?? location.title,
          subtitle: override.subtitle ?? location.subtitle,
          left: override.left ?? location.position.left,
          top: override.top ?? location.position.top,
          width: override.width ?? location.position.width,
          height: override.height ?? location.position.height,
          destination: override.destination,
        };
      }),
    [],
  );

  const mapPoints = useMemo(
    () => [...sectionMapPoints, ...projectMapPoints],
    [sectionMapPoints],
  );

  const scrollToSection = useCallback((id: SectionId) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const completeArrival = useCallback(() => {
    if (arrivalTimeoutRef.current) {
      window.clearTimeout(arrivalTimeoutRef.current);
      arrivalTimeoutRef.current = null;
    }

    const onArrival = pendingArrivalRef.current;
    pendingArrivalRef.current = null;
    setTravelLabel(null);
    setTravelStatus("walking");

    if (onArrival) {
      onArrival();
    }
  }, []);

  const startGuidedTravel = useCallback(
    (point: MapPoint, onArrival: () => void) => {
      const destinationNode = getLocationNode(point.id);

      if (IS_TEST_ENV) {
        currentNodeRef.current = destinationNode;
        finalNodeRef.current = destinationNode;
        setCurrentNode(destinationNode);
        setPlayer((previous) => ({
          ...previous,
          ...point.destination,
          moving: false,
          frame: 0,
        }));
        onArrival();
        return;
      }

      const route = buildRoute(currentNodeRef.current, point.id);

      if (arrivalTimeoutRef.current) {
        window.clearTimeout(arrivalTimeoutRef.current);
        arrivalTimeoutRef.current = null;
      }

      pendingArrivalRef.current = onArrival;
      finalDestinationRef.current = point.destination;
      finalNodeRef.current = destinationNode;
      setTravelLabel(point.title);
      setTravelStatus("walking");

      if (route.length === 0) {
        currentNodeRef.current = destinationNode;
        setCurrentNode(destinationNode);
        setPlayer((previous) => ({
          ...previous,
          ...point.destination,
          moving: false,
          frame: 0,
        }));
        completeArrival();
        return;
      }

      routeRef.current = route;
      setActiveProject(null);
    },
    [completeArrival],
  );

  const skipTravel = useCallback(() => {
    if (arrivalTimeoutRef.current) {
      window.clearTimeout(arrivalTimeoutRef.current);
      arrivalTimeoutRef.current = null;
    }

    routeRef.current = [];
    currentNodeRef.current = finalNodeRef.current;
    setCurrentNode(finalNodeRef.current);
    setPlayer((previous) => ({
      ...previous,
      ...finalDestinationRef.current,
      moving: false,
      frame: 0,
    }));
    completeArrival();
  }, [completeArrival]);

  const openMapPoint = useCallback(
    (point: MapPoint) => {
      if (point.kind === "section") {
        scrollToSection(point.id as SectionId);
        return;
      }

      const project = projectEntries.find((entry) => entry.slug === point.id);
      if (project) {
        setActiveProject(project);
      }
    },
    [scrollToSection],
  );

  const activateMapPoint = useCallback(
    (point: MapPoint) => {
      startGuidedTravel(point, () => openMapPoint(point));
    },
    [openMapPoint, startGuidedTravel],
  );

  const currentMapChoices = useMemo(() => {
    if (player.moving || travelLabel || activeProject) return [];

    return mapPoints.filter(
      (point) => {
        const locationNode = getLocationNode(point.id);
        const locationPoint = NAV_POINTS[locationNode];
        const currentPoint = NAV_POINTS[currentNode];

        return (
          locationNode === currentNode ||
          distanceBetween(locationPoint, currentPoint) <= 8
        );
      },
    );
  }, [activeProject, currentNode, mapPoints, player.moving, travelLabel]);

  const canRoam = useMemo(
    () => !player.moving && !travelLabel && !activeProject,
    [activeProject, player.moving, travelLabel],
  );

  const moveToNode = useCallback((node: NavNode) => {
    if (node === currentNodeRef.current) return;

    if (arrivalTimeoutRef.current) {
      window.clearTimeout(arrivalTimeoutRef.current);
      arrivalTimeoutRef.current = null;
    }

    const point = NAV_POINTS[node];
    finalDestinationRef.current = point;
    finalNodeRef.current = node;
    pendingArrivalRef.current = null;
    routeRef.current = [{ node, point }];
    setTravelLabel(null);
    setTravelStatus("walking");
    setActiveProject(null);
    setPlayer((previous) => ({ ...previous, moving: true }));
  }, []);

  const movePlayer = useCallback(
    (direction: NavDirection) => {
      if (!canRoam) return;

      const nextNode = getNextNavNode(currentNodeRef.current, direction);
      if (!nextNode) return;

      if (IS_TEST_ENV) {
        currentNodeRef.current = nextNode;
        finalNodeRef.current = nextNode;
        setCurrentNode(nextNode);
        setPlayer((previous) => ({
          ...previous,
          ...NAV_POINTS[nextNode],
          direction,
          moving: false,
          frame: 0,
        }));
        return;
      }

      moveToNode(nextNode);
    },
    [canRoam, moveToNode],
  );

  const availableDirections = useMemo(
    () => ({
      up: Boolean(getNextNavNode(currentNode, "up")),
      down: Boolean(getNextNavNode(currentNode, "down")),
      left: Boolean(getNextNavNode(currentNode, "left")),
      right: Boolean(getNextNavNode(currentNode, "right")),
    }),
    [currentNode],
  );

  useEffect(() => {
    if (viewMode !== "map" || activeProject) return;

    const keyDirections: Partial<Record<string, NavDirection>> = {
      ArrowUp: "up",
      w: "up",
      W: "up",
      ArrowDown: "down",
      s: "down",
      S: "down",
      ArrowLeft: "left",
      a: "left",
      A: "left",
      ArrowRight: "right",
      d: "right",
      D: "right",
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, button, a") &&
        !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          event.key,
        )
      ) {
        return;
      }

      const direction = keyDirections[event.key];

      if (direction) {
        event.preventDefault();
        movePlayer(direction);
        return;
      }

      if (event.key === "Enter" && currentMapChoices.length > 0 && canRoam) {
        event.preventDefault();
        openMapPoint(currentMapChoices[0]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeProject,
    canRoam,
    currentMapChoices,
    movePlayer,
    openMapPoint,
    viewMode,
  ]);

  useEffect(() => {
    if (!activeProject) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    projectDialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveProject(null);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = projectDialogRef.current;
      if (!dialog) return;

      const focusableElements = [
        ...dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [activeProject]);

  useEffect(() => {
    if (IS_TEST_ENV) return;

    const tick = (timestamp: number) => {
      const last = lastAnimationTimeRef.current ?? timestamp;
      const deltaSeconds = Math.min((timestamp - last) / 1000, 0.045);
      lastAnimationTimeRef.current = timestamp;

      setPlayer((previous) => {
        const target = routeRef.current[0];

        if (!target) {
          if (previous.moving) {
            return { ...previous, moving: false, frame: 0 };
          }
          return previous;
        }

        const distance = distanceBetween(previous, target.point);

        if (distance <= ARRIVAL_DISTANCE) {
          const reachedStep = routeRef.current.shift();

          if (reachedStep) {
            currentNodeRef.current = reachedStep.node;
            setCurrentNode(reachedStep.node);
          }

          if (routeRef.current.length === 0) {
            if (pendingArrivalRef.current) {
              setTravelStatus("opening");
              arrivalTimeoutRef.current = window.setTimeout(
                completeArrival,
                ARRIVAL_PAUSE_MS,
              );
            } else {
              setTravelLabel(null);
              setTravelStatus("walking");
            }

            return {
              ...previous,
              ...(reachedStep?.point ?? target.point),
              moving: false,
              frame: 0,
            };
          }

          return {
            ...previous,
            ...(reachedStep?.point ?? target.point),
            moving: true,
          };
        }

        const travelDistance = PLAYER_SPEED * deltaSeconds;
        const ratio = Math.min(1, travelDistance / distance);
        const nextX = previous.x + (target.point.x - previous.x) * ratio;
        const nextY = previous.y + (target.point.y - previous.y) * ratio;
        const direction = directionFromDelta(
          nextX - previous.x,
          nextY - previous.y,
          previous.direction,
        );
        let frame = previous.frame;

        frameClockRef.current += deltaSeconds * 1000;
        if (frameClockRef.current >= FRAME_TICK_MS) {
          frame = (frame + 1) % 2;
          frameClockRef.current = 0;
        }

        return {
          x: nextX,
          y: nextY,
          direction,
          moving: true,
          frame,
        };
      });

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (arrivalTimeoutRef.current) {
        window.clearTimeout(arrivalTimeoutRef.current);
      }
      animationFrameRef.current = null;
      arrivalTimeoutRef.current = null;
      lastAnimationTimeRef.current = null;
    };
  }, [completeArrival]);

  const currentSprite = player.moving
    ? WALK_SPRITES[player.direction][player.frame]
    : idleFrontSprite;

  if (viewMode === "grid") {
    return (
      <section
        id="home"
        className="retro-section hero-overworld pb-10 pt-24 md:pb-14 md:pt-28"
      >
        <div className="container mx-auto px-4">
          <div className="hero-board rounded-sm border border-cyan-300/35 bg-slate-950/80 p-5">
            <p className="retro-ui text-xs text-emerald-300 md:text-sm">
              RESUME VIEW
            </p>
            <h1 className="retro-heading mt-2 text-2xl text-slate-100 md:text-4xl">
              Nathan's World
            </h1>
            <MobileViewToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {mapLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => scrollToSection(location.id)}
                  className="retro-ui rounded-sm border border-cyan-300/30 bg-cyan-500/10 px-3 py-3 text-left text-xs text-cyan-100 hover:bg-cyan-500/20"
                >
                  {location.id.toUpperCase()}
                </button>
              ))}
              {projectEntries.map((project) => (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  className="retro-ui rounded-sm border border-amber-300/35 bg-amber-500/10 px-3 py-3 text-xs text-amber-100 hover:bg-amber-500/20"
                >
                  {project.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="retro-section hero-overworld pb-10 pt-24 md:pb-14 md:pt-28"
    >
      <div className="container mx-auto px-4">
        <header className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="retro-ui text-xs text-emerald-300 md:text-sm">
              INTERACTIVE MAP
            </p>
            <h1 className="retro-heading mt-2 text-2xl text-slate-100 md:text-4xl">
              Nathan's World
            </h1>
            <MobileViewToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection("projects")}
                className="retro-ui inline-flex items-center gap-2 rounded-sm border border-amber-300/50 bg-amber-500/15 px-4 py-2 text-xs text-amber-100 hover:bg-amber-500/25"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                PRESS START
              </button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="retro-ui inline-flex items-center gap-2 rounded-sm border border-emerald-300/45 bg-emerald-500/12 px-4 py-2 text-xs text-emerald-100 hover:bg-emerald-500/25"
              >
                <FileText className="h-3.5 w-3.5" />
                RESUME
              </a>
            </div>
          </div>

          <aside className="guide-panel w-full max-w-[300px] rounded-sm border border-cyan-300/35 bg-slate-950/80 p-4 md:justify-self-end">
            <p className="retro-ui text-xs text-emerald-300">
              CHOOSE DESTINATION
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {mapLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => scrollToSection(location.id)}
                  className="retro-ui rounded-sm border border-cyan-300/30 bg-cyan-500/10 px-2 py-2 text-[10px] text-cyan-100 hover:bg-cyan-500/20"
                >
                  {location.id.toUpperCase()}
                </button>
              ))}
            </div>
          </aside>
        </header>

        <div className="hero-board overflow-hidden rounded-sm border border-cyan-300/35 bg-slate-950/80">
          <div className="world-map relative overflow-hidden rounded-sm image-pixelated outline-none">
            <img
              src={backgroundMap}
              alt="Retro overworld map"
              className="h-full w-full select-none object-cover image-pixelated"
            />
            <div
              className={cn(
                "map-nav-grid",
                debugNavGridVisible && "map-nav-grid-visible",
              )}
              style={{
                backgroundSize: `${NAV_GRID_CELL_SIZE}px ${NAV_GRID_CELL_SIZE}px`,
              }}
              aria-hidden
            />

            {mapPoints.map((point) => (
              <button
                key={`${point.kind}-${point.id}`}
                className="map-hotspot"
                style={{
                  left: point.left,
                  top: point.top,
                  width: point.width,
                  height: point.height,
                }}
                onClick={() => activateMapPoint(point)}
                onPointerEnter={() => setHoveredMapPoint(point)}
                onPointerLeave={() => setHoveredMapPoint(null)}
                onFocus={() => setHoveredMapPoint(point)}
                onBlur={() => setHoveredMapPoint(null)}
                aria-label={`${point.title} ${point.subtitle}`}
              />
            ))}

            <div
              className="map-player"
              style={{
                left: `${(player.x / MAP_WIDTH) * 100}%`,
                top: `${(player.y / MAP_HEIGHT) * 100}%`,
                width: `${SPRITE_WIDTH_PERCENT}%`,
                height: `${SPRITE_HEIGHT_PERCENT}%`,
              }}
            >
              <img
                src={currentSprite}
                alt=""
                aria-hidden
                className="map-player-sprite"
              />
            </div>

            {travelLabel && (
              <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-sm border border-amber-300/45 bg-slate-950/90 px-3 py-2 text-center">
                <p className="retro-ui text-[10px] text-amber-100">
                  {travelStatus === "opening" ? "OPENING" : "WALKING TO"}{" "}
                  {travelLabel}
                </p>
                <button
                  onClick={skipTravel}
                  className="inline-flex items-center rounded-sm border border-amber-300/40 bg-amber-500/15 p-1 text-amber-100"
                  aria-label="Skip travel"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-3 border-t border-cyan-300/25 bg-slate-950/85 p-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-2">
              <p className="text-xs text-slate-300">
                <span className="retro-ui text-emerald-300">
                  {hoveredMapPoint ? "DESTINATION:" : "WORLD MAP:"}
                </span>{" "}
                {hoveredMapPoint
                  ? `${hoveredMapPoint.title} - ${hoveredMapPoint.subtitle}`
                  : "Use arrows/WASD to roam. Hover or tap a destination to preview."}
              </p>
              {currentMapChoices.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="retro-ui text-[10px] text-amber-200">
                    PRESS ENTER OR OPEN:
                  </span>
                  {currentMapChoices.map((choice) => (
                    <button
                      key={`${choice.kind}-${choice.id}-open`}
                      onClick={() => openMapPoint(choice)}
                      className="retro-ui rounded-sm border border-emerald-300/35 bg-emerald-500/15 px-2 py-1.5 text-[10px] text-emerald-100 hover:bg-emerald-500/25"
                    >
                      {choice.subtitle.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-200">
                <MapPin className="h-3.5 w-3.5 text-amber-300" />
                <span className="retro-ui">PATH LOCKED</span>
              </div>
              <div
                className="grid grid-cols-3 gap-1"
                aria-label="Path movement controls"
              >
                <span />
                <button
                  onClick={() => movePlayer("up")}
                  disabled={!canRoam || !availableDirections.up}
                  className="map-roam-button"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <span />
                <button
                  onClick={() => movePlayer("left")}
                  disabled={!canRoam || !availableDirections.left}
                  className="map-roam-button"
                  aria-label="Move left"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (currentMapChoices[0]) openMapPoint(currentMapChoices[0]);
                  }}
                  disabled={!canRoam || currentMapChoices.length === 0}
                  className="map-roam-button"
                  aria-label="Open current location"
                >
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => movePlayer("right")}
                  disabled={!canRoam || !availableDirections.right}
                  className="map-roam-button"
                  aria-label="Move right"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <span />
                <button
                  onClick={() => movePlayer("down")}
                  disabled={!canRoam || !availableDirections.down}
                  className="map-roam-button"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <span />
              </div>
            </div>
          </div>
        </div>

        {activeProject && (
          <div
            ref={projectDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-panel-title"
            aria-describedby="project-panel-summary"
            tabIndex={-1}
            className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/78 px-4 py-6 backdrop-blur-sm focus:outline-none"
          >
            <article className="detail-frame max-h-[90vh] w-full max-w-4xl overflow-auto rounded-sm border border-cyan-300/35 bg-slate-950 p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="retro-ui text-xs text-emerald-300">
                    {activeProject.regionLabel}
                  </p>
                  <h2
                    id="project-panel-title"
                    className="retro-heading mt-2 text-2xl text-slate-50 md:text-3xl"
                  >
                    {activeProject.title}
                  </h2>
                  <p
                    id="project-panel-summary"
                    className="mt-2 text-sm text-slate-300"
                  >
                    {activeProject.summary}
                  </p>
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  className="rounded-sm border border-slate-400/40 bg-slate-800/80 p-2 text-slate-100 hover:bg-slate-700"
                  aria-label="Close project panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
                <div
                  className={cn(
                    "flex min-h-[230px] items-center justify-center overflow-hidden rounded-sm border border-slate-300/20",
                    activeProject.mediaBackground === "dark"
                      ? "bg-emerald-950/80"
                      : "bg-white",
                  )}
                >
                  <img
                    src={activeProject.detailImage ?? activeProject.image}
                    alt={`${activeProject.title} screenshot`}
                    className="h-auto max-h-[460px] w-full object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="retro-ui text-xs text-amber-200">
                      TECH STACK
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeProject.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-sm border border-cyan-300/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="retro-ui text-xs text-amber-200">
                      FEATURES
                    </h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
                      {activeProject.features.slice(0, 4).map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {activeProject.links.live && (
                      <a
                        className="detail-action detail-action-live"
                        href={activeProject.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        LIVE
                      </a>
                    )}
                    {activeProject.links.code && (
                      <a
                        className="detail-action detail-action-code"
                        href={activeProject.links.code}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-3.5 w-3.5" />
                        CODE
                      </a>
                    )}
                    <Link
                      className="detail-action"
                      to={`/projects/${activeProject.slug}`}
                    >
                      DETAILS
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
