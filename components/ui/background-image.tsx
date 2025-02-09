import Image from 'next/image'

export function BackgroundImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  )
} 