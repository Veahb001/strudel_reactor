import { initAudioOnFirstClick, getAudioContext, webaudioOutput } from "@strudel/webaudio";

/**
 * Initialize audio context and return it
 * @returns {Promise<AudioContext|null>}
 */
export async function initializeAudioContext() {
    await initAudioOnFirstClick();
    const ctx = getAudioContext();

    if (!ctx) {
        console.warn('Audio context not available');
        return null;
    }

    return ctx;
}

/**
 * Create and connect audio gain node
 * @param {AudioContext} ctx 
 * @param {number} volumeDb - Volume in decibels
 * @returns {GainNode|null}
 */
export function createGainNode(ctx, volumeDb) {
    if (!ctx) return null;

    const gainNode = ctx.createGain();
    gainNode.gain.value = Math.pow(10, volumeDb / 20);

    return gainNode;
}

/**
 * Connect audio nodes in chain: source -> gain -> destination
 * @param {AudioContext} ctx
 * @param {GainNode} gainNode
 * @returns {boolean} - Success status
 */
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

/**
 * Disconnect and cleanup audio nodes
 * @param {GainNode} gainNode
 */
export function disconnectAudioChain(gainNode) {
    try {
        if (gainNode) gainNode.disconnect();
        if (webaudioOutput?.node) webaudioOutput.node.disconnect();
    } catch (err) {
        console.warn("Audio cleanup error:", err);
    }
}

/**
 * Update volume smoothly
 * @param {GainNode} gainNode
 * @param {number} volumeDb - New volume in decibels
 */
export function updateVolume(gainNode, volumeDb) {
    if (!gainNode) return;

    const ctx = getAudioContext();
    const gainValue = Math.pow(10, volumeDb / 20);
    gainNode.gain.setTargetAtTime(gainValue, ctx.currentTime, 0.05);
}