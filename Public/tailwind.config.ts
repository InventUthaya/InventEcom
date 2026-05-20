/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./shared/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./sites/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sites/web/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        mobmenu: 'mobmenu 0.5s ease-in-out forwards',
        buyDropdown: 'buyDropdown 0.5s ease-in-out forwards',
        buyDropdownContent: 'buyDropdownContent 0.5s ease-in-out forwards',
      }
    },
  }
}

