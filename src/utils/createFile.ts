import mkdirp from 'mkdirp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import ArtTemplate from 'art-template';
import type { ResolvedConfig } from 'vite';
import type { FlattenRouteItem } from '../interface';
import type { SimpleEntryOptions } from '../interface';
import { getEnvConstants } from '../constants';

export function createFolder(config: ResolvedConfig, options: SimpleEntryOptions) {
  const { root } = config;

  const { LITE_REACT_VIEW_DIR, USER_CONFIG_DIR } = getEnvConstants(root, options);

  mkdirp.sync(LITE_REACT_VIEW_DIR);
  mkdirp.sync(USER_CONFIG_DIR);
}

export function createRouteTreeFile(path: string, fileString: string) {
  createFile(path, fileString);
}

export function createFlattenRoutesFile(
  routeFlatten: FlattenRouteItem[],
  path: string,
  tpl: string
) {
  createFile(
    path,
    ArtTemplate.render(tpl, {
      data: {
        routes: routeFlatten
      }
    })
  );
}

export default function createFile(path: string, content: string) {
  writeFileSync(path, content, 'utf-8');
}
