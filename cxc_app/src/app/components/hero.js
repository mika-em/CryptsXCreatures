import Typewriter from './typewriter';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-cover bg-center gap-24">
      <div className="mt-6 flex flex-col items-center gap-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-base-content leading-tight">
          Welcome to
        </h2>
        <h1
          className="-mt-3 text-5xl md:text-7xl glowing-text font-bold
         bg-clip-text text-transparent bg-gradient-to-r from-[#fde68a] via-[#f6ad55] to-[#e53e3e] text-center leading-snug"
          style={{ lineHeight: '1.5' }}
        >
          <Typewriter text="Crypts x Creatures" delay={100} />
        </h1>
      </div>
      <div className="flex flex-col items-center gap-8">
        <p className="text-center text-md md:text-lg font-medium max-w-xl text-base-content -mt-5 leading-relaxed">
          Embark on a journey of creativity, powered by AI. <br />
          Generate captivating stories, thrilling adventures, or your next great
          masterpiece.
        </p>
        <Link
          href="/story"
          className="btn btn-accent btn-md text-md md:text-lg px-8 py-4 fle font-bold hover:scale-105 transition-all"
          style={{ lineHeight: '1', textAlign: 'center' }}
        >
          START WRITING
        </Link>
      </div>
    </div>
  );
}
