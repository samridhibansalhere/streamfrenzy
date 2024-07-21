import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid lg:grid-cols-3 h-screen">
      <div className="bg-primary lg:col-span-2 hidden lg:flex lg:items-center lg:justify-center p-8">
        <div className="text-white">
          <h1 className="font-bold text-5xl mb-4">StreamFrenzy</h1>
          <p className="text-base">
          StreamFrenzy is your ultimate destination for a boundless entertainment experience.
          Dive into a whirlwind of movies, series, and exclusive content, 
          all curated to keep you on the edge of your seat. With seamless streaming and a vast library at your fingertips, 
          StreamFrenzy promises to turn every screen into a gateway to adventure, drama, and thrill.
          </p>
        </div>
      </div>
      <div className="bg-primary lg:col-span-1 flex items-center justify-center p-8">
        <SignUp />
      </div>
    </div>
  );
}