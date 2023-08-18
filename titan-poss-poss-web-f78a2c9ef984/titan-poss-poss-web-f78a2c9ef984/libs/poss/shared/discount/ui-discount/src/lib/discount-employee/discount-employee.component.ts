import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-employee',
  templateUrl: './discount-employee.component.html'
})
export class DiscountEmployeeComponent implements OnInit, OnChanges, OnDestroy {
  employeeDiscountFormGroup: FormGroup;

  isCouponApplied = false;

  @Input() cashMemoId: string = null;
  @Input() appliedCouponCode;
  @Input() resetFormEvent: Observable<null>;

  @Output() applyCouponCode = new EventEmitter<string>();
  @Output() removeCouponCode = new EventEmitter<null>();

  destroy$: Subject<null> = new Subject<null>();

  constructor(private fieldValidatorsService: FieldValidatorsService) {
    this.employeeDiscountFormGroup = new FormGroup({
      couponCode: new FormControl(
        this.appliedCouponCode ? this.appliedCouponCode : '',
        [
          this.fieldValidatorsService.requiredField('Coupon Code'),
          this.fieldValidatorsService.numbersField('Coupon Code')
        ]
      )
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['appliedCouponCode']) {
      this.updateForm();
    }
  }
  ngOnInit(): void {
    this.resetFormEvent
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(data => {
        this.employeeDiscountFormGroup.reset();
        this.updateForm();
      });
  }
  updateForm() {
    if (this.appliedCouponCode) {
      this.employeeDiscountFormGroup.patchValue({
        couponCode: this.appliedCouponCode
      });
      this.isCouponApplied = true;
      this.employeeDiscountFormGroup.get('couponCode').disable();
    } else {
      this.isCouponApplied = false;
      this.employeeDiscountFormGroup.get('couponCode').enable();
      this.employeeDiscountFormGroup.reset();
    }
  }
  onApply() {
    this.applyCouponCode.emit(
      this.employeeDiscountFormGroup.get('couponCode').value
    );
  }
  removeCoupon() {
    this.removeCouponCode.emit();
  }
  ngOnDestroy() {
    this.employeeDiscountFormGroup.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
