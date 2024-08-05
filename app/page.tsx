"use client"
import { NavbarDemo } from "./components/navbar";
import Blog1 from "./pages/blogbuster1/page";
import "./globals.css";
import Blog2 from "./pages/blogbuster2/page";
import Blog3 from "./pages/blogbuster3/page";
import { useEffect } from "react";
import Cookies from "js-cookie";


const Home = () => {
  useEffect(() => {
    parseAuthorizationCode();
  }, []);

  const parseAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    window.history.replaceState({}, document.title, window.location.pathname);

    if (code) {
      localStorage.setItem("code", code);
      console.log("code", code);
    }
  };


  return (
    <main className="h-full bg-gradient-custom">
      <div className="h-[20vh]">
        <p className="text-white text-3xl pt-7 ml-10 font-bold">Blog Buster</p>
        <NavbarDemo />
      </div>
      <div className="flex">
        <Blog1 />
      </div>
      <div className="h-[20vh]"></div>
      <div>
        <Blog2 />
      </div>
      <div className="h-[20vh]"></div>
      <div>
        <Blog3 />
      </div>
    </main>
  );
};

export default Home;
