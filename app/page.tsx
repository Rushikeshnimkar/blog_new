"use client"
import { NavbarDemo } from "./components/navbar";
import Blog1 from "./pages/blogbuster1/page";
import "./globals.css";
import Blog2 from "./pages/blogbuster2/page";
import Blog3 from "./pages/blogbuster3/page";
import Contract from "./pages/contract/page";
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
      exchangeCodeForToken(code);
      console.log("code", code);
    }
  };

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE_WEB2;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI_GOOGLE_WEB2;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET_GOOGLE_WEB2;

  const exchangeCodeForToken = async (code: string) => {
    const tokenEndpoint = 'https://www.googleapis.com/oauth2/v4/token';

    const tokenRequestBody = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenRequestBody).toString(),
      });

      const tokenData = await response.json();

      // Assuming id_token is present in tokenData
      const idToken = tokenData.id_token;
      const accessToken = tokenData.access_token;
      sendIdToken(idToken);

      console.log("token", tokenData);
    } catch (error) {
      console.error('Token exchange error:', error);
    }
  };

  const sendIdToken = async (idToken: string) => {
    try {
      const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
      const response = await fetch(`${REACT_APP_GATEWAY_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("Response from server:", data);
      const token = data?.payload.token;
      const userId = data?.payload.userId;
      console.log("token", token);
      Cookies.set("erebrus_token", token, { expires: 7 });
      Cookies.set("erebrus_userid", userId, { expires: 7 });
      window.location.reload();
    } catch (error) {
      console.error('Error sending idToken:', error);
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
      <div className="h-screen">
        <Contract/>
      </div>
    </main>
  );
};

export default Home;
