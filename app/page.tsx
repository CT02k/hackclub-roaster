"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const redirectUrl = `https://hackatime.hackclub.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HACKATIME_REDIRECT_URI ?? "")}&response_type=code&scope=${encodeURIComponent(process.env.NEXT_PUBLIC_HACKATIME_SCOPE ?? "profile read")}`;
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-100 text-black">
      <Link href="https://hackclub.com?ref=hc-roaster">
        <Image src="/flag-orpheus-top.png" className="absolute top-0 left-10" alt="Orpheus Flag" width={150} height={150} />
      </Link>
      <h1 className="text-4xl font-mono">Hackclub Roaster</h1>
        <Link href={redirectUrl} className="bg-[#ec3750] text-white rounded-full group relative contain-content flex items-center px-6 py-2.5 mt-4 hover:saturate-90 transition-all cursor-pointer border-b-4 border-r-4 border-rose-950">
          Link Hackatime
          <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1000">🙏</span>
          <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1250">🤠</span>
          <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1500">🕷️</span>
          
        </Link>
    </div>
  );
}
