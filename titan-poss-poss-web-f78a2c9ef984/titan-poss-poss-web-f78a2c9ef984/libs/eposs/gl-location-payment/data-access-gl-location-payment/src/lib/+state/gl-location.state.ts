import {
  CustomErrors,
  PaymentCodes,
  LocationCodeDetails,
  GLLocationPaymentList
} from '@poss-web/shared/models';
import { GlLocationPaymentDetailsEntity } from './gl-location.entity';

export interface GlLocationPaymentState {
  error: CustomErrors;
  glLocationList: GlLocationPaymentDetailsEntity;
  isLoading: boolean;
  hasSaved: boolean;
  totalCount: number;
  saveGlLocationPayment: GLLocationPaymentList;
  paymentCodes: PaymentCodes[];
  locationData: LocationCodeDetails[];
}
