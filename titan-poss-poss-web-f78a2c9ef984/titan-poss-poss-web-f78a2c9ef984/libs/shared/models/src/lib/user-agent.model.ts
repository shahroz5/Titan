import { CustomErrors } from './error.model';

export interface UserAgentState {
  hostname: string;
  enableUnipay: boolean;
  isLoading: boolean;
  error: CustomErrors;
}

export interface Hostname {
  hostname: string;
}
