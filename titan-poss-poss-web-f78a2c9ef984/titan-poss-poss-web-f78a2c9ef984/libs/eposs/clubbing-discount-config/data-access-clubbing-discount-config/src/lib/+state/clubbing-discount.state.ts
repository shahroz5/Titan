import {
  CustomErrors,
  DiscountTypeBasedCodes,
  ClubDiscountsList
} from '@poss-web/shared/models';
import { ClubDiscountsEntity } from './clubbing-discount.entity';
export interface ClubDiscountsState {
  error: CustomErrors;
  clubbedDiscountList: ClubDiscountsEntity;
  isLoading: boolean;
  hasSaved: boolean;
  totalCount: number;
  saveclubbedDiscounts: ClubDiscountsList;
  discountCodesType1: DiscountTypeBasedCodes[];
  discountCodesType2: DiscountTypeBasedCodes[];
  discountCodesType3: DiscountTypeBasedCodes[];
}
