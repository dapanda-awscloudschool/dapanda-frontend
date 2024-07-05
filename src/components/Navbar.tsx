import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./Search/SearchBar";
import dynamic from "next/dynamic";
// import NavIcons from "./NavIcons";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative border-b-2 border-gray-300">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">DAPANDA</div>
        </Link>
        <Menu />
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between h-full">
        {/* LEFT */}
        <div className="flex items-center gap-4 mr-8">
          <Link href="/" className="flex items-center gap-1">
            <Image src="/DAPANDA.png" alt="DAPANDA" width={70} height={70} />
            <div className="text-2xl tracking-wide">DAPANDA</div>
          </Link>
        </div>
        {/* CENTER */}
        <div className="flex-1 flex justify-center mx-8">
          <SearchBar />
        </div>
        {/* RIGHT */}
        <div className="flex items-center justify-end gap-4 ml-8">
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
