import {
  RequestListEntity,
  ItemListEntity,
  BoutiqueListEntity,
  HistoryEntity
} from './inter-boutique-transfer.entity';
import {
  RequestList,
  ItemList,
  ItemSummary,
  CustomErrors,
  IBThistoryHeaderPayload,
  InterBoutiqueTransferRequestTypesEnum,
  HistoryFilterData
} from '@poss-web/shared/models';

export class InterBoutiqueTransferState {
  requestSentList: RequestListEntity;
  requestReceivedList: RequestListEntity;
  requestSentListCount: number;
  requestReceivedListCount: number;
  boutiqueList: BoutiqueListEntity;
  boutiqueListCount: number;
  createRequestResponse: RequestList;
  request: RequestList;
  itemList: ItemListEntity;
  updateItemListResponse: ItemList;
  updateItemListStatusResponse: RequestList;
  searchItemResponse: {
    searchResult: ItemSummary;
    isSearchSuccess: boolean;
  };
  hasError?: CustomErrors;
  isLoading?: boolean;

  IBThistory: HistoryEntity;
  isLoadingHistory: boolean;
  ibtHistoryCount: number;
  isLoadingSelectedHistory: boolean;
  hasSelectedHistory: boolean;
  selectedHistory: IBThistoryHeaderPayload;
  items: HistoryEntity;
  historyType: InterBoutiqueTransferRequestTypesEnum;
  advancedFilter: HistoryFilterData;
  studdedProductGroups: string[];
  isLoadingImage: boolean;
}
