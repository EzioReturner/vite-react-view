import React from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import './selectLang.less';
import LocaleStore from '@/store/localeStore';
import { MenuInfo } from 'rc-menu/lib/interface';

interface InjectedProps {
  localeStore: LocaleStore;
}

const SelectLang: React.FC = props => {
  const injected = () => {
    return props as InjectedProps;
  };

  const { localeStore } = injected();

  const changeLang = (data: MenuInfo) => {
    localeStore.setLocale(data.key as string);
  };

  const getIcon = (lang: string) => {
    let icon;
    switch (lang) {
      case 'zh_CN':
        icon = '🇨🇳';
        break;
      case 'en_US':
        icon = '🇺🇸';
        break;
      default:
        icon = '';
        break;
    }

    return icon;
  };

  const getMenu = () => {
    const { lang, languages } = localeStore;
    const selectedLang = lang;
    return (
      <Menu selectedKeys={[selectedLang]}>
        {languages.map(({ lang, langName }) => (
          <Menu.Item key={lang} onClick={changeLang}>
            <span
              style={{
                marginRight: '5px'
              }}
            >
              {getIcon(lang)}
            </span>
            {langName}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={getMenu()} placement="bottomRight">
      <div className="RA-selectLang-iconContainer">
        <GlobalOutlined className="RA-selectLang-icon" />
      </div>
    </Dropdown>
  );
};

export default inject('localeStore')(observer(SelectLang));
