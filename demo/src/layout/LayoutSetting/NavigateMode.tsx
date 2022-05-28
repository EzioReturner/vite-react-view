import React from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import LayoutStore from '@/store/layoutStore';
import { observer, inject } from 'mobx-react';
import LocaleStore from '@/store/localeStore';
import verticalSvg from '@/assets/image/setting/vertical.svg';
import horizontalSvg from '@/assets/image/setting/horizontal.svg';
import splitSvg from '@/assets/image/setting/split.svg';
import inlineSvg from '@/assets/image/setting/inline.svg';

const NavigateMode: React.FC = props => {
  const {
    layoutStore: { isHorizontalNavigator, isInlineLayout, changeLayoutStatus },
    localeStore: { localeContent }
  } = props as { layoutStore: LayoutStore; localeStore: LocaleStore };
  return (
    <>
      <div className={classNames('RA-setting-Row', 'RA-setting-haveSelectedIcon')}>
        <div className="RA-setting-title">
          {localeContent['layoutSetting.navMode'] || '导航风格'}
        </div>
        <Tooltip
          placement="top"
          title={localeContent['layoutSetting.verticalNav'] || '左侧导航模式'}
        >
          <img
            onClick={() => changeLayoutStatus('navigateMode', 'vertical')}
            src={verticalSvg as any}
            alt=""
          />
        </Tooltip>
        <Tooltip
          placement="top"
          title={localeContent['layoutSetting.horizontalNav'] || '顶部导航模式'}
        >
          <img
            onClick={() => changeLayoutStatus('navigateMode', 'horizontal')}
            src={horizontalSvg as any}
            alt=""
          />
        </Tooltip>
        <CheckOutlined
          className={classNames(
            'RA-setting-selectedIcon',
            isHorizontalNavigator && 'RA-setting-selectedIcon-rightPlace'
          )}
        />
      </div>
      <div
        className={classNames(
          'RA-setting-Row',
          'RA-setting-layoutMode',
          'RA-setting-haveSelectedIcon',
          isHorizontalNavigator && 'RA-setting-layoutMode-disabled'
        )}
      >
        <div className="RA-setting-title">
          {localeContent['layoutSetting.layoutMode'] || '布局模式'}
        </div>
        <Tooltip
          placement="top"
          title={
            isHorizontalNavigator
              ? localeContent['layoutSetting.verticalNavOnly'] || '仅在左侧导航模式下起效'
              : localeContent['layoutSetting.splitMode'] || '分列式布局'
          }
        >
          <img
            onClick={() => (isHorizontalNavigator ? {} : changeLayoutStatus('layoutMode', 'split'))}
            src={splitSvg as any}
            alt=""
          />
        </Tooltip>
        <Tooltip
          placement="top"
          title={
            isHorizontalNavigator
              ? localeContent['layoutSetting.verticalNavOnly'] || '仅在左侧导航模式下起效'
              : localeContent['layoutSetting.inlineMode'] || '一体式布局'
          }
        >
          <img
            onClick={() =>
              isHorizontalNavigator ? {} : changeLayoutStatus('layoutMode', 'inline')
            }
            src={inlineSvg as any}
            alt=""
          />
        </Tooltip>
        {!isHorizontalNavigator && (
          <CheckOutlined
            className={classNames(
              'RA-setting-selectedIcon',
              isInlineLayout && 'RA-setting-selectedIcon-rightPlace'
            )}
          />
        )}
      </div>
    </>
  );
};

export default inject('layoutStore', 'localeStore')(observer(NavigateMode));
