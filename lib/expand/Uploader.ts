import type { HttpClient } from '../HttpClient';
import type { HttpRequestConfig } from '../types';

class FileUploader {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public async upload<T = any>(
    url: string,
    data: Record<string, any> & { file: Blob | File },
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

    const finalConfig: HttpRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.client.post(url, formData, finalConfig);
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
