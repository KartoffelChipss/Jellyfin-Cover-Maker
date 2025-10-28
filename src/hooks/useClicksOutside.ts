import { useEffect } from 'preact/hooks';
import type { RefObject } from 'preact';

type EventHandler = (event: MouseEvent | TouchEvent) => void;

const useClickOutside = <T extends HTMLElement>(ref: RefObject<T>, handler: EventHandler): void => {
    useEffect(() => {
        let startedInside = false;
        let startedWhenMounted = false;

        const validateEventStart = (event: MouseEvent | TouchEvent) => {
            startedWhenMounted = !!ref.current;
            startedInside = !!ref.current && ref.current.contains(event.target as Node);
        };

        const listener = (event: MouseEvent | TouchEvent) => {
            if (startedInside || !startedWhenMounted) return;
            if (!ref.current || ref.current.contains(event.target as Node)) return;

            handler(event);
        };

        document.addEventListener('mousedown', validateEventStart);
        document.addEventListener('touchstart', validateEventStart);
        document.addEventListener('click', listener);

        return () => {
            document.removeEventListener('mousedown', validateEventStart);
            document.removeEventListener('touchstart', validateEventStart);
            document.removeEventListener('click', listener);
        };
    }, [ref, handler]);
};

export default useClickOutside;
