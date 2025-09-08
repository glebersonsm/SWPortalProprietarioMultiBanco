/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "187.73.180.122",
        // port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "45.70.147.166",
        // port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        // port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "177.66.74.242",
        // port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "172.23.0.159",
        // port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
