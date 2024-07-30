const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE_WEB2;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI_GOOGLE_WEB2;
const CLIENT_SECRET= process.env.NEXT_PUBLIC_CLIENT_SECRET_GOOGLE_WEB2;

export const handleLoginClick = () => {
    const state = Math.random().toString(36).substring(7);
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email&state=${state}`;
    window.location.href = authUrl;
  };