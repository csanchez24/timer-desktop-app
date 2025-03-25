export const formatTime = (seconds: number, withSec: boolean = true) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  if (!withSec) {
    return `${hrs}:${mins}`;
  }
  return `${hrs}:${mins}:${secs}`;
};
