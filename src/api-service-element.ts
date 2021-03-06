﻿import {determineIsDevelopment} from '@leavittsoftware/titanium-elements/lib/titanium-dev-detection-mixin';
import {customElement, LitElement, property} from 'lit-element';

import {ApiService} from './api-service';
import {AuthenticatedTokenProvider} from './authenticated-token-provider';
import {GetResult} from './get-result';
import {ODataDto} from './odata-dto';

@customElement('api-service')
export class ApiServiceElement extends LitElement {
  private _apiService: ApiService = new ApiService(new AuthenticatedTokenProvider());

  @property({type: String}) baseProductionUri: string = 'https://api2.leavitt.com/';

  @property({type: String}) baseDevUri: string = 'https://devapi2.leavitt.com/';

  @property({type: String}) appName: string = 'General';

  firstUpdated() {
    if (this._apiService) {
      this._apiService.baseUrl = determineIsDevelopment(window.location.origin) ? this.baseDevUri : this.baseProductionUri;
    }
  }

  updated(changedProps: any) {
    if (changedProps.has('appName') && changedProps.get('appName') !== this.appName) {
      if (this.appName === '' || typeof this.appName === 'undefined' || this.appName === null) {
        this._apiService.deleteHeader('X-LGAppName');
      } else {
        this._apiService.addHeader('X-LGAppName', this.appName);
      }
    }
  }

  async postAsync<T>(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<T|null> {
    return this._apiService.postAsync<T>(urlPath, body, appName);
  }

  async getAsync<T extends ODataDto>(urlPath: string, appName: string|null = null): Promise<GetResult<T>> {
    return this._apiService.getAsync<T>(urlPath, appName);
  }

  async patchAsync(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<void> {
    return this._apiService.patchAsync(urlPath, body, appName);
  }

  async patchReturnDtoAsync<T>(urlPath: string, body: any&ODataDto, appName: string|null = null): Promise<T> {
    return this._apiService.patchReturnDtoAsync<T>(urlPath, body, appName);
  }

  async deleteAsync(urlPath: string, appName: string|null = null): Promise<void> {
    return this._apiService.deleteAsync(urlPath, appName);
  }
}