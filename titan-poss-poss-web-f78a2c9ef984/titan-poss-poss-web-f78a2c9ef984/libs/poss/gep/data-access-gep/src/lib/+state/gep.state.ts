import {
  CustomErrors,
  GepInitResponse,
  MetalPrice,
  totalBreakUp,
  MetalType,
  ItemType,
  FileUploadLists,
  HistorySearchParamDetails,
  GEPSearchResponse,
  GEPList,
  DiscountsList,

} from '@poss-web/shared/models';
import { GepDetailsEntity, GepCancelEntity } from './gep.entity';

export interface GepState {
  gepProductDetails: GepDetailsEntity;
  preMeltingUploadResponse: boolean;
  gepInitResponse: GepInitResponse;
  gepResponse: any;
  metalPrice: MetalPrice[];
  totalBreakUp: {
    data: any;
    totalBreakUp: totalBreakUp;
  };
  metalType: MetalType[];
  itemType: ItemType[];
  summary: any;
  deleteResponse: any;
  updateGepItem: any;
  loadGepDetails: any;
  holdConfirmResponse: any;
  loadOnHold: any[];
  countOnhold: number;
  saveCancelGep: any;
  loadCancelGep: GepCancelEntity;
  gepItem: any;
  cancelGepCount: number;
  loadGepItem: any;
  deleteGep: any;
  updateRso: any;
  hasError?: CustomErrors;
  isLoading?: boolean;
  isCustomerUpdate?: boolean;
  rso: any;
  reason: any;
  uploadFileListResponse: FileUploadLists[];
  downloadFileUrl: string;
  historySearchParamDetails: HistorySearchParamDetails;
  historyItems: GEPSearchResponse;
  searhGEPResponse: GEPList[];
  searhGEPResponseCount: number;
  viewGEPDeatilsResponse: any;
  availableDiscountsList: DiscountsList[];
}
