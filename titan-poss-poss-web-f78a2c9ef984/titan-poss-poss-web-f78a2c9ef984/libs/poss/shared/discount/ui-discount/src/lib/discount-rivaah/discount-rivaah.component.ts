import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-rivaah',
  templateUrl: './discount-rivaah.component.html'
})
export class DiscountRivaahComponent implements OnInit {
  rivaahDiscountForm: FormGroup;

  isCouponApplied = false;

  @Input() cashMemoId: string = null;
  @Input() appliedCouponCode;
  @Input() resetFormEvent: Observable<null>;

  @Output() applyCouponCode = new EventEmitter<string>();
  @Output() removeCouponCode = new EventEmitter<null>();

  destroy$: Subject<null> = new Subject<null>();

  constructor(private fieldValidatorsService: FieldValidatorsService) {
    this.rivaahDiscountForm = new FormGroup({
      couponCode: new FormControl(
        this.appliedCouponCode ? this.appliedCouponCode : '',
        [this.fieldValidatorsService.requiredField('Coupon Code')]
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
        this.rivaahDiscountForm.reset();
        this.updateForm();
      });
  }
  updateForm() {
    if (this.appliedCouponCode) {
      this.rivaahDiscountForm.patchValue({
        couponCode: this.appliedCouponCode
      });
      this.isCouponApplied = true;
      this.rivaahDiscountForm.get('couponCode').disable();
    } else {
      this.isCouponApplied = false;
      this.rivaahDiscountForm.get('couponCode').enable();
      this.rivaahDiscountForm.reset();
    }
  }
  onApply() {
    this.applyCouponCode.emit(this.rivaahDiscountForm.get('couponCode').value);
  }
  removeCoupon() {
    this.removeCouponCode.emit();
  }
  ngOnDestroy() {
    this.rivaahDiscountForm.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
