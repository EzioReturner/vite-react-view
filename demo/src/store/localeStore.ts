import { observable, configure, action } from 'mobx';
import setting from '@/config/setting';

const { usei18n } = setting;

interface Languages {
  lang: string;
  langName: string;
  version: number;
}

configure({ enforceActions: 'observed' });
class LocaleStore {
  @observable lang: string = localStorage.getItem('lucky-lang') || 'zh_CN';
  @observable localeContent: any = {};
  @observable languages: Languages[] = [];
  dict: string = '';

  constructor() {
    usei18n && this.initLocaleList();
  }

  async initLocaleList() {
    await this.dispatchI18nDict();
    await this.dispatchDictLanguage();
    await this.dispachLocaleContent();
  }

  async dispatchI18nDict() {}

  @action setDict(dict: string) {
    this.dict = dict;
  }

  async dispatchDictLanguage() {}

  @action setLanguages(data: Languages[]) {
    this.languages = data;
  }

  async dispachLocaleContent() {}

  @action setLocale(key: string): void {
    this.lang = key;
    localStorage.setItem('lucky-lang', key);
    this.dispachLocaleContent();
  }

  @action setLocaleContent(data: any) {
    this.localeContent = data;
  }
}

export const localeStore = new LocaleStore();
export default LocaleStore;
