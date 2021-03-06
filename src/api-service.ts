﻿import {BearerTokenProvider} from './bearer-token-provider';
import {GetResult} from './get-result';
import {ODataDto} from './odata-dto';

export class ApiService {
  constructor(tokenProvider: BearerTokenProvider) {
    this._tokenProvider = tokenProvider;
    this.addHeader('Content-Type', 'application/json');
    this.addHeader('X-LGAppName', 'General');
  }

  private _tokenProvider: BearerTokenProvider;

  addHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  deleteHeader(key: string) {
    delete this.headers[key];
  }

  headers = {} as any;
  baseUrl: string = 'https://api2.leavitt.com/';

  async postAsync<T>(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<T|null> {
    // Add in the odata model info if it not already on the object
    if (body._odataInfo && !body['@odata.type']) {
      if (body._odataInfo.type) {
        body['@odata.type'] = body._odataInfo.type;
      }
      delete body._odataInfo;
    }

    if (appName !== null) {
      this.addHeader('X-LGAppName', appName);
    }

    this.addHeader('Authorization', `Bearer ${await this._tokenProvider._getBearerTokenAsync()}`);

    let response;
    try {
      response = await fetch(`${this.baseUrl}${urlPath}`, {method: 'POST', body: JSON.stringify(body), headers: this.headers});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    if (response.status === 204) {
      return Promise.resolve(null);
    }

    let json;
    try {
      json = await response.json();
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }

    if (json.error != null) {
      return Promise.reject(json.error.message);
    }

    if (response.status === 201 || response.status === 200) {
      return Promise.resolve(json);
    } else {
      return Promise.reject('Request error, please try again later.');
    }
  }

  async patchAsync(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<void> {
    // Add in the odata model info if it not already on the object
    if (body._odataInfo && !body['@odata.type']) {
      if (body._odataInfo.type) {
        body['@odata.type'] = body._odataInfo.type;
      }
      delete body._odataInfo;
    }
    if (appName !== null) {
      this.addHeader('X-LGAppName', appName);
    }

    this.addHeader('Authorization', `Bearer ${await this._tokenProvider._getBearerTokenAsync()}`);

    let response;
    try {
      response = await fetch(`${this.baseUrl}${urlPath}`, {method: 'PATCH', body: JSON.stringify(body), headers: this.headers});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    if (response.status === 204) {
      return Promise.resolve();
    }

    let json;
    try {
      json = await response.json();

      if (json.error != null) {
        return Promise.reject(json.error.message);
      }

      return Promise.reject('Request error, please try again later.');
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }
  }

  async patchReturnDtoAsync<T>(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<T> {
    // Add in the odata model info if it not already on the object
    if (body._odataInfo && !body['@odata.type']) {
      if (body._odataInfo.type) {
        body['@odata.type'] = body._odataInfo.type;
      }
      delete body._odataInfo;
    }
    if (appName !== null) {
      this.addHeader('X-LGAppName', appName);
    }

    this.addHeader('Authorization', `Bearer ${await this._tokenProvider._getBearerTokenAsync()}`);

    let response;
    try {
      response = await fetch(`${this.baseUrl}${urlPath}`, {method: 'PATCH', body: JSON.stringify(body), headers: {...this.headers, 'Prefer': 'return=representation'}});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    let json;
    try {
      json = await response.json();

      if (json.error != null) {
        return Promise.reject(json.error.message);
      }

      if (response.status === 200) {
        return Promise.resolve(json);
      } else {
        return Promise.reject('Request error, please try again later.');
      }
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }
  }

  async deleteAsync(urlPath: string, appName: string|null = null): Promise<void> {
    if (appName !== null) {
      this.addHeader('X-LGAppName', appName);
    }

    this.addHeader('Authorization', `Bearer ${await this._tokenProvider._getBearerTokenAsync()}`);

    let response;
    try {
      response = await fetch(`${this.baseUrl}${urlPath}`, {method: 'DELETE', headers: this.headers});
    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    if (response.status === 204) {
      return Promise.resolve();
    }

    if (response.status === 404) {
      return Promise.reject('Not Found');
    }

    let json;
    try {
      json = await response.json();
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }

    if (json.error != null) {
      return Promise.reject(json.error.message);
    }

    if (response.status === 201) {
      return Promise.resolve(json);
    } else {
      return Promise.reject('Request error, please try again later.');
    }
  }

  async getAsync<T extends ODataDto>(urlPath: string, appName: string|null = null): Promise<GetResult<T>> {
    if (appName !== null) {
      this.addHeader('X-LGAppName', appName);
    }

    this.addHeader('Authorization', `Bearer ${await this._tokenProvider._getBearerTokenAsync()}`);

    let response;
    try {
      response = await fetch(`${this.baseUrl}${urlPath}`, {
        method: 'GET',
        headers: this.headers

      });

    } catch (error) {
      if (error.message != null && error.message.indexOf('Failed to fetch') !== -1)
        return Promise.reject('Network error. Check your connection and try again.');

      return Promise.reject(error);
    }

    if (response.status === 404) {
      return Promise.reject(`404: Endpoint not found.`);
    }

    const text = await response.text();
    let json;
    try {
      json = text.length ? JSON.parse(text) : {};
    } catch (error) {
      return Promise.reject(`The server sent back invalid JSON. ${error}`);
    }

    if (json.error) {
      return Promise.reject(json.error.message);
    }

    return Promise.resolve(new GetResult<T>(json));
  }
}
