import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FileUploader } from './Uploader';

describe('fileUploader', () => {
  let fileUploader: FileUploader;
  // Mock the AxiosInstance
  const axios = { post: vi.fn() } as any;

  beforeEach(() => {
    fileUploader = new FileUploader(axios);
  });

  it('instance of FileUploader', () => {
    expect(fileUploader).toBeInstanceOf(FileUploader);
  });

  it('upload a file and response', async () => {
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const mockResponse: AxiosResponse = {
      config: {} as any,
      data: { success: true },
      headers: {},
      status: 200,
      statusText: 'OK',
    };

    (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const response = await fileUploader.upload(url, { file });

    expect(response).toEqual(mockResponse);

    expect(axios.post).toHaveBeenCalledWith(
      url,
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  });

  it('merge provided config with default config', async () => {
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const mockResponse: AxiosResponse = {
      config: {} as any,
      data: { success: true },
      headers: {},
      status: 200,
      statusText: 'OK',
    };

    (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const customConfig: AxiosRequestConfig = {
      headers: { 'Custom-Header': 'value' },
    };

    const response = await fileUploader.upload(url, { file }, customConfig);

    expect(response).toEqual(mockResponse);

    expect(axios.post).toHaveBeenCalledWith(
      url,
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Custom-Header': 'value',
        },
      },
    );
  });

  it('handle errors', async () => {
    const url = 'https://example.com/upload';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });

    (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fileUploader.upload(url, { file })).rejects.toThrow('Network Error');
  });

  it('handle empty URL', async () => {
    const url = '';
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Request failed with status code 404'));

    await expect(fileUploader.upload(url, { file })).rejects.toThrow('Request failed with status code 404');
  });

  it('handle null URL', async () => {
    const url = null as unknown as string;
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Request failed with status code 404'));

    await expect(fileUploader.upload(url, { file })).rejects.toThrow('Request failed with status code 404');
  });
});
