import {
  PendingCMResponsePayload,
  CustomErrors,
  FocItemDetailsResponsePayload,
  IssuePendingFocConfirmationPayload,
  AvailableSchemesPayload,
  FocSchemeDetailsDto,
  AddFocToCmResponsePayload,
  PendingFocSchemesResponsePayload,
  ABFocSchemeDetailsDto,
  ManualFocDetailsDto
} from '@poss-web/shared/models';

export interface FocState {
  pendingFocCm: PendingCMResponsePayload[];
  isLoadingPendingCM: boolean;

  selectedPendingCM: PendingCMResponsePayload;

  pendingFocSchemes: PendingFocSchemesResponsePayload;
  isLoadingPendingFocSchemes: boolean;

  focItemDetails: FocItemDetailsResponsePayload[];
  manualFocItemDetails: FocItemDetailsResponsePayload[];
  isLoadingFocItemDetails: boolean;
  hasFocItemDetails: boolean;

  pendingIssueResponse: IssuePendingFocConfirmationPayload;
  isIssuingPendingFOC: boolean;

  focItems: any[];
  totalFocEligibleWt: number;
  totalFocIssuingWt: number;
  focItemsCount: number;

  isLoading: boolean;
  availableFocSchemes: AvailableSchemesPayload[];

  focSchemes: FocSchemeDetailsDto[];
  manualFocSchemes: ManualFocDetailsDto[];
  isFocSchemesLoaded: boolean;
  isFocSchemesForItems: boolean;

  focAddedToCM: AddFocToCmResponsePayload[];
  isFocAdded: boolean;

  manualFocAddedToCM: AddFocToCmResponsePayload[];
  isManualFocAdded: boolean;

  pendingFocSchemeIds: string[];
  isFocKeptPending: boolean;

  keepFOCPendingTrigger: boolean;

  error: CustomErrors;
  isCleared: boolean;

  // AB FOC

  ABFocSchemes: FocSchemeDetailsDto[];
  ABFocSchemesForItems: boolean;
  SelectedABFocSchemes: ABFocSchemeDetailsDto[];
  SelectedABFocSchemesCount: number;
  SaveFocSchemes: ABFocSchemeDetailsDto[];
  deleteABFOCSchemesRes: boolean;

  isLoadingManualFocItemDetails: boolean;
  hasManualFocItemDetails: boolean;
  manualFocValidationDetails: any;
  isManualFocVerified: boolean;
}
