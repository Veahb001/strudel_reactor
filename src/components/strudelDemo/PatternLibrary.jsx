//LOAD FROM JSON
// import { useEffect, useState } from "react";

// export default function PatternLibrary({ onLoadPattern }) {
//   const [presets, setPresets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadPresets() {
//       try {
//         const presetFiles = ["basicrock.json"];

//         const loadedPresets = await Promise.all(
//           presetFiles.map(async (file) => {
//             const res = await fetch(`/presets/${file}`);
//             return res.json();
//           })
//         );

//         setPresets(loadedPresets);
//       } catch (err) {
//         console.error("Error loading presets:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadPresets();
//   }, []);

//   if (loading) {
//     return <div className="pattern-library">Loading presets...</div>;
//   }

//   return (
//     <div className="pattern-library">
//       <h5>Pattern Library</h5>
//       <ul className="preset-list">
//         {presets.map((preset, i) => (
//           <li key={i} className="preset-item">
//             <select 
//               id="preset-select"
//               className="preset-dropdown"
//               value={selectedPreset}
//               onChange={handlePresetChange}
//             >
//               <option value="">-- Select a Preset --</option>
//               {presets.map(preset => (
//                 <option key={preset.id} value={preset.id}>
//                   {preset.name} - {preset.description}
//                 </option>
//               ))}
//             </select>
//             <strong>{preset.name}</strong> — {preset.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



// LOAD FROM JSX 
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
            X Clear
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