import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

type HttpClientConfig = CreateAxiosDefaults;

type HttpRequestConfig<T = any> = AxiosRequestConfig<T>;

type HttpResponse<T = any> = AxiosResponse<T> & { config: HttpRequestConfig<T>; };

interface RequestInterceptorConfig {
  fulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (response: HttpResponse<T>) => Promise<HttpResponse> | HttpResponse;
  rejected?: (error: any) => any;
}

type HandleErrorMessage = (message: string, error: any) => void;

interface HttpResponseBody<T = any> {
  /**
   * 200 表示成功，其他表示失败
   * 200 means success, others means fail
   */
  code: number | string;
  data?: T;
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
