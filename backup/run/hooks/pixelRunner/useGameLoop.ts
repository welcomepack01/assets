
import { useEffect, useRef, useCallback } from 'react';

export const useGameLoop = (
    isRunning: boolean, 
    onUpdate: (time: number, delta: number) => void
) => {
    const frameId = useRef(0);
    const lastTime = useRef(0);

    const loop = useCallback((time: number) => {
        if (!isRunning) return;

        // Calculate delta
        const delta = (time - lastTime.current) / 1000 || 0;
        lastTime.current = time;

        // Cap delta to prevent huge jumps if tab was inactive
        const safeDelta = Math.min(delta, 0.1);

        onUpdate(time, safeDelta);

        frameId.current = requestAnimationFrame(loop);
    }, [isRunning, onUpdate]);

    useEffect(() => {
        if (isRunning) {
            lastTime.current = performance.now();
            frameId.current = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(frameId.current);
        }

        return () => cancelAnimationFrame(frameId.current);
    }, [isRunning, loop]);
};
