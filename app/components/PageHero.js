import Image from "next/image";

export default function PageHero({ image, alt, title, subtitle }) {
  return (
    <section className="relative h-[42vh] min-h-[320px] flex items-center justify-center text-center">
      <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 px-6 max-w-2xl fade-up">
        <h1 className="text-white text-4xl sm:text-5xl font-bold drop-shadow-lg mb-3">{title}</h1>
        {subtitle && <p className="text-white/90 text-lg drop-shadow">{subtitle}</p>}
      </div>
    </section>
  );
}
