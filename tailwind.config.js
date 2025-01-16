/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          corporate: {
            50: '#F5F7FA',  // Lightest gray
            100: '#E4E7EB',  // Light gray
            200: '#CBD2D9',  // Gray
            300: '#9AA5B1',  // Medium gray
            400: '#7B8794',  // Dark gray
            500: '#616E7C',  // Darker gray
            600: '#52606D',  // Very dark gray
            700: '#3E4C59',  // Almost black
            800: '#323F4B',  // Corporate black
            900: '#1F2933',  // Deepest black
          },
          primary: {
            DEFAULT: "hsl(215 65% 45%)", // Professional blue
            foreground: "hsl(0 0% 100%)",
            dark: "hsl(215 65% 35%)",
            "dark-foreground": "hsl(0 0% 100%)"
          },
          secondary: {
            DEFAULT: "hsl(215 25% 95%)", // Light blue-gray
            foreground: "hsl(215 65% 45%)",
            dark: "hsl(215 25% 20%)",
            "dark-foreground": "hsl(215 65% 85%)"
          },
          destructive: {
            DEFAULT: "hsl(0 65% 45%)", // Professional red
            foreground: "hsl(0 0% 100%)",
            dark: "hsl(0 65% 35%)",
            "dark-foreground": "hsl(0 0% 100%)"
          },
          muted: {
            DEFAULT: "hsl(215 25% 95%)",
            foreground: "hsl(215 25% 35%)",
            dark: "hsl(215 25% 20%)",
            "dark-foreground": "hsl(215 25% 80%)"
          },
          accent: {
            DEFAULT: "hsl(215 65% 45%)",
            foreground: "hsl(0 0% 100%)",
            dark: "hsl(215 65% 35%)",
            "dark-foreground": "hsl(0 0% 100%)"
          },
          popover: {
            DEFAULT: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideIn: {
            '0%': { opacity: '0', transform: 'translateX(-20px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          count: {
            '0%': { transform: 'scale(0.5)', opacity: '0' },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          }
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          fadeIn: 'fadeIn 0.5s ease-out forwards',
          slideIn: 'slideIn 0.5s ease-out forwards',
          count: 'count 0.5s ease-out forwards',
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }