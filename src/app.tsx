import { useEffect, useRef, useState } from "preact/hooks";
import FileInput from "./components/FileInput";
import { Download, ImageOff } from "lucide-preact";
import GitHub from "./components/GitHub";
import SliderInput from "./components/SliderInput";

export default function App() {
    const DEFAULT_TEXT_SIZE = 120;
    const CANVAS_WIDTH = 960;
    const CANVAS_HEIGHT = 540;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [title, setTitle] = useState("Movies");
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);

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
        let y = (CANVAS_HEIGHT - totalHeight) / 2 + lineHeight / 2;

        for (const line of lines) {
            ctx.fillText(line, CANVAS_WIDTH / 2, y);
            y += lineHeight;
        }
    };

    const drawCanvas = (img: HTMLImageElement, titleText: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const imgAspect = img.width / img.height;
        const canvasAspect = CANVAS_WIDTH / CANVAS_HEIGHT;

        let sx = 0,
            sy = 0,
            sWidth = img.width,
            sHeight = img.height;

        if (imgAspect > canvasAspect) {
            sWidth = img.height * canvasAspect;
            sx = (img.width - sWidth) / 2;
        } else {
            sHeight = img.width / canvasAspect;
            sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(
            img,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );

        // dim overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        document.fonts.ready.then(() => {
            ctx.font = `bold ${textSize}px "Montserrat", sans-serif`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            drawWrappedText(ctx, titleText, CANVAS_WIDTH * 0.9, textSize * 1.2);
        });
    };

    const handleTitleChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const newTitle = input.value;
        setTitle(newTitle);
        if (image) drawCanvas(image, newTitle);
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
    }, [image, title, textSize]);

    useEffect(() => {
        const defaultImg = new Image();
        defaultImg.onload = () => {
            setImage(defaultImg);
        };
        defaultImg.src = "/default-bg.jpg";
    }, []);

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <h1 className="text-4xl font-bold my-8 w-full flex items-center gap-2">
                    <img src={"/logo.svg"} alt={"Logo"} className="h-9" />
                    Jellyfin Cover Maker
                </h1>
                <a
                    href={
                        "https://github.com/KartoffelChipss/Jellyfin-Cover-Maker"
                    }
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    className="h-6 w-6"
                >
                    <GitHub />
                </a>
            </div>
            <div className="flex gap-5 w-full">
                <div className="flex flex-col gap-5 w-1/2">
                    <label className="w-full">
                        <span className="text-sm text-muted-foreground">
                            Title:
                        </span>
                        <input
                            class="input"
                            type="text"
                            value={title}
                            onInput={handleTitleChange}
                            placeholder="Enter title"
                        />
                    </label>

                    <div className="flex flex-col grow">
                        <span className="text-sm text-muted-foreground mb-1">
                            Background Image:
                        </span>
                        <FileInput onImageUpload={handleImageUpload} />
                    </div>

                    <SliderInput
                        value={textSize}
                        min={10}
                        max={250}
                        onChange={(v) => setTextSize(v)}
                        step={1}
                        showPlusMinusButtons
                        displayValue
                        displayUnit="px"
                        defaultValue={DEFAULT_TEXT_SIZE}
                    />

                    <button
                        onClick={downloadImage}
                        className="btn font-bold w-full"
                    >
                        <Download />
                        Download
                    </button>
                </div>

                {image ? (
                    <canvas
                        className="rounded-md border border-input border-solid max-w-full aspect-16/9"
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                    />
                ) : (
                    <div
                        style={{
                            width: `${CANVAS_WIDTH}px`,
                            height: `${CANVAS_HEIGHT}px`,
                        }}
                        className={`rounded-md border border-input border-solid max-w-full flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground aspect-16/9`}
                    >
                        <ImageOff />
                        <span>
                            You need to upload an image to see the preview.
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
