import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GiftCardsFacade } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CashMemoMinimalDetail,
  CustomErrors,
  GetGiftCardItemResponse,
  GiftCardItem,
  GiftCardsTypesEnum,
  InvoiceDeliveryTypes,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PostTransactionConfirmationActionsServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  RoleCodesEnum,
  RsoNameObject,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-gift-cards-history-details',
  templateUrl: './gift-cards-history-details.component.html',
  styleUrls: ['./gift-cards-history-details.component.scss']
})
export class GiftCardsHistoryDetailsComponent implements OnInit {
  selectedHistoryItem: CashMemoMinimalDetail;
  isLoading$: Observable<boolean>;
  isCommonFacadeLoading$: Observable<boolean>;
  isCustomerFacadeLoading$: Observable<boolean>;
  moment = moment;
  printErrorText: string;
  destroy$: Subject<null> = new Subject<null>();
  summaryBarRemarks$ = new Subject<string>();

  gcCmDetails: CashMemoMinimalDetail;
  giftCardsItemList = [];
  giftCardObservable$: Observable<GiftCardItem[]>;
  clearAllDataObservable$: Observable<boolean> = of(false);
  giftCardsTypesEnum = GiftCardsTypesEnum;
  roleCode: string = RoleCodesEnum.RSO;
  rsoNamesList: { value: string; description: string }[] = [];
  customerId: number;

