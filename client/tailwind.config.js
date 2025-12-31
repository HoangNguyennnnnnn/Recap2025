/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-blue': '#1a1a2e',
                'stardust-gold': '#ffd700',
                'soft-pink': '#ffb6c1',
            },
            fontFamily: {
                'dancing': ['"Dancing Script"', 'cursive'],
                'inter': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
