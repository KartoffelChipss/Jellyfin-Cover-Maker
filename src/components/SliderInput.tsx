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
    decimalPlaces?: number;
    className?: string;
    disabled?: boolean;
}

const SliderInput: FC<SliderInputProps> = ({
    value,
    min,
    max,
    step = 1,
    buttonStep,
    onChange,
    defaultValue,
    showPlusMinusButtons = false,
    displayValue = false,
    displayUnit,
    decimalPlaces = 0,
    className = "",
    disabled = false,
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
        <div
            className={
                "relative flex gap-3 items-center justify-between " + className
            }
        >
            {showPlusMinusButtons && (
                <button
                    className="btn-ghost"
                    onClick={() =>
                        onChange(Math.max(min, value - (buttonStep || step)))
                    }
                    disabled={value <= min}
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
                disabled={disabled}
            />

            {showPlusMinusButtons && (
                <button
                    className="btn-ghost"
                    onClick={() =>
                        onChange(Math.min(max, value + (buttonStep || step)))
                    }
                    disabled={value >= max || disabled}
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
                        {decimalPlaces > 0
                            ? value.toFixed(decimalPlaces)
                            : value}
                        {displayUnit ?? ""}
                    </span>
                </div>
            )}

            {defaultValue && (
                <button
                    className="btn-ghost"
                    onClick={() => onChange(defaultValue)}
                    disabled={value === defaultValue || disabled}
                    title="Reset to default value"
                >
                    <Undo2 />
                </button>
            )}

            {disabled && (
                <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>
            )}
        </div>
    );
};

export default SliderInput;
