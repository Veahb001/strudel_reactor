import react from 'react';

export default function SettingsManager({
    volume,
    reverb,
    onLoadSettings
}) {
    const saveSettings = () => {
        const settings = {
            volume,
            reverb,
            savedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json'});
        const url = URL.createObjectURL (dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'strudel-settings-${Date.now()}.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const loadSettings = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onLoad = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                onLoadSettings(settings);
                alert('Settings loaded successfully!')
            } catch(error) {
                alert('Failed to load settings: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div style = {{ display: 'flex', gap:'10px', marginTop: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={saveSettings}>
            Save Settings
            </button>
            <label className="btn btn-secondary btn-sm">
                Load Settings
                <input type="file" accept=".json" onChange={loadSettings} style= {{ display: 'none'}} />
            </label>
        </div>
    );
}