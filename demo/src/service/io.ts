import Axios from 'axios';
import { notification } from 'antd';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
interface IoOptions extends AxiosRequestConfig {
  returnConfig?: boolean; // 是否返回req配置项
  options?: AxiosRequestConfig;
  passFilter?: boolean;
}

class Request {
  instance: AxiosInstance;

  constructor() {
    const baseURL = ['localhost', '0.0.0.0', '10.130.94.195'].includes(window.location.hostname)
      ? `http://${window.location.hostname}:9009`
      : window.location.origin;
    this.instance = Axios.create({
      baseURL,
      timeout: 60000
    });
    this.initInterceptors();
  }

  // 初始化拦截器
  initInterceptors() {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (error: AxiosResponse) => {
        Promise.reject(error);
      }
    );
  }

  // 设置自定义头部
  setHeader = (key: string, val: string) => {
    this.instance.defaults.headers.common[key] = val;
  };

  // 错误notify
  notify(message: string | number) {
    notification.error({
      message: '请求错误',
      description: `${
        message ||
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.'
      }`
    });
  }

  // 错误处理
  handleError = (error: any) => {
    const { errMsg, status, errCode } = error;

    switch (status) {
      case 401:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        this.notify(errMsg || error);
        break;
    }
    return Promise.reject(error);
  };

  filterStatus(res: any, returnConfig: boolean) {
    const { data } = res;
    if (Array.isArray(data)) return data;
    if (data.success === undefined || data.success) {
      return returnConfig ? res : data;
    } else {
      return Promise.reject(data);
    }
  }

  async sendRequest(method: Method, url: string, details: IoOptions) {
    const { params, returnConfig = false, data = undefined, options, passFilter } = details;
    return this.instance
      .request({
        url,
        method,
        ...params,
        data: passFilter ? data : omitBy(data || {}, isNil),
        ...options
      })
      .then(res => this.filterStatus(res, returnConfig))
      .catch(this.handleError);
  }

  get(path: string, options: IoOptions = {}) {
    const { params: query, passFilter } = options;
    let _path: string = path;
    if (query) {
      const keys = Object.keys(passFilter ? query : omitBy(query, isNil));
      if (keys.length) {
        _path += `?${keys.map(key => `${key}=${query[key]}`).join('&')}`;
      }
    }
    return this.sendRequest('get', _path, options);
  }

  post(path: string, options: IoOptions) {
    const _path = `${path}${path.includes('?') ? '&' : '?'}_csrf=${window.pageConfig._csrf}`;
    return this.sendRequest('post', _path, options);
  }

  put(path: string, options: IoOptions) {
    return this.sendRequest('put', path, options);
  }

  patch(path: string, options: IoOptions) {
    return this.sendRequest('patch', path, options);
  }

  delete(path: string, options: IoOptions) {
    return this.sendRequest('delete', path, options);
  }
}
const request = new Request();

export default request;
