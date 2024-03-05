import Image from "next/image";

export const Icons = {
  logo: () => (
    <Image
      className="h-50 w-100"
      src="/dark.png"
      width={50}
      height={50}
      alt="Picture of the author"
    />
  ),
};
