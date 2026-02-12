import type { HttpClient } from "../HttpClient";
import type { HttpRequestConfig } from "../types";

/**
 * 下载请求配置
 */
type DownloadRequestConfig = {
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
class FileDownloader {
  private readonly client: HttpClient;
  private readonly defaultConfig: DownloadRequestConfig;

  constructor(client: HttpClient) {
    this.client = client;
    this.defaultConfig = {
      method: 'GET',
      responseType: 'blob',
      responseReturn: 'body',
    };
  }

  /**
   * 下载文件
   * @typeParam T - 响应数据的类型，默认Blob
   * @param url - 文件的完整链接
   * @param config - 配置信息，可选
   * @returns 如果config.responseReturn为'body'，则返回Blob(默认)，否则返回AxiosResponse<Blob>
   */
  public async download<T extends Blob = Blob>(
    url: string,
    config?: DownloadRequestConfig,
  ): Promise<T> {
    // 合并默认配置和传入的配置
    const requestConfig: DownloadRequestConfig = {
      ...this.defaultConfig,
      ...config,
    };

    if (typeof this.client.request !== 'function') {
      throw new Error(
        'HttpClient does not support method "request". Please ensure the method is properly implemented in your client instance.',
      );
    }

    return await this.client.request<T>(url, requestConfig);
  }
}

export { FileDownloader };
