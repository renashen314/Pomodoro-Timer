import { useCallback, useEffect, useRef, useState } from "react"

type SessionType = "focus" | "short-break" | "long-break";

const SESSION_TYPE_LABEL: Record<SessionType, string> = {
    "focus": "focus time",
    "short-break": "short break",
    "long-break": "long break",
  };

const SESSION_DURATION_IN_MINUTES: Record<SessionType, number> = {
    "focus": 25,
    "short-break": 5,
    "long-break": 20
}

const SESSION_ORDER: SessionType[] = ["focus", "short-break", "focus", "long-break"];

function Timer() {
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
    const currentSessionType = SESSION_ORDER[currentSessionIndex];
    const [timeLeft, setTimeLeft] = useState(() => SESSION_DURATION_IN_MINUTES[currentSessionType] * 60);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const interval = useRef<number | null>(null);

    const goToNextSession = useCallback(() => {
        if (currentSessionIndex < SESSION_ORDER.length - 1) {
            const nextIndex = currentSessionIndex + 1;
            setCurrentSessionIndex(nextIndex);
            setTimeLeft(SESSION_DURATION_IN_MINUTES[SESSION_ORDER[nextIndex]] * 60);
            setIsRunning(true); // or true if you want auto-start
        } else {
            setIsRunning(false); // End of all sessions
        }
    }, [currentSessionIndex])

    const formatter = (seconds: number) => {
        const m = Math.floor(seconds/60)
        const s = seconds % 60
        return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
    }

    useEffect(()=>{
        if (isRunning && interval.current == null) {
            interval.current = window.setInterval(()=>{
                setTimeLeft((prev)=>{
                    if (prev <= 1) {
                        clearInterval(interval.current!)
                        interval.current = null
                        goToNextSession();
                        return 0
                    }
                    return prev -1
                })
            },1000)
        }
        return () => {
            if (interval.current !== null){
                clearInterval(interval.current)
                interval.current = null
            }
        }
    }, [isRunning, currentSessionIndex, goToNextSession])

    const handleStart = () =>{
        setIsRunning(!isRunning)
    }
    const handleSkip = () =>{
        goToNextSession();
    }
    const handleReset = () =>{
        setIsRunning(false)
        setCurrentSessionIndex(0);
        setTimeLeft(SESSION_DURATION_IN_MINUTES[SESSION_ORDER[0]] * 60);
    }

    const isLastSessionEnded = currentSessionIndex === SESSION_ORDER.length - 1 && !isRunning && timeLeft === 0;

  return (
     <div className="timer-container">
        <div className="session-count">
            <p>Session {currentSessionIndex + 1} of {SESSION_ORDER.length} ({SESSION_TYPE_LABEL[currentSessionType]})</p>
        </div>
      <h1 className="timer-text">{isLastSessionEnded ? "Session ends" : formatter(timeLeft)}</h1>
      <div className="buttons">
        <button onClick={handleStart} className="" disabled={isLastSessionEnded}>{isRunning ? "Pause" : "Lock In"}</button>
        <button onClick={handleSkip} className="button-skip-reset" disabled={isLastSessionEnded}>Skip</button>
        <button onClick={handleReset} className="button-skip-reset">Reset</button>
      </div>
    </div>
  )
}

export default Timer