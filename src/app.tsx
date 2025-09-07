import { useEffect, useRef, useState } from 'preact/hooks';
import Header from './components/Header';
import OptionsDisplay from './components/OptionsDisplay';
import WebFont from 'webfontloader';
import Modal from './components/Modal';
import { Download } from 'lucide-preact';

export type TextAlign = 'left' | 'center' | 'right';
export type TextBaseLine = 'top' | 'middle' | 'bottom';

const hexToRgb = (hex: string): [number, number, number] => {
    const match = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return [0, 0, 0];
    return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
};

const MAX_CANVAS_WIDTH = 1000;
const MAX_CANVAS_HEIGHT = 500;

const getCanvasSizeFromCustomAspectRatio = (aw: number, ah: number) => {
    if (aw <= 0 || ah <= 0) return { width: MAX_CANVAS_WIDTH, height: MAX_CANVAS_HEIGHT };
    const scale = Math.min(MAX_CANVAS_WIDTH / aw, MAX_CANVAS_HEIGHT / ah);
    return {
        width: Math.round(aw * scale),
        height: Math.round(ah * scale),
    };
};

const getDefaultFontSizeFromCustomAspectRatio = (
    aspectRatioWidth: number,
    aspectRatioHeight: number
) => {
    const aspectRatio = aspectRatioWidth / aspectRatioHeight;
    if (aspectRatio >= 1.5) return 120; // landscape
    if (aspectRatio <= 0.7) return 50; // portrait
    return 80; // square-ish
};

