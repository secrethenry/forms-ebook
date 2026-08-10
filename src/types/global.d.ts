/**
 * Tipagem global para SDKs de terceiros carregados via <script>
 * (Meta Pixel, Microsoft Clarity, YouTube IFrame API).
 */

export {};

declare global {
  // Meta Pixel
  interface Window {
    fbq?: (
      method: "track" | "trackCustom" | "init" | "consent",
      eventNameOrId: string,
      params?: Record<string, unknown>,
    ) => void;
    _fbq?: unknown;

    // Microsoft Clarity
    clarity?: (
      method: "set" | "identify" | "consent" | "event" | "upgrade",
      ...args: unknown[]
    ) => void;

    // YouTube IFrame API
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }

  // Namespace mínimo da YouTube IFrame API (o que usamos no VslPlayer)
  namespace YT {
    class Player {
      constructor(el: HTMLElement | string, options: PlayerOptions);
      playVideo(): void;
      pauseVideo(): void;
      getCurrentTime(): number;
      getDuration(): number;
      getPlayerState(): number;
      destroy(): void;
      mute(): void;
      unMute(): void;
    }

    interface PlayerOptions {
      videoId?: string;
      events?: {
        onReady?: (event: { target: Player }) => void;
        onStateChange?: (event: { data: number; target: Player }) => void;
      };
      playerVars?: Record<string, string | number>;
    }

    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }
  }
}
