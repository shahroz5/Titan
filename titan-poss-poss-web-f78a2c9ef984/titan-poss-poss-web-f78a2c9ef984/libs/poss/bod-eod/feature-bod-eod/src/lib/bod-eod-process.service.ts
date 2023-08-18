import { Injectable } from '@angular/core';
import { BodEodFacade } from '@poss-web/poss/bod-eod/data-access-bod-eod';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  BankDepositRequestPayload,
  BodEodEnum,
  LocationSettingAttributesEnum,
  MetalRatesRequestFormat,
  OfflineGhsEodRevenueCollection
} from '@poss-web/shared/models';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class BodEodProcessService {
  bodBusinessDay: number;
  eodBusinessDay: number;
  walkInDetailsMandatory: boolean;
  bankingMandatory: boolean;
  isGhsMandatory: boolean;
  isServiceMandatory: boolean;
  locationCode = '';

  availableMetalRatesstatus: string;

  initiateBodProcessSubscription: Subscription;
  initiateEodProcessSubscription: Subscription;

  bodProcessOnPageLoadSubscription: Subscription;

  isWalkInMandatory$: Observable<string>;
  isBankingMandatory$: Observable<string>;
  locationCode$: Observable<string>;
  isGhsMandatory$: Observable<string>;
  isServiceMandatory$: Observable<string>;

  constructor(
    private bodEodFacade: BodEodFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private sharedBodEodFacade: SharedBodEodFacade
  ) {
    this.getLocationSettings();
  }

  getLocationSettings() {
    this.isWalkInMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.STORE_IS_WALKIN_DETAILS_MANDATORY
    );
    this.isBankingMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.BANKING_IS_BANKING_MANDATORY
    );
    this.locationCode$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE
    );
    this.isGhsMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.GHS_IS_EGHS_MANDATORY
    );
    this.isServiceMandatory$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.SERVICE_IS_SERVICE_MANDATORY
    );

    combineLatest([
      this.isWalkInMandatory$,
      this.isBankingMandatory$,
      this.locationCode$,
      this.isGhsMandatory$,
      this.isServiceMandatory$
    ]).subscribe(
      ([
        isWalkInMandatory,
        isBankingMandatory,
        locationCode,
        isGhsMandatory,
        isServiceMandatory
      ]) => {
        if (!!isWalkInMandatory) {
          this.walkInDetailsMandatory = JSON.parse(isWalkInMandatory);
        }
        if (!!isBankingMandatory) {
          this.bankingMandatory = JSON.parse(isBankingMandatory);
        }
        if (!!isGhsMandatory) {
          this.isGhsMandatory = JSON.parse(isGhsMandatory);
        }
        if (!!isServiceMandatory) {
          this.isServiceMandatory = JSON.parse(isServiceMandatory);
        }
        if (!!locationCode) {
          this.locationCode = locationCode;
        }
      }
    );
  }

  initiateBodProcess() {
    /*Below Action to initiate Bod Process*/
    this.bodEodFacade.startBodProcess();

    this.bodEodFacade
      .getBodBusinessDate()
      .pipe(
        filter(date => !!date),
        take(1)
      )
      .subscribe(bodBusinessDay => {
        this.bodBusinessDay = bodBusinessDay;
      });

    this.initiateBodProcessSubscription = this.bodEodFacade
      .isBodProcessStarted()
      .subscribe(isBodProcessStarted => {
        if (!!isBodProcessStarted) {
          //Below Api to update the status in toolbar
          this.sharedBodEodFacade.loadLatestBusinessDay();

          //action to load metal rates to store
          this.executeBodStep1(false, this.bodBusinessDay);

          const bodStep1ControllerSubscription = this.bodEodFacade
            .getGoldRateAvailablityStatus()
            .pipe(
              filter(goldStatus => !!goldStatus),
              take(1)
            )
            .subscribe(goldStatus => {
              if (!!goldStatus) {
                this.executeBodStep2(this.bodBusinessDay);
              }
            });

          const bodStep2ControllerSubscription = this.bodEodFacade
            .getBoutiquePossBodStatus()
            .pipe(
              filter(
                boutiquePossBodstatus =>
                  !!boutiquePossBodstatus &&
                  boutiquePossBodstatus === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(boutiquePossBodstatus => {
              this.locationSettingsFacade
                .getLocationSetting(
                  LocationSettingAttributesEnum.GHS_IS_EGHS_MANDATORY
                )
                .subscribe(isGhsMandatory => {
                  if (!!isGhsMandatory && !!JSON.parse(isGhsMandatory)) {
                    this.executeBodStep3(this.bodBusinessDay);
                  } else {
                    this.updateBodCompleted();
                  }
                });
            });

          this.initiateBodProcessSubscription.add(
            bodStep1ControllerSubscription
          );
          this.initiateBodProcessSubscription.add(
            bodStep2ControllerSubscription
          );
        }
      });
  }

  getBodStepsStatusWhenBoutiqueBodIsCompleted(errorCode) {
    /*Below Action to initiate Bod Process*/
    this.bodProcessOnPageLoadSubscription = this.bodEodFacade
      .getEodBusinessDate()
      .pipe(filter(date => !!date))
      .subscribe(eodBusinessDate => {
        this.eodBusinessDay = eodBusinessDate;
        //action to load metal rates to store
        this.executeBodStep1(false, this.eodBusinessDay);

        if (errorCode === BodEodEnum.ERR_SALE_189) {
          this.bodEodFacade.boutiquePossBodCompletedSuccess(null);
        } else if (errorCode === BodEodEnum.ERR_SALE_190) {
          this.executeBodStep2(this.eodBusinessDay);
        }

        this.locationSettingsFacade
          .getLocationSetting(
            LocationSettingAttributesEnum.GHS_IS_EGHS_MANDATORY
          )
          .pipe(
            filter(data => !!data),
            take(1)
          )
          .subscribe(isGhsMandatory => {
            if (!!isGhsMandatory && !!JSON.parse(isGhsMandatory)) {
              this.executeBodStep3(this.eodBusinessDay);
            } else {
              this.bodEodFacade
                .getBoutiquePossBodStatus()
                .pipe(
                  filter(status => status === BodEodEnum.COMPLETED),
                  take(1)
                )
                .subscribe(status => {
                  this.updateBodCompleted();
                });
            }
          });
      });
  }

  /*Bod Related Steps*/
  executeBodStep1(
    isRetryAttempted: boolean,
    businessDate = this.bodBusinessDay
      ? this.bodBusinessDay
      : this.eodBusinessDay
  ) {
    //NAP-7852 changes
    const requestPayload: MetalRatesRequestFormat = {
      businessDate: businessDate,
      isRetryAttempted: isRetryAttempted
    };
    this.bodEodFacade.loadAvailableMetalRatesForBusinessDay(requestPayload);
    this.bodEodFacade
      .getGoldRateAvailablityStatus()
      .subscribe(goldRateStatus => {
        if (!goldRateStatus) {
          this.bodEodFacade.partialUpdateForMetalRates(null);
        }
      });
  }

  executeBodStep2(businessDate) {
    this.bodEodFacade.checkIfBoutiquePossBodCompleted(businessDate);
  }

  executeBodStep3(businessDate) {
    this.bodEodFacade.checkIfGhsBodCompleted(businessDate);
  }

  updateBodCompleted() {
    this.bodEodFacade.markBodProcessCompleted();
  }
  continueAnywayWithoutMetalRates() {
    this.bodEodFacade
      .getBoutiquePossBodStatus()
      .pipe(
        filter(status => status !== BodEodEnum.COMPLETED),
        take(1)
      )
      .subscribe(status => {
        this.executeBodStep2(
          this.bodBusinessDay ? this.bodBusinessDay : this.eodBusinessDay
        );
      });
  }

  /*Eod Related Steps below */

  initiateEodProcess() {
    /*Below Action to initiate Eod Process*/

    this.bodEodFacade.startEodProcess();
    this.bodEodFacade
      .getEodBusinessDate()
      .pipe(
        filter(date => !!date),
        take(1)
      )
      .subscribe(eodBusinessDay => {
        this.eodBusinessDay = eodBusinessDay;
      });

    this.initiateEodProcessSubscription = this.bodEodFacade
      .isEodProcessStarted()
      .subscribe(isEodProcessStarted => {
        if (!!isEodProcessStarted) {
          const eodStep1ControllerSubscription = this.locationSettingsFacade
            .getLocationSetting(
              LocationSettingAttributesEnum.STORE_IS_WALKIN_DETAILS_MANDATORY
            )
            .pipe(
              filter(isMandatory => !!isMandatory),
              take(1)
            )
            .subscribe(isMandatory => {
              this.walkInDetailsMandatory = JSON.parse(isMandatory);
              if (!!JSON.parse(isMandatory)) {
                this.executeEodStep1(this.eodBusinessDay);
              } else {
                this.isBankingMandatory$
                  .pipe(
                    filter(bankingsRequired => !!bankingsRequired),
                    take(1)
                  )
                  .subscribe(bankingsRequired => {
                    this.bankingMandatory = JSON.parse(bankingsRequired);
                    if (!!bankingsRequired && !!JSON.parse(bankingsRequired)) {
                      this.executeEodStep3(this.eodBusinessDay);
                    } else {
                      this.executeEodStep4(this.eodBusinessDay);
                    }
                  });
              }
            });

          //Execute after Walk-in details completed
          const eodStep2ControllerSubscription = this.bodEodFacade
            .getWalkInDetailsStatus()
            .pipe(
              filter(
                walkInStatus =>
                  !!walkInStatus && walkInStatus === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(walkInStatus => {
              this.isBankingMandatory$
                .pipe(
                  filter(bankingsRequired => !!bankingsRequired),
                  take(1)
                )
                .subscribe(bankingsRequired => {
                  if (!!bankingsRequired && !!JSON.parse(bankingsRequired)) {
                    this.executeEodStep3(this.eodBusinessDay);
                  } else {
                    this.executeEodStep4(this.eodBusinessDay);
                  }
                });
            });

          //Execute after GhsBank bank Deposit is completed
          const eodStep3ControllerSubscription = this.bodEodFacade
            .getGhsBankDepositUploadStatus()
            .pipe(
              filter(
                ghsBankDeposit =>
                  !!ghsBankDeposit && ghsBankDeposit === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(ghsBankDeposit => {
              this.executeEodStep3(this.eodBusinessDay);
            });
          // Execute after Boutique bank Deposit is completed
          const eodStep4ControllerSubscription = this.bodEodFacade
            .getBoutiqueBankDepositStatus()
            .pipe(
              filter(
                boutiqueBankDeposit =>
                  !!boutiqueBankDeposit &&
                  boutiqueBankDeposit === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(boutiqueBankDeposit => {
              this.executeEodStep4(this.eodBusinessDay);
            });

          // Execute after boutique revenue consolidation completed
          const eodStep5ControllerSubscription = this.bodEodFacade
            .getBoutiqueRevenueCollectionStatus()
            .pipe(
              filter(
                boutiqueRevenueConsolidation =>
                  !!boutiqueRevenueConsolidation &&
                  boutiqueRevenueConsolidation === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(boutiqueRevenueConsolidation => {
              this.isGhsMandatory$
                .pipe(
                  filter(ghsRequired => !!ghsRequired),
                  take(1)
                )
                .subscribe(ghsRequired => {
                  if (!!ghsRequired && !!JSON.parse(ghsRequired)) {
                    this.executeEodStep5(this.eodBusinessDay);
                  } else {
                      this.isServiceMandatory$
                        .pipe(
                          filter(serviceRequired => !!serviceRequired),
                          take(1)
                        )
                        .subscribe(serviceRequired => {
                          this.isServiceMandatory = JSON.parse(serviceRequired);
                          if (!!serviceRequired && !!JSON.parse(serviceRequired)) {
                            this.executeEodStep7(this.eodBusinessDay);
                          } else {
                            this.executeEodStep8(this.eodBusinessDay);
                          }
                        });
                  }
                });
            });

          // Execute after GHS revenue download completed
          const eodStep6ControllerSubscription = this.bodEodFacade
            .getGhsRevenueCollectionStatus()
            .pipe(
              filter(
                ghsRevenueDownloadStatus =>
                  !!ghsRevenueDownloadStatus &&
                  ghsRevenueDownloadStatus === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(ghsRevenueDownloadStatus => {
              this.executeEodStep6(this.eodBusinessDay);
            });

          //GHS EOD is completed
          const eodStep7ControllerSubscription = this.bodEodFacade
            .getGhsEodActivityStatus()
            .pipe(
              filter(
                ghsEodStatus =>
                  !!ghsEodStatus && ghsEodStatus === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(ghsEodStatus => {
              this.isServiceMandatory$
                .pipe(
                  filter(serviceRequired => !!serviceRequired),
                  take(1)
                )
                .subscribe(serviceRequired => {
                  this.isServiceMandatory = JSON.parse(serviceRequired);
                  if (!!serviceRequired && !!JSON.parse(serviceRequired)) {
                    this.executeEodStep7(this.eodBusinessDay);
                  } else {
                    this.executeEodStep8(this.eodBusinessDay);
                  }
                });
            });

          //Service Revenue EOD is completed
          const eodStep8ControllerSubscription = this.bodEodFacade
            .getServiceRevenueCollectionStatus()
            .pipe(
              filter(
                serviceRevenueStatus =>
                  !!serviceRevenueStatus && serviceRevenueStatus === BodEodEnum.COMPLETED
              ),
              take(1)
            )
            .subscribe(serviceRevenueStatus => {
              this.executeEodStep8(this.eodBusinessDay);
            });

          this.initiateEodProcessSubscription.add(
            eodStep1ControllerSubscription
          );
          this.initiateEodProcessSubscription.add(
            eodStep2ControllerSubscription
          );
          this.initiateEodProcessSubscription.add(
            eodStep3ControllerSubscription
          );
          this.initiateEodProcessSubscription.add(
            eodStep4ControllerSubscription
          );
          this.initiateEodProcessSubscription.add(
            eodStep5ControllerSubscription
          );
          this.initiateEodProcessSubscription.add(
            eodStep6ControllerSubscription
          );
          this.initiateEodProcessSubscription.add(
            eodStep7ControllerSubscription
          );
          this.initiateEodProcessSubscription.add(
            eodStep8ControllerSubscription
          );
        }
      });
  }

  executeEodStep1(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay
  ) {
    this.bodEodFacade.checkIfWalkinDetailsCompleted(businessDate);
  }
  executeEodStep2(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay
  ) {
    this.bodEodFacade.checkPreviousDayGhsDepositUploaded(businessDate);
  }
  executeEodStep3(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay,
    remarks?,
    skipBanking?
  ) {
    const requestPayload: BankDepositRequestPayload = {
      businessDate: businessDate,
      remarks: remarks ? remarks : null,
      skipBanking: skipBanking ? skipBanking : false
    };

    this.bodEodFacade.checkPreviousDayBankDeposit(requestPayload);
  }
  executeEodStep4(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay
  ) {
    this.bodEodFacade.performBoutiqueRevenueCollection(businessDate);
  }
  executeEodStep5(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay
  ) {
    this.bodEodFacade.performGhsRevenueCollection(businessDate);
  }
  executeEodStep6(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay
  ) {
    this.bodEodFacade.performGhsEodActivity(businessDate);
  }
  executeEodStep7(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay
  ) {
    this.bodEodFacade.performServiceRevenueCollection(businessDate);
  }
  executeEodStep8(
    businessDate = this.eodBusinessDay
      ? this.eodBusinessDay
      : this.bodBusinessDay
  ) {
    this.bodEodFacade.performBoutiqueEodActivity(businessDate);
  }

  continueWithoutBankDeposit(userRemarks: string) {
    this.executeEodStep3(this.eodBusinessDay, userRemarks, true);
  }

  performOfflineEodGhsRevenueCollection(eghsOfflineEodData) {
    const inputData: OfflineGhsEodRevenueCollection = {
      achAmount: eghsOfflineEodData.achAmount,
      achReversal: eghsOfflineEodData.achReversal,
      airPayAmount: eghsOfflineEodData.airpay,
      airPayReversal: eghsOfflineEodData.airpayReversal,
      businessDate: this.eodBusinessDay,
      cashAmount: eghsOfflineEodData.cashAmount,
      cashRefund: eghsOfflineEodData.cashRefund,
      cashReversal: eghsOfflineEodData.cashReversal,
      cccommission: eghsOfflineEodData.ccCommision,
      ccrevenue: eghsOfflineEodData.ccRevenue,
      ccreversal: eghsOfflineEodData.ccReversal,
      chequeAmount: eghsOfflineEodData.chequeAmount,
      chequeReversal: eghsOfflineEodData.chequeReversal,
      ddamount: eghsOfflineEodData.ddAmount,
      ddreversal: eghsOfflineEodData.ddReversal,
      emplSalaryDeductionAmount: eghsOfflineEodData.empSalaryDeductionAmount,
      emplSalaryDeductionAmountReversal:
        eghsOfflineEodData.reversalEmpSalaryDedutionAmount,
      locationCode: this.locationCode,
      netAmount: eghsOfflineEodData.netAmount,
      password: eghsOfflineEodData.enterPassword,
      paytmAmount: eghsOfflineEodData.paytm,
      paytmReversal: eghsOfflineEodData.paytmReversal,
      roRefund: eghsOfflineEodData.roRefund
    };
    this.bodEodFacade.performOfflineEodGhsRevenueCollection(inputData);

    this.bodEodFacade
      .getGhsOfflineBodPassword()
      .pipe(
        filter(data => !!data),
        take(1)
      )
      .subscribe(data => {
        this.bodEodFacade.markBodProcessCompleted();
      });
  }
}
