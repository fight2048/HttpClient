import type {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig,
} from 'axios';

/**
 * HTTP客户端配置类型
 * 基于Axios默认配置，扩展了自定义选项
 */
type HttpClientConfig = CreateAxiosDefaults;

/**
 * HTTP请求配置类型
 * 使用泛型T约束请求数据的类型，提高类型安全性
 * @typeParam T - 请求数据的类型，默认为unknown避免使用any
 */
type HttpRequestConfig<T = unknown> = AxiosRequestConfig<T>;

/**
 * HTTP响应类型
 * 扩展AxiosResponse，添加config属性
 * @typeParam T - 响应数据的类型
 */
type HttpResponse<T = unknown> = AxiosResponse<T> & { config: HttpRequestConfig<T>; };

/**
 * 请求拦截器配置
 * @typeParam T - 请求配置的类型
 */
interface RequestInterceptorConfig<T = InternalAxiosRequestConfig> {
    fulfilled?: (config: T) => T | Promise<T>;
    rejected?: (error: AxiosError) => Promise<never>;
}

/**
 * 响应拦截器配置
 * @typeParam T - 响应数据的类型
 */
interface ResponseInterceptorConfig<T = unknown> {
    fulfilled?: (response: HttpResponse<T>) => HttpResponse | Promise<HttpResponse>;
    rejected?: (error: AxiosError) => Promise<never>;
}

/**
 * 错误消息处理器类型
 * @param message - 错误消息
 * @param error - 原始错误对象
 */
type HandleErrorMessage = (message: string, error: unknown) => void;

/**
 * HTTP响应体标准格式
 * @typeParam T - 业务数据的类型
 */
interface HttpResponseBody<T = unknown> {
    /**
     * 业务状态码
     * @example 200 表示成功
     * @example 400, 500 等表示错误
     */
    code: number;
    /**
     * 业务数据
     */
    data?: T;
    /**
     * 响应消息
     */
    message?: string;
}

export type {
    HttpResponseBody,
    HandleErrorMessage,
    HttpRequestConfig,
    HttpClientConfig,
    RequestInterceptorConfig,
    HttpResponse,
    ResponseInterceptorConfig,
};
