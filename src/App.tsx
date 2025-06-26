import "./App.css";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Timer from "./components/Timer";
import SettingsBar from "./components/SettingsBar";

type SessionType = "focus" | "short-break" | "long-break";

function App() {
  const [durations, setDurations] = useState<Record<SessionType, number>>({
    "focus": 25,
    "short-break": 5,
    "long-break": 20
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const handleDurationChange = (type: SessionType, minutes: number) => {
    setDurations(prev => ({
      ...prev,
      [type]: minutes
    }));
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  return (
    <>
      <SettingsBar
        onDurationChange={handleDurationChange}
        onSoundToggle={handleSoundToggle}
        onVolumeChange={handleVolumeChange}
        soundEnabled={soundEnabled}
        volume={volume}
        durations={durations}
      />
      <Header />
      <Timer 
        durations={durations}
        soundEnabled={soundEnabled}
        volume={volume}
      />
      <Footer />
    </>
  );
}

export default App;
