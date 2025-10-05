import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx,html,vue}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#50C878",
        },
        secondary: {
          DEFAULT: "#3B82F6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
