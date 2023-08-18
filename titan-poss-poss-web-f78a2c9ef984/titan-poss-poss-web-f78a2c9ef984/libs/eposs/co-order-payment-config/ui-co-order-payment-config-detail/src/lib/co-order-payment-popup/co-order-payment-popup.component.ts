import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-co-order-payment-popup',
  templateUrl: './co-order-payment-popup.component.html',
  styleUrls: ['./co-order-payment-popup.component.scss']
})
export class CoOrderPaymentPopupComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();

  formData: FormGroup;
  frozenMetalRate: string;
  nonFrozenMetalRate: string;
  bestRate: string;

  constructor(
    public dialogRef: MatDialogRef<CoOrderPaymentPopupComponent>,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.coOrderPaymentConfig.frozenMetalRate',
        'pw.coOrderPaymentConfig.nonFrozenMetalRate',
        'pw.coOrderPaymentConfig.bestRate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        (this.frozenMetalRate =
          translatedMessages['pw.coOrderPaymentConfig.frozenMetalRate']),
          (this.nonFrozenMetalRate =
            translatedMessages['pw.coOrderPaymentConfig.nonFrozenMetalRate']),
          (this.bestRate =
            translatedMessages['pw.coOrderPaymentConfig.bestRate']);
      });
    this.formData = new FormGroup({
      ibtMetalRateFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.ibtMetalRateFrozenPercentforGold
          ? this.data?.selectedDetails?.ibtMetalRateFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      ibtMetalRateFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.ibtMetalRateFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.ibtMetalRateFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      ibtMetalRateNonFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.ibtMetalRateNonFrozenPercentforGold
          ? this.data?.selectedDetails?.ibtMetalRateNonFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      ibtMetalRateNonFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.ibtMetalRateNonFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.ibtMetalRateNonFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      ibtBestRatePercentforGold: new FormControl(
        this.data?.selectedDetails?.ibtBestRatePercentforGold
          ? this.data?.selectedDetails?.ibtBestRatePercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField('Best Gold Rate Percent'),
          this.fieldValidatorsService.percentageField('Best Gold Rate Percent')
        ]
      ),
      ibtBestRatePercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.ibtBestRatePercentforPlatinum
          ? this.data?.selectedDetails?.ibtBestRatePercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          ),
          this.fieldValidatorsService.percentageField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      mtrMetalRateFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.mtrMetalRateFrozenPercentforGold
          ? this.data?.selectedDetails?.mtrMetalRateFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      mtrMetalRateFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.mtrMetalRateFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.mtrMetalRateFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      mtrMetalRateNonFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.mtrMetalRateNonFrozenPercentforGold
          ? this.data?.selectedDetails?.mtrMetalRateNonFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      mtrMetalRateNonFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.mtrMetalRateNonFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.mtrMetalRateNonFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      mtrBestRatePercentforGold: new FormControl(
        this.data?.selectedDetails?.mtrBestRatePercentforGold
          ? this.data?.selectedDetails?.mtrBestRatePercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField('Best Gold Rate Percent'),
          this.fieldValidatorsService.percentageField('Best Gold Rate Percent')
        ]
      ),
      mtrBestRatePercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.mtrBestRatePercentforPlatinum
          ? this.data?.selectedDetails?.mtrBestRatePercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          ),
          this.fieldValidatorsService.percentageField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      prodMetalRateFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.prodMetalRateFrozenPercentforGold
          ? this.data?.selectedDetails?.prodMetalRateFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      prodMetalRateFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.prodMetalRateFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.prodMetalRateFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      prodMetalRateNonFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.prodMetalRateNonFrozenPercentforGold
          ? this.data?.selectedDetails?.prodMetalRateNonFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      prodMetalRateNonFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.prodMetalRateNonFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.prodMetalRateNonFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      prodBestRatePercentforGold: new FormControl(
        this.data?.selectedDetails?.prodBestRatePercentforGold
          ? this.data?.selectedDetails?.prodBestRatePercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField('Best Gold Rate Percent'),
          this.fieldValidatorsService.percentageField('Best Gold Rate Percent')
        ]
      ),
      prodBestRatePercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.prodBestRatePercentforPlatinum
          ? this.data?.selectedDetails?.prodBestRatePercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          ),
          this.fieldValidatorsService.percentageField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      comMetalRateFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.comMetalRateFrozenPercentforGold
          ? this.data?.selectedDetails?.comMetalRateFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      comMetalRateFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.comMetalRateFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.comMetalRateFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      comMetalRateNonFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.comMetalRateNonFrozenPercentforGold
          ? this.data?.selectedDetails?.comMetalRateNonFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      comMetalRateNonFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.comMetalRateNonFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.comMetalRateNonFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      comBestRatePercentforGold: new FormControl(
        this.data?.selectedDetails?.comBestRatePercentforGold
          ? this.data?.selectedDetails?.comBestRatePercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField('Best Gold Rate Percent'),
          this.fieldValidatorsService.percentageField('Best Gold Rate Percent')
        ]
      ),
      comBestRatePercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.comBestRatePercentforPlatinum
          ? this.data?.selectedDetails?.comBestRatePercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          ),
          this.fieldValidatorsService.percentageField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      autoApprovalFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.autoApprovalFrozenPercentforGold
          ? this.data?.selectedDetails?.autoApprovalFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      autoApprovalFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.autoApprovalFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.autoApprovalFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      autoApprovalNonFrozenPercentforGold: new FormControl(
        this.data?.selectedDetails?.autoApprovalNonFrozenPercentforGold
          ? this.data?.selectedDetails?.autoApprovalNonFrozenPercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      autoApprovalNonFrozenPercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.autoApprovalNonFrozenPercentforPlatinum
          ? this.data?.selectedDetails?.autoApprovalNonFrozenPercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          ),
          this.fieldValidatorsService.percentageField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      autoApprovalBestRatePercentforGold: new FormControl(
        this.data?.selectedDetails?.autoApprovalBestRatePercentforGold
          ? this.data?.selectedDetails?.autoApprovalBestRatePercentforGold
          : '',
        [
          this.fieldValidatorsService.requiredField('Best Gold Rate Percent'),
          this.fieldValidatorsService.percentageField('Best Gold Rate Percent')
        ]
      ),
      autoApprovalBestRatePercentforPlatinum: new FormControl(
        this.data?.selectedDetails?.autoApprovalBestRatePercentforPlatinum
          ? this.data?.selectedDetails?.autoApprovalBestRatePercentforPlatinum
          : '',
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          ),
          this.fieldValidatorsService.percentageField(
            'Best Platinum Rate Percent'
          )
        ]
      )
    });
  }

  save() {
    this.dialogRef.close({
      type: 'save',
      data: this.formData.getRawValue()
    });
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
