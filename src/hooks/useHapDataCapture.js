import { useCallback } from "react";

export function useHapDataCapture() {
    const captureHapData = useCallback((haps) => {
        try {
            if (haps && haps.length > 0) {
                const latestHap = haps[0];
                const gain = latestHap.value?.gain ?? 0.5;

                if (!window.strudelHapData) {
                    window.strudelHapData = [];
                }

                window.strudelHapData.push(gain);

                if (window.strudelHapData.length > 100) {
                    window.strudelHapData.shift();
                }

                const event = new CustomEvent("strudelHapData", {
                    detail: [...window.strudelHapData]
                });
                document.dispatchEvent(event);
            }
        } catch (err) {
            console.warn('Hap capture error:', err);
        }
    }, []);

    return { captureHapData };
}