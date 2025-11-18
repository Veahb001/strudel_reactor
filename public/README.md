# Strudel React Preprocessor

A React-based frontend for Strudel.cc live coding music platform with real-time preprocessing, BPM control, JSON persistence, and live visualizations.

## Video Demonstration

[Insert link to your demonstration video here]

## Controls & Features

### Playback Controls
- **▶ Play** - Plays the current pattern without reprocessing
- **⏹ Stop** - Stops playback immediately
- **Preprocess** - Processes the pattern code (applies BPM preprocessing) without starting playback
- **Proc & Play** - Processes the pattern and immediately starts playback

### Keyboard Shortcuts
- **Spacebar** - Toggle play/pause (works when not typing in text fields)
- **Enter** - Stop current playback, process, and play (works when not typing in text fields)

### Audio Controls

#### Volume Slider
- Controls master output volume
- Range: -30dB to +6dB
- Updates in real-time without stopping playback
- Default: -6dB

#### BPM Slider
- Controls song tempo/speed
- Range: 40 BPM to 240 BPM
- **Note:** Changing BPM will restart the song as the pattern must be reprocessed
- Default: 120 BPM

### Pattern Library
- **Dropdown selector** with three pre-made patterns:
  - **Basic Beat** - Simple drum pattern for testing
  - **Melodic Sequence** - Simple melody with bass
  - **Complex Rhythm** - Polyrhythmic pattern demonstrating advanced features
- **Clear button** - Resets editor to empty state
- **Instant loading** - Selected pattern immediately loads into left editor
- Displays category badge and description for selected preset

### My Songs (User Presets)

#### Saving Songs
- ** Save Current Song** button opens dialog
- Enter a name for your song
- Saves both the pattern code AND current settings (volume, BPM)
- Songs stored in browser localStorage
- Persists between sessions

#### Loading Songs
- **Dropdown selector** shows all saved songs with creation date
- **Load** - Instantly loads song code and restores all saved settings
- ** Export** - Downloads individual song as JSON file
- ** Delete** - Removes song from saved list (with confirmation)
- Shows song metadata (BPM, Volume) when selected

#### Import/Export
- ** Export All** - Downloads all saved songs as single JSON file
- ** Import** - Upload JSON file to import songs
- Supports both single songs and collections
- Perfect for sharing songs with others or backing up your work

### Dual Editor View

#### Left Editor (Preprocessing Input)
- **Textarea** where you write or edit Strudel code
- Code entered here gets preprocessed before execution
- BPM values inserted automatically
- Full monospace font for readability

#### Right Editor (Strudel Output)
- **Live Strudel REPL** - shows final processed code
- This is what actually executes
- Read-only view of preprocessed result
- Updates when you press Preprocess or Proc & Play

### Visualizations

#### Animated Visual (Top Left)
- Cat GIF animation
- Only plays when music is playing
- Provides visual feedback of playback state

#### D3 Bar Chart
- Real-time visualization of audio data
- Shows last 20 "hap" (Happening) events from Strudel
- Extracts and displays gain values
- Color-coded bars (gradient from purple to pink)
- Updates continuously while playing
- Shows total events captured

#### Piano Roll Canvas
- Visual representation of notes being played
- Scrolls horizontally as song progresses
- Shows pitch (vertical) and timing (horizontal)
- Different colors for different instruments

## Known Issues & Quirks

### BPM Processing
When you change the BPM slider, the song will automatically stop and restart with the new tempo. This is necessary because Strudel patterns must be reprocessed to apply the new BPM value. The same applies when using "Proc & Play".

### Browser Compatibility
This application works best in **Chrome** or **Edge** browsers. Firefox may experience audio initialization issues due to Web Audio API differences.

### First Click Audio
Due to browser autoplay policies, you must interact with the page (click any button) before audio will work. The first time you press Play, there may be a brief delay as the audio context initializes.

### LocalStorage Limitations
Saved songs are stored in browser localStorage, which has size limitations (typically 5-10MB). If you save many large songs, you may need to export and clear some to make room.

### D3 Graph Data Source
The D3 bar chart requires the `.log()` method to be active in your Strudel code. The default song has this enabled. If you write custom songs, add `all(x => x.log())` at the end to enable visualization.

## Song Attribution

### Default Song
The default song loaded on startup is a remix of **Algorave Dave's** Stranger Things theme.
- Original performance: https://www.youtube.com/watch?v=ZCcpWzhekEY
- Remixed and adapted for this project
- Uses Strudel.cc syntax and sound libraries

### Pattern Library Songs
All patterns in the Pattern Library dropdown are original compositions created for this project to demonstrate different features of Strudel:
- Basic Beat: Demonstrates simple drum patterns
- Melodic Sequence: Shows melody and bass integration  
- Complex Rhythm: Showcases polyrhythmic capabilities

## AI Usage

### Claude AI (Anthropic)
AI assistance was used to help organize and restructure the project's CSS stylesheet.

