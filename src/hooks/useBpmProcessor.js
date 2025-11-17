import { useCallback } from "react";
import { applyBpmToCode } from "../utils/bpmHelpers";
import { processText } from "../utils/strudelProcessor";

export function useBpmProcessor(bpm, editorInstance, procText) {
    const processOnly = useCallback(() => {
        if (!editorInstance.current) {
            console.warn('Editor instance not ready');
            return;
        }

        let newCode = processText(procText);
        newCode = applyBpmToCode(newCode, bpm);

        console.log('Applied BPM:', bpm);
        editorInstance.current.setCode(newCode);
    }, [bpm, editorInstance, procText]);

    const procAndPlay = useCallback(() => {
        console.log('ProcAndPlay called');
        processOnly();
        editorInstance.current?.evaluate();
    }, [processOnly, editorInstance]);

    const play = useCallback(() => {
        console.log('Play called');
        editorInstance.current?.evaluate();
    }, [editorInstance]);

    const stop = useCallback(() => {
        console.log('Stop called');
        editorInstance.current?.stop();
    }, [editorInstance]);

    return {
        processOnly,
        procAndPlay,
        play,
        stop,
    };
}