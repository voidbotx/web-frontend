import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1 className="text-4xl font-bold">Welcome to My App</h1>
      <p className="mt-4 text-lg">This is the home page.</p>
      <Image
        src="/images/hero.png"
        alt="Hero Image"
        width={500}
        height={500}
        className="rounded-lg shadow-lg"
      />
    </main>
  );
}
