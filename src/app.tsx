import { NoiseGenerator } from "@scripts/noise-generator";
import { useEffect, useRef, useState } from "react";

export function App() {
  const [slope, setSlope] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const noiseRef = useRef<NoiseGenerator | null>(null);

  useEffect(() => {
    noiseRef.current = new NoiseGenerator();
    return () => noiseRef.current?.dispose();
  }, []);

  useEffect(() => {
    noiseRef.current?.setVolume(volume);
  }, [volume]);

  const toggle = () => {
    if (isPlaying) {
      noiseRef.current?.stop();
    } else {
      noiseRef.current?.play(slope);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSlopeChange = (newSlope: number) => {
    setSlope(newSlope);
    if (isPlaying) {
      noiseRef.current?.play(newSlope);
    }
  };

  return (
    <div>
      <div>
        <label>
          Color:
          <input
            type="range"
            min="-6"
            max="6"
            step="0.1"
            value={slope}
            onChange={(e) => handleSlopeChange(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <button onClick={toggle}>{isPlaying ? "Stop" : "Play"}</button>
    </div>
  );
}
