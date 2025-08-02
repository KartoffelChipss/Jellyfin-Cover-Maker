import { Plus, Undo2 } from "lucide-preact";
import { type FC, useEffect, useRef } from "preact/compat";

interface SliderInputProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    buttonStep?: number;
    onChange: (value: number) => void;
    defaultValue?: number;
    showPlusMinusButtons?: boolean;
    displayValue?: boolean;
    displayUnit?: string;
}

const SliderInput: FC<SliderInputProps> = ({
    value,
    min,
    max,
    step = 1,
    buttonStep = 1,
    onChange,
    defaultValue,
    showPlusMinusButtons = false,
    displayValue = false,
    displayUnit,
}) => {
    const sliderRef = useRef<HTMLInputElement>(null);

    const updateSliderStyle = () => {
        const el = sliderRef.current;
        if (!el) return;

        const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;
        el.style.setProperty("--slider-value", `${percent}%`);
    };

    useEffect(() => {
        updateSliderStyle();
    }, [value, min, max]);

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const newValue = parseFloat(target.value);
        onChange(newValue);
    };

    return (
        <div className="flex gap-3 items-center justify-between">
            {showPlusMinusButtons && (
                <button
                    className="btn-ghost"
                    onClick={() =>
                        onChange(Math.max(min, value - (buttonStep || step)))
                    }
                >
                    <Plus />
                </button>
            )}

            <input
                type="range"
                class="input w-full"
                min={min}
                max={max}
                step={step}
                value={value}
                defaultValue={defaultValue}
                onInput={handleInput}
                ref={sliderRef}
            />

            {showPlusMinusButtons && (
                <button
                    className="btn-ghost"
                    onClick={() =>
                        onChange(Math.min(max, value + (buttonStep || step)))
                    }
                >
                    <Plus />
                </button>
            )}

            {displayValue && (
                <div className="text-center relative">
                    <span className="text-md text-muted-foreground font-mono">
                        <span className="opacity-0">
                            {String(max).length > String(value).length
                                ? "0".repeat(
                                      String(max).length - String(value).length
                                  )
                                : ""}
                        </span>
                        {value}
                        {displayUnit ?? ""}
                    </span>
                </div>
            )}

            {defaultValue && (
                <button
                    className="btn-ghost"
                    onClick={() => onChange(defaultValue)}
                    disabled={value === defaultValue}
                    title="Reset to default value"
                >
                    <Undo2 />
                </button>
            )}
        </div>
    );
};

export default SliderInput;
