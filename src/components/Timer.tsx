import { useEffect, useRef, useState } from "react"

const INITIAL_TIME_IN_SECONDS = 5 * 60

function Timer() {
    const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME_IN_SECONDS)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const interval = useRef<number | null>(null)

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
                        setIsRunning(false)
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
    }, [isRunning])

    const handleStart = () =>{
        setIsRunning(!isRunning)
    }
    const handleSkip = () =>{
        setIsRunning(false)
        setTimeLeft(INITIAL_TIME_IN_SECONDS)
    }
    const handleReset = () =>{
         setIsRunning(false)
         setTimeLeft(INITIAL_TIME_IN_SECONDS)
    }

  return (
     <div className="flex flex-col items-center gap-4">
        <div>
            <p>Session 1 of 4</p>
        </div>
      <h1 className="text-4xl font-mono">{formatter(timeLeft)}</h1>
      <div className="flex gap-2">
        <button onClick={handleStart} className="px-4 py-2 bg-green-500 text-white rounded">{isRunning ? "Pause" : "Start"}</button>
        <button onClick={handleSkip} className="px-4 py-2 bg-yellow-500 text-white rounded">Skip</button>

      </div>
    </div>
  )
}

export default Timer