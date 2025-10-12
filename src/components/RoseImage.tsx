import Image from 'next/image'

interface Props {
  className?: string
}

export const RoseImage = ({ className }: Props) => <Image src="/images/rose.png" alt="background-rose" width="720" height="480" className={className} />
