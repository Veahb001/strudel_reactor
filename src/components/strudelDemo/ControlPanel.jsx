export default function ControlPanel({ onProcess, onProcAndPlay, onPlay, onStop, volume, onVolumeChange, reverb, onReverbChange, filterCutoff, onFilterCutoffChange, }) {                   
    return(
        <div className="col-md-4">

            <nav>
                <button id="process" className="btn btn-outline-primary" onClick={onProcess}>Preprocess</button>
                <button id="process_play" className="btn btn-outline-primary" onClick={onProcAndPlay}>Proc & Play</button>
                <br />
                <button id="play" className="btn btn-outline-primary" onClick={onPlay}>Play</button>
                <button id="stop" className="btn btn-outline-primary" onClick={onStop}>Stop</button>
            </nav>
            <div className="mt-3">
                <label className="form-label">Volume</label>
                <input type="range" min="-24" max="6" step="0.5" value={volume} onChange={(e) => onVolumeChange(parseFloat(e.target.value))} className="form-range"/>

            <label className="form-label">Reverb</label>
            <input type="range" min="0" max="1" step="0.05" value={reverb} onChange={(e) => onReverbChange(parseFloat(e.target.value))} className="form-range"/>

            <label className="form-label">Filter Cutoff (Hz)</label>
            <input type="range" min="200" max="20000" step="100" value={filterCutoff} onChange={(e) => onFilterCutoffChange(parseFloat(e.target.value))} className="form-range"/>
            </div>
        </div>
    );
}        