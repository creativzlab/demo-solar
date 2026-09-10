"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import styles from "./branded-video-player.module.css";

type BrandedVideoPlayerProps = {
  src: string;
  poster: string;
  title: string;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function BrandedVideoPlayer({ src, poster, title }: BrandedVideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
  };

  const toggleFullscreen = async () => {
    if (!playerRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await playerRef.current.requestFullscreen();
      }
    } catch {
      setIsFullscreen(false);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressStyle = { "--player-progress": `${progress}%` } as CSSProperties;

  return (
    <div
      ref={playerRef}
      className={styles.player}
      data-playing={isPlaying ? "true" : "false"}
      data-testid="branded-video-player"
    >
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={title}
        onClick={togglePlayback}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
      >
        <source src={src} />
        Seu navegador não oferece suporte à reprodução de vídeo.
      </video>

      <div className={styles.brandBadge} aria-hidden="true">
        <span />
        Demanda Infinita
      </div>

      {!isPlaying ? (
        <button
          type="button"
          className={styles.centerPlay}
          onClick={togglePlayback}
          aria-label="Reproduzir vídeo"
        >
          <Play fill="currentColor" aria-hidden="true" />
        </button>
      ) : null}

      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.controls} aria-label="Controles do vídeo">
        <button
          type="button"
          className={styles.controlButton}
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
        >
          {isPlaying ? <Pause fill="currentColor" aria-hidden="true" /> : <Play fill="currentColor" aria-hidden="true" />}
        </button>

        <span className={styles.time} aria-label={`${formatTime(currentTime)} de ${formatTime(duration)}`}>
          {formatTime(currentTime)} <i>/</i> {formatTime(duration)}
        </span>

        <input
          className={styles.progress}
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => {
            const nextTime = Number(event.currentTarget.value);
            if (videoRef.current) videoRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
          }}
          style={progressStyle}
          aria-label="Progresso do vídeo"
        />

        <button
          type="button"
          className={styles.controlButton}
          onClick={() => {
            if (!videoRef.current) return;
            videoRef.current.muted = !videoRef.current.muted;
          }}
          aria-label={isMuted ? "Ativar som" : "Silenciar vídeo"}
        >
          {isMuted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>

        <button
          type="button"
          className={styles.controlButton}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Sair da tela cheia" : "Abrir em tela cheia"}
        >
          <Maximize2 aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
