import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds } from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import { transpiler } from "@strudel/transpiler";
import { stranger_tune } from "../utils/tunes";
import { processText } from "../utils/strudelProcessor";
import console_monkey_patch from "../utils/console-monkey-patch";

export function useStrudelEditor() {
  const [procText, setProcText] = useState(stranger_tune);
  const editorRef = useRef(null);
  const rollRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
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
      onDraw: (haps, time) =>
        drawPianoroll({ haps, time, ctx, drawTime, fold: 0 }),
      prebake: async () => {
        initAudioOnFirstClick();
        const loadModules = evalScope(
          import("@strudel/core"),
          import("@strudel/draw"),
          import("@strudel/mini"),
          import("@strudel/tonal"),
          import("@strudel/webaudio")
        );
        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
      },
    });

    editorInstance.current.setCode(procText);
  }, []);

  const processOnly = () => {
    const newCode = processText(procText);
    editorInstance.current.setCode(newCode);
  };

  const procAndPlay = () => {
    processOnly();
    editorInstance.current.evaluate();
  };

  const play = () => editorInstance.current.evaluate();
  const stop = () => editorInstance.current.stop();

  return {
    procText,
    setProcText,
    procAndPlay,
    processOnly,
    play,
    stop,
    rollRef,
    editorRef,
  };
}
