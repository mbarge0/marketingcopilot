/**
 * Marketing Co-Pilot Tailwind Configuration
 * Extends Tailwind with design system tokens
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        copilot: {
          primary: {
            DEFAULT: '#0066FF',
            hover: '#0052CC',
            light: '#EFF6FF',
          },
          secondary: {
            DEFAULT: '#FF7A00',
            hover: '#E66900',
            light: '#FFF7ED',
          },
          // Semantic Colors
          success: {
            DEFAULT: '#16A34A',
            light: '#D1FAE5',
          },
          error: {
            DEFAULT: '#DC2626',
            light: '#FEE2E2',
          },
          warning: {
            DEFAULT: '#F59E0B',
            light: '#FEF3C7',
          },
          info: {
            DEFAULT: '#0EA5E9',
            light: '#DBEAFE',
          },
          // Neutral Palette
          background: '#F8FAFC',
          surface: '#FFFFFF',
          text: {
            DEFAULT: '#1E293B',
            muted: '#475569',
          },
          border: '#E2E8F0',
          hover: '#F1F5F9',
          // Insight Priority
          critical: {
            bg: '#FEE2E2',
            text: '#991B1B',
          },
          opportunity: {
            bg: '#FEF3C7',
            text: '#92400E',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Satoshi', 'Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'IBM Plex Mono', 'monospace'],
        chat: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5', letterSpacing: '0' }],
        sm: ['14px', { lineHeight: '1.5', letterSpacing: '0' }],
        base: ['16px', { lineHeight: '1.5', letterSpacing: '0' }],
        lg: ['18px', { lineHeight: '1.5', letterSpacing: '0' }],
        xl: ['20px', { lineHeight: '1.4', letterSpacing: '0' }],
        '2xl': ['24px', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 1px 3px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
        xl: '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        'copilot-xs': '4px',
        'copilot-sm': '8px',
        'copilot-md': '16px',
        'copilot-lg': '24px',
        'copilot-xl': '32px',
        'copilot-2xl': '48px',
      },
      transitionDuration: {
        'copilot-fast': '150ms',
        'copilot-base': '200ms',
        'copilot-smooth': '300ms',
      },
      transitionTimingFunction: {
        'copilot': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        'copilot-content': '1400px',
      },
      width: {
        'copilot-sidebar': '240px',
        'copilot-panel': '320px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%)',
        'gradient-success': 'linear-gradient(135deg, #16A34A 0%, #10B981 100%)',
        'gradient-energy': 'linear-gradient(135deg, #FF7A00 0%, #F59E0B 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
}

export default config


