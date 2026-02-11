import type { AxiosInstance, AxiosResponse } from 'axios';
import type { HttpRequestConfig, HttpClientConfig } from './types';
import axios from 'axios';
import { FileDownloader } from './expand/Downloader';
import { InterceptorManager } from './Interceptor';
import { FileUploader } from './expand/Uploader';

class HttpClient {
  public readonly INSTANCE: AxiosInstance;

  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
  public download: FileDownloader['download'];
  public upload: FileUploader['upload'];

  private readonly defaultConfig: HttpClientConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    // 默认超时时间
    timeout: 30 * 1000,
  };
  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: HttpClientConfig = {}) {
    // 合并默认配置和传入的配置
    const requestConfig = { ...this.defaultConfig, ...options };
    this.INSTANCE = axios.create(requestConfig);

    bindMethods(this);

    // 实例化拦截器管理器
    const interceptorManager = new InterceptorManager(this.INSTANCE);
    this.addRequestInterceptor = interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor = interceptorManager.addResponseInterceptor.bind(interceptorManager);

    // 实例化文件上传器
    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);

    // 实例化文件下载器
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
  }

  /**
   * 获取基础URL
   */
  public getBaseUrl() {
    return this.INSTANCE.defaults.baseURL;
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   */
  public get<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST请求方法
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' });
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' });
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(
    url: string,
    config: HttpRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.INSTANCE({ url, ...config });
      return response as T;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
}

export { HttpClient };

/**
 * 反射绑定类实例的方法到该实例上，确保方法中的`this`引用正确。
 * @param instance
 */
export function bindMethods<T extends object>(instance: T): void {
  const prototype = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(prototype);

  propertyNames.forEach((propertyName) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
    const propertyValue = instance[propertyName as keyof T];

    if (typeof propertyValue === 'function' && propertyName !== 'constructor'
      && descriptor && !descriptor.get && !descriptor.set) {
      instance[propertyName as keyof T] = propertyValue.bind(instance);
    }
  });
}

