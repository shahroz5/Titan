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
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-empowerment',
  templateUrl: './discount-empowerment.component.html'
})
export class DiscountEmpowermentComponent
  implements OnInit, OnChanges, OnDestroy {
  empowermentDiscountFormGroup: FormGroup;

  @Input() cashMemoId: string = null;
  @Input() isEmpowermentDiscountApplied;
  @Input() resetFormEvent: Observable<null>;

  @Output() applyEmpowermentDiscount = new EventEmitter<boolean>();
  @Output() removeEmpowermentDiscount = new EventEmitter<null>();

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.empowermentDiscountFormGroup = new FormGroup({
      isSelected: new FormControl(
        this.isEmpowermentDiscountApplied
          ? this.isEmpowermentDiscountApplied
          : null
      )
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['isEmpowermentDiscountApplied']) {
      this.updateForm();
    }
    if (changes && changes['cashMemoId']) {
      if (!this.cashMemoId) {
        this.empowermentDiscountFormGroup.get('isSelected').disable();
      } else {
        this.empowermentDiscountFormGroup.get('isSelected').enable();
      }
    }
  }
  ngOnInit(): void {
    this.resetFormEvent
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(data => {
        // this.empowermentDiscountFormGroup.reset();

        this.updateForm();
      });
    this.empowermentDiscountFormGroup
      .get('isSelected')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === true) {
          this.applyEmpowermentDiscount.emit(true);
        } else if (data === false) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.discount.removeEmpowermentDiscountAlertMsg'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.removeEmpowermentDiscount.emit();
              } else {
                this.updateForm();
              }
            });
        }
      });
  }
  updateForm() {
    // if (this.appliedCouponCode) {
    this.empowermentDiscountFormGroup.patchValue(
      {
        isSelected: this.isEmpowermentDiscountApplied
      },
      { emitEvent: false }
    );
    // this.isCouponApplied = true;
    // this.empowermentDiscountFormGroup.get('couponCode').disable();
    // }
    // else this.isCouponApplied = false;
  }
  ngOnDestroy() {
    this.empowermentDiscountFormGroup.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
