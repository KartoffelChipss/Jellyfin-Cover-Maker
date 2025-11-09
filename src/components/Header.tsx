import { useState } from 'preact/hooks';
import PrivacyModal from './legal/PrivacyModal';
import ImpressumModal from './legal/Impressum';

const Header = () => {
    const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
    const [impressumModalOpen, setImpressumModalOpen] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between w-full">
                <h1 className="text-4xl font-bold my-8 w-full flex items-center gap-2">
                    <img src={'/logo.svg'} alt={'Jellyfin Cover Maker Logo'} className="h-9" />
                    Jellyfin Cover Maker
                </h1>
                <button
                    className="btn-link text-muted-foreground"
                    onClick={() => setPrivacyModalOpen(true)}
                >
                    Privacy
                </button>
                <button
                    className="btn-link text-muted-foreground"
                    onClick={() => setImpressumModalOpen(true)}
                >
                    Impressum
                </button>
                <a
                    href={'https://github.com/KartoffelChipss/Jellyfin-Cover-Maker'}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    className="btn-link"
                >
                    <img
                        src="https://img.shields.io/github/stars/KartoffelChipss/Jellyfin-Cover-Maker?style=social"
                        alt="GitHub stars"
                    />
                </a>
            </header>
            <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
            <ImpressumModal
                isOpen={impressumModalOpen}
                onClose={() => setImpressumModalOpen(false)}
            />
        </>
    );
};

export default Header;
