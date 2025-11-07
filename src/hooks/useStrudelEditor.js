import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope, gain, ir } from "@strudel/core";
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
  const [ready, setReady] = useState(false);
  const editorRef = useRef(null);
  const rollRef = useRef(null);
  const editorInstance = useRef(null);
  const [bpm, setBpm] = useState(120); //Current Default is 120BPM

  const effectsRef = useRef({
  gain: null,
  reverb: null,
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
        try {
          if (haps && haps.length > 0) {
            const latestHap = haps[0];
            const gain = latestHap.value?.gain  ?? 0.5;

            if(!window.strudelHapData) {
              window.strudelHapData = [];

            window.strudelHapData.push(gain);
            if (window.strudelHapData.length > 100)
              window.strudelHapData.shift();
            }
            const event = new CustomEvent("strudelHapData", {
              detail: [...window.strudelHapData]
            });
            document.dispatchEvent(event);
          }
        } catch (err) {
          console.wwarn('Hap ccapture error:', err);
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
        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
      },
    });

    editorInstance.current.setCode(procText);
  }, []);

  useEffect(() => {
    const setupAudio = async () => {
      await initAudioOnFirstClick();
      const ctx = getAudioContext();
      if (!ctx) {
        console.log('Aduio context not ready yet');
        return;
      }

      console.log('Setting up audio nodes ...')

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

      convolver.connect(gainNode);
      gainNode.connect(ctx.destination);
    }

    // Save references
    effectsRef.current = { gain: gainNode, reverb: convolver};
    setReady(true);
    console.log('Aduio nodes ready')

    // Safe cleanup
    return () => {
      try {
        output.disconnect();
        convolver.disconnect();
        gainNode.disconnect();
      } catch (err) {
        console.warn("Audio cleanup error:", err);
      }
    }
    };
  }, [volume]); 

  //Update volume
  useEffect(() => {
    console.log('Volume effect running:', { ready, volume, effectsRef: effectsRef.current })
    if (!ready) return;
    const { gain } = effectsRef.current || {};
    if (gain) {
      const ctx = getAudioContext();
      gain.gain.setTargetAtTime(Math.pow(10, volume / 20), ctx.currentTime, 0.05);
    }
  }, [ready, volume]);

  //Update BPM
  const applyBpm = (code) => {
    //Check if preproc code already has '.cpm()' or '.setBpm()'
    if (code.includes('.cpm(') || code.includes('setBpm(')) {
      code = code.replace(/\.cpm\([^)]*\)/g, `.cpm(${bpm})`);
      code = code.replace(/\.setBpm\([^)]*\)/g, `.cpm(${bpm})`);
    }else{
      // Add BPM to the end of the pattern
      // Find the last pattern and add .cpm() to it
      code = code.trim();
      if (!code.endsWith('.cpm()')) {
        code = `${code}.cpm(${bpm})`;
      }
    }
  }


  const processOnly = () => {
    //const newCode = processText(procText);
    let newCode = processText(procText);

    //Apply BPM to the code
    if (!newCode.includes('.cpm(') && !newCode.includes('setBpm(')) {
      newCode = `${newCode}.cpm(${bpm})`;
    }
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
    bpm,
    setBpm,
  };
}
