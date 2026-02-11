import type { HttpClient } from "../HttpClient";
import type { HttpRequestConfig } from "../types";

type DownloadRequestConfig = {
  /**
   * 定义期望获得的数据类型。
   * raw: 原始的AxiosResponse，包括headers、status等。
   * body: 只返回响应数据的BODY部分(Blob)
   */
  responseReturn?: "body" | "raw";
} & Omit<HttpRequestConfig, "responseReturn">;

class FileDownloader {
  private client: HttpClient;
  private readonly defaultConfig: DownloadRequestConfig = {
    responseReturn: "body",
    method: "GET",
    responseType: "blob",
  };

  constructor(client: HttpClient) {
    this.client = client;
  }
  /**
   * 下载文件
   * @param url 文件的完整链接
   * @param config 配置信息，可选。
   * @returns 如果config.responseReturn为'body'，则返回Blob(默认)，否则返回HttpResponse<Blob>
   */
  public async download<T = Blob>(
    url: string,
    config?: DownloadRequestConfig,
  ): Promise<T> {
    // 合并默认配置和传入的配置
    const requestConfig: DownloadRequestConfig = {
      ...this.defaultConfig,
      ...config,
    };
    if (!this.client.request) {
      throw new Error(
        `HttpClient does not support method "request". Please ensure the method is properly implemented in your client instance.`,
      );
    }
    return await this.client.request(url, requestConfig);
  }
}

export { FileDownloader };
