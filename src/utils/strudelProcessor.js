export function processText(input, mutedTracks = []) {
    let processed = input;
    mutedTracks.forEach(trackId => {
        const trackPattern = new RegExp(`(${trackId}:[^\\n]*?)(?=\\n|$)`, 'g');
        processed = processed.replace(trackPattern, (match) => {
            if (match.includes('.gain(')) {
                return match.replace(/\.gain\([^)]*\)/, '.gain(0)');
            }
            return match + '.gain(0)';
        });
    });

    return processed;
}