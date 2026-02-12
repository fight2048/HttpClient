import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { HttpRequestConfig, HttpClientConfig } from './types';
import axios from 'axios';
import { FileDownloader } from './expand/Downloader';
import { FileUploader } from './expand/Uploader';
import { InterceptorManager } from './Interceptor';

/**
 * HTTP客户端类
 * 基于Axios封装的HTTP客户端，支持请求/响应拦截器、文件上传下载等功能
 */
class HttpClient {
  /** Axios实例 */
  public readonly INSTANCE: AxiosInstance;

  /** 添加请求拦截器 */
  public readonly addRequestInterceptor: InterceptorManager['addRequestInterceptor'];

  /** 添加响应拦截器 */
  public readonly addResponseInterceptor: InterceptorManager['addResponseInterceptor'];

  /** 下载文件方法 */
  public readonly download: FileDownloader['download'];

  /** 上传文件方法 */
  public readonly upload: FileUploader['upload'];

  /** 默认配置 */
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
   * @returns 基础URL字符串
   */
  public getBaseUrl(): string | undefined {
    return this.INSTANCE.defaults.baseURL;
  }

  /**
   * DELETE请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param config - 请求配置
   * @returns Promise对象
   */
  public delete<T = unknown>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param config - 请求配置
   * @returns Promise对象
   */
  public get<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * HEAD请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param config - 请求配置
   * @returns Promise对象
   */
  public head<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'HEAD' });
  }

  /**
   * OPTIONS请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param config - 请求配置
   * @returns Promise对象
   */
  public options<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'OPTIONS' });
  }

  /**
   * POST请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns Promise对象
   */
  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' });
  }

  /**
   * PUT请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns Promise对象
   */
  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' });
  }

  /**
   * PATCH请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns Promise对象
   */
  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PATCH' });
  }

  /**
   * 通用的请求方法
   * @typeParam T - 响应数据的类型
   * @param url - 请求URL
   * @param config - 请求配置
   * @returns Promise对象
   */
  public async request<T>(
    url: string,
    config: HttpRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.INSTANCE({ url, ...config });
      return response as unknown as T;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>;
        throw axiosError.response ? axiosError.response.data : error;
      }
      throw error;
    }
  }
}

/**
 * 反射绑定类实例的方法到该实例上，确保方法中的`this`引用正确
 * @param instance - 类实例
 */
export function bindMethods<T extends object>(instance: T): void {
  const prototype = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(prototype);

  propertyNames.forEach((propertyName) => {
    if (propertyName === 'constructor') {
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
    const propertyValue = instance[propertyName as keyof T];

    if (
      typeof propertyValue === 'function' &&
      descriptor &&
      !descriptor.get &&
      !descriptor.set
    ) {
      instance[propertyName as keyof T] = propertyValue.bind(instance);
    }
  });
}

export { HttpClient };

