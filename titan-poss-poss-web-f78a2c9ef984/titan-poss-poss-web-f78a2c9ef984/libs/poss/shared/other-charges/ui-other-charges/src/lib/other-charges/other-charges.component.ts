import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  CashMemoTaxDetails,
  Lov,
  OtherChargesDto,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-other-charge',
  templateUrl: './other-charges.component.html',
  styleUrls: []
})
export class OtherChargesComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  otherChargesForm: FormGroup;
  taxFormControl: FormControl;
  isDiscountApplied = false;

  remarksList: SelectDropDownOption[] = [];
  destroy$: Subject<null> = new Subject<null>();
  @Input() taxDetails: CashMemoTaxDetails;
  @Input() reasons: Lov[];
  @Input() currencyCode: string;
  @Input() enableForm = false;
  @Input() otherCharges: any;
  @Input() setFocus = false;

  @Output() apply = new EventEmitter<OtherChargesDto>();
  @ViewChild('amountInput')
  amountInput: ElementRef;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService
  ) {
    this.otherChargesForm = new FormGroup({
      otherCharges: new FormControl('', [
        this.fieldValidatorsService.amountField('Amount'),
        this.fieldValidatorsService.requiredField('Amount')
      ]),

      remarks: new FormControl('', [
        this.fieldValidatorsService.requiredField('Remarks')
      ])
    });

    this.taxFormControl = new FormControl('');
    this.taxFormControl.disable();

    this.otherChargesForm.disable();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enableForm']) {
      this.enableForm === true
        ? this.otherChargesForm.enable()
        : this.otherChargesForm.disable();
    }
    if (changes['reasons']) {
      this.createRemarksDropDownList();
    }
    if (changes['otherCharges']) {
      this.otherChargesBindValue();
    }
    if (changes['setFocus']) {
      if (this.setFocus) {
        setTimeout(() => {
          this.amountInput.nativeElement.focus();
        }, 100);
      }
    }
  }

  ngAfterViewInit() {
    this.createRemarksDropDownList();
  }

  calculateTax() {
    let taxValue = 0;
    let cessTaxValue = 0;

    if (this.otherChargesForm.get('otherCharges').valid) {
      if (this.taxDetails.data !== null) {
        for (const tax of Object.keys(this.taxDetails.data)) {
          taxValue += this.currencyRoundOff(
            (Number(this.otherChargesForm.get('otherCharges').value) *
              this.taxDetails.data[tax].taxPercentage) /
              100
          );
        }
      }
      if (this.taxDetails.cess !== null) {
        for (const tax of Object.keys(this.taxDetails.cess)) {
          if (this.taxDetails.cess[tax].cessOnTax === true) {
            cessTaxValue =
              (taxValue * this.taxDetails.cess[tax].cessPercentage) / 100;
          } else {
            cessTaxValue =
              (Number(this.otherChargesForm.get('otherCharges').value) *
                this.taxDetails.cess[tax].cessPercentage) /
              100;
          }
        }
      }

      this.taxFormControl.patchValue(
        this.currencyRoundOff(cessTaxValue) + this.currencyRoundOff(taxValue)
      );
    }
  }

  currencyRoundOff(amount: any) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  ngOnInit(): void {
    this.otherChargesForm.reset();
    this.updateForm();
  }

  otherChargesBindValue() {
    this.otherChargesForm.reset();
    this.taxFormControl.reset();
    if (this.otherCharges) {
      this.taxFormControl.patchValue(this.otherCharges?.data.taxValue);
      this.otherChargesForm
        .get('remarks')
        .patchValue(this.otherCharges?.data.remarks);
      this.otherChargesForm
        .get('otherCharges')
        .patchValue(this.otherCharges?.data.value);
    }
  }
  updateForm() {
    this.isDiscountApplied = true;
    //this.otherChargesForm.disable();
  }
  createRemarksDropDownList() {
    this.remarksList = [];
    this.reasons?.forEach((reason: Lov) => {
      if (reason.isActive) {
        this.remarksList.push({
          value: reason.value,
          description: reason.value
        });
      }
    });
  }
  onApply() {
    if (this.otherChargesForm.valid) {
      this.apply.emit({
        remarks: this.otherChargesForm.get('remarks').value,
        taxValue: Number(this.taxFormControl.value),
        value: Number(this.otherChargesForm.get('otherCharges').value)
      });
    }
  }

  ngOnDestroy() {
    this.otherChargesForm.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
