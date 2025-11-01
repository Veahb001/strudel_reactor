import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope, ir } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds } from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import { transpiler } from "@strudel/transpiler";
import { stranger_tune } from "../utils/tunes";
import { processText } from "../utils/strudelProcessor";
import console_monkey_patch from "../utils/console-monkey-patch";

export function useStrudelEditor() {
  const [procText, setProcText] = useState(stranger_tune);
  const [volume, setVolume] = useState(-6);
  const [reverb, setReverb] = useState(0.3);
  const [filterCutoff, setFilterCutoff] = useState(20000);
  const editorRef = useRef(null);
  const rollRef = useRef(null);
  const editorInstance = useRef(null);

  const effectsRef = useRef({
  gain: null,
  reverb: null,
  filter: null,
  });

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

  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    //Gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.gain.value = Math.pow(10, volume / 20); //convert dB to linear
  
    //Reverb node
    const convolver = ctx.createConvolver();
    const irBuffer = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const channelData = irBuffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    }
    convolver.buffer = irBuffer;

    //Filter node
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.value = filterCutoff;

    // Connect nodes: Source -> Filter -> Reverb -> Gain -> Destination
    webaudioOutput.node.disconnect();
    webaudioOutput.node.connect(filterNode);
    filterNode.connect(convolver);
    convolver.connect(gainNode);
    gainNode.connect(ctx.destination);

    //Save references
    effectsRef.current = { gain: gainNode, reverb: convolver, filter:filterNode };

    return () => {
      gainNode.disconnect();
      convolver.disconnect();
      filterNode.disconnect();
    };
  }, []
  

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
