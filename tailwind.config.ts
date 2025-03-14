import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mainOrange: '#ED7117',
        secondOrange: '#FCAE1E',

        mainBlue: '#01458E',
        lightBlue: '#157AB2',
        secondBlue: '#03649F',
        
        mainGreen: '#6DB73C',
        secondGreen: '#8AC541',

        black: '#333333',
        white: '#FFFFFF',

        mainGrey: '#797474',
        secondGrey: '#555555',

        neutral1: '#F5F5F5',
        neutral2: '#D9D9D9',
        neutral3: '#808080',

        success1: '#28A745',
        success2: '#A5D6A7',

        error1: '#E00015',
        error2: '#FF6B6B'
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
