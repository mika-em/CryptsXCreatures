import Typewriter from './components/typewriter';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-base-200">
      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-base-content text-center ">
        Welcome to
      </h2>
      <h1 className="text-7xl glowing-text font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
        {' '}
        <Typewriter text="Crypts x Creatures." delay={100} />
      </h1>
    </div>
  );
}
