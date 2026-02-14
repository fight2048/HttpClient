import type {AxiosInstance} from 'axios';

import type {HttpResponse, RequestInterceptorConfig, ResponseInterceptorConfig,} from './types';

/**
 * 默认请求拦截器配置
 */
const defaultRequestInterceptorConfig: RequestInterceptorConfig = {
    fulfilled: (config) => config,
    rejected: (error: unknown) => Promise.reject(error),
};

/**
 * 默认响应拦截器配置
 */
const defaultResponseInterceptorConfig: ResponseInterceptorConfig<HttpResponse> = {
    fulfilled: (response: HttpResponse) => response,
    rejected: (error: unknown) => Promise.reject(error),
};

/**
 * 拦截器管理器
 * 负责管理请求和响应拦截器的添加和移除
 */
class InterceptorManager {
    private readonly httpClient: AxiosInstance;
    private readonly requestInterceptorIds: number[] = [];
    private readonly responseInterceptorIds: number[] = [];

    constructor(instance: AxiosInstance) {
        this.httpClient = instance;
    }

    /**
     * 添加请求拦截器
     * @param config - 拦截器配置，包含fulfilled和rejected回调
     * @returns 拦截器ID，可用于移除拦截器
     */
    addRequestInterceptor(config: RequestInterceptorConfig = defaultRequestInterceptorConfig): number {
        const id = this.httpClient.interceptors.request.use(config.fulfilled, config.rejected);
        this.requestInterceptorIds.push(id);
        return id;
    }

    /**
     * 添加响应拦截器
     * @typeParam T - 响应数据的类型
     * @param config - 拦截器配置，包含fulfilled和rejected回调
     * @returns 拦截器ID，可用于移除拦截器
     */
    addResponseInterceptor(config: ResponseInterceptorConfig<HttpResponse> = defaultResponseInterceptorConfig): number {
        const id = this.httpClient.interceptors.response.use(config.fulfilled, config.rejected);
        this.responseInterceptorIds.push(id);
        return id;
    }

    /**
     * 移除所有请求拦截器
     */
    clearRequestInterceptors(): void {
        this.httpClient.interceptors.request.clear();
        this.requestInterceptorIds.length = 0;
    }

    /**
     * 移除所有响应拦截器
     */
    clearResponseInterceptors(): void {
        this.httpClient.interceptors.response.clear();
        this.responseInterceptorIds.length = 0;
    }

    /**
     * 移除指定的请求拦截器
     * @param id - 拦截器ID
     */
    removeRequestInterceptor(id: number): void {
        const index = this.requestInterceptorIds.indexOf(id);
        if (index > -1) {
            this.httpClient.interceptors.request.eject(id);
            this.requestInterceptorIds.splice(index, 1);
        }
    }

    /**
     * 移除指定的响应拦截器
     * @param id - 拦截器ID
     */
    removeResponseInterceptor(id: number): void {
        const index = this.responseInterceptorIds.indexOf(id);
        if (index > -1) {
            this.httpClient.interceptors.response.eject(id);
            this.responseInterceptorIds.splice(index, 1);
        }
    }
}

export {InterceptorManager};
