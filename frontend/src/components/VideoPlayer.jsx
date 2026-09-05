import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const PROGRESS_SAVE_INTERVAL_MS = 10000;

export default function VideoPlayer({ src, poster, initialTime = 0, onProgress, className }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const lastSaveRef = useRef(0);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = src.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else {
      video.src = src;
    }

    const seekToInitial = () => {
      if (initialTime > 0 && initialTime < video.duration - 5) {
        video.currentTime = initialTime;
      }
      video.removeEventListener('loadedmetadata', seekToInitial);
    };
    video.addEventListener('loadedmetadata', seekToInitial);

    const handleTimeUpdate = () => {
      const now = Date.now();
      if (now - lastSaveRef.current >= PROGRESS_SAVE_INTERVAL_MS) {
        lastSaveRef.current = now;
        onProgressRef.current?.(video.currentTime, video.duration);
      }
    };
    const handlePauseOrEnd = () => {
      onProgressRef.current?.(video.currentTime, video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('pause', handlePauseOrEnd);
    video.addEventListener('ended', handlePauseOrEnd);

    return () => {
      video.removeEventListener('loadedmetadata', seekToInitial);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('pause', handlePauseOrEnd);
      video.removeEventListener('ended', handlePauseOrEnd);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      controls
      autoPlay
      poster={poster}
    />
  );
}
