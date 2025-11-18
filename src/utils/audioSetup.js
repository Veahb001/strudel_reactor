import { initAudioOnFirstClick, getAudioContext, webaudioOutput } from "@strudel/webaudio";

export async function initializeAudioContext() {
    await initAudioOnFirstClick();
    const ctx = getAudioContext();

    if (!ctx) {
        console.warn('Audio context not available');
        return null;
    }

    return ctx;
}

export function createGainNode(ctx, volumeDb) {
    if (!ctx) return null;

    const gainNode = ctx.createGain();
    gainNode.gain.value = Math.pow(10, volumeDb / 20);

    return gainNode;
}

export function connectAudioChain(ctx, gainNode) {
    const output = webaudioOutput?.node;

    if (!output) {
        console.warn("Strudel output node not found");
        return false;
    }

    try {
        output.disconnect();
    } catch (_) {
        // Ignore disconnect errors
    }

    output.connect(gainNode);
    gainNode.connect(ctx.destination);

    return true;
}

export function disconnectAudioChain(gainNode) {
    try {
        if (gainNode) gainNode.disconnect();
        if (webaudioOutput?.node) webaudioOutput.node.disconnect();
    } catch (err) {
        console.warn("Audio cleanup error:", err);
    }
}

export function updateVolume(gainNode, volumeDb) {
    if (!gainNode) return;

    const ctx = getAudioContext();
    const gainValue = Math.pow(10, volumeDb / 20);
    gainNode.gain.setTargetAtTime(gainValue, ctx.currentTime, 0.05);
}