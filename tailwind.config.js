// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: {
          normal: 'Poppins_400Regular',
          thin: 'Poppins_100Thin',
          light: 'Poppins_300Light',
          regular: 'Poppins_400Regular',
          medium: 'Poppins_500Medium',
          semibold: 'Poppins_600SemiBold',
          bold: 'Poppins_700Bold',
          extrabold: 'Poppins_800ExtraBold',
          black: 'Poppins_900Black',
        },
      },
    },
  },
  plugins: [],
};
