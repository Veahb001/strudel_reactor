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
  const [ready, setReady] = useState(false);
  const editorRef = useRef(null);
  const rollRef = useRef(null);
  const editorInstance = useRef(null);

  const effectsRef = useRef({
  gain: null,
  reverb: null,
  filter: null,
  });

  useEffect(() => {
    if (!editorRef.current || !rollRef.current) {
      console.warn('Refs not ready yet, waiting...') 
      return;
    }

    if (editorInstance.current) {
      console.warn('Editor instance already initialized');
      return;
    } 
    console_monkey_patch();

    if (!window.strudelLog) window.strudelLog = [];

    // Always use the original, unpatched console
    const nativeConsole = window.__nativeConsole || window.console;

    // Create a new function wrapper
    window.console.log = (...args) => {
      try {
        // Log to real console
        nativeConsole.log(...args);

        // If numeric values are logged, store them in the global array
        const numeric = args.map(a => parseFloat(a)).filter(a => !isNaN(a));
        if (numeric.length) {
          window.strudelLog.push(numeric[0]);
          if (window.strudelLog.length > 100) window.strudelLog.shift();
        }
      } catch (err) {
        nativeConsole.warn("Strudel log capture failed:", err);
      }
    };

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
    gainNode.gain.value = Math.pow(10, volume / 20);
    //Reverb node
    const convolver = ctx.createConvolver();
    const irBuffer = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = irBuffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    convolver.buffer = irBuffer;

    //Filter node
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.value = filterCutoff;

    // Check if webaudioOutput exists
    const output = webaudioOutput?.node ?? null;
    if (!output) {
      console.warn("Strudel output node not found");
      return;
    }

  // Connect nodes only if Strudel output is available
  if (webaudioOutput?.node) {
    try {
      webaudioOutput.node.disconnect();
    } catch (_) {
      /* ignore */
    }

    webaudioOutput.node.connect(filterNode);
    filterNode.connect(convolver);
    convolver.connect(gainNode);
    gainNode.connect(ctx.destination);
  }

  // Save references
  effectsRef.current = { gain: gainNode, reverb: convolver, filter: filterNode };
  setReady(true);

  // Safe cleanup
  return () => {
    try {
      output.disconnect();
      filterNode.disconnect();
      convolver.disconnect();
      gainNode.disconnect();
    } catch (err) {
      console.warn("Audio cleanup error:", err);
    }
    };
  }, []); //run once on mount

  //Update volume
  useEffect(() => {
    if (!ready) return;
    const { gain, ctx } = effectsRef.current || {};
    if (gain && ctx) {
      gain.gain.setTargetAtTime(Math.pow(10, volume / 20), ctx.currentTime, 0.05);
    }
  }, [ready, volume]);

  //Update filter cutoff
  useEffect(() => {
    const { filter, ctx } = effectsRef.current || {};
    if (filter && ctx) {
      filter.frequency.setTargetAtTime(filterCutoff, ctx.currentTime, 0.05);
    }
  }, [ready, filterCutoff]);

  // Reverb wet amount could be faked by scaling gain (basic implementation could be altered)
  useEffect(() => {
    if (!ready) return;
    const { reverb, ctx, filter, gain } = effectsRef.current || {};
    if (!(reverb && ctx && filter && gain)) return;
    
    if (!effectsRef.current.dryNode) {
      const dryNode = ctx.createGain();
      const wetNode = ctx.createGain();

      filter.disconnect();
      filter.connect(dryNode);
      filter.connect(reverb);

      reverb.connect(wetNode);
      dryNode.connect(gain);
      wetNode.connect(gain);

      effectsRef.current.dryNode = dryNode;
      effectsRef.current.wetNode = wetNode;
    }

    effectsRef.current.dryNode.gain.setTargetAtTime(1 - reverb, ctx.currentTime, 0.05);
    effectsRef.current.wetNode.gain.setTargetAtTime(reverb, ctx.currentTime, 0.05);
  }, [ready, reverb]);
  

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
    volume,
    setVolume,
    reverb,
    setReverb,
    filterCutoff,
    setFilterCutoff,
  };
}
