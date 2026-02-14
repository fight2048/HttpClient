import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig,
} from "axios";
import {DownloadRequestConfig, FileDownloader, FileUploader, HttpClient, InterceptorManager} from "./lib";
import type {HttpClientConfig, HttpRequestConfig, RequestInterceptorConfig, ResponseInterceptorConfig} from './types';

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

/**
 * 下载请求配置
 */
export type DownloadRequestConfig = {
    /**
     * 定义期望获得的数据类型
     * body: 只返回响应数据的BODY部分(Blob)
     * raw: 返回原始的AxiosResponse，包括headers、status等
     */
    responseReturn?: 'body' | 'raw';
} & Omit<HttpRequestConfig, 'responseReturn'>;

/**
 * 文件下载器类
 * 负责处理文件下载相关的逻辑
 */
declare class FileDownloader {
    private readonly client;
    private readonly defaultConfig;

    constructor(client: HttpClient);

    /**
     * 下载文件
     * @typeParam T - 响应数据的类型，默认Blob
     * @param url - 文件的完整链接
     * @param config - 配置信息，可选
     * @returns 如果config.responseReturn为'body'，则返回Blob(默认)，否则返回AxiosResponse<Blob>
     */
    download<T = Blob>(url: string, config?: DownloadRequestConfig): Promise<T>;
}

export {FileDownloader};

/**
 * 文件上传数据接口
 */
interface UploadData {
    file: Blob | File;

    [key: string]: any;
}

/**
 * 文件上传器类
 * 负责处理文件上传相关的逻辑
 */
declare class FileUploader {
    private readonly client;

    constructor(client: HttpClient);

    /**
     * 上传文件
     * @typeParam T - 响应数据的类型
     * @param url - 上传URL
     * @param data - 上传数据，包含file字段
     * @param config - 请求配置
     * @returns Promise对象
     */
    upload<T = unknown>(url: string, data: UploadData, config?: HttpRequestConfig): Promise<T>;
}

export {FileUploader};

export declare const defaultRequestInterceptor: RequestInterceptorConfig;
export declare const defaultResponseInterceptor: ResponseInterceptorConfig<HttpResponse<any>>;

/**
 * HTTP客户端类
 * 基于Axios封装的HTTP客户端，支持请求/响应拦截器、文件上传下载等功能
 */
declare class HttpClient {
    /** Axios实例 */
    readonly INSTANCE: AxiosInstance;
    /** 添加请求拦截器 */
    readonly addRequestInterceptor: InterceptorManager['addRequestInterceptor'];
    /** 添加响应拦截器 */
    readonly addResponseInterceptor: InterceptorManager['addResponseInterceptor'];
    /** 下载文件方法 */
    readonly download: FileDownloader['download'];
    /** 上传文件方法 */
    readonly upload: FileUploader['upload'];
    /** 默认配置 */
    private readonly defaultConfig;

    /**
     * 构造函数，用于创建Axios实例
     * @param options - Axios请求配置，可选
     */
    constructor(options?: HttpClientConfig);

    /**
     * 获取基础URL
     * @returns 基础URL字符串
     */
    getBaseUrl(): string | undefined;

    /**
     * DELETE请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param config - 请求配置
     * @returns Promise对象
     */
    delete<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * GET请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param config - 请求配置
     * @returns Promise对象
     */
    get<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * HEAD请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param config - 请求配置
     * @returns Promise对象
     */
    head<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * OPTIONS请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param config - 请求配置
     * @returns Promise对象
     */
    options<T = unknown>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * POST请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param data - 请求数据
     * @param config - 请求配置
     * @returns Promise对象
     */
    post<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;

    /**
     * PUT请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param data - 请求数据
     * @param config - 请求配置
     * @returns Promise对象
     */
    put<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;

    /**
     * PATCH请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param data - 请求数据
     * @param config - 请求配置
     * @returns Promise对象
     */
    patch<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>;

    /**
     * 通用的请求方法
     * @typeParam T - 响应数据的类型
     * @param url - 请求URL
     * @param config - 请求配置
     * @returns Promise对象
     */
    request<T>(config: HttpRequestConfig): Promise<T>;
}

/**
 * 反射绑定类实例的方法到该实例上，确保方法中的`this`引用正确
 * @param instance - 类实例
 */
export declare function bindMethods<T extends object>(instance: T): void;

export {HttpClient};

/**
 * 拦截器管理器
 * 负责管理请求和响应拦截器的添加和移除
 */
declare class InterceptorManager {
    private readonly httpClient;
    private readonly requestInterceptorIds;
    private readonly responseInterceptorIds;

    constructor(instance: AxiosInstance);

    /**
     * 添加请求拦截器
     * @param config - 拦截器配置，包含fulfilled和rejected回调
     * @returns 拦截器ID，可用于移除拦截器
     */
    addRequestInterceptor(config?: RequestInterceptorConfig): number;

    /**
     * 添加响应拦截器
     * @typeParam T - 响应数据的类型
     * @param config - 拦截器配置，包含fulfilled和rejected回调
     * @returns 拦截器ID，可用于移除拦截器
     */
    addResponseInterceptor(config?: ResponseInterceptorConfig<HttpResponse>): number;

    /**
     * 移除所有请求拦截器
     */
    clearRequestInterceptors(): void;

    /**
     * 移除所有响应拦截器
     */
    clearResponseInterceptors(): void;

    /**
     * 移除指定的请求拦截器
     * @param id - 拦截器ID
     */
    removeRequestInterceptor(id: number): void;

    /**
     * 移除指定的响应拦截器
     * @param id - 拦截器ID
     */
    removeResponseInterceptor(id: number): void;
}

export {InterceptorManager};
