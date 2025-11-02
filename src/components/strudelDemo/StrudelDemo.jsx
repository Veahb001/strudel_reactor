import {useState} from 'react';
import WaveformVisualiser from './WaveformVisualiser';
import { useStrudelEditor } from "../../hooks/useStrudelEditor";
import StrudelEditor from "./StrudelEditor";
import ControlPanel from "./ControlPanel";
import RadioControls from "./RadioControls";
import PianorollCanvas from "./PianorollCanvas";
import PatternLibrary from "./PatternLibrary";
import './style.css'

export default function StrudelDemo() {
  const {
    procText,
    setProcText,
    procAndPlay,
    processOnly,
    play,
    stop,
    rollRef,
    editorRef,
    volume,
    setVolume,
    reverb,
    setReverb,
    filterCutoff,
    setFilterCutoff,
  } = useStrudelEditor();

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    play();
    setIsPlaying(true);
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
  };

  const handleProcAndPlay = () => {
    procAndPlay();
    setIsPlaying(true);
  };
  
  const handleLoadPattern = (patternCode) => {
    setProcText(patternCode);
  } 

  return (
    <div>
      <div className="strudel-page container-fluid">
      {/* Top Controls */}
      <div className="row align-items-center top-controls">
          <ControlPanel
            onProcess={processOnly}
            onProcAndPlay={handleProcAndPlay}
            onPlay={handlePlay}
            onStop={handleStop}
            volume={volume}
            onVolumeChange={setVolume}
            reverb={reverb}
            onReverbChange={setReverb}
            filterCutoff={filterCutoff}
            onFilterCutoffChange={setFilterCutoff}
          />
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <PatternLibrary onLoadPattern={handleLoadPattern} />
        </div>
      </div>

        {/* Both Editors Side-by-Side */}
      <div className="row editors-row">
        <div className="col-md-6 editor-col">
          <StrudelEditor
            value={procText}
            onChange={setProcText}
            placeholder="Enter your Strudel pattern code or select a preset above..."
          />
        </div>
        <div className="col-md-6 editor-col">
          <div ref={editorRef} id="editor" className="code-editor" />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <WaveformVisualiser isPlaying={isPlaying} />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <PianorollCanvas rollRef={rollRef} />
        </div>
      </div>

            {/* Bottom radio controls */}
      <div className="row">
        <RadioControls onChange={procAndPlay} />
      </div>
      </div>
    </div>
  );
}