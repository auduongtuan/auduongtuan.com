import { defineSound, ensureReady } from "@web-kits/audio";
import { confetti, hover, success, tap } from "../../.web-kits/core";
import useAppStore from "@store/useAppStore";

const playTap = defineSound(tap);
const playConfetti = defineSound(confetti);
const playHover = defineSound(hover);
const playSuccess = defineSound(success);
const playNeedleDrop = defineSound({
  layers: [
    {
      source: { type: "noise", color: "brown" },
      filter: { type: "bandpass", frequency: 900, resonance: 1.2 },
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.08 },
      gain: 0.11,
    },
    {
      source: { type: "sine", frequency: { start: 180, end: 90 } },
      envelope: { attack: 0.002, decay: 0.12, sustain: 0, release: 0.04 },
      gain: 0.12,
      delay: 0.025,
    },
  ],
});
const playNeedleLift = defineSound({
  layers: [
    {
      source: { type: "noise", color: "pink" },
      filter: { type: "highpass", frequency: 1600, resonance: 0.7 },
      envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.05 },
      gain: 0.07,
    },
    {
      source: { type: "sine", frequency: { start: 240, end: 420 } },
      envelope: { attack: 0.002, decay: 0.07, sustain: 0, release: 0.03 },
      gain: 0.06,
    },
  ],
});
const playVolumeTick = defineSound({
  layers: [
    {
      source: { type: "noise", color: "brown" },
      filter: { type: "bandpass", frequency: 1200, resonance: 2.8 },
      envelope: { attack: 0, decay: 0.018, sustain: 0, release: 0.006 },
      gain: 0.045,
    },
    {
      source: { type: "square", frequency: 95 },
      filter: { type: "lowpass", frequency: 600 },
      envelope: { attack: 0, decay: 0.02, sustain: 0, release: 0.006 },
      gain: 0.035,
    },
  ],
});

let lastSpotifyVolumeSoundAt = 0;

function soundEffectsEnabled() {
  return useAppStore.getState().soundEffectsEnabled;
}

async function playSound(play: () => unknown) {
  if (typeof window === "undefined" || !soundEffectsEnabled()) {
    return;
  }

  await ensureReady();
  if (!soundEffectsEnabled()) return;

  play();
}

export function playNavigationSound() {
  void playSound(playTap);
}

export function playThemeSound() {
  void playSound(playConfetti);
}

export function playGifHoverSound() {
  void playSound(playHover);
}

export function playSuccessSound() {
  void playSound(playSuccess);
}

export function playSpotifyPlaybackSound(isPlaying: boolean) {
  void playSound(isPlaying ? playNeedleDrop : playNeedleLift);
}

export function playSpotifyVolumeSound() {
  if (!soundEffectsEnabled()) return;

  const now = performance.now();
  if (now - lastSpotifyVolumeSoundAt < 90) return;

  lastSpotifyVolumeSoundAt = now;
  void playSound(playVolumeTick);
}
