import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImp from 'vite-plugin-imp';
import path from 'path';
import viteReactView from '../src/plugin';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/' : './',
  plugins: [
    viteReactView({
      entryDir: ['/src', '/client']
    }),
    react({
      include: ['**/*.tsx', '**/*.ts'],
      jsxRuntime: 'classic',
      babel: {
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          [
            '@babel/plugin-proposal-decorators',
            {
              legacy: true
            }
          ],
          ['@babel/plugin-proposal-class-properties', { loose: true }]
        ]
      }
    }),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style(name) {
            return `antd/es/${name}/style/index.js`;
          }
        },
        {
          libName: 'raturbo-components',
          style(name) {
            return `raturbo-components/esm/${name}/style/index.js`;
          }
        }
      ]
    })
  ],
  // 配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.ts', '.js', '.vue', '.tsx', '.json']
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#536ec2'
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9009,
    open: true,
    https: false,
    proxy: {}
  },
  build: {
    outDir: 'app/public',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
