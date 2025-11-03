import { useEffect, useRef, useState } from 'react';
import { getAudioContext, webaudioOutput } from '@strudel/webaudio';

export default function WaveformVisualiser({ isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size (high DPI support)
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Try to create and connect analyser
    const setupAnalyser = () => {
      const audioContext = getAudioContext();
      if (!audioContext) return null;

      if (!analyserRef.current) {
        try {
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 4096;
          analyser.smoothingTimeConstant = 0.85;
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;

          // Try to tap into Strudel's audio output
          if (webaudioOutput?.node) {
            const splitter = audioContext.createGain();
            splitter.gain.value = 1.0;
            
            // Insert analyser into the chain
            webaudioOutput.node.connect(splitter);
            splitter.connect(analyser);
            analyser.connect(audioContext.destination);
            
            analyserRef.current = analyser;
            setIsConnected(true);
            console.log('Waveform visualiser connected');
          }
        } catch (error) {
          console.warn('Could not connect waveform analyser:', error);
        }
      }
      return analyserRef.current;
    };

    const analyser = setupAnalyser();
    
    if (!analyser) {
      // Draw "waiting" state
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#555';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for audio...', width / 2, height / 2);
      
      window.removeEventListener('resize', resizeCanvas);
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Get audio data
      analyser.getByteTimeDomainData(timeData);
      analyser.getByteFrequencyData(freqData);

      // Clear with dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Draw frequency spectrum (background)
      if (isPlaying) {
        const barCount = 64;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor(i * bufferLength / barCount);
          const barHeight = (freqData[dataIndex] / 255) * height * 0.8;
          
          // Create gradient
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, 'rgba(0, 123, 255, 0.2)');
          gradient.addColorStop(0.5, 'rgba(0, 180, 255, 0.4)');
          gradient.addColorStop(1, 'rgba(0, 255, 136, 0.6)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
        }
      }

      // Draw waveform
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isPlaying ? '#00ff88' : '#555555';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Draw center line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 1; i < 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying]);

  return (
    <div className="waveform-visualiser">
      <div className="visualiser-header">
        <h5>
          Audio Waveform 
          <br/>
          {isPlaying && <span className="live-indicator">LIVE</span>}
          {!isPlaying && <span className="status-indicator">Not Connected</span>}
        </h5>
      </div>
      {/* <canvas 
        ref={canvasRef} 
        className="waveform-canvas"
      /> */}
    </div>
  );
}