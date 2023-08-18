import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CtGrfFacade } from '@poss-web/poss/grf/data-access-grf';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CashPaymentConfiguration,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CreditNote,
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SUMMARY_BAR_DATA } from '../../summary-bar.token';

@Component({
  selector: 'poss-web-summary-bar-merge-grf',
  templateUrl: './summary-bar-merge-grf.component.html',
  styleUrls: ['./summary-bar-merge-grf.component.scss']
})
export class SummaryBarMergeGrfComponent implements OnInit, OnDestroy {
  remarksFormControl: FormControl;
  events = new EventEmitter<SummaryBarEventRef>();
  destroy$: Subject<null> = new Subject<null>();
  remarksLabel = '';
  grfCNs: CreditNote[] = [];
  goldRateFreezeCN: CreditNote[] = [];
  avgGoldRate = 0;
  totalGoldWt = 0;
  totalAmt = 0;
  totalGoldRatePerRate = 0;
  currencySymbol: string;
  remainingAmount = 0;
  totalCashLimit = 0;
  cashAmountMaxCap = 0;
  configAmountForAdv = 0;
  isPanMan = true;
  constructor(
    @Inject(SUMMARY_BAR_DATA) private data: { remarks: Observable<string> },
    public translate: TranslateService,
    public currencySymbolService: CurrencySymbolService,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog,
    private commonFacade: CommonFacade,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {
    this.currencySymbol = `(${this.currencySymbolService.get(
      this.defaultCurrencyCode
    )})`;
    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit(): void {
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
    ]);
    if (this.data?.remarks) {
      this.data.remarks
        .pipe(takeUntil(this.destroy$))
        .subscribe((remarks: string) => {
          this.remarksFormControl.reset();
          this.remarksFormControl.setValue(remarks);
        });
    }
    // this.commonFacade
    //   .getCashAmountMaxCap()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.MERGE_GRF,
        CommomStateAttributeNameEnum.CASH_AMOUNT_MAX_CAP
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amount: string) => {
        if (amount) {
          this.cashAmountMaxCap = Number(amount);
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.MERGE_GRF,
        CommomStateAttributeNameEnum.CONFIG_AMOUNT_FOR_ADV
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((advAmount: number) => {
        if (advAmount) {
          this.configAmountForAdv = advAmount;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.MERGE_GRF,
        CommomStateAttributeNameEnum.MERGE_CNS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((grfCNs: CreditNote[]) => {
        if (grfCNs) {
          this.grfCNs = grfCNs;
          this.avgGoldRate = 0;
          this.totalAmt = 0;
          this.totalGoldWt = 0;
          this.remainingAmount = 0;
          this.totalGoldRatePerRate = 0;
          this.totalCashLimit = 0;
          this.grfCNs.forEach(grf => {
            this.totalGoldRatePerRate =
              this.totalGoldRatePerRate + grf.ratePerUnit;
            this.totalGoldWt = this.totalGoldWt + grf.weight;
            this.totalAmt = this.totalAmt + (grf.amount - grf.utilisedAmount);
            this.totalCashLimit = this.totalCashLimit + grf.cashCollected;
          });
          if (this.grfCNs.length > 0)
            this.avgGoldRate = Math.round(this.totalAmt / this.totalGoldWt);
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.MERGE_GRF,
        CommomStateAttributeNameEnum.IS_PAN_CARD_MAN
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPanCardMan: boolean) => {
        this.isPanMan = isPanCardMan;
      });
  }
  callAlertPopup(key: string) {
    this.dialog.closeAll();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((trasnaltedMsg: string) => {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.ERROR,
            message: trasnaltedMsg
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
            }
          });
      });
  }
  clearData() {
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
    this.remarksFormControl.reset();
  }
  createMergeGRF() {
    if (this.remarksFormControl.valid) {
      if (this.grfCNs.length === 1) {
        this.callAlertPopup('pw.grf.creditNoteInfoMsg');
      } else if (this.totalCashLimit > this.cashAmountMaxCap) {
        this.callAlertPopup('pw.grf.cashLimitAlertMsg');
      } else if (this.totalAmt > this.configAmountForAdv && this.isPanMan) {
        this.callAlertPopup('pw.grf.panCardAlertMsg');
      } else {
        this.events.emit({
          eventType: SummaryBarEventType.CREATEGRF,
          remarks: this.remarksFormControl.value
        });
      }
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trimRemarks() {
    this.remarksFormControl.setValue(
      this.remarksFormControl.value.replace(/\s+/g, ' ')
    );
  }
}
