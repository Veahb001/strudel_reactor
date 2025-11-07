export default function ControlPanel({ 
  onProcess, 
  onProcAndPlay, 
  onPlay, 
  onStop,
//   onPause, 
  volume, 
  onVolumeChange, 
  reverb, 
  onReverbChange, 
  filterCutoff, 
  onFilterCutoffChange 
}) {                   
    return(
        <div className="control-panel-wrapper">
            {/* Buttons Section */}
            <div className="control-buttons">
                <button id="play" className="btn btn-outline-primary" onClick={onPlay}>▶</button>
                {/* <button id="stop" className="btn btn-outline-primary" onClick={onPause}>❚❚</button> */}
                <button id="stop" className="btn btn-outline-primary" onClick={onStop}>⏹</button>
                <br/>
                <button id="process" className="btn btn-outline-primary" onClick={onProcess}>Preprocess</button>
                <button id="process_play" className="btn btn-outline-primary" onClick={onProcAndPlay}>Proc & Play</button>
            </div>

            <div className="control-sliders">
                <div className="slider-group">
                    <label className="form-label">Volume: {volume} dB</label>
                    <input 
                        type="range" 
                        min="-30" 
                        max="6" 
                        step="1" 
                        value={volume} 
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))} 
                        className="form-range"
                    />
                </div>

                <div className="slider-group">
                    <label className="form-label">Reverb: {reverb.toFixed(2)}</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={reverb} 
                        onChange={(e) => onReverbChange(parseFloat(e.target.value))} 
                        className="form-range"
                    />
                </div>

                <div className="slider-group">
                    <label className="form-label">Filter Cutoff: {filterCutoff} Hz</label>
                    <input 
                        type="range" 
                        min="500" 
                        max="20000" 
                        step="100" 
                        value={filterCutoff} 
                        onChange={(e) => onFilterCutoffChange(parseFloat(e.target.value))} 
                        className="form-range"
                    />
                </div>
            </div>
        </div>
    );
}