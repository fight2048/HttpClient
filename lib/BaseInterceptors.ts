import type {
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
  HttpResponse
} from 'http-client-4ts';
import {
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

export const defaultRequestInterceptor: RequestInterceptorConfig = {
  fulfilled: (config: InternalAxiosRequestConfig) => {
    //对于传参时，如果传递是空值，则该字段干脆不要作为参数传递
    if (config.data
      && typeof config.data === 'object'
      && !Array.isArray(config.data)) {
      const d = Object.entries(config.data)
        .filter((value, index) => {
          return value[1] ?? false
        })
      config.data = Object.fromEntries(d)
    }

    if (config.params
      && typeof config.params === 'object'
      && !Array.isArray(config.params)) {
      const d = Object.entries(config.params)
        .filter((value, index) => {
          return value[1] ?? false
        })
      config.params = Object.fromEntries(d)
    }
    return config
  },
  rejected: (error: AxiosError) => {
    return Promise.reject(error);
  },
}

export const defaultResponseInterceptor: ResponseInterceptorConfig = {
  fulfilled: (response: HttpResponse) => {
    if (response.status < 200 || response.status >= 400) {
      throw Object.assign({}, response, { response });
    }

    if (!response?.config?.responseReturn || response?.config?.responseReturn === 'raw') {
      return response;
    }

    if (response?.config?.responseReturn === 'body') {
      return response?.data ?? {};
    }

    if (response?.config?.responseReturn === 'data') {
      return response?.data?.data ?? {};
    }

    return response;
  },
  rejected: (error: AxiosError) => {
    return Promise.reject(error);
  }
};