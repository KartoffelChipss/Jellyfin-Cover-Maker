import GitHub from "./GitHub";

const Header = () => (
    <header className="flex items-center justify-between w-full">
        <h1 className="text-4xl font-bold my-8 w-full flex items-center gap-2">
            <img src={"/logo.svg"} alt={"Logo"} className="h-9" />
            Jellyfin Cover Maker
        </h1>
        <a
            href={"https://github.com/KartoffelChipss/Jellyfin-Cover-Maker"}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className="h-6 w-6"
        >
            <GitHub />
        </a>
    </header>
);

export default Header;
