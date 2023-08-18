import {
  AvailableMetalRates,
  CustomErrors,
  EghsBodGeneratedPassword,
  UsersActiveSessionsResults
} from '@poss-web/shared/models';

export class BodEodState {
  errors?: CustomErrors;
  isLoading: boolean;

  bodProcessStatus: string;
  previousdayEODStatus: string;
  isBodProcessStarted: boolean;
  isEodProcessStarted: boolean;
  bodBusinessDate: number;
  closedBusinessDate: number;
  rateFetchAttempts: number;
  availableMetalRates: AvailableMetalRates;
  isGoldRateAvailable: boolean;
  metalRatesAvailableStatus: string;

  boutiquePossBodStatus: string;
  ghsBodStatus: string;
  ghsOfflineBodPassword: any;
  viewGhsOfflineBodPasswordData: EghsBodGeneratedPassword[];
  offlineGhsPasswordCount: number;
  eodProcessStatus: string;
  currentDayBodStatus: string;
  eodBusinessDate: number;
  walkInDetailsStatus: string;
  previousDayGhsBankDepositUploadStatus: string;
  previousDayBankDepositCompletionStatus: string;
  boutiqueRevenueCollectionStatus: string;
  ghsRevenueCollectionStatus: string;
  serviceRevenueCollectionStatus: string;

  ghsEodActivityStatus: string;
  boutiquePossEodActivityStatus: string;
  offlineGhsEodRevenueCollectionStatus: string;
  bodStepsStatus: string;
  eodStepsStatus: string;
  activeUserSessions: UsersActiveSessionsResults[];
}
