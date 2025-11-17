import { useEffect, useRef, useState } from "react";
import {
    initializeAudioContext,
    createGainNode,
    connectAudioChain,
    disconnectAudioChain,
    updateVolume
} from "../utils/audioSetup";

export function useAudioEffects(volume) {
    const [ready, setReady] = useState(false);
    const effectsRef = useRef({ gain: null });

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
            const success = connectAudioChain(ctx, gainNode);

            if (success) {
                effectsRef.current = { gain: gainNode };
                setReady(true);
                console.log('Audio nodes ready');
            }
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

        const { gain } = effectsRef.current || {};
        updateVolume(gain, volume);
    }, [ready, volume]);

    return { ready, effectsRef };
}