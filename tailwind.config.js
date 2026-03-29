/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],

    safelist: [

        "xs:block",
        "sm:block",
        "md:block",
        "lg:block",
        "xl:block",
        "2xl:block",
        "3xl:block",

        // hidden
        "xs:hidden",
        "sm:hidden",
        "md:hidden",
        "lg:hidden",
        "xl:hidden",
        "2xl:hidden",
        "3xl:hidden",

        "left-[0px]",
        "right-[0px]",
        "left-[0rem]",
        "right-[0rem]",

    ],
    theme: {
        screens: {
            xs: '480px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
            '3xl': '1880px'
        }
    },

    extend: {
        colors: {
            white: "#ffffff",
            black: "#111111",
        },
    },

    plugins: [],
};