// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     serverComponentsExternalPackages: ['@prisma/client'],
//   },
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  
  /* config options here */
};

export default nextConfig;