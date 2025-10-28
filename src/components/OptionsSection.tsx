import { ChevronDown } from 'lucide-preact';
import { useEffect, useRef, useState } from 'preact/hooks';

interface OptionsSectionProps {
    children?: React.ReactNode;
    icon?: React.ReactNode;
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
}

const OptionsSection = ({ children, icon, title, isExpanded, onToggle }: OptionsSectionProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<string>('0px');
    const [allowOverflow, setAllowOverflow] = useState(false);
    const overflowTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '0px');
        }

        if (isExpanded) {
            if (overflowTimerRef.current) {
                clearTimeout(overflowTimerRef.current);
            }
            overflowTimerRef.current = window.setTimeout(() => setAllowOverflow(true), 500);
        } else {
            if (overflowTimerRef.current) {
                clearTimeout(overflowTimerRef.current);
                overflowTimerRef.current = null;
            }
            setAllowOverflow(false);
        }

        return () => {
            if (overflowTimerRef.current) {
                clearTimeout(overflowTimerRef.current);
                overflowTimerRef.current = null;
            }
        };
    }, [isExpanded]);

    return (
        <div>
            <button
                className="flex items-center justify-between w-full hover:cursor-pointer py-3"
                onClick={onToggle}
            >
                <h3 className="flex items-center gap-2 font-semibold">
                    {icon}
                    {title}
                </h3>
                <div
                    className={`transition-transform duration-300 transform ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                >
                    <ChevronDown />
                </div>
            </button>

            <div
                ref={contentRef}
                style={{
                    maxHeight: height,
                    transition: 'max-height 0.3s ease',
                    /* allow popovers (like color pickers) to escape only after a short delay */
                    overflow: allowOverflow ? 'visible' : 'hidden',
                    zIndex: allowOverflow ? 50 : undefined,
                }}
                className="px-1 flex flex-col gap-3"
            >
                {children}
            </div>
        </div>
    );
};

export default OptionsSection;
