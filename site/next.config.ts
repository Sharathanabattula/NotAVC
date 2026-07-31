import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /*
      Lets the company name and the headline number morph from the card into
      the breakdown page rather than the whole view being swapped out. Where
      the browser doesn't support it the navigation still works, it just
      doesn't animate.
    */
    viewTransition: true,
  },
};

export default nextConfig;
