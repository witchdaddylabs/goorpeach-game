/**
 * Layout — active game dimensions for landscape (480×270) or portrait (270×480).
 * Mobile-first: portrait upright is fully playable; no rotate blocker.
 */
import {
  LAYOUT_LANDSCAPE,
  LAYOUT_PORTRAIT,
  SCENES,
  type GameLayout,
} from '../config';

let active: GameLayout = LAYOUT_LANDSCAPE;

export function isPortraitViewport(): boolean {
  return window.innerHeight > window.innerWidth;
}

export function getLayout(): GameLayout {
  return active;
}

export function setLayout(portrait: boolean): GameLayout {
  active = portrait ? LAYOUT_PORTRAIT : LAYOUT_LANDSCAPE;
  document.body.classList.toggle('layout-portrait', portrait);
  document.body.classList.toggle('layout-landscape', !portrait);
  const root = document.getElementById('game-root');
  if (root) {
    root.classList.toggle('game-root--portrait', portrait);
    root.classList.toggle('game-root--landscape', !portrait);
  }
  return active;
}

export function getInitialLayout(): GameLayout {
  return setLayout(isPortraitViewport());
}

/**
 * Resize Phaser to the active layout and restart the foreground scene so
 * coordinates match the new band (orientation change mid-run).
 */
export function bindResponsiveLayout(game: Phaser.Game): void {
  let lastWidth = -1;
  let lastHeight = -1;

  const apply = (): void => {
    const portrait = isPortraitViewport();
    const layout = setLayout(portrait);
    if (layout.width === lastWidth && layout.height === lastHeight) return;
    lastWidth = layout.width;
    lastHeight = layout.height;

    game.scale.setGameSize(layout.width, layout.height);
    game.scale.refresh();

    const scenes = game.scene.getScenes(true);
    const top = scenes[0];
    if (!top?.scene.isActive()) return;

    const key = top.scene.key;
    // Never restart boot/preload — avoids loader/audio glitches on first paint.
    if (key === SCENES.Boot || key === SCENES.Preload) return;

    const data = top.scene.settings.data as Record<string, unknown>;
    game.scene.start(key, data);
  };

  apply();
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', apply);

  const screenOrientation = window.screen.orientation;
  if (screenOrientation && 'addEventListener' in screenOrientation) {
    screenOrientation.addEventListener('change', apply);
  }
}