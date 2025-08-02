import { useEffect, useRef, useState } from "preact/hooks";
import Header from "./components/Header";
import OptionsDisplay from "./components/OptionsDisplay";

export default function App() {
    const DEFAULT_TEXT_SIZE = 120;
    const DEFAULT_BG_DIM = 0.4;

    const camvasSizes: Record<
        "cover" | "poster",
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
    const [title, setTitle] = useState("Movies");
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);
    const [bgDim, setBgDim] = useState(DEFAULT_BG_DIM);
    const [imageType, setImageType] = useState<"cover" | "poster">("cover");

    const getCanvasWidth = () => camvasSizes[imageType].width;
    const getCanvasHeight = () => camvasSizes[imageType].height;
    const getDefaultFontSize = () => camvasSizes[imageType].defaultFontSize;

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
        lineHeight: number
    ) => {
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);

        const totalHeight = lines.length * lineHeight;
        let y = (getCanvasHeight() - totalHeight) / 2 + lineHeight / 2;

        for (const line of lines) {
            ctx.fillText(line, getCanvasWidth() / 2, y);
            y += lineHeight;
        }
    };

    const drawCanvas = (img: HTMLImageElement, titleText: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
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
        ctx.fillStyle = `rgba(0, 0, 0, ${bgDim})`;
        ctx.fillRect(0, 0, getCanvasWidth(), getCanvasHeight());

        document.fonts.ready.then(() => {
            ctx.font = `bold ${textSize}px "Montserrat", sans-serif`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            drawWrappedText(
                ctx,
                titleText,
                getCanvasWidth() * 0.9,
                textSize * 1.2
            );
        });
    };

    const formatTitleForFileName = (title: string) => {
        return title
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase();
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = `jellyfin-cover-${formatTitleForFileName(title)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            drawCanvas(image, title);
        }
    }, [image, title, textSize, bgDim, imageType]);

    useEffect(() => {
        const defaultImg = new Image();
        defaultImg.onload = () => {
            setImage(defaultImg);
        };
        defaultImg.src = "/default-bg.jpg";
    }, []);

    const handleImageTypeChange = (type: "cover" | "poster") => {
        setImageType(type);
        setTextSize(camvasSizes[type].defaultFontSize);
    };

    return (
        <>
            <Header />
            <div className="flex gap-5 w-full">
                <OptionsDisplay
                    title={title}
                    setTitle={setTitle}
                    textSize={textSize}
                    setTextSize={setTextSize}
                    defaultFontSize={getDefaultFontSize()}
                    setImage={handleImageUpload}
                    imageType={imageType}
                    setImageType={handleImageTypeChange}
                    bgDim={bgDim}
                    setBgDim={setBgDim}
                    defaultBgDim={DEFAULT_BG_DIM}
                    downloadImage={downloadImage}
                />

                <div
                    className={
                        "flex items-center justify-center grow " +
                        (imageType === "poster" ? "flex-col" : "")
                    }
                >
                    <canvas
                        className={
                            "rounded-md border border-input border-solid grow"
                        }
                        style={{
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
