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
  selector: 'poss-web-discount-tsss',
  templateUrl: './discount-tsss.component.html'
})
export class DiscountTsssComponent implements OnInit, OnChanges, OnDestroy {
  tsssDiscountFormGroup: FormGroup;

  isCouponApplied = false;

  @Input() cashMemoId: string = null;
  @Input() appliedCouponCode;
  @Input() resetFormEvent: Observable<null>;

  @Output() applyCouponCode = new EventEmitter<string>();
  @Output() removeCouponCode = new EventEmitter<null>();

  destroy$: Subject<null> = new Subject<null>();

  constructor(private fieldValidatorsService: FieldValidatorsService) {
    this.tsssDiscountFormGroup = new FormGroup({
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
        this.tsssDiscountFormGroup.reset();
        this.updateForm();
      });
  }
  updateForm() {
    if (this.appliedCouponCode) {
      this.tsssDiscountFormGroup.patchValue({
        couponCode: this.appliedCouponCode
      });
      this.isCouponApplied = true;
      this.tsssDiscountFormGroup.get('couponCode').disable();
    } else {
      this.tsssDiscountFormGroup.get('couponCode').enable();
      this.isCouponApplied = false;
      this.tsssDiscountFormGroup.reset();
    }
  }
  onApply() {
    this.applyCouponCode.emit(
      this.tsssDiscountFormGroup.get('couponCode').value
    );
  }
  RemoveCoupon() {
    this.removeCouponCode.emit();
  }
  ngOnDestroy() {
    this.tsssDiscountFormGroup.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
