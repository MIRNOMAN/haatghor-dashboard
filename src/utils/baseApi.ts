const isDev = process.env.NODE_ENV === "development";

export const getEnv = (
  devKey: string,
  prodKey: string,
  name: string
): string => {
  const value = isDev ? process.env[devKey] : process.env[prodKey];
  if (!value) {
    console.warn(
      `⚠ ${name} is not defined in environment variables, using fallback`
    );
    return isDev
      ? "http://localhost:5000/api/v1"
      : "http://localhost:5000/api/v1";
  }
  return value;
};

export const BASEAPI = (): string =>
  getEnv("NEXT_PUBLIC_BASEURL_DEV", "NEXT_PUBLIC_BASEURL_PROD", "Base API URL");

export const CLIENT_URL = (): string =>
  getEnv(
    "NEXT_PUBLIC_CLIENT_URL_DEV",
    "NEXT_PUBLIC_CLIENT_URL_PROD",
    "Client Public URL"
  );

export const AI_BASEAPI = (): string =>
  getEnv(
    "NEXT_PUBLIC_AI_BASEURL_DEV",
    "NEXT_PUBLIC_AI_BASEURL_PROD",
    "AI Backend URL"
  );
