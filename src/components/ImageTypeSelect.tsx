import { RectangleHorizontal, RectangleVertical } from 'lucide-preact';
import type { FC } from 'preact/compat';

interface ImageTypeSelectProps {
    value: 'cover' | 'poster' | 'custom';
    onChange: (value: 'cover' | 'poster' | 'custom') => void;
}

const SelectOption: FC<{
    value: string;
    selected: boolean;
    onClick: () => void;
}> = ({ value, selected, onClick }) => {
    const selectedClasses = 'border-2 border-primary';

    return (
        <button
            onClick={onClick}
            className={`card grow flex flex-col items-center justify-center gap-1 ${
                selected ? selectedClasses : ''
            }`}
        >
            {value === 'poster' ? <RectangleVertical /> : <RectangleHorizontal />}
            <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </button>
    );
};
const ImageTypeSelect: FC<ImageTypeSelectProps> = ({ value, onChange }) => (
    <div className="flex items-center gap-2">
        <SelectOption
            value="cover"
            selected={value === 'cover'}
            onClick={() => onChange('cover')}
        />
        <SelectOption
            value="poster"
            selected={value === 'poster'}
            onClick={() => onChange('poster')}
        />
        <SelectOption
            value="custom"
            selected={value === 'custom'}
            onClick={() => onChange('custom')}
        />
    </div>
);

export default ImageTypeSelect;
