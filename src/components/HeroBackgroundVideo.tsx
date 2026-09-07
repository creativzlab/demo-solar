"use client";

import { useEffect, useRef, useState } from "react";

const cloudinaryBase =
  "https://res.cloudinary.com/hm2xwqag/video/upload";
const desktopVideo = `${cloudinaryBase}/ac_none,fps_20,q_auto:eco,w_1280/v1787079981/baby_boomer_solar_ih0nl3.mp4`;
const mobileVideo = `${cloudinaryBase}/ac_none,fps_20,q_auto:eco,w_720/v1787079981/baby_boomer_solar_ih0nl3.mp4`;

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = (navigator as NavigatorWithConnection).connection
      ?.saveData;

    if (reduceMotion || saveData) return;

    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const frameId = window.requestAnimationFrame(() => {
      setSource(isMobile ? mobileVideo : desktopVideo);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;

    const playWhenVisible = () => {
      if (document.hidden || !video.classList.contains("is-in-viewport")) {
        video.pause();
        return;
      }

      void video.play().catch(() => undefined);
    };

    const handleVisibilityChange = () => playWhenVisible();

    video.addEventListener("canplay", playWhenVisible);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    playWhenVisible();

    return () => {
      video.removeEventListener("canplay", playWhenVisible);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.pause();
    };
  }, [source]);

  return (
    <video
      ref={videoRef}
      className={`hero-video${ready ? " is-ready" : ""}`}
      src={source}
      width={1920}
      height={1080}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onLoadedData={() => setReady(true)}
      onError={() => setReady(false)}
      aria-hidden="true"
      tabIndex={-1}
      data-viewport-animate
      data-autoplay-video
    >
      Seu navegador não suporta vídeo em HTML5.
    </video>
  );
}
