import { observable, configure, action, computed, runInAction } from 'mobx';
import NProgress from 'nprogress';
import setting from '@/config/setting';
import { userStore } from './userStore';
import intersection from 'lodash/intersection';
import { message } from 'antd';
import { changeTheme } from '@/utils/theme';
import { useLocationQuery } from '@/utils/customHooks';
import { fileRoutes as routeConfig, constantRouteConfig } from '@/config/routes-config';
import useLiteRouter from 'virtual:@lite/react-view';
import type { VrpRouteConfig } from '@/router';

const { useMenu, useHeader, useTheme, layoutMode, navigateMode, contentAreaWidthMode } = setting;

interface LoadingOptions {
  fixed?: boolean; // 只覆盖路由可视区域
  spinning: boolean; // 开启关闭遮罩
  text?: string | number | React.ReactNode; // 文案
}

interface LayoutStatus extends StoreKeyValue {
  showSiderBar: boolean;
  showHeader: boolean;
  layoutMode: 'split' | 'inline';
  navigateMode: 'vertical' | 'horizontal';
  contentAreaWidthMode: 'max-width' | 'flow';
  fixSiderBar: boolean;
  fixHeader: boolean;
  visionTheme: 'light' | 'dark';
  collapsed: boolean;
  mobile: boolean;
  currentColor: string;
}

configure({ enforceActions: 'observed' });
class LayoutStore {
  // 存放已经初始化完毕的页面
  @observable readyInitializers: Array<string> = [];

  // 开启的菜单
  @observable openMenus: Array<string> = [];

  // 面包屑列表
  @observable breadcrumbList: Array<Breadcrumb> = [];

  // 路由数据
  @observable routeConfig: Array<VrpRouteConfig> = [];

  // 全局spinning配置信息
  @observable loadingOptions: LoadingOptions = { spinning: false };

  @observable layoutStatus: LayoutStatus = {
    showSiderBar: useMenu, // 显示头部
    showHeader: useHeader, // 显示菜单
    layoutMode: (layoutMode as 'split' | 'inline') || 'split', // 布局模式
    navigateMode: (navigateMode as 'vertical' | 'horizontal') || 'vertical', // 导航风格
    contentAreaWidthMode: (contentAreaWidthMode as 'max-width' | 'flow') || 'max-width', // 内容区域宽度
    fixSiderBar: true, // 固定左侧导航
    fixHeader: true, // 固定顶部header
    visionTheme: 'light', // 视觉主题
    collapsed: false,
    mobile: false,
    currentColor: '#536ec2'
  };

  @observable appViewPort: 'iframe' | 'mobile' | 'app' | null = null;

  @observable activeRenderId: string | null = null;

  constructor() {
    this.effectUrlQueryConfig();
    this.initLayoutStatus();
    this.addWindowEvent();
    // this.changeViewport();
  }

  addWindowEvent(): void {
    window.addEventListener('message', e => {
      const { data } = e;

      if (typeof data === 'object') {
        const { action } = data;

        switch (action) {
          case 'refresh':
            window.location.reload();
            break;
          case 'active':
            runInAction(() => {
              this.activeRenderId = Math.random().toString(36).substring(2, 8);
            });
            break;
          default:
            break;
        }
      }
    });
  }

  @computed
  get authRedirect() {
    const [app] = this.routeConfig;
    const appRoutes = app.routes;
    if (appRoutes) {
      let redirectPath = '';
      for (let index = 0; index < appRoutes.length; index++) {
        const { redirect, meta, path } = appRoutes[index];
        if (redirect || path === '/') continue;
        const allowed = !meta?.authority || intersection(userStore.authority, meta?.authority);
        if (allowed) {
          redirectPath = path;
          break;
        }
      }
      return redirectPath;
    }
    return '';
  }

  get isInlineLayout() {
    return this.layoutStatus.layoutMode === 'inline';
  }

  get isContentFlowMode() {
    return this.layoutStatus.contentAreaWidthMode === 'flow';
  }

  get isHorizontalNavigator() {
    return this.layoutStatus.navigateMode === 'horizontal';
  }

  get isDarkTheme() {
    return this.layoutStatus.visionTheme === 'dark';
  }

  @action
  effectUrlQueryConfig() {
    const search = window.location.href.split('?')[1];

    /* eslint-disable-next-line */
    const urlQuery = useLocationQuery(search) as StoreKeyValue;

    const { viewport } = urlQuery;

    this.appViewPort = viewport;

    if (viewport && ['iframe', 'mobile'].includes(viewport)) {
      this.changeLayoutStatus('showHeader', false);
      this.changeLayoutStatus('showSiderBar', false);
    }

    this.initialRouteConfig();
  }

