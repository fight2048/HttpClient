import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpClient } from '../../lib/HttpClient';

describe('httpClient', () => {
  let mock: MockAdapter;
  let client: HttpClient;

  beforeEach(() => {
    mock = new MockAdapter(axios, {
      delayResponse: 100,      // 所有模拟请求延迟1秒
      onNoMatch: 'passthrough'  // 未匹配的请求将真实发送
    });
    client = new HttpClient();
  });

  afterEach(() => {
    mock.reset();
  });

  it('GET request', async () => {
    const mockData = { data: 'data' };

    mock.onGet('test/url')
      .reply(200, mockData);

    const response = await client.get('test/url');

    expect(response.data)
      .toEqual(mockData);
  });

  it('POST request', async () => {
    const postData = { key: 'value' };
    const mockData = { data: 'data' };

    mock.onPost('/test/post', postData)
      .reply(200, mockData);

    const response = await client.post('/test/post', postData);

    expect(response.data)
      .toEqual(mockData);
  });

  it('PUT request', async () => {
    const putData = { key: 'value' };
    const mockData = { data: 'data' };

    mock.onPut('/test/put', putData)
      .reply(200, mockData);

    const response = await client.put('/test/put', putData);

    expect(response.data)
      .toEqual(mockData);
  });

  it('DELETE request', async () => {
    const mockData = { data: 'data' };

    mock.onDelete('/test/delete')
      .reply(200, mockData);
    const response = await client.delete('/test/delete');

    expect(response.data)
      .toEqual(mockData);
  });

  it('handle network errors', async () => {
    mock.onGet('/test/error').networkError();
    try {
      await client.get('/test/error');
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.isAxiosError).toBe(true);
      expect(error.message).toBe('Network Error');
    }
  });

  it('handle timeout', async () => {
    mock.onGet('/test/timeout').timeout();
    try {
      await client.get('/test/timeout');
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.isAxiosError).toBe(true);
      expect(error.code).toBe('ECONNABORTED');
    }
  });

  it('upload a file', async () => {
    const file = new Blob(['file contents'], { type: 'text/plain' });
    const mockData = { data: 'data' };
    const mockError = { error: 'error' };

    mock.onPost('/test/upload')
      .reply((config) => {
        return config.data instanceof FormData && config.data.has('file')
          ? [200, mockData]
          : [400, mockError];
      });

    const response = await client.upload('/test/upload', { file });
    expect(response.data).toEqual(mockData);
  });

  it('download a file as a blob', async () => {
    const file = new Blob(['file content'], { type: 'text/plain' });

    mock.onGet('/test/download').reply(200, file);

    const response = await client.download('/test/download');

    expect(response).toBeInstanceOf(Blob);
  });
});
