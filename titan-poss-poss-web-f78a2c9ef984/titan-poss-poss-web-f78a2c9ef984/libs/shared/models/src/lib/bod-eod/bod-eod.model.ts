import { Observable } from 'rxjs';
import { CustomErrors } from '../error.model';

export interface BodBusinessDayResponse {
  businessDate: number;
  fiscalYear: number;
  id: string;
  isGHSBODDone: boolean;
  isGHSEODDone: boolean;
  locationCode: string;
  remarks: string;
  skipBanking: boolean;
  status: string;
}
//NAP-7852
export interface BodBusinessDayResponseFormat {
  businessDate: number;
  fiscalYear: number;
  id: string;
  isGHSBODDone: boolean;
  isGHSEODDone: boolean;
  locationCode: string;
  remarks: string;
  skipBanking: boolean;
  status: string;
  rateFetchAttempts: number;
}
export interface MetalRatesRequestFormat {
  businessDate: number;
  isRetryAttempted: boolean;
}
//NAP-7852 End
export interface AvailableMetalRates {
  goldRate: number;
  platinumRate: number;
  silverRate: number;
}

export interface AvailableMetalRatesResponse {
  additionalProp1: {
    applicableDate: number;
    currency: string;
    metalTypeCode: string;
    purity: number;
    ratePerUnit: number;
  };
  additionalProp2: {
    applicableDate: number;
    currency: string;
    metalTypeCode: string;
    purity: number;
    ratePerUnit: number;
  };
  additionalProp3: {
    applicableDate: number;
    currency: string;
    metalTypeCode: string;
    purity: number;
    ratePerUnit: number;
  };
}

export interface MetalRatesObject {
  applicableDate: number;
  currency: string;
  metalTypeCode: string;
  purity: number;
  ratePerUnit: number;
}
export interface GhsFileUploadResponse {
  status: boolean;
}
export interface ServiceFileUploadResponse {
  status: boolean;
}
export interface WalkInDetailsResponse {
  conversion: number | string;
  employeeCode: string;
  locationCode: string;
  noOfInvoice: number | string;
  walkins: number | string;
}
export interface BankDepositRequestPayload {
  businessDate: number;
  remarks: string;
  skipBanking: boolean;
}
export interface OfflineGhsEodRevenueCollection {
  achAmount: string;
  achReversal: string;
  airPayAmount: string;
  airPayReversal: string;
  businessDate: number;
  cashAmount: string;
  cashRefund: string;
  cashReversal: string;
  cccommission: string;
  ccrevenue: string;
  ccreversal: string;
  chequeAmount: string;
  chequeReversal: string;
  ddamount: string;
  ddreversal: string;
  emplSalaryDeductionAmount: string;
  emplSalaryDeductionAmountReversal: string;
  locationCode: string;
  netAmount: string;
  password: string;
  paytmAmount: string;
  paytmReversal: string;
  roRefund: string;
}

// NAP-3938: Update metal Rates Below
export interface MetalRateUpdateRequestPayload {
  applicableDate: string;
  metalRates: {
    additionalProp1: {
      metalTypeCode: string;
      ratePerUnit: number;
    };
    additionalProp2: {
      metalTypeCode: string;
      ratePerUnit: number;
    };
    additionalProp3: {
      metalTypeCode: string;
      ratePerUnit: number;
    };
  };
  password: string;
}
export interface EghsBodGeneratedPassword {
  contextType: string;
  goldRate: number;
  locationCode: string;
  password: string;
  passwordDate: string;
}
export interface EghsBodPasswordsListingResponse {
  offlineEghsBodPasswordData: EghsBodGeneratedPassword[];
  count: number;
}
export interface MetalRatesAndGoldAvailabilityResponse {
  availableMetalRates: AvailableMetalRates;
  goldRateAvailable: boolean;
}

//NAP-7851 Below
export interface UsersSessionsResponse {
  id: number;
  loginDate: number | string;
  expiryDate: number | string;
  hostName: string;
}
export interface UsersActiveSessionsResults {
  userName?: string;
  employeeCode?: string;
  employeeName?: string;
  emailId?: string;
  mobileNo?: string;
  sessions?: UsersActiveSessionsResults[];
  id?: number;
  loginDate?: number | string;
  expiryDate?: number | string;
  hostName?: string;
}

export interface ClosedBodResponse {
  businessDate: number;
  fiscalYear: number;
  status: string;
}

export interface LatestBodResponse {
  businessDate: number;
  fiscalYear: number;
  previousBusinessDate: number;
  status: string;
}

export abstract class SharedBodEodFeatureServiceAbstraction {
  // Actions below
  public abstract loadCurrentDayBodStatus();
  public abstract loadMetalRatesForBusinessDay(businessDate: number);
  public abstract loadLatestBusinessDay();

  // Selectors below
  public abstract getBusinessDayDate(): Observable<number>;
  public abstract getBusinessDayDateForGuard(): Observable<number>;
  public abstract getGoldRateAvailablityStatus(): Observable<boolean>;
  public abstract getGoldRate(): Observable<number>;
  public abstract getCurrentDayBodStatus(): Observable<string>;
  public abstract getIsLoading(): Observable<boolean>;
  public abstract getError(): Observable<CustomErrors>;
  public abstract getBodEodStatus(): Observable<string>;
  public abstract getFiscalYear(): Observable<number>;

  public abstract getEodBusinessDate(): Observable<number>;
  public abstract getLatestBusinessDate(): Observable<number>;
}
