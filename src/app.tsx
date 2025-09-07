import { useEffect, useRef, useState } from 'preact/hooks';
import Header from './components/Header';
import OptionsDisplay from './components/OptionsDisplay';
import WebFont from 'webfontloader';

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
    const [title, setTitle] = useState('Movies');
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);
    const [bgDim, setBgDim] = useState(DEFAULT_BG_DIM);
    const [fontName, setFontName] = useState('Montserrat');
    const [imageType, setImageType] = useState<'cover' | 'poster' | 'custom'>('cover');
    const [customAspectRatioWidth, setCustomAspectRatioWidth] = useState(0.75);
    const [customAspectRatioHeight, setCustomAspectRatioHeight] = useState(1);
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

    const drawCanvas = (img: HTMLImageElement, titleText: string) => {
        console.log('Custom Aspect Ratio:', customAspectRatioWidth, ':', customAspectRatioHeight);
        console.log('Canvas Size:', getCanvasWidth(), 'x', getCanvasHeight());

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = getCanvasWidth();
        canvas.height = getCanvasHeight();

        const canvasWidth = getCanvasWidth();
        const canvasHeight = getCanvasHeight();

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

        document.fonts.ready.then(() => {
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
        });
    };

    const formatTitleForFileName = (title: string) => {
        return title
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `jellyfin-cover-${formatTitleForFileName(title)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            drawCanvas(image, title);
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
                    drawCanvas(image, title);
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
                    downloadImage={downloadImage}
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
        </>
    );
}
