import fg from 'fast-glob';
import { slash } from './utils/tools';
import { createFolder } from './utils/createFile';
import generateFlattenRoutes from './flattenRoutes';
import generateTreeRoutes from './treeRoutes';
import {
  getEnvConstants,
  getConstantsMergedOptions,
  VIRTUAL_MODULE_ID,
  RESOLVED_VIRTUAL_MODULE_ID,
  CWD
} from './constants';
import { readFileSync } from 'fs';
import path, { resolve } from 'path';
import type { ViteReactViewOptions, SimpleEntryOptions, StoreKeyValue } from './interface';
import type { Plugin, ViteDevServer, ResolvedConfig } from 'vite';

export default function viteReactView(viewOptions?: ViteReactViewOptions): Plugin {
  let options: ViteReactViewOptions = {
    ...viewOptions,
    entryDir: viewOptions?.entryDir || ['/src']
  };

  return {
    name: 'vite:react-view',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
      return null;
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const funcTpl = readFileSync(resolve(__dirname, './templates/function.art'), 'utf-8');

        return funcTpl;
      }

      return null;
    },
    config(config) {
      let entrys = options.entryDir!.filter(e => e !== '/src');
      config.build = {
        ...(config.build || {}),
        rollupOptions: {
          ...(config.build?.rollupOptions || {}),
          input: {
            main: resolve(path.join(CWD, 'index.html')),
            ...entrys.reduce((_entrys: StoreKeyValue, entry) => {
              const E = entry.replace('/', '');

              _entrys[E] = resolve(path.join(CWD, entry, 'index.html'));

              return _entrys;
            }, {})
          }
        }
      };
    },
    async configResolved(config) {
      let entryDir = options.entryDir!;

      for (let i = 0; i < entryDir.length; i++) {
        const entry = entryDir[i];

        let _options = {
          ...(options || {}),
          entryDir: entry
        };

        createFolder(config, _options);

        await generateViewRoutes(config, _options);
      }
    },
    async configureServer(server) {
      lanuchWatcher(server, options);
    }
  };
}

async function generateViewRoutes(config: ResolvedConfig, options: SimpleEntryOptions) {
  const { root } = config;

  const { VIEWS_DIR } = getEnvConstants(root, options);

  const scanningResult = await scanningFiles(VIEWS_DIR, options);

  const routes = await generateFlattenRoutes(root, scanningResult, options);

  generateTreeRoutes(root, routes, options);
}

async function scanningFiles(viewsDir: string, options: SimpleEntryOptions) {
  const { ext, ignore } = getConstantsMergedOptions(options);

  const scanningResult = fg.sync([`**/*.${ext}`], {
    cwd: viewsDir,
    ignore
  });

  return scanningResult;
}

async function lanuchWatcher(server: ViteDevServer, options: ViteReactViewOptions) {
  const { watcher } = server;

  let entrys = options.entryDir || [];

  watcher.on('add', async path => {
    handleFileChange(path, entrys, server, options);
  });

  watcher.on('unlink', async path => {
    handleFileChange(path, entrys, server, options);
  });
}

async function handleFileChange(
  _path: string,
  entrys: string[],
  server: ViteDevServer,
  options?: ViteReactViewOptions
) {
  let path = slash(_path);

  const { config } = server;

  for (let i = 0; i < entrys.length; i++) {
    if (path.indexOf(entrys[i]) < 0) continue;

    await generateViewRoutes(config, {
      ...options,
      entryDir: entrys[i]
    });
    updateServer(server);
  }
}

function updateServer(server: ViteDevServer) {
  server.ws.send({
    type: 'full-reload'
  });
}
