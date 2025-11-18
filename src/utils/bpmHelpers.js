export function extractBpmFromCode(code) {
    // Try to extract from setcps(140/60/4) or setcps(140/4)
    const setcpsMatch = code.match(/setcps\(([\d.]+)/);
    if (setcpsMatch) {
        return parseFloat(setcpsMatch[1]);
    }

    // Try to extract from setcpm(130/4) or setcpm(130)
    const setcpmMatch = code.match(/setcpm\(([\d.]+)/);
    if (setcpmMatch) {
        return parseFloat(setcpmMatch[1]);
    }

    // Try to extract from .cpm(120)
    const cpmMatch = code.match(/\.cpm\(([\d.]+)\)/);
    if (cpmMatch) {
        return parseFloat(cpmMatch[1]);
    }

    // Default to 120 if nothing found
    return 120;
}

export function applyBpmToCode(code, bpm) {
    let newCode = code;

    // Replace BPM in various formats
    if (newCode.includes('setcps(')) {
        newCode = newCode.replace(/setcps\([\d.]+/g, `setcps(${bpm}`);
    } else if (newCode.includes('setcpm(')) {
        newCode = newCode.replace(/setcpm\([\d.]+/g, `setcpm(${bpm}`);
    } else if (newCode.includes('.cpm(')) {
        newCode = newCode.replace(/\.cpm\([^)]*\)/g, `.cpm(${bpm})`);
    } else if (newCode.includes('.setBpm(')) {
        newCode = newCode.replace(/\.setBpm\([^)]*\)/g, `.cpm(${bpm})`);
    } else {
        newCode = `${newCode}.cpm(${bpm})`;
    }

    return newCode;
}