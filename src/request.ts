import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { HttpClient, } from 'http-client-4ts'

/**
 * @description HttpClient初始化，配置新建一个 HttpClient 实例
 */
export const client: HttpClient = new HttpClient({
  baseURL: `/`, // 设置基础URL
  timeout: 30 * 1000, // 设置请求超时时间为30秒
  withCredentials: true, // 确保发送请求时会携带cookie
})

//先添加默认的请求和响应拦截器，保证在自定义的请求和响应拦截器之前执行
// client.addRequestInterceptor(defaultRequestInterceptor)
// client.addResponseInterceptor(defaultResponseInterceptor)

// 设置统一的自定义请求头：4个：cookie X-Hospital Accept-Language  X-Platform
// 其中cookie和 Accept-Language在浏览器领域是自带的
export const HTTP_HEADER_X_HOSPITAL: string = 'X-Hospital'
export const HTTP_HEADER_X_PLATFORM: string = 'X-Platform'

/**
 * HttpClient请求拦截器配置
 * @param config
 * @returns {any}
 */
client.addRequestInterceptor({
  fulfilled: (config: InternalAxiosRequestConfig) => {
    // 是否加载loading
    if (config?.headers?.loading ?? false) {

    }

    return config
  },
  rejected: (error: AxiosError) => {
    return Promise.reject(error)
  },
})

const enum CODE {
  UNKNOWN = -1,
  LOGOUT = 456,
  UNAUTHORIZED = 457,
}

/**
 * HttpClient添加响应拦截器
 * @param config
 * @returns {any}
 */
client.addResponseInterceptor({
  fulfilled: (response: AxiosResponse) => {

    // 若data.code存在，覆盖默认code
    const code = response.data?.code ?? response.status
    // 若code属于操作正常code，则status修改为200
    if (code > 300) {
      switch (code) {
        case CODE.UNKNOWN:
          break
        case CODE.LOGOUT:
          // logout()
          break
        case CODE.UNAUTHORIZED:
          // logout()
          break
        case 401:
        case 402:
        case 403:
          break
      }
    }

    return response
  },
  rejected: (error: AxiosError) => {
    let message = error.message
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        console.error('网络错误：断网/无法连接服务器')
      } else if (error.message.includes('timeout')) {
        console.error('网络错误：请求超时')
      } else {
        console.error('网络错误：', error.message)
      }
    } else {
      //说明是其他异常
      console.error('其他异常')
    }
    console.error(message)

    return Promise.reject(error)
  },
})

// 导出 HttpClient 实例
export default client
