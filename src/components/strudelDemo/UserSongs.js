import React, { useState, useEffect } from 'react';

export default function UserSongs({
    currentPattern,
    currentSettings,
    onLoadSong
}) {
    const [songs, setSongs] = useState([]);
    const [songName, setSongName] = useState('');
    const [selectedSong, setSelectedSong] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    // Load songs from localStorage
    useEffect(() => {
        loadSongsFromStorage();
    }, []);

    const loadSongsFromStorage = () => {
        try {
            const stored = localStorage.getItem('userStrudelSongs');
            if (stored) {
                setSongs(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load songs:', error);
        }
    };

    const saveSongsToStorage = (newSongs) => {
        try {
            localStorage.setItem('userStrudelSongs', JSON.stringify(newSongs));
            setSongs(newSongs);
        } catch (error) {
            console.error('Failed to save songs:', error);
            alert('Failed to save song: ' + error.message);
        }
    };

    const handleSaveSong = () => {
        if (!songName.trim()) {
            alert('Please enter a song name');
            return;
        }

        if (!currentPattern || currentPattern.trim() === '') {
            alert('Cannot save an empty song');
            return;
        }

        const newSong = {
            id: Date.now(),
            name: songName.trim(),
            pattern: currentPattern,
            settings: currentSettings,
            createdAt: new Date().toISOString()
        };

        const updatedSongs = [...songs, newSong];
        saveSongsToStorage(updatedSongs);
        setSongName('');
        setShowSaveDialog(false);
        alert('Song saved successfully!');
    };

    const handleSongSelect = (e) => {
        const songId = e.target.value;
        setSelectedSong(songId);

        if (songId) {
            const song = songs.find(s => s.id === parseInt(songId));
            if (song) {
                onLoadSong(song.pattern, song.settings);
            }
        }
    };

    const handleClearSelection = () => {
        setSelectedSong('');
    };

    const handleDeleteSelected = () => {
        if (!selectedSong) {
            alert('Please select a song to delete');
            return;
        }

        if (window.confirm('Are you sure you want to delete this song?')) {
            const updatedSongs = songs.filter(s => s.id !== parseInt(selectedSong));
            saveSongsToStorage(updatedSongs);
            setSelectedSong('');
        }
    };

    const handleExportSelected = () => {
        if (!selectedSong) {
            alert('Please select a song to export');
            return;
        }

        const song = songs.find(s => s.id === parseInt(selectedSong));
        if (song) {
            const dataStr = JSON.stringify(song, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${song.name.replace(/\s+/g, '-')}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleExportAllSongs = () => {
        const dataStr = JSON.stringify(songs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my-strudel-songs-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImportSongs = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);

                if (Array.isArray(imported)) {
                    const mergedSongs = [...songs, ...imported];
                    saveSongsToStorage(mergedSongs);
                    alert(`Imported ${imported.length} songs!`);
                } else if (imported.pattern && imported.name) {
                    const mergedSongs = [...songs, imported];
                    saveSongsToStorage(mergedSongs);
                    alert(`Imported song: ${imported.name}`);
                } else {
                    alert('Invalid song file format');
                }
            } catch (error) {
                alert('Failed to import songs: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div className="user-songs">
            <h5>Custom Songs</h5>

            <div className="song-controls">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowSaveDialog(!showSaveDialog)}
                >
                    Save Current Song
                </button>

                <button
                    className="btn btn-success btn-sm"
                    onClick={handleExportAllSongs}
                    disabled={songs.length === 0}
                >
                    Export All
                </button>

                <label className="btn btn-info btn-sm">
                    Import
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImportSongs}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            {showSaveDialog && (
                <div className="save-song-dialog">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Enter song name..."
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveSong()}
                    />
                    <button
                        className="btn btn-sm btn-success"
                        onClick={handleSaveSong}
                    >
                        Save
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowSaveDialog(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div className="song-selector">
                <label htmlFor="song-select" className="song-label">
                    Load Saved Song:
                </label>

                <select
                    id="song-select"
                    className="song-dropdown"
                    value={selectedSong}
                    onChange={handleSongSelect}
                >
                    <option value="">-- Select a Song --</option>
                    {songs.map(song => (
                        <option key={song.id} value={song.id}>
                            {song.name} ({new Date(song.createdAt).toLocaleDateString()})
                        </option>
                    ))}
                </select>

                {selectedSong && (
                    <div className="song-actions-inline">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleClearSelection}
                            title="Clear selection"
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-info btn-sm"
                            onClick={handleExportSelected}
                            title="Export this song"
                        >
                            Export
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={handleDeleteSelected}
                            title="Delete this song"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {selectedSong && songs.find(s => s.id === parseInt(selectedSong)) && (
                <div className="song-info-display">
                    <span className="song-detail">
                        BPM: {songs.find(s => s.id === parseInt(selectedSong)).settings?.bpm || 'N/A'}
                    </span>
                    <span className="song-detail">
                        Volume: {songs.find(s => s.id === parseInt(selectedSong)).settings?.volume || 'N/A'}dB
                    </span>
                    <span className="song-detail">
                        Reverb: {((songs.find(s => s.id === parseInt(selectedSong)).settings?.reverb || 0) * 100).toFixed(0)}%
                    </span>
                    <span className="song-detail">
                        Delay: {((songs.find(s => s.id === parseInt(selectedSong)).settings?.delay || 0) * 100).toFixed(0)}%
                    </span>
                    <span className="song-detail">
                        Distortion: {((songs.find(s => s.id === parseInt(selectedSong)).settings?.distortion || 0) * 100).toFixed(0)}%
                    </span>
                </div>
            )}

            {songs.length === 0 && (
                <p className="text-muted">No saved songs yet</p>
            )}
        </div>
    );
}