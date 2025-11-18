import { useEffect, useRef, useState } from "react";
import { getAudioContext } from "@strudel/webaudio";
import {
    initializeAudioContext,
    createGainNode,
    connectAudioChain,
    disconnectAudioChain,
    updateVolume
} from "../utils/audioSetup";

export function useAudioEffects(volume, reverb, delay, distortion) {
    const [ready, setReady] = useState(false);
    const effectsRef = useRef({
        gain: null,
        reverb: null,
        dryGain: null,
        wetGain: null,
        delay: null,
        delayGain: null,
        distortion: null
    });

    // Setup audio chain
    useEffect(() => {
        const setupAudio = async () => {
            const ctx = await initializeAudioContext();

            if (!ctx) {
                console.log('Audio context not ready yet');
                return;
            }

            console.log('Setting up audio nodes...');

            const gainNode = createGainNode(ctx, volume);
            const convolver = ctx.createConvolver();
            const irBuffer = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
            for (let ch = 0; ch < 2; ch++) {
                const data = irBuffer.getChannelData(ch);
                for (let i = 0; i < data.length; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.5));
                }
            }
            convolver.buffer = irBuffer;

            //Delay
            const delayNode = ctx.createDelay(5.0);
            delayNode.delayTime.value = 0.3;
            const delayFeedback = ctx.createGain();
            delayFeedback.gain.value = 0.3;
            const delayGainNode = ctx.createGain();
            delayGainNode.gain.value = 0;

            //Distortion
            const distortionNode = ctx.createWaveShaper();
            const makeDistortionCurve = (amount) => {
                const k = amount;
                const samples = 44100;
                const curve = new Float32Array(samples);
                const deg = Math.PI / 180;
                for (let i = 0; i < samples; i++) {
                    const x = (i * 2) / samples - 1;
                    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
                }
                return curve;
            };
            distortionNode.curve = makeDistortionCurve(0);

            //dry/wet gains for reverb
            const dryGain = ctx.createGain();
            const wetGain = ctx.createGain();
            dryGain.gain.value = 1;
            wetGain.gain.value = 0;
            const output = window.webaudioOutput?.node;

            if (!output) {
                console.warn("Strudel output node not found");
                return;
            }

                // Disconnect default connection
                try {
                    output.disconnect();
                } catch (_) { }

                output.connect(distortionNode);

                // Delay chain
                distortionNode.connect(delayNode);
                delayNode.connect(delayFeedback);
                delayFeedback.connect(delayNode);
                delayNode.connect(delayGainNode);

                // Split for reverb
                delayGainNode.connect(dryGain);
                delayGainNode.connect(convolver);
                convolver.connect(wetGain);

                // Merge and output
                dryGain.connect(gainNode);
                wetGain.connect(gainNode);
                gainNode.connect(ctx.destination);

                effectsRef.current = {
                    gain: gainNode,
                    reverb: convolver,
                    dryGain,
                    wetGain,
                    delay: delayNode,
                    delayGain: delayGainNode,
                    distortion: distortionNode
                };
                setReady(true);
                console.log('Effects ready:', { gain: !!gainNode, reverb: !!convolver });
                console.log('Audio nodes ready');
        };

        setupAudio();

        // Cleanup
        return () => {
            const { gain } = effectsRef.current || {};
            disconnectAudioChain(gain);
        };
    }, []);

    // Update volume when it changes
    useEffect(() => {
        if (!ready) return;
        const { dryGain, wetGain } = effectsRef.current || {};
        if (dryGain && wetGain) {
            const ctx = getAudioContext();
            if (ctx) {
                dryGain.gain.setTargetAtTime(1 - reverb, ctx.currentTime, 0.05);
                wetGain.gain.setTargetAtTime(reverb, ctx.currentTime, 0.05);
            }
        }
    }, [ready, reverb]);

    // Update volume
    useEffect(() => {
        if (!ready) return;
        const { gain } = effectsRef.current || {};
        updateVolume(gain, volume);
    }, [ready, volume]);

    // Update delay
    useEffect(() => {
        if (!ready) return;
        const { delayGain } = effectsRef.current || {};
        if (delayGain) {
            const ctx = getAudioContext();
            if (ctx) {
                delayGain.gain.setTargetAtTime(delay, ctx.currentTime, 0.05);
            }
        }
    }, [ready, delay]);

    // Update distortion
    useEffect(() => {
        if (!ready) return;
        const { distortion: distortionNode } = effectsRef.current || {};
        if (distortionNode) {
            const makeDistortionCurve = (amount) => {
                const k = amount * 100;
                const samples = 44100;
                const curve = new Float32Array(samples);
                const deg = Math.PI / 180;
                for (let i = 0; i < samples; i++) {
                    const x = (i * 2) / samples - 1;
                    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
                }
                return curve;
            };
            distortionNode.curve = makeDistortionCurve(distortion);
        }
    }, [ready, distortion]);

    return { ready, effectsRef };
}