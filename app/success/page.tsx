"use client";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    githubUsername: "",
    avatar: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("ticketData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    }
  }, []);

  const nameParts = userData.fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[1];

  return (
    <div className="container px-5 min-h-[90vh] mx-auto">
      <div className="max-w-md mx-auto mt-10 lg:max-w-lg">
        <h1 className="text-4xl text-white text-center font-bold mb-4 md:text-5xl">
          Congrats, <span className="gradient-text">{firstName}</span>{" "}
          <span className="gradient-text">{lastName}</span>! Your ticket is
          ready.
        </h1>
        <p className="text-xl text-center text-white">
          We've emailed your ticket to{" "}
          <span className="text-custom-orange-500">{userData.email}</span> and
          will send updates in the run up to the event.
        </p>
        <div className="mt-20 relative">
          <img src="/assets/images/pattern-ticket.svg" alt="Ticket" />
          <div className="absolute inset-0 p-5">
            <div className="flex gap-4 items-start">
              <img
                src="/assets/images/logo-mark.svg"
                alt="logo-mark"
                className="w-7 h-7"
              />
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white leading-none -mt-0.5">
                  Coding Conf
                </h2>
                <p className="text-md text-gray-400 mt-1 tracking-wide">
                  Jan 31, 2025 / Austin, TX
                </p>
              </div>
            </div>
            <div className="mt-auto absolute bottom-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    typeof userData.avatar === "string" &&
                    userData.avatar.startsWith("data:image")
                      ? userData.avatar
                      : "/assets/images/image-avatar.jpg"
                  }
                  alt="Avatar"
                  className="w-13 h-13 rounded-xl object-cover [@media(min-width:500px)]:w-16 [@media(min-width:500px)]:h-16"
                />
                <div>
                  <p className="text-2xl text-white tracking-wide">
                    {firstName} {lastName}
                  </p>
                  <p className="text-md tracking-wide text-gray-400 flex items-center gap-1">
                    <img src="/assets/images/icon-github.svg" alt="" />
                    {userData.githubUsername}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute right-8 bottom-8 origin-right rotate-90 [@media(min-width:500px)]:bottom-14 [@media(min-width:500px)]:right-10 ">
              <p className="text-gray-500 text-2xl tracking-widest [@media(min-width:500px)]:text-[1.4rem] [@media(min-width:500px)]:tracking-normal ">
                #01609
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
