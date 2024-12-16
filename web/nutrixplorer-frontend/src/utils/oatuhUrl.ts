export const oauthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=` +
    import.meta.env.VITE_GOOGLE_CLIENT_ID +
    "&redirect_uri=" +
    import.meta.env.VITE_GOOGLE_REDIRECT_URL +
    "&response_type=code&scope=openid profile email&prompt=consent" +
    "&access_type=offline";
