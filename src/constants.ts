import { slash } from './utils/tools';
import type { SimpleEntryOptions } from './interface';
import path, { resolve } from 'path';

export const VIRTUAL_MODULE_ID = 'virtual:vite-react-view';

export const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export const CWD = process.cwd();

export const START_ANCHOR = '/* vite routes begin */';

export const END_ANCHOR = '/* vite routes end */';

const ENTRY_EXT = 'tsx';

const VIEW_INDEX = 'index';

const IGNORE = ['**/components', '**/component', '**/test', '**/tests', '**/utils', '**/util'];

const USER_CONFIG_FILE = 'routes-config.tsx';

export const ENTRY_DIR = '/src';

const VIEW_DIR = '/views';

const USER_CONFIG_DIR = '/config';

export const getConstantsMergedOptions = (options?: SimpleEntryOptions) => {
  return {
    ext: options?.ext || ENTRY_EXT,
    ignore: [...IGNORE, ...(options?.ignore || [])],
    viewIndex: options?.viewIndex || VIEW_INDEX
  };
};

export const getEnvConstants = (root: string = process.cwd(), options: SimpleEntryOptions) => {
  // 项目根路径
  const SLASH_ROOT = slash(root);

  const src = (options?.entryDir || ENTRY_DIR) as string;

  const viewDir = options?.viewDir || VIEW_DIR;

  // src 路径（可配置
  const SRC_DIR = resolve(path.join(SLASH_ROOT, src));

  // src下 views 路径（可配置
  const VIEWS_DIR = resolve(path.join(SRC_DIR, viewDir));

  // src 下 config 文件路径
  const _USER_CONFIG_DIR = resolve(path.join(SRC_DIR, USER_CONFIG_DIR));

  // vite react view 路径
  const VITE_REACT_VIEW_DIR = resolve(path.join(SRC_DIR, '/.vite/react-view'));

  // vite react view config 文件路径
  const VITE_REACT_VIEW_CONFIG_FILE = resolve(path.join(SRC_DIR, '/.vite/react-view/config.ts'));

  return {
    SLASH_ROOT,
    SRC_DIR,
    VIEWS_DIR,
    USER_CONFIG_DIR: _USER_CONFIG_DIR,
    USER_CONFIG_FILE: options?.userConfigFile || USER_CONFIG_FILE,
    VITE_REACT_VIEW_DIR,
    VITE_REACT_VIEW_CONFIG_FILE
  };
};
