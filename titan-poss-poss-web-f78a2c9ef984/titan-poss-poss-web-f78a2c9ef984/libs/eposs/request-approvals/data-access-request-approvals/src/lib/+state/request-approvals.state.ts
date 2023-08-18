import {
  ItemEntity,
  IbtRequestEntity,
  IbtRequestItemsEntity
} from './request-approvals.entity';
import {
  RequestApprovals,
  RequestApprovalsItems,
  CustomErrors,
  BinRequestApprovalsItems
} from '@poss-web/shared/models';

export interface RequestApprovalsState {
  binRequestApprovalsItem: ItemEntity;
  binRequestItemsCount: number;
  isbinRequestItemsLoading: boolean;
  isLoading?: boolean;
  error?: CustomErrors;
  isBinRequestItemsReset: boolean;
  isBinRequestItemsCountReset: boolean;
  hasUpdatingFailure: CustomErrors;
  isUpdatingItemSuccess: boolean;
  binRequestApproval: BinRequestApprovalsItems;
  locationCount: number;
  isLocationLoading: boolean;
  location: Location[];

  adjRequest: IbtRequestEntity;
  isLoadingadjRequest: boolean;
  adjRequestItemsCount: number;
  isadjRequestItemsCountReset: boolean;
  isadjRequestItemsReset: boolean;
  selectedAdjRequest: RequestApprovals;
  isLoadingSelectedAdjStock: boolean;

  lossRequest: IbtRequestEntity;
  isLoadinglossequest: boolean;
  lossRequestItemsCount: number;
  islossRequestItemsCountReset: boolean;
  islossRequestItemsReset: boolean;
  selectedlossRequest: RequestApprovals;
  isLoadingSelectedlossStock: boolean;

  loanRequest: IbtRequestEntity;
  isLoadingloanRequest: boolean;
  loanRequestItemsCount: number;
  isloanRequestItemsCountReset: boolean;
  isloanRequestItemsReset: boolean;
  selectedloanRequest: RequestApprovals;
  isLoadingSelectedloanStock: boolean;

  psvRequest: IbtRequestEntity;
  isLoadingpsvRequest: boolean;
  psvRequestItemsCount: number;
  ispsvRequestItemsCountReset: boolean;
  ispsvRequestItemsReset: boolean;
  selectedpsvRequest: RequestApprovals;
  isLoadingSelectedpsvStock: boolean;

  exhRequest: IbtRequestEntity;
  isLoadingexhRequest: boolean;
  exhRequestItemsCount: number;
  isexhRequestItemsCountReset: boolean;
  isexhRequestItemsReset: boolean;
  selectedexhRequest: RequestApprovals;
  isLoadingSelectedexhStock: boolean;

  focRequest: IbtRequestEntity;
  isLoadingfocRequest: boolean;
  focRequestItemsCount: number;
  isfocRequestItemsCountReset: boolean;
  isfocRequestItemsReset: boolean;
  selectedfocRequest: RequestApprovals;
  isLoadingSelectedfocStock: boolean;

  ibtRequest: IbtRequestEntity;
  ibtCancellationRequest: IbtRequestEntity;
  isLoadingIbtCancellationRequest: boolean;
  isLoadingIbtRequest: boolean;
  ibtCancelRequestItemsListCount: number;
  ibtCancelItems: IbtRequestItemsEntity;
  searchIbtCancellationRequestResults: IbtRequestEntity;
  isSearchingCancellationIbtRequest: boolean;
  hasSearchCancellationIbtRequest: boolean;
  hasUpadatingCancelApprovalsFailure: CustomErrors;
  ibtCancelUpdateRequest: RequestApprovals;
  isCancelUpdatingSuccess: boolean;
  searchIbtRequestResults: IbtRequestEntity;
  isSearchingIbtRequest: boolean;
  hasSearchIbtRequest: boolean;
  ibtRequestItemsCount: number;
  isIbtRequestItemsCountReset: boolean;
  isIbtRequestItemsReset: boolean;
  selectedRequest: RequestApprovals;
  isLoadingSelectedStock: boolean;
  ibtCancelRequestItemsCount: number;
  isIbtCancelRequestItemsCountReset: boolean;
  isIbtCancelRequestItemsReset: boolean;
  selectedCancelRequest: RequestApprovals;
  isLoadingSelectedCancelStock: boolean;

  ibtRequestApprovalsItem: IbtRequestItemsEntity;
  ibtRequestApprovalsItemsCount: number;
  isibtRequestItemsLoading: boolean;
  isibtRequestCancelItemsLoading: boolean;

  ibtRequestApproval: RequestApprovalsItems;
  hasUpdatingIbtFailure: CustomErrors;
  isUpdatingIbtSuccess: boolean;

  isUpdatingSuccess: boolean;
  hasUpadatingApprovalsFailure: CustomErrors;
  ibtUpdateRequest: RequestApprovals;
  selectedItems: IbtRequestItemsEntity;

  otherIssuesCount: number;

  isRequestItemsReset: boolean;
  isRequestItemsCountReset: boolean;
  studdedProductGroups: string[];
  isLoadingImage: boolean;
}