  constructor(
    private giftCardsFacade: GiftCardsFacade,
    private activatedRoute: ActivatedRoute,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.giftCardsFacade.resetGiftCardsData();
    // To load payment details
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      transactionType: {
        type: TransactionTypeEnum.CM,
        subType: SubTransactionTypeEnum.GIFT_SALE
      },
      showPayment: false
    });

    const transactionId = this.activatedRoute.snapshot.params['_id'];
    this.isLoading$ = this.giftCardsFacade.getIsLoading();
    this.isCommonFacadeLoading$ = this.giftCardsFacade.getIsLoading();
    this.isCustomerFacadeLoading$ = this.customerFacade.getIsLoading();
    this.giftCardsFacade.loadRsoDetails(this.roleCode);

    this.gcCmDetails = null;
    this.clearAllDataObservable$ = of(true);
    this.giftCardObservable$ = of([]);

    // load transaction items
    this.giftCardsFacade.loadSelectedGcCashMemoDetails(transactionId);
    // Get Gift Card Transaction items
    this.giftCardsFacade
      .getSelectedGcCashMemoDetails()
      .pipe(
        filter(selectedGcCashMemoDetails => !!selectedGcCashMemoDetails),
        take(1)
      )
      .subscribe((selectedGcCashMemoDetails: CashMemoMinimalDetail) => {
        this.gcCmDetails = selectedGcCashMemoDetails;
        this.selectedHistoryItem = selectedGcCashMemoDetails;

        if (this.gcCmDetails) {
          this.giftCardsItemList = [];
          this.showSummaryBar();
          if (this.gcCmDetails?.itemIdList?.length > 0) {
            this.gcCmDetails.itemIdList.forEach((giftCardItemId: string) => {
              this.giftCardsFacade.getAddedGiftCardItem(
                this.gcCmDetails.id,
                giftCardItemId
              );
            });
          }

          this.commonFacade.setTransactionConfig({
            isPaymentEditable: false,
            transactionType: {
              type: TransactionTypeEnum.CM,
              subType: SubTransactionTypeEnum.GIFT_SALE
            },
            transactionID: this.gcCmDetails.id,
            showPayment: true
          });
          //To load Customer details
          this.customerId = this.gcCmDetails.customerId;
          this.customerFacade.loadSelectedCustomer(
            this.gcCmDetails.customerId.toString(),
            false,
            false
          );
          // this.giftCardsFacade.setCardsTotalAmount(this.gcCmDetails.totalValue);
          this.commonFacade.setTransactionTotalAmount(
            this.gcCmDetails.totalValue
          );
          // this.giftCardsFacade.setCardsTotalQty(this.gcCmDetails.totalQuantity);
          this.commonFacade.setGcTotalCardsQty(this.gcCmDetails.totalQuantity);

          if (this.selectedHistoryItem && this.selectedHistoryItem.remarks) {
            this.summaryBarRemarks$.next(this.selectedHistoryItem.remarks);
          }
        }
      });

    this.giftCardsFacade
      .getAddedGiftCardItemResponse()
      .pipe(
        filter(giftCardItemDetail => !!giftCardItemDetail),
        takeUntil(this.destroy$)
      )
      .subscribe((giftCardItemDetail: GetGiftCardItemResponse) => {
        if (giftCardItemDetail) {
          const giftCardGridItem: GiftCardItem = {
            cardNo: giftCardItemDetail.instrumentNo,
            amount: giftCardItemDetail.totalValue,
            tax: giftCardItemDetail.totalTax,
            finalPrice: giftCardItemDetail.finalValue,
            bin: giftCardItemDetail.binCode,
            itemId: giftCardItemDetail.itemId
          };
          this.giftCardsItemList = [
            // ...this.giftCardsItemList,
            giftCardGridItem
          ];

          this.giftCardObservable$ = giftCardGridItem
            ? of(this.giftCardsItemList)
            : of([]);
        }
      });

    this.giftCardsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((errors: CustomErrors) => {
        if (errors && errors.code) {
          this.errorHandler(errors);
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

    this.printingService
      .getIsMailSent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMailSent: boolean) => {
        if (isMailSent) {
          this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
        }
      });

    this.printingService
      .getIsPrintingSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrintingSuccess: boolean) => {
        if (isPrintingSuccess) {
          this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
        }
      });


      this.giftCardsFacade
      .getRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: RsoNameObject[]) => {
        this.rsoNamesList = rsoDetails;
        // if (rsoDetails && rsoDetails.length > 0) {
        //   this.rsoNamesList = rsoDetails.map((rsoNameObj: RsoNameObject) => {
        //     return { value: rsoName, description: rsoName };
        //   });
        // } else {
        //   this.rsoNamesList = [];
        // }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError(error.message);
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error,
          hasBackdrop: true
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  showAlertPopUp(message: string) {
    this.alertPopUpService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  printError(message: string) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: message,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {});
  }

  dateFormat(date) {
    return moment(date);
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GIFT_CARD, {
        status: this.selectedHistoryItem.status,
        type: GiftCardsTypesEnum.HISTORY,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.PRINT: {
            this.printGIftCardsConfirmedTransaction(
              this.selectedHistoryItem.id
            );
          }
        }
      });
  }

  printGIftCardsConfirmedTransaction(transactionId: string) {
    this.postConfirmationActions
      .open()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          let action = '';
          switch (res) {
            case 'print': {
              action = InvoiceDeliveryTypes.PRINT;
              break;
            }
            case 'mail': {
              action = InvoiceDeliveryTypes.MAIL;
              break;
            }
            case 'both': {
              action = InvoiceDeliveryTypes.BOTH;
              break;
            }
          }

          this.printingService.loadPrintData({
            printType: printTypesEnum.GC_PRINTS,
            transacionId: transactionId,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            reprint: true,
            customerId: this.customerId,
            invoiceType: action
          });
        }
      });
  }

  clearFields() {
    this.gcCmDetails = null;
    this.giftCardObservable$ = of([]);
    this.giftCardsItemList = [];
    this.clearAllDataObservable$ = of(true);
    this.giftCardsFacade.resetGiftCardsData();

    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      transactionType: {
        type: TransactionTypeEnum.CM,
        subType: SubTransactionTypeEnum.GIFT_SALE
      },
      showPayment: false
    });
  }

    // display rso name from rso code
    getRsoNameFromCode(code: string) {
      if (this.rsoNamesList.length !== 0) {
        for (const rso of this.rsoNamesList) {
          if (rso.value === code) return rso.description;
        }
      }
      return code;
    }

  ngOnDestroy() {
    this.clearFields();
    this.commonFacade.clearTransactionConfig();
    this.printingService.resetPrint();
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
