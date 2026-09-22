"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [loggedIn] = useState(() => {
    const access_token = document.cookie.split("; ").find(row => row.startsWith("access_token="))?.split("=")[1];
    return access_token !== undefined;
  });

  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState("");

  const redirectUrl = `https://hackatime.hackclub.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`)}&response_type=code&scope=${encodeURIComponent("profile read")}`;
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[url('/bg.webp')] bg-cover w-full h-full text-black p-4">
      <Link href="https://hackclub.com?ref=hc-roaster">
        <Image src="/flag-orpheus-top.png" className="absolute top-0 left-10" alt="Orpheus Flag" width={150} height={150} />
      </Link>
      <Image src="/title.png" alt="Hackclub Roaster" width={400} height={400} className="mt-4" />
      <p className="text-center text-lg font-mono mt-4">Roast yourself with your hackclub data with the power of AI</p>
      {
        loggedIn ? (
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <Image src="/loading.png" alt="Loading" width={50} height={50} className="mt-4 animate-spin" />
            ) : null}
            {
              roast && !loading ? (
              <div className="relative my-8 w-250 min-h-48 h-fit flex items-center justify-center p-16">
                <div className="z-1">
                  <Image src="/draw.png" alt="Draw" width={50} height={50} className="absolute top-0 left-5" />
                  <Image src="/draw1.png" alt="Draw" width={50} height={50} className="absolute bottom-0 right-5" />
                  <p className="w-full text-center font-mono wrap-break-word p-0">{roast}</p>
                </div>
                <Image src="/paper.png" alt="Paper" width={50} height={50} className="absolute w-full h-full" />
              </div>) : null
            }
            <button className="bg-[#ec3750] text-white rounded-full group relative contain-content flex items-center px-6 py-2.5 mt-4 hover:saturate-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer border-b-4 border-r-4 border-rose-950"
             onClick={() => {
              setLoading(true);
              fetch("/api/roast")
                .then(res => res.json())
                .then(data => {
                  setRoast(data.response);
                  setLoading(false);
                })
                .catch(err => {
                  console.error(err);
                  setLoading(false);
                });
             }} disabled={loading}>
              Roast
            <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1000">🙏</span>
            <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1250">🤠</span>
            <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1500">🕷️</span>
          </button>
          </div>
        ) : (
          <Link href={redirectUrl} className="bg-[#ec3750] text-white rounded-full group relative contain-content flex items-center px-6 py-2.5 mt-4 hover:saturate-90 transition-all cursor-pointer border-b-4 border-r-4 border-rose-950">
            Link Hackatime
            <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1000">🙏</span>
            <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1250">🤠</span>
            <span className="absolute text-2xl translate-x-35 group-hover:-translate-x-15 group-hover:rotate-180 transition duration-1500">🕷️</span>
          </Link>
        )
      }
      <Image src="/idkanymore.png" alt="idk anymore" width={100} height={100} className="fixed bottom-0 right-0" />
    </div>
  );
}
