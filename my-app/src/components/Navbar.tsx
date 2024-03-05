import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
const Navbar = async () => {
  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative shadow-lg bg-white ">
        <MaxWidthWrapper>
          <div className="border-b flex justify-center border-gray-200 ">
            <div className="flex h-16 items-center py-2">
              <div className="ml-4 mr-4 flex lg:ml-0">
                <Link href="/">
                  <Icons.logo />
                </Link>
              </div>
              <h5 className=" text-pretty font-semibold 2xl: text-2xl justify-center text-center">
                Kenya Leaf Stem Stem Analyser
              </h5>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
