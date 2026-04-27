export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#f5f7fb',
        panel: '#ffffff',
        ink: '#14213d',
        accent: '#2ba8ff',
        accentDark: '#1a6dff',
        success: '#24b47e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      boxShadow: {
        shell: '0 18px 50px rgba(16, 24, 40, 0.08)',
      },
      backgroundImage: {
        'shell-wave': 'radial-gradient(circle at top left, rgba(43,168,255,0.18), transparent 36%), radial-gradient(circle at top right, rgba(26,109,255,0.18), transparent 32%), linear-gradient(135deg, #eef4ff 0%, #f7f9fc 100%)',
      },
    },
  },
  plugins: [],
};
