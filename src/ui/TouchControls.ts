/**
 * TouchControls — the ONLY home for touch input (CLAUDE.md rule 5).
 *
 * Mobile-first: this game is built for touch. Layout per docs/BRIEF.md —
 * drag lower-left to steer, hold lower-right to brake, tap upper-right to fire.
 * It emits the SAME events the keyboard does, so scenes never branch on input
 * source. Keyboard handlers live in their scenes.
 *
 * Accessibility: touch targets must be large enough to hit comfortably (aim for
 * ~44px CSS minimum, scaled), and steer sensitivity is player-adjustable in
 * Settings. The overlay should not obscure essential HUD.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 11.
 */
export class TouchControls {
  // TODO: render touch zones; emit steer/brake/fire events to the active scene.
}
