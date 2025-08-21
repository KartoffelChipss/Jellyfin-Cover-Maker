import type { FC } from "preact/compat";
import FileInput from "./FileInput";
import ImageTypeSelect from "./ImageTypeSelect";
import SliderInput from "./SliderInput";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Download,
} from "lucide-preact";
import PopoverPicker from "./PopoverPicker";
import type { TextAlign, TextBaseLine } from "../app";
import FontOptions from "./FontOptions";
import BasleineTop from "./icons/BaselineTop";
import BaselineBottom from "./icons/BaselineBottom";

interface OptionsDisplayProps {
    title: string;
    setTitle: (title: string) => void;
    setImage: (image: Event) => void;
    textSize: number;
    setTextSize: (size: number) => void;
    bgDim: number;
    setBgDim: (dim: number) => void;
    imageType: "cover" | "poster";
    setImageType: (type: "cover" | "poster") => void;
    downloadImage: () => void;
    defaultFontSize: number;
    defaultBgDim: number;
    font: string;
    setFont: (font: string) => void;
    textColor: string;
    setTextColor: (color: string) => void;
    dimColor: string;
    setDimColor: (color: string) => void;
    textAlign: TextAlign;
    setTextAlign: (align: TextAlign) => void;
    textBaseline: TextBaseLine;
    setTextBaseline: (baseline: TextBaseLine) => void;
    defaultTextPadding: number;
    textPadding: number;
    setTextPadding: (padding: number) => void;
}

const OptionsDisplay: FC<OptionsDisplayProps> = ({
    title,
    setTitle,
    setImage,
    textSize,
    setTextSize,
    bgDim,
    setBgDim,
    imageType,
    setImageType,
    downloadImage,
    defaultFontSize,
    defaultBgDim,
    font,
    setFont,
    textColor,
    setTextColor,
    dimColor,
    setDimColor,
    textAlign,
    setTextAlign,
    textBaseline,
    setTextBaseline,
    defaultTextPadding,
    textPadding,
    setTextPadding,
}) => (
    <div className="flex flex-col gap-5 w-1/3 mb-5">
        <div className="flex gap-3 items-end">
            <label className="grow-2">
                <span className="text-sm text-muted-foreground">Title:</span>
                <input
                    class="input"
                    type="text"
                    value={title}
                    onInput={(e) => setTitle(e.currentTarget.value)}
                    placeholder="Enter title"
                />
            </label>
            <label className="grow">
                <span className="text-sm text-muted-foreground">Font:</span>
                <select
                    className="select w-full"
                    onChange={(e) => setFont(e.currentTarget.value)}
                    value={font}
                >
                    <FontOptions />
                </select>
            </label>
            <label
                className="grow"
                onClick={(e) => {
                    e.preventDefault();
                    const nextAlign =
                        textAlign === "left"
                            ? "center"
                            : textAlign === "center"
                            ? "right"
                            : "left";
                    setTextAlign(nextAlign);
                }}
            >
                <button
                    class="btn-icon-outline"
                    type="button"
                    title={`Align text to ${textAlign}`}
                    aria-label={`Align text to ${textAlign}`}
                >
                    {textAlign === "left" && <AlignLeft />}
                    {textAlign === "center" && <AlignCenter />}
                    {textAlign === "right" && <AlignRight />}
                </button>
            </label>
            <label
                className="grow"
                onClick={(e) => {
                    e.preventDefault();
                    const nextBaseline =
                        textBaseline === "top"
                            ? "middle"
                            : textBaseline === "middle"
                            ? "bottom"
                            : "top";
                    setTextBaseline(nextBaseline);
                }}
            >
                <button
                    class="btn-icon-outline"
                    type="button"
                    title={`Align text baseline to ${textBaseline}`}
                    aria-label={`Align text baseline to ${textBaseline}`}
                >
                    {textBaseline === "top" && <BasleineTop />}
                    {textBaseline === "middle" && <AlignJustify />}
                    {textBaseline === "bottom" && <BaselineBottom />}
                </button>
            </label>
        </div>

        <div className="flex flex-col grow">
            <span className="text-sm text-muted-foreground mb-1">
                Background Image:
            </span>
            <FileInput onImageUpload={setImage} />
        </div>

        <div className="flex flex-col grow">
            <span className="text-sm text-muted-foreground mb-1">
                Image Type:
            </span>
            <ImageTypeSelect
                value={imageType}
                onChange={(t) => setImageType(t)}
            />
        </div>

        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">
                Text Padding:
            </span>
            <SliderInput
                value={textPadding}
                min={0}
                max={0.5}
                decimalPlaces={2}
                onChange={(v) => setTextPadding(v)}
                step={0.01}
                showPlusMinusButtons
                displayValue
                displayUnit="%"
                defaultValue={defaultTextPadding}
                disabled={textAlign == "center" && textBaseline == "middle"}
            />
        </div>

        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">
                Text Size:
            </span>
            <SliderInput
                value={textSize}
                min={1}
                max={250}
                onChange={(v) => setTextSize(v)}
                step={1}
                showPlusMinusButtons
                displayValue
                displayUnit="px"
                defaultValue={defaultFontSize}
            />
        </div>

        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">
                Background Dim:
            </span>
            <SliderInput
                value={bgDim}
                min={0}
                max={1}
                onChange={(v) => setBgDim(v)}
                step={0.01}
                showPlusMinusButtons
                displayValue
                decimalPlaces={2}
                defaultValue={defaultBgDim}
            />
        </div>

        <div className="flex gap-3">
            <div className="flex flex-col grow">
                <span className="text-sm text-muted-foreground mb-1">
                    Text color:
                </span>
                <PopoverPicker
                    color={textColor}
                    onChange={setTextColor}
                    defaultColor="#ffffff"
                />
            </div>
            <div className="flex flex-col grow">
                <span className="text-sm text-muted-foreground mb-1">
                    Dim color:
                </span>
                <PopoverPicker
                    color={dimColor}
                    onChange={setDimColor}
                    defaultColor="#000000"
                />
            </div>
        </div>

        <button onClick={downloadImage} className="btn font-bold w-full">
            <Download />
            Download
        </button>
    </div>
);

export default OptionsDisplay;
