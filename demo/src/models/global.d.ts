declare interface StoreKeyValue {
  [name: string]: StoreValue;
}

declare type StoreValue = any;

declare interface Window {
  less: any;
  logProxy: (data: any) => void;
  pageConfig: {
    serverTime: string;
    _csrf: string;
    staticPath: string;
  };
  renderEnvironment?: string;
  __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  WEEKMAP: string[];
}

declare interface Breadcrumb {
  name: string;
  path: string;
  display: boolean;
}

/**
 * @hideBreadcrumb 隐藏面包屑
 * @withoutHeaderBody 只需要面包屑
 * @title 标题
 * @subTitle 副标题
 * @content 内容
 * @extraContent 右侧额外内容
 * @logo logo
 */
declare interface PageHeaderProps {
  hideBreadcrumb?: boolean;
  withoutHeaderBody?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
  logo?: React.ReactNode;
}

declare interface PageWrapperProps extends PageHeaderProps {
  hideHeader?: React.ReactNode;
  style?: React.CSSProperties;
}
