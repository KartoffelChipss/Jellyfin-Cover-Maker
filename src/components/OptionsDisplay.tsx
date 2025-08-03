import type { FC } from "preact/compat";
import FileInput from "./FileInput";
import ImageTypeSelect from "./ImageTypeSelect";
import SliderInput from "./SliderInput";
import { Download } from "lucide-preact";
import PopoverPicker from "./PopoverPicker";

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
}) => (
    <div className="flex flex-col gap-5 w-1/3 mb-5">
        <div className="flex gap-3">
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
                    <option value="Montserrat" selected>
                        Montserrat
                    </option>
                    <option value="Oswald">Oswald</option>
                    <option value="Anton">Anton</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Raleway">Raleway</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Cormorant">Cormorant</option>
                    <option value="Alegreya">Alegreya</option>
                    <option value="Alegreya Sans">Alegreya Sans</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                    <option value="Source Serif Pro">Source Serif Pro</option>
                    <option value="Work Sans">Work Sans</option>
                    <option value="Inter">Inter</option>
                    <option value="Lato">Lato</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Eczar">Eczar</option>
                    <option value="Syne">Syne</option>
                    <option value="Unbounded">Unbounded</option>
                </select>
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