  @action
  initLayoutStatus() {
    if (useTheme) {
      const status = localStorage.getItem('RA-layoutStatus');
      if (status) {
        const _status = JSON.parse(status);
        message.loading('正在应用视觉风格', 3);
        setTimeout(() => {
          this.changeLayoutVision();
        }, 300);
        this.layoutStatus = _status;
      }
      if (this.isHorizontalNavigator) {
        this.layoutStatus.layoutMode = 'split';
      }
    }
  }

  // 初始化路由配置信息，当前session只能设置一次
  @action initialRouteConfig(): void {
    const { app } = constantRouteConfig;

    const liteRouter = useLiteRouter(routeConfig);

    console.log(liteRouter);

    app.routes = [app.routes![0], ...liteRouter];

    this.routeConfig = [app];
  }

  // 动态设置路由方法
  @action setMenu(menu: Array<VrpRouteConfig>): void {
    this.routeConfig = menu;
  }

  // 响应分辨率
  // @action changeViewport(): void {
  //   const info: any = isMobile(navigator.userAgent);
  //   this.layoutStatus.isMobile = info.any;
  //   this.layoutStatus.isMobile && this.toggleCollapsed(true);
  //   const clientWidth = document.body.clientWidth;
  //   if (clientWidth < 1000) {
  //     this.toggleCollapsed(true);
  //     document.body.className = `${document.body.className} mobile`.trim();
  //   } else {
  //     this.toggleCollapsed(false);
  //   }
  //   // 移动端模式
  //   if (clientWidth < 600) {
  //     this.layoutStatus.isMobile = true;
  //     this.layoutStatus.layoutMode = 'split';
  //     this.layoutStatus.navigateMode = 'vertical';
  //     this.layoutStatus.fixHeader = true;
  //     this.layoutStatus.fixSiderBar = true;
  //   }
  // }

  // 初始化面包屑
  @action initBreadcrumb(name: string, path: string): void {
    this.breadcrumbList.push({
      name,
      path,
      display: false
    });
  }

  // 增加面包屑
  @action addBreadcrumb = (path: string): void => {
    const cache: Breadcrumb | undefined = this.breadcrumbList.find(
      (res: Breadcrumb) => res.path === path
    );
    cache && (cache.display = true);
  };

  // 删除面包屑
  @action delBreadcrumb = (name: string, path: string): any => {
    let delSelf = false;
    this.breadcrumbList = this.breadcrumbList.reduce(
      (total: Array<Breadcrumb>, index: Breadcrumb): Array<Breadcrumb> => {
        if (index.name === name) {
          index.display = false;
          delSelf = index.path === path;
        }
        total.push(index);
        return total;
      },
      []
    );
    return delSelf ? this.breadcrumbList[0] : null;
  };

  @action ctrlSpinning = (options: LoadingOptions) => {
    this.loadingOptions = options;
  };

  @action ctrlProgress = (type: boolean) => {
    type ? NProgress.start() : NProgress.done(true);
  };

  // 记录懒加载模块并开启loading
  @action addInitializer(initializer: string): void {
    this.readyInitializers.push(initializer);
    NProgress.start();
  }

  // 检查是否已加载过
  @action checkIsInitial(route: VrpRouteConfig): void {
    const { path, meta, name } = route;

    if (!this.readyInitializers.includes(path)) {
      this.addInitializer(path);
      meta?.loading && this.ctrlSpinning({ spinning: true });
      name && this.initBreadcrumb(name, path);
    }
  }

  // 切换collapsed
  @action toggleCollapsed = (collapsed?: any): void => {
    this.layoutStatus.collapsed = collapsed;
  };

  // 调整status
  @action changeLayoutStatus = (key: keyof LayoutStatus, value: any) => {
    if (key === 'navigateMode') {
      this.layoutStatus.contentAreaWidthMode = value === 'vertical' ? 'flow' : 'max-width';
      this.layoutStatus.collapsed = false;
    }
    this.layoutStatus[key] = value;
    if (key === 'currentColor' || key === 'visionTheme') {
      setTimeout(() => {
        this.changeLayoutVision();
      }, 0);
    }

    localStorage.setItem('RA-layoutStatus', JSON.stringify(this.layoutStatus));
  };

  // 调整视觉风格
  @action changeLayoutVision = () => {
    const { visionTheme, currentColor } = this.layoutStatus;
    changeTheme(visionTheme, currentColor);
  };

  // 设置打开的菜单
  @action setOpenMenus(menus: Array<string>): void {
    this.openMenus = menus;
  }
}
export const layoutStore = new LayoutStore();
export default LayoutStore;
