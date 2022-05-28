export interface StoreKeyValue {
  [name: string]: StoreValue;
}

type StoreValue = any;

export interface ViteReactViewOptions {
  ignore?: string[];
  ext?: string;
  viewIndex?: string;
  userConfigFile?: string;
  viewDir?: string;
  entryDir?: string[];
  beforeParse?: (body: string, entryName?: string) => string;
  beforeAssign?: (body: string, entryName?: string) => string;
}

export interface SimpleEntryOptions extends Omit<ViteReactViewOptions, 'entryDir'> {
  entryDir: string;
}

export interface FlattenRouteItem extends RouteItem {
  component: string;
}

export interface TreeRouteItem extends RouteItem {
  routes?: TreeRouteItem[];
  meta?: StoreKeyValue;
}

interface RouteItem {
  path: string;
  name: string;
  exact?: boolean;
  redirect?: string;
  order?: number;
}

export interface CustomerRouteConfig
  extends Omit<FlattenRouteItem & TreeRouteItem, 'component' | 'routes'> {
  component?: () => Promise<any>;
  routes?: CustomerRouteConfig[];
}
