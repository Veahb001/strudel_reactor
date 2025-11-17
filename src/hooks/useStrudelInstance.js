import { useEffect, useRef } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import {
    initAudioOnFirstClick,
    getAudioContext,
    webaudioOutput,
    registerSynthSounds
} from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import { transpiler } from "@strudel/transpiler";
import console_monkey_patch from "../utils/console-monkey-patch";

export function useStrudelInstance(editorRef, rollRef, procText, onHapData) {
    const editorInstance = useRef(null);

    useEffect(() => {
        if (!editorRef.current || !rollRef.current) {
            console.warn('Refs not ready yet, waiting...');
            return;
        }

        if (editorInstance.current) {
            console.warn('Editor instance already initialized');
            return;
        }

        console_monkey_patch();

        const canvas = rollRef.current;
        const ctx = canvas.getContext("2d");
        const drawTime = [-2, 2];
        canvas.width *= 2;
        canvas.height *= 2;

        editorInstance.current = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: editorRef.current,
            drawTime,

            onDraw: (haps, time) => {
                drawPianoroll({ haps, time, ctx, drawTime, fold: 0 });
                if (onHapData) {
                    onHapData(haps);
                }
            },

            prebake: async () => {
                initAudioOnFirstClick();
                const loadModules = evalScope(
                    import("@strudel/core"),
                    import("@strudel/draw"),
                    import("@strudel/mini"),
                    import("@strudel/tonal"),
                    import("@strudel/webaudio")
                );
                await Promise.all([
                    loadModules,
                    registerSynthSounds(),
                    registerSoundfonts()
                ]);
            },
        });

        editorInstance.current.setCode(procText);
    }, [editorRef, rollRef, procText, onHapData]);

    return editorInstance;
}