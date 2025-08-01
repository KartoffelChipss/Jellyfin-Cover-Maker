import { ImageIcon } from "lucide-preact";
import type { FC } from "preact/compat";
import { useState, useCallback, useRef } from "preact/hooks";

type DragAndDropFileInputProps = {
    onImageUpload: (e: Event) => void;
};

const FileInput: FC<DragAndDropFileInputProps> = ({ onImageUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            const file = files[0];

            const img = new Image();
            img.onload = () => {
                if (inputRef.current) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    inputRef.current.files = dataTransfer.files;

                    const event = new Event("change", { bubbles: true });
                    inputRef.current.dispatchEvent(event);
                }
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            };
            img.src = URL.createObjectURL(file);
        }
    }, []);

    const handleImageUpload = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }

        onImageUpload(e);
        setIsDragging(false);
    };

    return (
        <label
            class={
                "relative grow w-full rounded-md border border-input border-solid flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-colors " +
                (isDragging ? " border-primary border-dashed" : "")
            }
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            htmlFor="file-input"
        >
            <input
                ref={inputRef}
                id="file-input"
                className="hidden"
                onChange={handleImageUpload}
                type="file"
                accept="image/*"
            />

            <div className="flex flex-col items-center p-5 rounded-md bg-background/70 z-10">
                <ImageIcon class="w-6 h-6 text-muted-foreground" />
                <span class="text-sm text-muted-foreground text-center">
                    Drag and drop an image here
                    <br />
                    or click to upload
                </span>
            </div>

            {previewUrl && (
                <>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        class="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] object-cover rounded-md"
                    />
                    {/* <div class="absolute top-0 left-0 w-full h-full z-5 bg-black/80 rounded-md" /> */}
                </>
            )}
        </label>
    );
};

export default FileInput;
