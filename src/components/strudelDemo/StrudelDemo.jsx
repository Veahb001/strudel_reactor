import * as d3 from 'd3';
import {useEffect, useState} from 'react';
import WaveformVisualiser from './WaveformVisualiser';
import { useStrudelEditor } from "../../hooks/useStrudelEditor";
import StrudelEditor from "./StrudelEditor";
import ControlPanel from "./ControlPanel";
import RadioControls from "./RadioControls";
import PianorollCanvas from "./PianorollCanvas";
import PatternLibrary from "./PatternLibrary";
import SettingsManager from './settingsManager';
import './style.css'
import AnimatedVisual from './AnimatedVisual';
import D3BarChart from './D3BarChart';
import UserSongs from './UserSongs';

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
    onVolumeChange,
    setVolume,
    bpm,
    setBpm,
  } = useStrudelEditor();

  const [isPlaying, setIsPlaying] = useState(false);
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.strudelLog && window.strudelLog.length > 0) {
        setLogData([...window.strudelLog].slice(-100));
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

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

  const handleLoadSettings = (settings) => {
    if (settings.volume !== undefined) setVolume(settings.volume);
    if (settings.reverb !== undefined) setVolume(settings.reverb);
    };

    const handleBpmChange = (newBpm) => {
        setBpm(newBpm);
        setTimeout(() => {
            procAndPlay();
        }, 100);
    };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName =='TEXTAREA') {
        return;
      } 
      
      //When spacebar pressed pause and play music
      if (event.code === 'Space') {
          if (isPlaying) {
            handleStop();
            event.preventDefault();
          }else{
            handlePlay();
            event.preventDefault();
          }
        }
      
      //When Enter pressed proc and play music
      if (event.code === 'Enter'){
        event.preventDefault();
        handleStop();
        handleProcAndPlay();
      }
  };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      };
  }, [isPlaying]);

    const handleLoadSong = (pattern, settings) => {
        setProcText(pattern);

        if (settings) {
            if (settings.volume !== undefined) setVolume(settings.volume);
            if (settings.bpm !== undefined) setBpm(settings.bpm);
        }
    };

  return (
    <div>
      <div className="strudel-page container-fluid">
      <div>
        <h1>
          Strudel Editor
        </h1>
      </div>
      {/* Top Controls */}
        <div className="row align-items-start top-controls">
            <div className="col-md-4">
                <AnimatedVisual isPlaying={isPlaying} bpm={bpm} />
            </div>
            <div className="col-md-8">
                <ControlPanel
                    onProcess={processOnly}
                    onProcAndPlay={handleProcAndPlay}
                    onPlay={handlePlay}
                    onStop={handleStop}
                    volume={volume}
                    onVolumeChange={setVolume}
                    bpm={bpm}
                    onBpmChange={handleBpmChange}
                />
            </div>
        </div>

      {/* Radio controls */}
      <div className="row align-items-center radio-controls">
        <RadioControls onChange={procAndPlay} />
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <PatternLibrary onLoadPattern={handleLoadPattern} />
        </div>
              </div>

      <div className="row mt-3">
          <div className="col-md-12">
              <UserSongs
                  currentPattern={procText}
                  currentSettings={{ volume, bpm }}
                  onLoadSong={handleLoadSong}
              />
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
          <D3BarChart/>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <PianorollCanvas rollRef={rollRef} />
        </div>
      </div>

      </div>
    </div>
  );
}