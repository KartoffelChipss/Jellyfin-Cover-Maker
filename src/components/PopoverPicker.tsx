import { HexColorInput, HexColorPicker } from 'react-colorful';

import useClickOutside from '../hooks/useClicksOutside';
import { useCallback, useRef, useState } from 'preact/hooks';
import type { FC } from 'preact/compat';
import { Undo2 } from 'lucide-preact';

interface PopoverPickerProps {
    color: string;
    onChange: (color: string) => void;
    defaultColor: string;
    align?: 'top' | 'bottom';
}

const PopoverPicker: FC<PopoverPickerProps> = ({
    color,
    onChange,
    defaultColor,
    align = 'top',
}) => {
    const popover = useRef<HTMLDivElement>(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className="relative">
            <div
                className="h-8 w-full rounded-md cursor-pointer border border-input border-solid transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => toggle(true)}
            />

            {isOpen && (
                <div
                    className={`absolute flex flex-col items-center right-0 ${
                        align === 'top' ? 'top-11' : 'bottom-11'
                    } rounded-md bg-accent m-0 border border-input border-solid z-20`}
                    ref={popover}
                >
                    <div className="flex items-center w-1000 max-w-52">
                        <HexColorInput
                            className="my-2 rounded-none font-bol focus:outline-none px-3 flex grow max-w-42"
                            color={color}
                            onChange={onChange}
                        />
                        <button className="btn-ghost" onClick={() => onChange(defaultColor)}>
                            <Undo2 />
                        </button>
                    </div>
                    <HexColorPicker
                        color={color}
                        onChange={onChange}
                        className="max-w-48 max-h-48 rounded-t-md pb-2"
                    />
                </div>
            )}
        </div>
    );
};

export default PopoverPicker;
