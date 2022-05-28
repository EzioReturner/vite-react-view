import { hex2rgb, rgb2hsl, hsl2lighten, hsl2darken, hsl2fade, color2tint } from '@/utils/tools';
import setting from '@/config/setting';
import cloneDeep from 'lodash/cloneDeep';
import { ConfigProvider } from 'antd';

const { defaultDarkTheme, defaultLightTheme } = setting;

export function changeTheme(visionTheme: string, currentColor: string) {
  let rgbColor = hex2rgb(currentColor, 'number') as number[];
  let hslColor = rgb2hsl(rgbColor, 'number') as number[];

  const _className = ['darkTheme', 'lightTheme'].reduce((total: string, _key: string) => {
    if (total.indexOf(_key) >= 0) {
      total = total.replace(_key, '');
    }
    return total;
  }, cloneDeep(document.body.className));

  document.body.className = (_className + ` ${visionTheme}Theme`).trim();

  ConfigProvider.config({
    theme: {
      primaryColor: currentColor
    }
  });

  document.body.style.setProperty('--vrp-primary', currentColor);
  document.body.style.setProperty('--tc-primary', currentColor);

  document.body.style.setProperty('--vrp-primary-lighten', hsl2lighten(hslColor, 8));
  document.body.style.setProperty('--vrp-primary-lightener', hsl2lighten(hslColor, 20));
  document.body.style.setProperty('--vrp-primary-lightener-extra', hsl2lighten(hslColor, 33.5));

  document.body.style.setProperty('--tc-primary-lightener-extra', hsl2lighten(hslColor, 33.5));
  document.body.style.setProperty('--vrp-primary-darken', hsl2darken(hslColor, 8));

  document.body.style.setProperty('--vrp-primary-1', color2tint(rgbColor, 0.9));
  document.body.style.setProperty('--vrp-primary-2', color2tint(rgbColor, 0.8));
  document.body.style.setProperty('--vrp-primary-5', color2tint(rgbColor, 0.2));

  console.log('sussess');
}
