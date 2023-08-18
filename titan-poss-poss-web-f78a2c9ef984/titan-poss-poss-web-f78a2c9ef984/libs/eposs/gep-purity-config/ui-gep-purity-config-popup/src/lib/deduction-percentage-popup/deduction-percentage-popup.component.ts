import {
  ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { InputValidatorComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  AddRanges,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  Ranges,
  RivaahDiscountEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-deduction-percentage-popup',
  templateUrl: './deduction-percentage-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeductionPercentagePopupComponent implements OnInit, OnDestroy {
  api: GridApi;
  animateRows = true;
  destroy$: Subject<null> = new Subject<null>();
  multiFormGroup: FormGroup;
  deductionFormGroup: FormGroup;
  rivaahFormGroup: FormGroup;
  rivaahDiscountEnum = RivaahDiscountEnum;
  selectedFileType;
  translatedMsg = [];
  constructor(
    public dialogRef: MatDialogRef<DeductionPercentagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translateService
    .get([
      'pw.addDeductionForm.additionalDiscountLabel',
      'pw.addDeductionForm.additionalDiscountValueLabel',
      'pw.addDeductionForm.dedPercentage'
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe((translatedLabels: any) => {
      this.translatedMsg = translatedLabels;
    });
  }

  ngOnInit() {
    this.createForm();
  }

  discountRadioSelection(){
    if(this.multiFormGroup.get('rivaahFormGroup').get('rivaahDiscountValuetype').value === RivaahDiscountEnum.PERCENTAGE)
    {
      this.multiFormGroup.get('rivaahFormGroup').get('rivaahAdditionalDiscount').setValue('');
      this.multiFormGroup.get('rivaahFormGroup').get('rivaahAdditionalDiscount').
      setValidators(this.fieldValidatorsService.percentageField(
        this.translatedMsg['pw.addDeductionForm.additionalDiscountLabel']
      ));
    }
    else{
      this.multiFormGroup.get('rivaahFormGroup').get('rivaahAdditionalDiscount').setValue('');
      this.multiFormGroup.get('rivaahFormGroup').get('rivaahAdditionalDiscount').
        setValidators(this.fieldValidatorsService.amountField(
          this.translatedMsg['pw.addDeductionForm.additionalDiscountValueLabel']
        ));
    }
  }

  createForm() {
    let group = {};
    this.data.ranges.forEach((data) => {
      group[data.id] = new FormControl(
        this.data.rangesValue ? this.data.rangesValue[data.id] : '', [
        this.fieldValidatorsService.percentageField(
          this.translatedMsg['pw.addDeductionForm.dedPercentage']
        ),
        this.fieldValidatorsService.requiredField(
          this.translatedMsg['pw.addDeductionForm.dedPercentage']
        )
      ]);
    });
    console.log(group);
    this.selectedFileType= RivaahDiscountEnum.PERCENTAGE;
    this.multiFormGroup= new FormGroup({
      deductionFormGroup : new FormGroup(group),
      rivaahFormGroup : new FormGroup({
        rivaahAdditionalDiscount: new FormControl(
          this.data.rangesValue ? this.data.rangesValue.rivaahAdditionalDiscount : '',[
          this.fieldValidatorsService.percentageField(
            this.translatedMsg['pw.addDeductionForm.additionalDiscountLabel']
          )
        ]),
      })
    })
  }

  apply() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.dialogRef.close(this.multiFormGroup.value);
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
