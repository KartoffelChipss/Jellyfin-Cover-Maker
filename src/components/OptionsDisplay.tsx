import type { FC } from "preact/compat";
import FileInput from "./FileInput";
import ImageTypeSelect from "./ImageTypeSelect";
import SliderInput from "./SliderInput";
import { Download } from "lucide-preact";

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
}) => (
    <div className="flex flex-col gap-5 w-1/3">
        <label className="w-full">
            <span className="text-sm text-muted-foreground">Title:</span>
            <input
                class="input"
                type="text"
                value={title}
                onInput={(e) => setTitle(e.currentTarget.value)}
                placeholder="Enter title"
            />
        </label>

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

        <button onClick={downloadImage} className="btn font-bold w-full">
            <Download />
            Download
        </button>
    </div>
);

export default OptionsDisplay;
