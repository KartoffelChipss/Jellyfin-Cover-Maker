import { ImageIcon, ImagePlus } from 'lucide-preact';
import type { FC } from 'preact/compat';
import { useState, useCallback, useRef, useEffect } from 'preact/hooks';

type DragAndDropFileInputProps = {
    onImageUpload: (e: Event) => void;
};

const FileInput: FC<DragAndDropFileInputProps> = ({ onImageUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleGlobalDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleGlobalDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleGlobalDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            const file = files[0];

            if (inputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                inputRef.current.files = dataTransfer.files;

                const event = new Event('change', { bubbles: true });
                inputRef.current.dispatchEvent(event);
            }

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
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

    useEffect(() => {
        window.addEventListener('dragover', handleGlobalDragOver);
        window.addEventListener('dragleave', handleGlobalDragLeave);
        window.addEventListener('drop', handleGlobalDrop);

        return () => {
            window.removeEventListener('dragover', handleGlobalDragOver);
            window.removeEventListener('dragleave', handleGlobalDragLeave);
            window.removeEventListener('drop', handleGlobalDrop);
        };
    }, [handleGlobalDragOver, handleGlobalDragLeave, handleGlobalDrop]);

    return (
        <>
            <label
                class={
                    'relative grow w-full rounded-md border border-input border-solid flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-colors ' +
                    (isDragging ? ' border-primary border-dashed' : '')
                }
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
                        Drag and drop an image anywhere
                        <br />
                        or click here to upload
                    </span>
                </div>

                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        class="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] object-cover rounded-md"
                    />
                )}
            </label>

            {isDragging && (
                <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center pointer-events-none border-primary border-4 rounded-md">
                    <div class="card flex flex-row items-center gap-3 p-6 text-center">
                        <ImagePlus class="w-6 h-6" />
                        <p class="text-lg font-medium">Drop image anywhere to use</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default FileInput;
