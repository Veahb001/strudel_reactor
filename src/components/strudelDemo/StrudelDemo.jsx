import { useStrudelEditor } from "../../hooks/useStrudelEditor";
import StrudelEditor from "./StrudelEditor";
import ControlPanel from "./ControlPanel";
import RadioControls from "./RadioControls";
import PianorollCanvas from "./PianorollCanvas";
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

  return (
    <div>
      <h2>Strudel Demo</h2>
      <main className="container-fluid">
        <div className="row">
          <StrudelEditor value={procText} onChange={setProcText} />
          <ControlPanel
            onProcess={processOnly}
            onProcAndPlay={procAndPlay}
            onPlay={play}
            onStop={stop}
            volume={volume}
            onVolumeChange={setVolume}
            reverb={reverb}
            onReverbChange={setReverb}
            filterCutoff={filterCutoff}
            onFilterCutoffChange={setFilterCutoff}
          />
        </div>
        <div className="row">
          <div className="col-md-8">
            <div ref={editorRef} id="editor" />
            <div id="output" />
          </div>
          <RadioControls onChange={procAndPlay} />
        </div>
        <PianorollCanvas rollRef={rollRef} />
      </main>
    </div>
  );
}