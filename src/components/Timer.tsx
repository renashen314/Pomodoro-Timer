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

  return (
     <div className="flex flex-col items-center gap-4">
        <div>
            <p>Session {currentSessionIndex + 1} of {SESSION_ORDER.length} ({SESSION_TYPE_LABEL[currentSessionType]})</p>
        </div>
      <h1 className="text-4xl font-mono">{formatter(timeLeft)}</h1>
      <div className="flex gap-2">
        <button onClick={handleStart} className="px-4 py-2 bg-green-500 text-white rounded">{isRunning ? "Pause" : "Start"}</button>
        <button onClick={handleSkip} className="px-4 py-2 bg-yellow-500 text-white rounded">Skip</button>
        <button onClick={handleReset} className="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
      </div>
    </div>
  )
}

export default Timer