import {authenticatedTokenMixin} from '@leavittsoftware/user-manager/lib/authenticated-token-mixin';
import {BearerTokenProvider} from './bearer-token-provider';

export class AuthenticatedTokenProvider extends authenticatedTokenMixin
(class {}) implements BearerTokenProvider {
  async _getBearerTokenAsync() {
    return await this._getAccessTokenAsync();
  }
}