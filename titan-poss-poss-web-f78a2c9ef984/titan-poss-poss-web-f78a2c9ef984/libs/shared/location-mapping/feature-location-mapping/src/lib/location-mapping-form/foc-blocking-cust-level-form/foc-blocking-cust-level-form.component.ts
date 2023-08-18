import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-foc-blocking-cust-level-form',
  templateUrl: './foc-blocking-cust-level-form.component.html',
  styleUrls: ['./foc-blocking-cust-level-form.component.scss']
})
export class FocBlockingCustLevelFormComponent implements OnInit, OnDestroy {
  focBlockingCustomerLevel: FormGroup;
  currentDate = moment();
  @Output() formReady = new EventEmitter<FormGroup>();
  mobileNoTranslatedMsg: string;
  focItemCodeTranslatedMsg: string;
  quantityaTranslatedMsg: string;
  approvedByTranslatedMsg: string;
  remarksTranslatedMsg: string;
  destroy$ = new Subject<null>();
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.focBlockingCustomerLevel.mobileNumberLabel',
        'pw.focBlockingCustomerLevel.focItemCode',
        'pw.focBlockingCustomerLevel.quantityLabel',
        'pw.focBlockingCustomerLevel.approvedByLabel',
        'pw.focBlockingCustomerLevel.remarksLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.mobileNoTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.mobileNumberLabel'];
        this.focItemCodeTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.focItemCode'];
        this.quantityaTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.quantityLabel'];
        this.quantityaTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.quantityLabel'];
        this.approvedByTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.approvedByLabel'];
        this.remarksTranslatedMsg =
          translatedMsg['pw.focBlockingCustomerLevel.remarksLabel'];
      });
  }

  ngOnInit(): void {
    this.creatForm();
    this.focBlockingCustomerLevel
      .get('rangeFormGroup')
      .get('startDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.focBlockingCustomerLevel
          .get('rangeFormGroup')
          .get('endDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  creatForm() {
    this.focBlockingCustomerLevel = new FormGroup({
      focItemCode: new FormControl('', [
        this.fieldValidatorsService.itemCodeField(this.focItemCodeTranslatedMsg)
      ]),
      quantity: new FormControl('', [
        this.fieldValidatorsService.quantityField(this.quantityaTranslatedMsg)
      ]),
      rangeFormGroup: new FormGroup({
        startDate: new FormControl(''),
        endDate: new FormControl('')
      }),
      mobileNo: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.mobileNoTranslatedMsg),
        this.fieldValidatorsService.mobileField(this.mobileNoTranslatedMsg)
      ]),
      approvedBy: new FormControl('', [
        this.fieldValidatorsService.nameWithSpaceField(
          this.approvedByTranslatedMsg
        )
      ]),
      isCMMandatory: new FormControl(false),
      remarks: new FormControl('', [
        this.fieldValidatorsService.nameWithSpaceField(
          this.remarksTranslatedMsg
        )
      ]),
      isActive: new FormControl(true)
    });
    this.formReady.emit(this.focBlockingCustomerLevel);
  }
  selectionChange(checked) {
    this.focBlockingCustomerLevel.patchValue({ isActive: checked });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
