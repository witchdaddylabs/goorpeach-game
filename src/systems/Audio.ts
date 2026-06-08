/**
 * Audio — the central audio manager (CLAUDE.md rule 3). No scene calls
 * this.sound.play directly. Handles mute, ducking between music tracks, and the
 * browser-blocks-audio-until-first-interaction quirk.
 *
 * Audio gotcha (CLAUDE.md): use Phaser.Sound.WebAudioSoundManager and call
 * context.resume() on the MenuScene Start click. Verify on Safari iOS.
 *
 * TODO: implement. See CLAUDE.md working pattern, step 2.
 */
export class Audio {
  // TODO: unlock(), playMusic(), playSfx(), setMute(), duck().
}
