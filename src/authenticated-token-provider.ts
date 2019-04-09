import {GetUserManagerInstace} from '@leavittsoftware/user-manager/lib/user-manager';
import {BearerTokenProvider} from './bearer-token-provider';

export class AuthenticatedTokenProvider implements BearerTokenProvider {
  async _getBearerTokenAsync() {
    return await GetUserManagerInstace().getAccessTokenAsync();
  }
}