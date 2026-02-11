import type { AxiosRequestConfig } from 'axios';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FileDownloader } from './Downloader';

describe('fileDownloader', () => {
  let fileDownloader: FileDownloader;
  const mockAxiosInstance = {
    request: vi.fn(),
  } as any;

  beforeEach(() => {
    fileDownloader = new FileDownloader(mockAxiosInstance);
  });

  it('create FileDownloader', () => {
    expect(fileDownloader).toBeInstanceOf(FileDownloader);
  });

  it('download a file and return a Blob', async () => {
    const url = 'https://example.com/file';
    const mockBlob = new Blob(['file content'], { type: 'text/plain' });
    const mockResponse: Blob = mockBlob;

    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const response = await fileDownloader.download(url);

    expect(response).toBeInstanceOf(Blob);
    expect(response).toEqual(mockBlob);
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(url, {
      method: 'GET',
      responseType: 'blob',
      responseReturn: 'body',
    });
  });

  it('merge provided config with default config', async () => {
    const url = 'https://example.com/file';
    const mockBlob = new Blob(['file content'], { type: 'text/plain' });
    const mockResponse: Blob = mockBlob;

    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const customConfig: AxiosRequestConfig = {
      headers: { 'Custom-Header': 'value' },
    };

    const response = await fileDownloader.download(url, customConfig);
    expect(response).toBeInstanceOf(Blob);
    expect(response).toEqual(mockBlob);
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(url, {
      ...customConfig,
      method: 'GET',
      responseType: 'blob',
      responseReturn: 'body',
    });
  });

  it('handle errors gracefully', async () => {
    const url = 'https://example.com/file';
    mockAxiosInstance.request.mockRejectedValueOnce(new Error('Network Error'));
    await expect(fileDownloader.download(url)).rejects.toThrow('Network Error');
  });

  it('handle empty URL gracefully', async () => {
    const url = '';
    mockAxiosInstance.request.mockRejectedValueOnce(
      new Error('Request failed with status code 404'),
    );

    await expect(fileDownloader.download(url)).rejects.toThrow('Request failed with status code 404');
  });

  it('handle null URL gracefully', async () => {
    const url = null as unknown as string;
    mockAxiosInstance.request.mockRejectedValueOnce(
      new Error('Request failed with status code 404'),
    );

    await expect(fileDownloader.download(url)).rejects.toThrow('Request failed with status code 404');
  });
});

describe('fileDownloader use other method', () => {
  let fileDownloader: FileDownloader;

  it('call request using get', async () => {
    const url = 'https://example.com/file';
    const mockBlob = new Blob(['file content'], { type: 'text/plain' });
    const mockResponse: Blob = mockBlob;

    const mockAxiosInstance = {
      request: vi.fn(),
    } as any;

    fileDownloader = new FileDownloader(mockAxiosInstance);

    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse);

    const response = await fileDownloader.download(url);

    expect(response).toBeInstanceOf(Blob);
    expect(response).toEqual(mockBlob);
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(url, {
      method: 'GET',
      responseType: 'blob',
      responseReturn: 'body',
    });
  });

  it('call post', async () => {
    const url = 'https://example.com/file';

    const mockAxiosInstance = {
      request: vi.fn(),
    } as any;

    fileDownloader = new FileDownloader(mockAxiosInstance);

    const customConfig: AxiosRequestConfig = {
      method: 'POST',
      data: { name: 'aa' },
    };

    await fileDownloader.download(url, customConfig);

    expect(mockAxiosInstance.request).toHaveBeenCalledWith(
      url,
      {
        method: 'POST',
        data: { name: 'aa' },
        responseType: 'blob',
        responseReturn: 'body',
      },
    );
  });

  it('handle errors', async () => {
    const url = 'https://example.com/file';
    const mockAxiosInstance = {
      request1: vi.fn(),
    } as any;

    fileDownloader = new FileDownloader(mockAxiosInstance);

    await expect(() => fileDownloader.download(url, { method: 'POST' }))
      .rejects.toThrow(
        `HttpClient does not support method "request". Please ensure the method is properly implemented in your client instance.`,
      );
  });
});
