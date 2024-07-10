export type authContext = {
  google: {
    clientSecretName: string;
    clientId: string;
    callbackUrls: string[];
    logoutUrls: string[];
  };
};
