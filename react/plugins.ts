import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import autoImport from 'unplugin-auto-import/vite'

export default [
  react(),
  autoImport({
    dts: './react/auto.d.ts',
    imports: [
      {
        react: [
          'useState',
          'useRef',
          'useMemo',
          'useEffect',
        ],
      },
      {
        from: 'react',
        imports: [],
        type: true,
      },
    ],
  }),
] as Plugin[]
