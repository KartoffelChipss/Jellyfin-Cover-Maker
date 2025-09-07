import { X } from 'lucide-preact';
import type { FunctionalComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: FunctionalComponent<ModalProps> = ({ isOpen, onClose, children, title }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/75"
            onClick={handleOverlayClick}
            style={{ pointerEvents: 'auto' }}
        >
            <div
                ref={modalRef}
                className="card rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
                style={{ pointerEvents: 'auto' }}
            >
                {title && (
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-0">{title}</h2>
                        <button className="btn-icon-secondary" onClick={onClose}>
                            <X />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
