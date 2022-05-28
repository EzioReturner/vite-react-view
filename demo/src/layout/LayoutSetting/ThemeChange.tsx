import React from 'react';
import classNames from 'classnames';
import { CheckOutlined } from '@ant-design/icons';
import setting from '@/config/setting';
import { message, Tooltip } from 'antd';
import LayoutStore from '@/store/layoutStore';
import { observer, inject } from 'mobx-react';
import LocaleStore from '@/store/localeStore';
import lightSvg from '@/assets/image/setting/light.svg';
import darkSvg from '@/assets/image/setting/dark.svg';

const { themeColors } = setting;

const ThemeChange: React.FC = props => {
  const {
    layoutStore: {
      isDarkTheme,
      changeLayoutStatus,
      layoutStatus: { currentColor }
    },
    localeStore: { localeContent }
  } = props as { layoutStore: LayoutStore; localeStore: LocaleStore };

  const handleChangeTheme = (color: string) => {
    changeLayoutStatus('currentColor', color);
    message.loading('正在加载主题', 1.4);
  };

  const handleChangeVision = (theme: 'light' | 'dark') => {
    // changeLayoutStatus('visionTheme', theme);
    message.info('此功能将在未来支持', 1.4);
  };

  return (
    <>
      <div className={classNames('RA-setting-Row', 'RA-setting-haveSelectedIcon')}>
        <div className="RA-setting-title">
          {localeContent['layoutSetting.visionTheme'] || '整体色彩模式'}
        </div>
        <Tooltip placement="top" title={localeContent['layoutSetting.lightTheme'] || '亮色模式'}>
          <img src={lightSvg as any} alt="" onClick={() => handleChangeVision('light')} />
        </Tooltip>
        <Tooltip placement="top" title={localeContent['layoutSetting.darkTheme'] || '暗黑模式'}>
          <img src={darkSvg as any} alt="" onClick={() => handleChangeVision('dark')} />
        </Tooltip>
        <CheckOutlined
          className={classNames(
            'RA-setting-selectedIcon',
            isDarkTheme && 'RA-setting-selectedIcon-rightPlace'
          )}
        />
      </div>
      <div className={classNames('RA-setting-Row', 'RA-setting-themeChange')}>
        <div className="RA-setting-title">
          {localeContent['layoutSetting.colorStyle'] || '色彩风格'}
        </div>
        {themeColors?.map(c => (
          <div
            key={c}
            style={{ backgroundColor: c }}
            className="RA-setting-themeChange-colorBlock"
            onClick={() => handleChangeTheme(c)}
          >
            {currentColor === c && <CheckOutlined />}
          </div>
        ))}
      </div>
    </>
  );
};

export default inject('layoutStore', 'localeStore')(observer(ThemeChange));
