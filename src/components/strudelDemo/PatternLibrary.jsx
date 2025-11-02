import { useState } from 'react';
import { strudelPresets, getPresetsArray } from './strudelPresets';

export default function PatternLibrary({ onLoadPattern }) {
  const [selectedPreset, setSelectedPreset] = useState('');
  const presets = getPresetsArray();

  const handlePresetChange = (e) => {
    const presetId = e.target.value;
    setSelectedPreset(presetId);
    
    if (presetId && strudelPresets[presetId]) {
      onLoadPattern(strudelPresets[presetId].code);
    }
  };

  const handleClear = () => {
    setSelectedPreset('');
    onLoadPattern('');
  };

  return (
    <div className="pattern-library">
      <div className="preset-selector">
        <label htmlFor="preset-select" className="preset-label">
          Pattern Library:
        </label>
        
        <select 
          id="preset-select"
          className="preset-dropdown"
          value={selectedPreset}
          onChange={handlePresetChange}
        >
          <option value="">-- Select a Preset --</option>
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name} - {preset.description}
            </option>
          ))}
        </select>

        {selectedPreset && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleClear}
            title="Clear and start fresh"
          >
            ✖ Clear
          </button>
        )}
      </div>

      {selectedPreset && strudelPresets[selectedPreset] && (
        <div className="preset-info">
          <span className="preset-badge">{strudelPresets[selectedPreset].category}</span>
          <span className="preset-description">
            {strudelPresets[selectedPreset].description}
          </span>
        </div>
      )}
    </div>
  );
}