import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faGear } from "@fortawesome/free-solid-svg-icons";

interface SettingsBarProps {
  onDurationChange: (type: "focus" | "short-break" | "long-break", minutes: number) => void;
  onSoundToggle: (enabled: boolean) => void;
  onVolumeChange: (volume: number) => void;
  soundEnabled: boolean;
  volume: number;
  durations: {
    focus: number;
    "short-break": number;
    "long-break": number;
  };
}

function SettingsBar({
  onDurationChange,
  onSoundToggle,
  onVolumeChange,
  soundEnabled,
  volume,
  durations,
}: SettingsBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDurationChange = (type: "focus" | "short-break" | "long-break", value: string) => {
    const minutes = Math.min(90, Math.max(1, parseInt(value) || 1));
    onDurationChange(type, minutes);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="settings-bar">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle settings"
        aria-expanded={isOpen}
      >
        <FontAwesomeIcon icon={faGear} />
      </button>
      
      <div className={`settings-panel ${isOpen ? 'open' : ''}`} onKeyDown={handleKeyDown}>
        <div className="settings-header">
          <h3>Settings</h3>
          <button 
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Close settings"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </div>
        
        {/* Timers Section */}
        <div className="settings-section">
          <h4>Timers</h4>
          <div className="duration-inputs">
            <div className="input-group">
              <label htmlFor="focus-duration">Focus (minutes):</label>
              <input
                id="focus-duration"
                type="number"
                min="1"
                max="90"
                value={durations.focus}
                onChange={(e) => handleDurationChange("focus", e.target.value)}
                aria-describedby="focus-duration-help"
              />
              <small id="focus-duration-help">Maximum 90 minutes</small>
            </div>
            
            <div className="input-group">
              <label htmlFor="short-break-duration">Short Break (minutes):</label>
              <input
                id="short-break-duration"
                type="number"
                min="1"
                max="90"
                value={durations["short-break"]}
                onChange={(e) => handleDurationChange("short-break", e.target.value)}
                aria-describedby="short-break-duration-help"
              />
              <small id="short-break-duration-help">Maximum 90 minutes</small>
            </div>
            
            <div className="input-group">
              <label htmlFor="long-break-duration">Long Break (minutes):</label>
              <input
                id="long-break-duration"
                type="number"
                min="1"
                max="90"
                value={durations["long-break"]}
                onChange={(e) => handleDurationChange("long-break", e.target.value)}
                aria-describedby="long-break-duration-help"
              />
              <small id="long-break-duration-help">Maximum 90 minutes</small>
            </div>
          </div>
        </div>
        
        {/* Sounds Section */}
        <div className="settings-section">
          <h4>Sounds</h4>
          <div className="sound-controls">
            <div className="sound-toggle">
              <label htmlFor="sound-enabled">Play sound when timer finishes:</label>
              <input
                id="sound-enabled"
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => onSoundToggle(e.target.checked)}
              />
            </div>
            
            {soundEnabled && (
              <div className="volume-control">
                <label htmlFor="volume-slider">Volume: {Math.round(volume * 100)}%</label>
                <input
                  id="volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  aria-label="Volume control"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsBar; 