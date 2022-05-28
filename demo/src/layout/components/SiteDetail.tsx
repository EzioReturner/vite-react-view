import React from 'react';
import setting from '@/config/setting';
import classNames from 'classnames';
import LayoutStore from '@/store/layoutStore';
import { observer, inject } from 'mobx-react';
import logo from '@/assets/image/logo.png';

const { siteName, menuLinkUrl, useSiteIcon } = setting;

const SiteDetail: React.FC = props => {
  const {
    layoutStore: {
      layoutStatus: { darkTheme, collapsed },
      isInlineLayout,
      isHorizontalNavigator
    }
  } = props as { layoutStore: LayoutStore };
  return (
    <a
      className={classNames(
        'RA-siteDetail',
        isInlineLayout && 'RA-siteDetail-inlineLayout',
        isHorizontalNavigator && 'RA-siteDetail-horizontal',
        darkTheme && 'RA-siteDetail-darkTheme',
        collapsed && !isInlineLayout && 'RA-siteDetail-collapsed'
      )}
      href={menuLinkUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {useSiteIcon && <img alt="" src={logo} className="RA-siteDetail-logo" />}
      <span className="RA-siteDetail-title">{siteName}</span>
    </a>
  );
};

export default inject('layoutStore')(observer(SiteDetail));
