import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Ranges, RivaahDiscountEnum } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-add-deduction-form',
  templateUrl: './add-deduction-form.component.html',
  styleUrls: ['./add-deduction-form.component.scss']
})

export class AddDeductionFormComponent implements OnInit {
  @Input() ranges: Ranges[];
  @Input() isRivaah: boolean;
  @Output() formReady = new EventEmitter<FormGroup>();
  multiFormGroup: FormGroup;
  deductionFormGroup: FormGroup;
  rivaahFormGroup: FormGroup;
  rivaahDiscountEnum = RivaahDiscountEnum;
  selectedFileType;
  destroy$ = new Subject();
  translatedMsg = [];

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
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

  ngOnInit(): void {
    console.log('ranges', this.ranges);
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
    this.ranges.forEach((purityRange: Ranges) => {
      group[purityRange.id] = new FormControl('', [
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
        rivaahAdditionalDiscount: new FormControl('',[
          this.fieldValidatorsService.percentageField(
            this.translatedMsg['pw.addDeductionForm.additionalDiscountLabel']
          )
        ]),
      })
    })
    this.formReady.emit(this.multiFormGroup);
  }
}
