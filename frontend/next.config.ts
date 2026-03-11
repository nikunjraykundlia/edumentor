import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  /* config options here */
=======
  // Increase the body size limit for large PDF uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  allowedDevOrigins: ["10.2.0.2", "localhost:3000"],
>>>>>>> 40c3b1e1262813eee8f664573faff647d1422ef3
};

export default nextConfig;
