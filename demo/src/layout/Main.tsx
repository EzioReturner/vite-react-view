import React, { Suspense } from 'react';
import Authorized from '@/components/Authorized';
import { useLocation } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import LayoutStore from '@/store/layoutStore';
import { getRouteAuthority } from '@/utils/authorityTools';
import { Spin, Layout } from 'raturbo-components';
import SiderMenu from './components/SiderMenu';
import UserInfo from './components/UserInfo';
import SiteDetail from './components/SiteDetail';
import LayoutSetting from './LayoutSetting';
import setting from '@/config/setting';
import classNames from 'classnames';
import './Main.less';
import './components/styles/index.less';
import 'antd/dist/antd.variable.min.css';
import type { VrpRouteConfig } from '@/router';

const { useSetting } = setting;

const Exception403 = React.lazy(
  () => import(/* webpackChunkName: "403" */ '@/views/Exception/403')
);

interface MainSkeletonProps {
  route: VrpRouteConfig;
}

interface InjectProps extends MainSkeletonProps {
  layoutStore: LayoutStore;
}

const MainSkeleton: React.FC<MainSkeletonProps> = props => {
  const {
    layoutStore: {
      toggleCollapsed,
      loadingOptions,
      layoutStatus: {
        collapsed,
        navigateMode,
        contentAreaWidthMode,
        showHeader,
        showSiderBar,
        fixHeader,
        fixSiderBar,
        layoutMode
      },
      isHorizontalNavigator
    }
  } = props as InjectProps;

  let location = useLocation();

  const { route, children } = props;
  const routeAuthority: undefined | string | string[] = getRouteAuthority(
    location.pathname,
    route.routes
  );

  const Content = (
    <Authorized
      routeAuthority={routeAuthority}
      unidentified={
        <Suspense fallback={<Spin spinning />}>
          <Exception403 />
        </Suspense>
      }
    >
      <div
        className={classNames(
          'RA-basicLayout-wrapper-viewMain',
          isHorizontalNavigator && 'in-horizontal-layout'
        )}
      >
        <Spin {...{ ...loadingOptions, parentRelative: true }} />
        {children}
      </div>
    </Authorized>
  );

  return (
    <main
      style={{ height: '100%' }}
      className={classNames(navigateMode === 'horizontal' && 'RA-basicLayout-main-horizontal')}
    >
      <Layout
        collapsed={collapsed}
        verticalType={layoutMode}
        mode={navigateMode}
        contentFlowMode={contentAreaWidthMode === 'flow'}
        onChangeCollapsed={col => toggleCollapsed(col)}
        fixHeader={fixHeader}
        fixSider={fixSiderBar}
        hideHeader={!showHeader}
        hideSider={!showSiderBar}
        sider={<SiderMenu />}
        header={
          <div className="RA-basicLayout-header-container">
            {navigateMode === 'horizontal' && (
              <div className="horizontal-header-site-info">
                <SiteDetail />
                <SiderMenu />
              </div>
            )}
            {layoutMode === 'inline' && <SiteDetail />}
            <UserInfo />
          </div>
        }
      >
        {Content}
      </Layout>
      {useSetting && <LayoutSetting />}
    </main>
  );
};

export default inject('layoutStore')(observer(MainSkeleton));
