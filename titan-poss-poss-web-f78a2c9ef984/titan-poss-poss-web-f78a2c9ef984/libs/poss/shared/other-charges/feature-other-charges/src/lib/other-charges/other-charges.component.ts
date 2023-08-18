import {
  AfterViewInit,
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import { OtherChargesFacade } from '@poss-web/poss/shared/other-charges/data-access-other-charges';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CashMemoDetailsResponse,
  CashMemoTaxDetails,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CreatedCustomerResponse,
  CustomErrors,
  Lov,
  OtherChargesDto,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SubTransactionTypeEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'poss-web-other-charges',
  templateUrl: './other-charges.component.html',
  styleUrls: ['./other-charges.component.scss']
})
export class OtherChargesComponent implements OnInit, AfterViewInit, OnChanges {
  customerId = null;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  taxDetails$: Observable<CashMemoTaxDetails>;
  otherChargesList: any;
  enableForm = false;
  cashMemoId: null;
  reasons$: Observable<Lov[]>;
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  taxTransactionType: TransactionTypeEnum;
  transactionTypeEnumRef = TransactionTypeEnum;
  @Input() setFocus: number;
  setOtherChargesFocus = false;
  badgeNumber = 5;
  @ViewChild(MatExpansionPanel) pannel?: MatExpansionPanel;
  @Input() viewMode = false;
  @Input() showPanelNumber = true;

  constructor(
    private otherChargesFacade: OtherChargesFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private customerFacade: CustomerFacade,
    private productFacade: ProductFacade,
    private commonFacade: CommonFacade
  ) {}
  ngAfterViewInit(): void {
    this.otherChargesFacade.loadReasons('OTHER_CHARGES_REASONS');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setFocus']) {
      if (this.setFocus === this.badgeNumber) {
        this.pannel.open();
        this.setOtherChargesFocus = true;
      } else {
        this.setOtherChargesFocus = false;
      }
    }
  }

  ngOnInit(): void {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionConfig => {
        if (transactionConfig) {
          this.transactionType = transactionConfig.transactionType?.type;
          this.subTransactionType = transactionConfig.transactionType?.subType;
          this.taxTransactionType = transactionConfig?.taxTransactionType;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.OTHER_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(otherCharges => {
        this.otherChargesList = otherCharges;
      });

    this.componentInit();
  }

  componentInit() {
    this.isLoading$ = this.otherChargesFacade.getIsLoading();
    this.reasons$ = this.otherChargesFacade.getReasons();
    this.taxDetails$ = this.otherChargesFacade.getTaxDetails();

    this.otherChargesFacade
      .getPartialUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((UpdatedCashMemoDetailsResponse: CashMemoDetailsResponse) => {
        if (UpdatedCashMemoDetailsResponse) {
          this.commonFacade.setCMFinalAmount(
            UpdatedCashMemoDetailsResponse.finalValue,
            UpdatedCashMemoDetailsResponse.totalTax,
            UpdatedCashMemoDetailsResponse.otherChargesList
          );
        }
      });

    this.customerFacade
      .getSelectedCustomerDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((customer: CreatedCustomerResponse) => {
        if (customer) {
          this.customerId = customer.customerId;
          if (this.taxTransactionType && this.customerId) {
            this.otherChargesFacade.loadTaxDetails({
              itemCode: 'OTHERCHARGES',
              txnType: this.taxTransactionType,
              customerId: this.customerId
            });
          }
        } else {
          this.customerId = null;
        }
      });

    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items && items.length > 0) {
          this.enableForm = true;
        } else {
          this.enableForm = false;
        }
      });

    this.otherChargesFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionID => {
        if (transactionID) {
          this.cashMemoId = transactionID;
        }
      });
  }
  applyOtherCharges(value: OtherChargesDto) {
    this.otherChargesFacade.partialUpdateCashMemo({
      subTxnType: this.subTransactionType,
      txnType: this.transactionType,
      id: this.cashMemoId,
      requestDetails: {
        otherChargeDetailsDto: {
          data: {
            remarks: value.remarks,
            taxValue: value.taxValue,
            value: value.value
          },
          type: 'OTHERCHARGES'
        }
      }
    });
    this.otherChargesFacade
      .getPartialUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data && data.refTxnType === this.transactionType) {
          //  this.commonFacade.setCMFinalAmount(data.finalValue);
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
