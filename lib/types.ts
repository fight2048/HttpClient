import type {AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig,} from "axios";

/**
 * HTTP客户端配置类型
 * 基于Axios默认配置，扩展了自定义选项
 */
export type HttpClientConfig = CreateAxiosDefaults;

/**
 * HTTP请求配置类型
 * 使用泛型T约束请求数据的类型，提高类型安全性
 * @typeParam T - 请求数据的类型，默认为unknown避免使用any
 */
export type HttpRequestConfig<T = unknown> = AxiosRequestConfig<T> & {
    /**
     * 响应数据的返回方式。
     * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查。
     * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）。
     * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）。
     */
    responseReturn?: "body" | "data" | "raw";
};

/**
 * HTTP响应类型
 * 扩展AxiosResponse，添加config属性
 * @typeParam T - 响应数据的类型
 */
export type HttpResponse<T = unknown> = AxiosResponse<T> & {
    config: HttpRequestConfig<T>;
};

/**
 * 请求拦截器配置
 * @typeParam T - 请求配置的类型
 */
export interface RequestInterceptorConfig<T = InternalAxiosRequestConfig> {
    fulfilled?: (value: T) => T | Promise<T>;
    rejected?: (error: unknown) => unknown;
}

/**
 * 响应拦截器配置
 * @typeParam T - 响应数据的类型
 */
export interface ResponseInterceptorConfig<T> {
    fulfilled?: (value: T) => T | Promise<T>;
    rejected?: (error: unknown) => unknown;
}

/**
 * 错误消息处理器类型
 * @param message - 错误消息
 * @param error - 原始错误对象
 */
export type HandleErrorMessage = (message: string, error: unknown) => void;

/**
 * HTTP响应体标准格式
 * @typeParam T - 业务数据的类型
 */
export interface R<T = unknown> {
    /**
     * 业务状态码
     * @example 200 表示成功
     * @example 400, 500 等表示错误
     */
    code: number | string;
    /**
     * 响应消息
     */
    message?: string;

    /**
     * 业务数据
     */
    data?: T;
}