export default function App() {
    const DEFAULT_TEXT_SIZE = 120;
    const DEFAULT_BG_DIM = 0.4;
    const DEFAULT_TEXT_PADDING = 0.05;

    const canvasSizes: Record<
        'cover' | 'poster',
        { width: number; height: number; defaultFontSize: number }
    > = {
        cover: {
            width: 960,
            height: 540,
            defaultFontSize: 120,
        },
        poster: {
            width: 333,
            height: 500,
            defaultFontSize: 50,
        },
    };

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);
    const [title, setTitle] = useState('Movies');
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);
    const [bgDim, setBgDim] = useState(DEFAULT_BG_DIM);
    const [fontName, setFontName] = useState('Montserrat');
    const [imageType, setImageType] = useState<'cover' | 'poster' | 'custom'>('cover');
    const [customAspectRatioWidth, setCustomAspectRatioWidth] = useState(4);
    const [customAspectRatioHeight, setCustomAspectRatioHeight] = useState(3);
    const [textColor, setTextColor] = useState('#ffffff');
    const [dimColor, setDimColor] = useState('#000000');
    const [textAlign, setTextAlign] = useState<TextAlign>('center');
    const [textBaseline, setTextBaseline] = useState<TextBaseLine>('middle');
    const [textPadding, setTextPadding] = useState(DEFAULT_TEXT_PADDING);

    const getCanvasWidth = () => {
        if (imageType === 'custom')
            return getCanvasSizeFromCustomAspectRatio(
                customAspectRatioWidth,
                customAspectRatioHeight
            ).width;
        return canvasSizes[imageType].width;
    };

    const getCanvasHeight = () => {
        if (imageType === 'custom')
            return getCanvasSizeFromCustomAspectRatio(
                customAspectRatioWidth,
                customAspectRatioHeight
            ).height;
        return canvasSizes[imageType].height;
    };

    const getDefaultFontSize = () => {
        if (imageType === 'custom') {
            return getDefaultFontSizeFromCustomAspectRatio(
                customAspectRatioWidth,
                customAspectRatioHeight
            );
        }
        return canvasSizes[imageType].defaultFontSize;
    };

    const [downloadWidth, setDownloadWidth] = useState(getCanvasWidth());
    const [downloadHeight, setDownloadHeight] = useState(getCanvasHeight());
    const [downloadScale, setDownloadScale] = useState(1);

    const syncFromWidth = (w: number) => {
        const baseW = getCanvasWidth();
        const baseH = getCanvasHeight();
        const aspect = baseW / baseH;

        const width = Math.max(1, Math.round(w || 1));
        const height = Math.round(width / aspect);

        setDownloadWidth(width);
        setDownloadHeight(height);
        setDownloadScale(width / baseW);
    };

    const syncFromHeight = (h: number) => {
        const baseW = getCanvasWidth();
        const baseH = getCanvasHeight();
        const aspect = baseW / baseH;

        const height = Math.max(1, Math.round(h || 1));
        const width = Math.round(height * aspect);

        setDownloadHeight(height);
        setDownloadWidth(width);
        setDownloadScale(height / baseH);
    };

    const handleImageUpload = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => {
            setImage(img);
        };
        img.src = URL.createObjectURL(file);
    };

    const drawWrappedText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        maxWidth: number,
        lineHeight: number,
        align: TextAlign,
        baseline: TextBaseLine
    ) => {
        ctx.textAlign = align;

        let x: number = getCanvasWidth() / 2;
        if (align === 'left') x = maxWidth * textPadding;
        else if (align === 'right') x = getCanvasWidth() - maxWidth * textPadding;

        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);

        const totalHeight = lines.length * lineHeight;

        const padding = getCanvasHeight() * textPadding;
        let y: number;
        if (baseline === 'top') {
            y = padding;
            ctx.textBaseline = 'top';
        } else if (baseline === 'middle') {
            y = getCanvasHeight() / 2 - totalHeight / 2;
            ctx.textBaseline = 'top';
        } else {
            y = getCanvasHeight() - totalHeight - padding;
            ctx.textBaseline = 'top';
        }

        for (const line of lines) {
            ctx.fillText(line, x, y);
            y += lineHeight;
        }
    };

    const renderCanvas = async (
        canvas: HTMLCanvasElement | null,
        img: HTMLImageElement,
        titleText: string,
        scale: number = 1
    ) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = getCanvasWidth() * scale;
        const height = getCanvasHeight() * scale;

        canvas.width = width;
        canvas.height = height;

        const canvasWidth = getCanvasWidth();
        const canvasHeight = getCanvasHeight();

        ctx.scale(scale, scale);

        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (imgAspect > canvasAspect) {
            sourceWidth = img.height * canvasAspect;
            sourceX = (img.width - sourceWidth) / 2;
        } else {
            sourceHeight = img.width / canvasAspect;
            sourceY = (img.height - sourceHeight) / 2;
        }

        ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvasWidth,
            canvasHeight
        );

        // dim overlay
        const [r, g, b] = hexToRgb(dimColor);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${bgDim})`;
        ctx.fillRect(0, 0, getCanvasWidth(), getCanvasHeight());

        // make sure font is loaded
        try {
            await document.fonts.load(`700 ${textSize}px "${fontName}"`);
            await document.fonts.ready; // extra safety for all faces
        } catch (_) {
            // ignore
        }

        ctx.font = `bold ${textSize}px "${fontName}", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        drawWrappedText(
            ctx,
            titleText,
            getCanvasWidth() * 0.9,
            textSize * 1.2,
            textAlign,
            textBaseline
        );
    };

    const formatTitleForFileName = (title: string) => {
        return title
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };

    const downloadImage = async () => {
        if (!image) return;
        const exportCanvas = document.createElement('canvas');
        await renderCanvas(exportCanvas, image, title, downloadScale);
        const link = document.createElement('a');
        link.download = `jellyfin-cover-${formatTitleForFileName(title)}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            renderCanvas(canvasRef.current, image, title);
        }
    }, [
        image,
        title,
        textSize,
        bgDim,
        imageType,
        fontName,
        textColor,
        dimColor,
        textAlign,
        textBaseline,
        textPadding,
        customAspectRatioWidth,
        customAspectRatioHeight,
    ]);

    useEffect(() => {
        if (!fontName) return;
        WebFont.load({
            google: {
                families: [fontName + ':400,700'],
            },
            active: () => {
                if (image) {
                    renderCanvas(canvasRef.current, image, title);
                }
            },
        });
    }, [fontName]);

    useEffect(() => {
        const defaultImg = new Image();
        defaultImg.onload = () => {
            setImage(defaultImg);
        };
        defaultImg.src = '/default-bg.webp';
    }, []);

    useEffect(() => {
        setDownloadScale(1);
        setDownloadWidth(Math.round(getCanvasWidth()));
        setDownloadHeight(Math.round(getCanvasHeight()));
    }, [imageType, customAspectRatioWidth, customAspectRatioHeight]);

    const handleImageTypeChange = (type: 'cover' | 'poster' | 'custom') => {
        setImageType(type);
        setTextSize(
            type === 'custom'
                ? getDefaultFontSizeFromCustomAspectRatio(
                      customAspectRatioWidth,
                      customAspectRatioHeight
                  )
                : canvasSizes[type].defaultFontSize
        );
    };

    return (
        <>
            <Header />
            <div className="flex gap-5 w-full mb-5">
                <OptionsDisplay
                    title={title}
                    setTitle={setTitle}
                    textSize={textSize}
                    setTextSize={setTextSize}
                    defaultFontSize={getDefaultFontSize()}
                    setImage={handleImageUpload}
                    imageType={imageType}
                    setImageType={handleImageTypeChange}
                    customAspectRatioWidth={customAspectRatioWidth}
                    setCustomAspectRatioWidth={setCustomAspectRatioWidth}
                    customAspectRatioHeight={customAspectRatioHeight}
                    setCustomAspectRatioHeight={setCustomAspectRatioHeight}
                    bgDim={bgDim}
                    setBgDim={setBgDim}
                    defaultBgDim={DEFAULT_BG_DIM}
                    downloadImage={() => setDownloadModalOpen(true)}
                    font={fontName}
                    setFont={setFontName}
                    textColor={textColor}
                    setTextColor={setTextColor}
                    dimColor={dimColor}
                    setDimColor={setDimColor}
                    textAlign={textAlign}
                    setTextAlign={setTextAlign}
                    textBaseline={textBaseline}
                    setTextBaseline={setTextBaseline}
                    defaultTextPadding={DEFAULT_TEXT_PADDING}
                    textPadding={textPadding}
                    setTextPadding={setTextPadding}
                />

                <div
                    className={
                        'flex items-center justify-center grow max-h-[500px] ' +
                        (imageType === 'poster' ? 'flex-col' : '')
                    }
                >
                    <canvas
                        className={'rounded-md border border-input border-solid'}
                        style={{
                            maxHeight: '500px',
                            aspectRatio: `${getCanvasWidth()} / ${getCanvasHeight()}`,
                        }}
                        ref={canvasRef}
                        width={getCanvasWidth()}
                        height={getCanvasHeight()}
                    />
                </div>
            </div>
            <Modal isOpen={downloadModalOpen} onClose={() => setDownloadModalOpen(false)}>
                <div>
                    <h2 class="text-lg font-bold mb-4">Download Image</h2>
                    <p class="mb-4">
                        Select the desired width and height for the downloaded image.
                    </p>

                    <div class="grid grid-cols-12 gap-4 mb-4">
                        <div class="flex flex-col col-span-5">
                            <label for="downloadWidth" class="text-sm text-muted-foreground">
                                Width:
                            </label>
                            <input
                                type="number"
                                id="downloadWidth"
                                class="input"
                                value={downloadWidth}
                                onChange={(e) => syncFromWidth(Number(e.currentTarget.value))}
                            />
                        </div>
                        <div class="flex flex-col col-span-5">
                            <label for="downloadHeight" class="text-sm text-muted-foreground">
                                Height:
                            </label>

                            <input
                                type="number"
                                id="downloadHeight"
                                class="input"
                                value={downloadHeight}
                                onChange={(e) => syncFromHeight(Number(e.currentTarget.value))}
                            />
                        </div>
                        <div class="flex flex-col col-span-2">
                            <label for="downloadScale" class="text-sm text-muted-foreground">
                                Scale:
                            </label>
                            <input
                                type="number"
                                id="downloadScale"
                                class="input"
                                value={downloadScale}
                                step={0.1}
                                min={0.1}
                                onChange={(e) => {
                                    const scale = Math.max(
                                        0.1,
                                        Number(e.currentTarget.value) || 0.1
                                    );
                                    setDownloadScale(scale);
                                    setDownloadWidth(Math.round(getCanvasWidth() * scale));
                                    setDownloadHeight(Math.round(getCanvasHeight() * scale));
                                }}
                            />
                        </div>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button
                            class="btn btn-secondary mr-2 mb-2"
                            onClick={() => setDownloadModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            class="btn btn-primary"
                            onClick={() => {
                                downloadImage();
                                setDownloadModalOpen(false);
                            }}
                        >
                            <Download />
                            Download
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
