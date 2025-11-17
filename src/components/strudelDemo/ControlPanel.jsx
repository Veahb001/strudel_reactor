import SettingsManager from "./settingsManager";

export default function ControlPanel({ 
  onProcess, 
  onProcAndPlay, 
  onPlay, 
  onStop,
  volume, 
  onVolumeChange,  
  handleLoadSettings,
  bpm,
  onBpmChange
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
                    <label className="form-label">BPM: {bpm}</label>
                    <input 
                        type="range" 
                        min="40" 
                        max="240" 
                        step="1" 
                        value={bpm} 
                        onChange={(e) => onBpmChange(parseFloat(e.target.value))} 
                    />
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-md-12">
                    <SettingsManager
                    onLoadSettings={handleLoadSettings}
                    />
                </div>
            </div>
        </div>
    );
}