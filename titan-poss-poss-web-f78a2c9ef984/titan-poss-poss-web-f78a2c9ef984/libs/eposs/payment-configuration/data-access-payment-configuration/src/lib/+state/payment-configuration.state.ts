import {
  CustomErrors,
  PaymentConfiguration,
  SelectedOptionsData
} from '@poss-web/shared/models';
import { PaymentModeConfigEntity } from './payment-configuration.entity';

export interface PaymentConfigurationState {
  paymentConfigurationlist: PaymentConfiguration[];
  paymentConfiguration: PaymentConfiguration;
  selectedOptions: SelectedOptionsData;
  transctionTypes: any;
  paymentModes: PaymentModeConfigEntity;
  totalElements: number;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
  paymentModeCount: number;
  configId: string;
  tcsPaymentModes: any;
  error: CustomErrors;
}
