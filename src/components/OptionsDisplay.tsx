import { useState, type FC } from 'preact/compat';
import FileInput from './FileInput';
import ImageTypeSelect from './ImageTypeSelect';
import SliderInput from './SliderInput';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Download,
    ImageIcon,
    Pilcrow,
    Settings2,
} from 'lucide-preact';
import PopoverPicker from './PopoverPicker';
import type { TextAlign, TextBaseLine } from '../app';
import FontOptions from './FontOptions';
import BaselineBottom from './icons/BaselineBottom';
import OptionsSection from './OptionsSection';
import BaselineTop from './icons/BaselineTop';

interface OptionsDisplayProps {
    title: string;
    setTitle: (title: string) => void;
    setImage: (image: Event) => void;
    textSize: number;
    setTextSize: (size: number) => void;
    bgDim: number;
    setBgDim: (dim: number) => void;
    imageType: 'cover' | 'poster' | 'custom';
    setImageType: (type: 'cover' | 'poster' | 'custom') => void;
    customAspectRatioWidth: number;
    setCustomAspectRatioWidth: (ratio: number) => void;
    customAspectRatioHeight: number;
    setCustomAspectRatioHeight: (ratio: number) => void;
    downloadImage: () => void;
    defaultFontSize: number;
    defaultBgDim: number;
    font: string;
    setFont: (font: string) => void;
    fontWeights: number[];
    fontWeight: number;
    setFontWeight: (weight: number) => void;
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
    customAspectRatioWidth,
    setCustomAspectRatioWidth,
    customAspectRatioHeight,
    setCustomAspectRatioHeight,
    downloadImage,
    defaultFontSize,
    defaultBgDim,
    font,
    setFont,
    fontWeights,
    fontWeight,
    setFontWeight,
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
}) => {
    const [expandedId, setExpandedId] = useState<number | null>(1);

    return (
        <div className="flex flex-col w-1/3 mb-5">
            <OptionsSection
                icon={<Settings2 className="h-5 w-5" />}
                title="General"
                isExpanded={expandedId === 1}
                onToggle={() => setExpandedId(expandedId === 1 ? null : 1)}
            >
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

                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Background Image:</span>
                    <FileInput onImageUpload={setImage} />
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Image Type:</span>
                    <ImageTypeSelect value={imageType} onChange={(t) => setImageType(t)} />
                </div>

                <div className={`relative flex flex-col`}>
                    {imageType !== 'custom' && (
                        <div className="absolute inset-0 bg-background/80 pointer-events-none rounded-md"></div>
                    )}
                    <span className="text-sm text-muted-foreground mb-1">Custom Aspect Ratio:</span>
                    <div className="flex flex-row items-center gap-2">
                        <input
                            class="input grow"
                            type="number"
                            value={customAspectRatioWidth}
                            onInput={(e) =>
                                setCustomAspectRatioWidth(Number(e.currentTarget.value))
                            }
                            placeholder="Width"
                            min={1}
                            disabled={imageType !== 'custom'}
                        />
                        <span className="mx-1">:</span>
                        <input
                            class="input grow"
                            type="number"
                            value={customAspectRatioHeight}
                            onInput={(e) =>
                                setCustomAspectRatioHeight(Number(e.currentTarget.value))
                            }
                            placeholder="Height"
                            min={1}
                            disabled={imageType !== 'custom'}
                        />
                    </div>
                </div>
            </OptionsSection>

            <OptionsSection
                icon={<Pilcrow className="h-5 w-5" />}
                title="Typography"
                isExpanded={expandedId === 2}
                onToggle={() => setExpandedId(expandedId === 2 ? null : 2)}
            >
                <div className="grid grid-cols-4 gap-3">
                    <label className="grid gap-1 col-span-2">
                        <span className="text-sm text-muted-foreground">Font:</span>
                        <select
                            className="select w-full"
                            onChange={(e) => setFont(e.currentTarget.value)}
                            value={font}
                        >
                            <FontOptions />
                        </select>
                    </label>
                    <label className={'grid gap-1 col-start-3"'}>
                        <span className="text-sm text-muted-foreground">Weight:</span>
                        <select
                            className="select w-full"
                            value={fontWeight}
                            onInput={(w) => {
                                const wNum = Number(w);
                                if (isNaN(wNum)) return;
                                setFontWeight(wNum);
                            }}
                        >
                            {fontWeights.map((w: number) => (
                                <option key={w}>{w}</option>
                            ))}
                        </select>
                    </label>
                    <div className={'grid gap-1 col-start-4'}>
                        <span className="text-sm text-muted-foreground">Text color:</span>
                        <PopoverPicker
                            color={textColor}
                            onChange={setTextColor}
                            defaultColor="#ffffff"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Text Size:</span>
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

                <div className={'grid gap-1'}>
                    <span className="text-sm text-muted-foreground">Text Align:</span>
                    <div className={'grid grid-cols-2 gap-3'}>
                        <label
                            className="grid"
                            onClick={(e) => {
                                e.preventDefault();
                                const nextAlign =
                                    textAlign === 'left'
                                        ? 'center'
                                        : textAlign === 'center'
                                          ? 'right'
                                          : 'left';
                                setTextAlign(nextAlign);
                            }}
                        >
                            <button
                                class="btn-outline"
                                type="button"
                                title={`Align text to ${textAlign}`}
                                aria-label={`Align text to ${textAlign}`}
                            >
                                {textAlign === 'left' && (
                                    <>
                                        <AlignLeft />
                                        Left
                                    </>
                                )}
                                {textAlign === 'center' && (
                                    <>
                                        <AlignCenter />
                                        Center
                                    </>
                                )}
                                {textAlign === 'right' && (
                                    <>
                                        <AlignRight />
                                        Right
                                    </>
                                )}
                            </button>
                        </label>
                        <label
                            className="grid"
                            onClick={(e) => {
                                e.preventDefault();
                                const nextBaseline =
                                    textBaseline === 'top'
                                        ? 'middle'
                                        : textBaseline === 'middle'
                                          ? 'bottom'
                                          : 'top';
                                setTextBaseline(nextBaseline);
                            }}
                        >
                            <button
                                class="btn-outline"
                                type="button"
                                title={`Align text baseline to ${textBaseline}`}
                                aria-label={`Align text baseline to ${textBaseline}`}
                            >
                                {textBaseline === 'top' && (
                                    <>
                                        <BaselineTop />
                                        Top
                                    </>
                                )}
                                {textBaseline === 'middle' && (
                                    <>
                                        <AlignJustify />
                                        Middle
                                    </>
                                )}
                                {textBaseline === 'bottom' && (
                                    <>
                                        <BaselineBottom />
                                        Bottom
                                    </>
                                )}
                            </button>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Text Padding:</span>
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
                        disabled={textAlign == 'center' && textBaseline == 'middle'}
                    />
                </div>
            </OptionsSection>

            <OptionsSection
                icon={<ImageIcon className="h-5 w-5" />}
                title="Background"
                isExpanded={expandedId === 3}
                onToggle={() => setExpandedId(expandedId === 3 ? null : 3)}
            >
                <div className="flex flex-col grow">
                    <span className="text-sm text-muted-foreground mb-1">Dim color:</span>
                    <PopoverPicker
                        color={dimColor}
                        onChange={setDimColor}
                        defaultColor="#000000"
                        align="bottom"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Background Dim:</span>
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
            </OptionsSection>

            <button onClick={downloadImage} className="btn font-bold w-full mt-3">
                <Download />
                Download
            </button>
        </div>
    );
};

export default OptionsDisplay;
