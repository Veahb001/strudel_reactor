import React from 'react';
import './AnimatedVisual.css';

export default function AnimatedVisual({ isPlaying, bpm }) {
    return (
        <div className="animated-visual-container">
            {isPlaying ? (
                <img
                    src="/spinning-cat.gif"
                    alt="spinning cat"
                    className="animated-gif"
                />
            ) : (
                <img
                    src="/cat-static.png"
                    alt="cat"
                    className="animated-gif stopped"
                />
            )}
            <div className="bpm-display">BPM: {bpm}</div>
        </div>
    );
}