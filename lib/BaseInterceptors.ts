import type {RequestInterceptorConfig, ResponseInterceptorConfig} from './types';
import {HttpResponse} from "./types";
import {InternalAxiosRequestConfig,} from 'axios';

export const defaultRequestInterceptor: RequestInterceptorConfig = {
    fulfilled: (config: InternalAxiosRequestConfig) => {
        //对于传参时，如果传递是空值，则该字段干脆不要作为参数传递
        if (config.data
            && typeof config.data === 'object'
            && !Array.isArray(config.data)) {
            const d = Object.entries(config.data)
                .filter((value, _) => {
                    return value[1] ?? false
                })
            config.data = Object.fromEntries(d)
        }

        if (config.params
            && typeof config.params === 'object'
            && !Array.isArray(config.params)) {
            const d = Object.entries(config.params)
                .filter((value, _) => {
                    return value[1] ?? false
                })
            config.params = Object.fromEntries(d)
        }
        return config
    },
    rejected: (error: unknown) => {
        return Promise.reject(error);
    },
}

// export const defaultResponseInterceptor = (): ResponseInterceptorConfig<HttpResponse<any>> => {
//     return {
//         fulfilled: (response: HttpResponse<any>) => {
//             const {config, data, status} = response;
//
//             if (status < 200 || status >= 400) {
//                 throw Object.assign({}, response, {response});
//             }
//
//             if (config?.responseReturn === 'raw') {
//                 return response;
//             }
//
//             if (config?.responseReturn === 'body') {
//                 return data;
//             }
//
//             if (config?.responseReturn === 'data') {
//                 return (data as { data: unknown })?.data;
//             }
//
//             return response;
//         },
//     };
// };

export const defaultResponseInterceptor: ResponseInterceptorConfig<HttpResponse<any>> = {
    fulfilled: (response: HttpResponse<any>) => {
        const {config, data, status} = response;

        if (status < 200 || status >= 400) {
            throw Object.assign({}, response, {response});
        }

        if (config?.responseReturn === 'raw') {
            return response;
        }

        if (config?.responseReturn === 'body') {
            return data;
        }

        if (config?.responseReturn === 'data') {
            return (data as { data: unknown })?.data;
        }

        return response;
    },
};