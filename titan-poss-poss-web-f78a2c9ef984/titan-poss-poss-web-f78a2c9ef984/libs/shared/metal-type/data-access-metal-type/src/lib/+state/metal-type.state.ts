import { MetaltypeEntity } from './metal-type.entity';
import {
  MaterialType,
  CustomErrors,
  MaterialTypelov
} from '@poss-web/shared/models';

export interface MetalTypeState {
  metalTypeList: MetaltypeEntity;
  metalType: MaterialType;
  materialTypeLov: MaterialTypelov[];
  error: CustomErrors;
  isLoading: boolean;
  totalElements: number;
  hasSaved: boolean;
  hasUpdated: boolean;

}
