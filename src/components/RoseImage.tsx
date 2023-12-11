import Image from "next/image";

interface Props {
  className?: string;
}

export const RoseImage = ({ className }: Props) => (
  <Image
    src="/images/rose.png"
    alt="background-rose"
    width="860"
    height="910"
    className={className}
  />
);
