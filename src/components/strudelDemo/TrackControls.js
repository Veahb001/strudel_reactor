import React from 'react';

export default function TrackControls({ mutedTracks, onToggleMute }) {
    const tracks = [
        { id: 'drums', label: 'Drums', color: '#ff6b6b' },
        { id: 'drums2', label: 'Percussion', color: '#4ecdc4' },
        { id: 'bassline', label: 'Bass', color: '#45b7d1' },
        { id: 'main_arp', label: 'Arpeggiator', color: '#96ceb4' }
    ];

    return (
        <div className="track-controls">
            <h5>Track Controls</h5>
            <div className="track-list">
                {tracks.map(track => (
                    <label key={track.id} className="track-item">
                        <input
                            type="checkbox"
                            checked={mutedTracks.includes(track.id)}
                            onChange={(e) => onToggleMute(track.id, e.target.checked)}
                        />
                        <span className="track-label" style={{ borderLeft: `4px solid ${track.color}` }}>
                            {track.label}
                        </span>
                        <span className="track-status">
                            {mutedTracks.includes(track.id) ? '🔇 Muted' : '🔊 Playing'}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}