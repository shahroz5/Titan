import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoutiqueBankDepositFacade } from '@poss-web/shared/boutique-bank-deposit/data-access-boutique-bank-deposit';
import {
  BankDepositDetails,
  CashDetails,
  CustomErrors,
  LocationSettingAttributesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  printTypesEnum,
  printDocTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  printTransactionTypesEnum,
  printFileTypeEnum,
  PossHomeKeyEnum,
  SharedBodEodFeatureServiceAbstraction,
  PrintingServiceAbstraction,
  TransactionIdsResponse,
  PendingDatesResponse,
  PifNoResponse
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { combineLatest, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';

import { ErrorGridPopupComponent } from '@poss-web/shared/components/ui-error-grid-popup';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';
import { PageEvent } from '@angular/material/paginator';
import {
  Column,
  SortDialogService
} from '@poss-web/shared/components/ui-sort-dialog';
export enum BankDepostEnum {
  ALL = 'All',
  CASH = 'CASH'
}
@Component({
  selector: 'poss-web-boutique-bank-deposit-listing',
  templateUrl: './boutique-bank-deposit-listing.component.html'
})
export class BoutiqueBankDepositListingComponent implements OnInit, OnDestroy {
  bankDepositDetails: BankDepositDetails[];
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  cashDetails: CashDetails;
  dateFormat: string;
  checkboxes: string[] = [];
  selectedRowsId: string[] = [];
  depositedAmount = 0;
  pifNoResponse = null;
  openPopup = false;
  checkBoxesFormGroup: FormGroup;
  disableSaveButton = false;
  disableCashDenomitionButton = null;
  isBankingMandatory: string;
  isCashPrintEnabled: string;
  isChequePrintEnabled: string;
  transactionId: string;
  transactionIds: string[] = [];
  printErrorText: string;
  sNoLabel: string;
  businessDateLabel: string;
  isPasswordMandatory: string;
  enableCheckBox = true;
  customerDetailsInBrand: any;
  brandDetails: any;
  cashDepositVariationLimit: number;
  ids: string[];
  bussinessDay: number;
  openErrorPopup = false;
  isPendingDatesAvailable: boolean;
  saveResponse: BankDepositDetails[];
  isPrintLoading$: Observable<boolean>;

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize = 10;

  totalElements$: Observable<number>;

  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  maxSortLimit = 1;

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;

  constructor(
    private boutiqueBankDepositFacade: BoutiqueBankDepositFacade,
    private router: Router,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private printingService: PrintingServiceAbstraction,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private customerFacade: CustomerFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private printFacade: PrintingFacade,
    private sortService: SortDialogService
  ) {
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.sNoLabel = translatedMessages['pw.otherReceiptsIssues.sNoLabel'];
        this.businessDateLabel =
          translatedMessages['pw.otherReceiptsIssues.businessDateLabel'];
      });
  }

  ngOnInit(): void {
    this.boutiqueBankDepositFacade.resetBoutiqueBankDepostDetails();
    this.isPrintLoading$ = this.printFacade.getIsLoading();
    this.translate
      .get([
        'pw.boutiqueBankDeposit.collectionDateLabel',
        'pw.boutiqueBankDeposit.bankNameLabel',
        'pw.boutiqueBankDeposit.amtCollectedLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.boutiqueBankDeposit.collectionDateLabel'],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName:
              translatedMessages['pw.boutiqueBankDeposit.bankNameLabel'],
            sortAscOrder: false
          },
          {
            id: 2,
            sortByColumnName:
              translatedMessages['pw.boutiqueBankDeposit.amtCollectedLabel'],
            sortAscOrder: false
          }
        ];
      });
    this.printFacade
      .getTransactionIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactionDetails: TransactionIdsResponse) => {
        if (transactionDetails) {
          if (transactionDetails.homeBankIds.length > 0) {
            this.printingService.loadPrintData({
              printType: printTypesEnum.CHEQUE_DEPOSIT_PRINT,
              transactionIds: {
                transactionIds: transactionDetails.homeBankIds
              },
              printFileType: printFileTypeEnum.CHEQUE_PRINT,
              transacionType: printTransactionTypesEnum.SALES,
              doctype: printDocTypeEnum.CUSTOMER_PRINT
            });
          }
          if (transactionDetails.nonHomeBankIds.length > 0) {
            this.printingService.loadPrintData({
              printType: printTypesEnum.CHEQUE_DEPOSIT_PRINT,
              transactionIds: {
                transactionIds: transactionDetails.nonHomeBankIds
              },
              printFileType: printFileTypeEnum.CHEQUE_PRINT,
              transacionType: printTransactionTypesEnum.SALES,
              doctype: printDocTypeEnum.CUSTOMER_PRINT
            });
          }
        }
      });

    this.printFacade
      .getIsPrintSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPrintSuccess => {
        if (isPrintSuccess) {
          this.listingPageEvent.pageIndex = 0;
          this.loadBankDepostDetails();
        }
      });
    combineLatest([
      this.locationSettingsFacade
        .getLocationSetting(LocationSettingAttributesEnum.GHS_IS_EGHS_MANDATORY)
        .pipe(takeUntil(this.destroy$)),
      this.locationSettingsFacade
        .getLocationSetting(
          LocationSettingAttributesEnum.SERVICE_IS_SERVICE_MANDATORY
        )
        .pipe(takeUntil(this.destroy$))
    ]).subscribe(([isGHSMandatory, isServiceMandatory]) => {
      const payload = {
        isGHSMandatory: isGHSMandatory,
        isServiceMandatory: isServiceMandatory
      };
      this.boutiqueBankDepositFacade.loadPendingDates(payload);
    });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.listingPageEvent.pageSize = data;
      });

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.createForm();
    this.overlayNotification.close();
    this.checkBoxesFormGroup.get('all').setValue(true);
    this.isLoading$ = this.boutiqueBankDepositFacade.getIsLoading();
    this.boutiqueBankDepositFacade
      .getPendingDates()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dates: PendingDatesResponse) => {
        if (dates) {
          let subTitle;
          let subTitle1;
          const ghsPendingDates = [];
          const servicePendingDates = [];
          const columnDefs = [
            {
              field: 'sno',
              headerName: this.sNoLabel,
              flex: 1
            },
            {
              field: 'bussinessDate',
              headerName: this.businessDateLabel,
              flex: 1
            }
          ];
          if (
            dates?.ghsPendingUploadDates &&
            dates?.ghsPendingUploadDates.length > 0
          ) {
            subTitle =
              'EGHS BANKING DETAILS NOT UPLOADED FOR FOLLOWING BUSINESS DATES';
            this.isPendingDatesAvailable = true;
            let i = 1;
            for (const date of dates.ghsPendingUploadDates) {
              ghsPendingDates.push({
                sno: i++,
                bussinessDate: moment(date).format(this.dateFormat)
              });
            }
          }
          if (
            dates?.servicePendingUploadDates &&
            dates?.servicePendingUploadDates.length > 0
          ) {
            subTitle1 =
              'SERVICE POSS BANKING DETAILS NOT UPLOADED FOR FOLLOWING BUSINESS DATES';
            this.isPendingDatesAvailable = true;
            let i = 1;
            for (const date of dates.servicePendingUploadDates) {
              servicePendingDates.push({
                sno: i++,
                bussinessDate: moment(date).format(this.dateFormat)
              });
            }
          }
          if (
            !this.openErrorPopup &&
            (ghsPendingDates.length > 0 || servicePendingDates.length > 0)
          )
            this.callPopup(
              subTitle,
              subTitle1,
              columnDefs,
              ghsPendingDates,
              servicePendingDates
            );
        } else {
          this.isPendingDatesAvailable = false;
        }
      });

    this.bodEodFeatureService
      .getEodBusinessDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
        } else {
          this.showAlertNotification(
            'pw.boutiqueBankDeposit.businessDayAlertMsg'
          );
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BANKING_IS_BANKING_MANDATORY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isBankingMandatory: string) => {
        this.isBankingMandatory = isBankingMandatory;
        if (this.isBankingMandatory === 'false') {
          this.showAlertNotification(
            'pw.boutiqueBankDeposit.bankingMandatoryMsg'
          );
        } else {
          this.listingPageEvent.pageIndex = 0;
          this.boutiqueBankDepositFacade.loadBankDepostDetails({
            pageIndex: this.listingPageEvent.pageIndex,
            pageSize: this.listingPageEvent.pageSize,
            paymentMode: [],
            selectedRowId: [],
            sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null
          });
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BANKING_IS_PASSWORD_MANDATORY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPasswordMandatory: string) => {
        this.isPasswordMandatory = isPasswordMandatory;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BANKING_ENABLE_CHEQUE_DEPOSIT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((enableCheque: any) => {
        this.isChequePrintEnabled = enableCheque;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BANKING_ENABLE_CASH_DEPOSIT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((enableCash: string) => {
        this.isCashPrintEnabled = enableCash;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.FACTORY_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandCode => {
        if (brandCode) {
          this.customerFacade.loadBrandDetails(brandCode);
        }
      });
    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetails => {
        if (brandDetails) {
          this.customerDetailsInBrand = brandDetails.customerDetails;
          this.brandDetails = brandDetails.configDetails;
          this.cashDepositVariationLimit = Number(
            this.brandDetails?.data?.passwordConfigForCashDeposit
          );
        }
      });

    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFormat: string) => {
        this.dateFormat = dateFormat;
      });
    this.boutiqueBankDepositFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (error.code === 'ERR-CORE-031') {
            this.openPopup = true;
          } else {
            this.openPopup = false;
            this.errorHandler(error);
          }
        }
      });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.boutiqueBankDepositFacade
      .getDepositedAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((depositedAmount: number) => {
        if (depositedAmount !== 0) {
          this.depositedAmount = depositedAmount;
          //this.depositedAmount = this.depositedAmount + depositedAmount;
        }
      });
    this.boutiqueBankDepositFacade
      .getSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((saveResponse: BankDepositDetails[]) => {
        if (saveResponse.length > 0) {
          this.saveResponse = saveResponse;
          this.ids = [];
          saveResponse.forEach(data => {
            this.ids.push(data.id);
          });
          this.transactionId = saveResponse[0].id;
        }
      });
    this.boutiqueBankDepositFacade
      .getBankDepositDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bankDepositDetails: BankDepositDetails[]) => {
        if (bankDepositDetails) {
          this.totalElements$ = this.boutiqueBankDepositFacade.getTotalElements();
          this.bankDepositDetails = [];
          if (bankDepositDetails.length > 0) {
            let rawData: any;
            rawData = this.checkBoxesFormGroup.getRawValue();
            if (
              !rawData.cash &&
              !rawData.dd &&
              !rawData.card &&
              !rawData.all &&
              !rawData.cheque
            ) {
              this.enableCheckBox = false;
            } else {
              this.enableCheckBox = true;
            }
            bankDepositDetails.forEach((depositDetails: BankDepositDetails) => {
              if (
                depositDetails.paymentCode.toUpperCase() === BankDepostEnum.CASH
              ) {
                this.cashDetails = {
                  paymentCode: depositDetails.paymentCode,
                  openingBalance: depositDetails.openingBalance,
                  amount: depositDetails.amount,
                  depositAmount: depositDetails.depositAmount,
                  payeeBankName: depositDetails.payeeBankName,
                  businessDate: depositDetails.businessDate,
                  collectionDate: depositDetails.collectionDate,
                  depositDate: depositDetails.depositDate,
                  id: depositDetails.id,
                  depositDetails: depositDetails.depositDetails
                };
              }
              this.bankDepositDetails.push({
                collectionDate: depositDetails.collectionDate
                  ? moment(depositDetails.collectionDate).format(
                      this.dateFormat
                    )
                  : '',
                paymentCode: depositDetails.paymentCode,
                locationCode: depositDetails.locationCode,
                payerBankName: depositDetails.payerBankName,
                payeeBankName: depositDetails.payeeBankName,
                instrumentDate: depositDetails.instrumentDate
                  ? moment(depositDetails.instrumentDate).format(
                      this.dateFormat
                    )
                  : '',
                depositDate: depositDetails.depositDate
                  ? moment(depositDetails.depositDate).format(this.dateFormat)
                  : null,
                businessDate: depositDetails.businessDate
                  ? moment(depositDetails.businessDate).format(this.dateFormat)
                  : '',
                instrumentNo: depositDetails.instrumentNo,
                amount: depositDetails.amount,
                openingBalance: depositDetails.openingBalance,
                depositAmount: Math.trunc(depositDetails.depositAmount),
                pifNo: depositDetails.pifNo,
                midCode: depositDetails.midCode,
                depositDetails: depositDetails.depositDetails,
                isGhsIncluded: depositDetails.isGhsIncluded,
                depositSlipNo: depositDetails.depositSlipNo,
                password: depositDetails.password,
                approvalDetails: depositDetails.approvalDetails,
                isBankingCompleted: depositDetails.isBankingCompleted,
                id: depositDetails.id,
                depositedSlipDate: depositDetails.depositedSlipDate,
                actualDepositAmount: depositDetails.depositAmount,
                isSelected: depositDetails.isSelected
              });
            });
          }
        }
      });
    this.boutiqueBankDepositFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          this.disableSaveButton = true;
          this.showNotifications('pw.boutiqueBankDeposit.saveDepositDetails');

          //reload page after save
          this.boutiqueBankDepositFacade.loadBankDepostDetails({
            pageIndex: this.listingPageEvent.pageIndex,
            pageSize: this.listingPageEvent.pageSize,
            paymentMode: this.checkboxes,
            selectedRowId: this.selectedRowsId,
            sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null
          });

          this.selectedRowsId = [];
        }
      });
    this.boutiqueBankDepositFacade
      .getHasDenomitionSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasDenomitionSaved: boolean) => {
        if (hasDenomitionSaved) {
          //this.depositedAmount = 0;
          this.disableCashDenomitionButton = true;
          this.disableSaveButton = false;
          this.showNotifications('pw.boutiqueBankDeposit.saveCashDenomition');
        }
      });
    this.boutiqueBankDepositFacade
      .getPifNoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pifNoResponse: PifNoResponse) => {
        if (pifNoResponse) {
          this.pifNoResponse = pifNoResponse;
          if (this.pifNoResponse.denominationDetails) {
            this.disableCashDenomitionButton = true;
            this.transactionIds = pifNoResponse.transactionIds;
          }
          this.bankDepositDetails = this.bankDepositDetails.map(
            depositDetails => ({
              ...depositDetails,
              isSelected: pifNoResponse.transactionIds.includes(
                depositDetails.id
              )
            })
          );
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadBankDepostDetails();
  }

  loadBankDepostDetails() {
    this.boutiqueBankDepositFacade.loadBankDepostDetails({
      pageIndex: this.listingPageEvent.pageIndex,
      pageSize: this.listingPageEvent.pageSize,
      paymentMode: this.checkboxes,
      selectedRowId: [],
      sort: this.sortBy ? [this.sortBy + ',' + this.sortOrder] : null
    });
  }

  getSelectedRowsId(rowId: any) {
    this.selectedRowsId = rowId;
  }

  createForm() {
    this.checkBoxesFormGroup = new FormGroup({
      cash: new FormControl(''),
      dd: new FormControl({ value: '', disabled: true }),
      card: new FormControl(''),
      cheque: new FormControl(''),
      all: new FormControl('')
    });
  }
  dateFormatting(date) {
    return moment(Number(date));
  }
  callPopup(
    subTitle,
    subTitle1,
    columnDefs,
    ghsPendingUploadDates,
    servicePendingUploadDates
  ) {
    this.dialog.closeAll();
    this.openErrorPopup = true;
    const dialogRef = this.dialog.open(ErrorGridPopupComponent, {
      autoFocus: false,
      width: '500px',
      disableClose: true,
      data: {
        title: '',
        subTitle: subTitle,
        subTitle1: subTitle1,
        columnDefs: columnDefs,
        rowData: ghsPendingUploadDates,
        rowData1: servicePendingUploadDates,
        buttonText: 'OK'
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.openErrorPopup = false;
        if (res === 'ok') {
        }
      });
  }
  onCheckChange($event) {
    this.openPopup = false;
    if ($event.checked) {
      if ($event.source.value === BankDepostEnum.ALL) {
        this.checkBoxesFormGroup.get('dd').reset();
        this.checkBoxesFormGroup.get('card').reset();
        this.checkBoxesFormGroup.get('cheque').reset();
        this.checkBoxesFormGroup.get('cash').reset();
        this.checkboxes = [];
      } else if ($event.source.value !== BankDepostEnum.ALL) {
        this.checkBoxesFormGroup.get('all').setValue(false);
        if ($event.source.value === 'CHEQUE') {
          this.checkBoxesFormGroup.patchValue({ dd: true });
          this.checkboxes = [...this.checkboxes, 'DD'];
        }
        this.checkboxes = [...this.checkboxes, $event.source.value];
        if (this.checkboxes.length === 4) {
          this.checkBoxesFormGroup.get('all').setValue(true);
        }
      }
    } else {
      if ($event.source.value === 'CHEQUE') {
        this.checkBoxesFormGroup.patchValue({ dd: false });
        this.checkboxes = this.checkboxes.filter(
          paymentMode => paymentMode !== 'DD'
        );
      }
      this.checkboxes = this.checkboxes.filter(
        paymentMode => paymentMode !== $event.source.value
      );
      if ($event.source.value !== BankDepostEnum.ALL) {
        this.checkBoxesFormGroup.get('all').setValue(false);
      }
    }
    if (this.isBankingMandatory === 'false') {
      this.showAlertNotification('pw.boutiqueBankDeposit.bankingMandatoryMsg');
    } else {
      this.listingPageEvent.pageIndex = 0;
      this.loadBankDepostDetails();
    }

    this.overlayNotification.close();
  }

  openSort() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              if (sortData[0].id === 0) {
                this.sortBy = 'collectionDate';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'payerBankName';
              } else if (sortData[0].id === 2) {
                this.sortBy = 'amount';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'asc' : 'DESC';
            }
          }
          this.listingPageEvent.pageIndex = 0;
          this.loadBankDepostDetails();
        }
      });
  }

  emitChequePrintIds(ids) {
    this.transactionIds = ids;
  }
  emitPifNo(pifNo) {
    this.boutiqueBankDepositFacade.loadDepositAmountByPifNo({ pifNo: pifNo });
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else if (error.code === ErrorEnums.ERR_SALE_456) {
      this.disableCashDenomitionButton = true;
      this.disableSaveButton = false;
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }
  emitBankDepositDetails($event) {
    this.saveResponse = [];
    this.openPopup = false;
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.boutiqueBankDepositFacade.saveBankBoutiqueDepositDetails(
            $event.data
          );
        }
      });
  }
  showAlertNotification(key: string): void {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasBackdrop: true,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }
  showLocationSettingNotification(key: string): void {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasBackdrop: false,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  cashDenominationDetails($event) {
    this.openPopup = false;
    this.disableCashDenomitionButton = false;
    this.disableSaveButton = false;
    this.transactionId = $event.ids[0];
    this.transactionIds = $event.ids;
    this.boutiqueBankDepositFacade.saveCashDenomition({
      bankDepositIds: $event.ids,
      denominationDetails: $event.depositDetails
    });
  }
  printChequeDeposit() {
    this.printFacade.loadTransactionIds({
      transactionIds: this.transactionIds
    });
  }
  printCashDeposit() {
    this.printingService.loadPrintData({
      printType: printTypesEnum.CASH_DEPOSIT_PRINT,
      transactionIds: { transactionIds: this.transactionIds },
      printFileType: printFileTypeEnum.CASH_PRINT,
      transacionType: printTransactionTypesEnum.SALES,
      doctype: printDocTypeEnum.CUSTOMER_PRINT
    });
  }

  sort(sortEvent: string[]) {
    this.listingPageEvent.pageIndex = 0;
    this.loadBankDepostDetails();
  }

  printError() {
    this.overlayNotification.close();
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: this.printErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
    this.listingPageEvent.pageIndex = 0;
    this.loadBankDepostDetails();
  }

  back() {
    this.dialog.closeAll();
    this.boutiqueBankDepositFacade.resetBoutiqueBankDepostDetails();
    this.openPopup = false;
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.BANK_DEPOSIT
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.printingService.resetPrint();
  }
}
