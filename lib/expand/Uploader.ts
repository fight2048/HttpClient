import type { HttpClient } from '../HttpClient';
import type { HttpRequestConfig } from '../types';

/**
 * 文件上传数据接口
 */
interface UploadData {
  // 要上传的文件
  file: Blob | File;
  // 其他表单字段
  [key: string]: any;
}

/**
 * 文件上传器类
 * 负责处理文件上传相关的逻辑
 */
class FileUploader {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * 上传文件
   * @typeParam T - 响应数据的类型
   * @param url - 上传URL
   * @param data - 上传数据，包含file字段
   * @param config - 请求配置
   * @returns Promise对象
   */
  public async upload<T = unknown>(
    url: string,
    data: UploadData,
    config?: HttpRequestConfig,
  ): Promise<T> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          !isUndefined(item) && formData.append(`${key}[${index}]`, item);
        });
      } else {
        !isUndefined(value) && formData.append(key, value);
      }
    });

    const requestConfig: HttpRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.client.post<T>(url, formData, requestConfig);
  }
}

export { FileUploader };

/**
 * 检查传入的值是否为undefined。
 *
 * @param {unknown} value 要检查的值。
 * @returns {boolean} 如果值是undefined，返回true，否则返回false。
 */
function isUndefined(value?: unknown): value is undefined {
  return value === undefined;
}