**Specific usage:**
- **Task:** Reorganize style.css into logical sections with clear comments
- **Input prompt:** "Help me cleanup my code, and help me organise my code as well starting with style.css and making sure theres only styles i need in there and they are organised in groups"
- **Output:** Reorganized CSS file with clear section headers:
  - Base Styles
  - Header
  - Control Panel  
  - Editors
  - Pattern Library
  - User Songs
  - D3 Visualization
  - Piano Roll Canvas
  - Buttons & Utilities
  - Responsive Design
- **Modification:** Minor adjustments to spacing and removed unused duplicate styles

All code was reviewed, tested, and integrated manually into the project. The AI-suggested structure improved code maintainability and readability.

## Technologies Used

- **React 18** - Component framework
- **D3.js** - Data visualization
- **Bootstrap 5** - UI components and styling
- **Strudel.cc** (npm package) - Live coding music engine
- **Web Audio API** - Audio processing and effects
- **LocalStorage API** - Client-side data persistence

## Installation & Running
```bash
# Install dependencies
npm install

# Start development server
npm start
```

Application will open at http://localhost:3000

## Project Structure
```
src/
├── components/
│   └── strudelDemo/
│       ├── StrudelDemo.jsx          # Main component
│       ├── ControlPanel.jsx         # Playback & audio controls
│       ├── UserSongs.jsx            # Save/load functionality
│       ├── PatternLibrary.jsx       # Preset patterns
│       ├── D3BarChart.jsx           # Real-time visualization
│       ├── AnimatedVisual.jsx       # Playback indicator
│       ├── PianorollCanvas.jsx      # Note visualization
│       ├── StrudelEditor.jsx        # Left editor (input)
│       ├── strudelPresets.js        # Pattern library data
│       └── style.css                # All styles
├── hooks/
│   ├── useStrudelEditor.js          # Main state management
│   ├── useBpmProcessor.js           # BPM preprocessing logic
│   ├── useHapDataCapture.js         # Audio data capture
│   └── useStrudelInstance.js        # Strudel initialization
└── utils/
    ├── strudelProcessor.js          # Pattern preprocessing
    ├── bpmHelpers.js                # BPM calculation
    ├── console-monkey-patch.js      # Log data capture
    ├── tunes.js                     # Default song
    └── audioSetup.js                # Web Audio setup
```

## Component Hierarchy
```
StrudelDemo (main)
├── AnimatedVisual
├── ControlPanel
│   ├── Playback Buttons
│   └── Sliders (Volume, BPM)
├── PatternLibrary
│   └── Preset Dropdown
├── UserSongs
│   ├── Save Dialog
│   ├── Song Dropdown
│   └── Import/Export Buttons
├── StrudelEditor (left - input)
├── Strudel REPL (right - output)
├── D3BarChart
└── PianorollCanvas
```

## Key React Concepts Used

- **Custom Hooks** - Logic separation (useStrudelEditor, useBpmProcessor)
- **useEffect** - Side effects (audio setup, keyboard listeners)
- **useRef** - Direct DOM access (canvas, editor instances)
- **useState** - Component state management
- **Props drilling** - Parent-to-child communication
- **Callback functions** - Child-to-parent communication
- **Component composition** - Modular, reusable components

## Bootstrap Components Used

1. **Buttons** - All playback controls, save/export buttons
2. **Dropdown selects** - Pattern Library, User Songs
3. **Range sliders** - Volume and BPM controls
4. **Text inputs** - Save song name dialog
5. **File inputs** - JSON import functionality

This meets the requirement of 5+ different Bootstrap component types.

## JSON Feature Implementation

### Saving Songs
```javascript
{
  "id": 1637012345678,
  "name": "My Awesome Beat",
  "pattern": "s(\"bd sd, hh*4\").speed(1)",
  "settings": {
    "volume": -6,
    "bpm": 140
  },
  "createdAt": "2024-11-18T12:34:56.789Z"
}
```

### Functionality
- **Write JSON:** Songs saved to localStorage as stringified JSON
- **Read JSON:** Parse JSON on load to restore songs
- **Export JSON:** Blob API creates downloadable .json files
- **Import JSON:** FileReader API parses uploaded JSON files
- **Data validation:** Checks for required fields (pattern, name)

## D3 Feature Implementation

### Data Source
Strudel's `.log()` method outputs "hap" (Happening) events to console. A monkey-patched console.log captures these in an array (max 100 items).

### Visualization
- **Chart type:** Vertical bar chart
- **X-axis:** Hap index (last 20 events shown)
- **Y-axis:** Gain value (0-1)
- **Update frequency:** Real-time (updates as new data arrives)
- **Color scheme:** Sequential gradient (purple to pink)
- **Interactive:** Shows event count

### D3 APIs Used
- `d3.select()` - DOM selection
- `d3.scaleBand()` - X-axis scaling
- `d3.scaleLinear()` - Y-axis scaling
- `d3.scaleSequential()` - Color interpolation
- `d3.axisBottom()` / `d3.axisLeft()` - Axis generation
- Dynamic data binding with `.data()`, `.enter()`, `.append()`

## Future Improvements

- Add audio effect sliders (reverb, delay, distortion) with proper Web Audio integration
- Implement cloud storage for song sharing
- Add collaborative editing features
- Mobile-responsive touch controls
- MIDI device input support
- Waveform audio visualization
- Song tempo tap feature
- Hotkey customization

---