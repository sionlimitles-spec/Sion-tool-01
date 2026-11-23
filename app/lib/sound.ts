let ctx: AudioContext | null = null;
export const isSoundOn = () => { try { return localStorage.getItem("sion_sound") !== "off"; } catch { return true; } };
export function setSoundOn(on: boolean) { try { localStorage.setItem("sion_sound", on ? "on" : "off"); } catch {} }
export function blip(kind: "click" | "hover" = "click") {
  if (typeof window === "undefined" || !isSoundOn()) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    ctx = ctx || new AC();
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    o.type = "square"; o.frequency.setValueAtTime(kind === "click" ? 520 : 760, t);
    o.frequency.exponentialRampToValueAtTime(kind === "click" ? 260 : 980, t + 0.07);
    g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.1);
  } catch {}
}
export const vibrate = (ms = 12) => { try { navigator.vibrate?.(ms); } catch {} };
