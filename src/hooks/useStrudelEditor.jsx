import { useRef, useState } from "react";
import { stranger_tune } from "../utils/tunes";
import { useStrudelInstance } from "./useStrudelInstance";
import { useAudioEffects } from "./useAudioEffects";
import { useHapDataCapture } from "./useHapDataCapture";
import { useBpmProcessor } from "./useBpmProcessor";
import { extractBpmFromCode } from "../utils/bpmHelpers";
import { useEffect } from "react"

export function useStrudelEditor() {
    // State
    const [procText, setProcText] = useState(stranger_tune);
    const [volume, setVolume] = useState(-6);
    const [bpm, setBpm] = useState(120);
    const [reverb, setReverb] = useState(0.3);
    const [delay, setDelay] = useState(0);
    const [distortion, setDistortion] = useState(0);
    const [mutedTracks, setMutedTracks] = useState([]);

    // Refs
    const editorRef = useRef(null);
    const rollRef = useRef(null);

    useEffect(() => {
        const detectedBpm = extractBpmFromCode(procText);
        setBpm(detectedBpm);
        console.log('Detected BPM from pattern:', detectedBpm);
    }, [procText]);

    // Custom Hooks
    const { captureHapData } = useHapDataCapture();
    const editorInstance = useStrudelInstance( editorRef, rollRef, procText, captureHapData );
    const { ready } = useAudioEffects(volume, reverb, delay, distortion);
    const { processOnly, procAndPlay, play, stop } = useBpmProcessor(bpm, editorInstance, procText, mutedTracks );

    // Return
    return {
        procText,
        setProcText,
        volume,
        setVolume,
        reverb,
        setReverb,
        delay,
        setDelay,
        distortion,
        setDistortion,
        bpm,
        setBpm,
        mutedTracks,
        setMutedTracks,
        ready,
        rollRef,
        editorRef,
        processOnly,
        procAndPlay,
        play,
        stop,
    };
}