import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import {
  Lov,
  EncircleTypesEnum,
  EncircleEligibleTypesEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-occasion-selection',
  templateUrl: './occasion-selection.component.html',
  styleUrls: ['./occasion-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OccasionSelectionComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() occasionList: Lov[];
  @Input() discountList: Lov[] = [];
  @Input() selectedOccasionEvent: Observable<string>;
  @Input() selectedEncircleEvent: Observable<string>;
  @Input() clearOccasionEvent: Observable<null>;
  @Input() clearEncircleEvent: Observable<null>;
  @Input() resetEncircleEvent: Observable<string>;
  @Input() occasionEnable: boolean;
  @Input() clearOccasionIconEvent: Observable<null>;
  @Input() customerLoyaltyDetails = null;
  @Input() enableDiscountUpdate = false;
  @Output() occasionValueEmit = new EventEmitter<string>();
  @Output() selectedEncircle = new EventEmitter<string>();
  @Output() availableEncircle = new EventEmitter<{
    availableEncircleDiscounts: any;
    addedEncircleDiscounts: string;
  }>();
  destroy$: Subject<null> = new Subject<null>();
  @ViewChild(SelectDropdownComponent)
  selectDropdownRef: SelectDropdownComponent;

  occasions: FormGroup;
  isAnniversary: boolean;
  isBirthday: boolean;
  isSpouseBirthday: boolean;
  occasionListArray = [];
  encircleDiscount = new FormControl();
  encirlceDiscountTypes = [
    String(EncircleTypesEnum.ULP_DISCOUNT_BIRTHDAY),
    String(EncircleTypesEnum.ULP_DISCOUNT_ANNIVERSARY),
    String(EncircleTypesEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY)
  ];
  encircleDiscountsOptions = [];
  @Input() setFocus = false;
  encircleDisableAlertMsg: string;
  previousEncircleDiscountSelected = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertPopupService: AlertPopupServiceAbstraction,
    private translate: TranslateService
  ) {
    this.occasions = this.formBuilder.group({
      occasionValue: [null]
    });
    this.translate
      .get(['pw.discountDetailsPopup.billLevelDiscountErrorMsg'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.encircleDisableAlertMsg =
          translatedMessages[
            'pw.discountDetailsPopup.billLevelDiscountErrorMsg'
          ];
      });
  }

  ngOnInit() {
    this.occasions.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.occasionValue !== null) {
          this.occasionValueEmit.emit(this.occasions.value.occasionValue);
        }
      });

    this.selectedOccasionEvent
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data !== null) {
          this.occasions.patchValue({ occasionValue: data });
        }
      });

    this.selectedEncircleEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.encircleDiscount.patchValue(data);
      });

    this.clearOccasionEvent?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.occasions.patchValue({ occasionValue: null });
      this.occasions.reset();
    });

    this.clearOccasionIconEvent
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.clearOccasionIcon();
      });

    this.occasions.disable();
    this.encircleDiscount.disable();

    this.encircleDiscount.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null && this.enableDiscountUpdate) {
          this.previousEncircleDiscountSelected = this.encircleDiscount.value;
          this.selectedEncircle.emit(this.encircleDiscount.value);
          this.availableEncircle.emit({
            availableEncircleDiscounts: this.encircleDiscountsOptions,
            addedEncircleDiscounts: this.encircleDiscount.value
          });
        }
      });

    this.clearEncircleEvent.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.encircleDiscount.patchValue(null, { emitEvent: false });
    });

    this.resetEncircleEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.encircleDiscount.patchValue(data, { emitEvent: false });
        this.previousEncircleDiscountSelected = data;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['occasionList']) {
      this.occasionListArray = [];
      this.occasionList.forEach(element => {
        this.occasionListArray.push({
          value: element.value,
          description: element.value
        });
      });
    }

    if (changes['customerLoyaltyDetails']) {
      if (this.customerLoyaltyDetails) {
        this.getApplicableEncircleDiscounts(this.customerLoyaltyDetails);
      } else {
        this.encircleDiscountsOptions = [];
        this.availableEncircle.emit({
          availableEncircleDiscounts: this.encircleDiscountsOptions,
          addedEncircleDiscounts: this.encircleDiscount.value
        });
      }
    }

    // if (changes['enableDiscountUpdate']) {
    //   if (this.enableDiscountUpdate) {
    //     this.encircleDiscount.enable();
    //   } else {
    //     this.encircleDiscount.disable();
    //   }
    // }
    if (changes['setFocus']) {
      if (this.setFocus) {
        setTimeout(() => {
          if (this.selectDropdownRef) this.selectDropdownRef.focus();
        }, 100);
      }
    }

    if (changes['occasionEnable']) {
      if (this.occasionEnable === true) {
        this.occasions.enable();
        if (this.enableDiscountUpdate) {
          this.encircleDiscount.enable();
        } else {
          this.encircleDiscount.disable();
        }
      } else {
        this.occasions.disable();
        this.encircleDiscount.disable();
      }
    }
  }

  getApplicableEncircleDiscounts(customerLoyaltyDetails) {
    this.encircleDiscountsOptions = [];
    let filteredArray = [];
    this.clearOccasionIcon();
    if (this.discountList.length !== 0) {
      filteredArray = this.discountList.filter(item => {
        return this.encirlceDiscountTypes.indexOf(item.code) > -1;
      });
    }

    if (
      customerLoyaltyDetails?.data?.birthdayDiscount ===
      EncircleEligibleTypesEnum.ULP_DISCOUNT_BIRTHDAY
    ) {
      const discOptions = filteredArray.filter(item => {
        return EncircleTypesEnum.ULP_DISCOUNT_BIRTHDAY.indexOf(item.code) > -1;
      });
      if (discOptions.length !== 0) {
        this.encircleDiscountsOptions.push({
          value: discOptions[0].code,
          description: discOptions[0].value
        });
        this.isBirthday = true;
      }
    }

    if (
      customerLoyaltyDetails?.data?.anniversaryDiscount ===
      EncircleEligibleTypesEnum.ULP_DISCOUNT_ANNIVERSARY
    ) {
      const discOptions = filteredArray.filter(item => {
        return (
          EncircleTypesEnum.ULP_DISCOUNT_ANNIVERSARY.indexOf(item.code) > -1
        );
      });
      if (discOptions.length !== 0) {
        this.encircleDiscountsOptions.push({
          value: discOptions[0].code,
          description: discOptions[0].value
        });
        this.isAnniversary = true;
      }
    }

    if (
      customerLoyaltyDetails?.data?.spouseBirthdayDiscount ===
      EncircleEligibleTypesEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY
    ) {
      const discOptions = filteredArray.filter(item => {
        return (
          EncircleTypesEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.indexOf(item.code) > -1
        );
      });
      if (discOptions.length !== 0) {
        this.encircleDiscountsOptions.push({
          value: discOptions[0].code,
          description: discOptions[0].value
        });
        this.isSpouseBirthday = true;
      }
    }

    // console.log(
    //   this.encircleDiscountsOptions.length,
    //   this.encircleDiscount.value
    // );
    if (
      this.encircleDiscountsOptions.length === 1 &&
      this.encircleDiscount.value === null
    ) {
      this.encircleDiscount.patchValue(this.encircleDiscountsOptions[0].value);
    }

    this.availableEncircle.emit({
      availableEncircleDiscounts: this.encircleDiscountsOptions,
      addedEncircleDiscounts: this.encircleDiscount.value
    });
  }

  clearOccasionIcon() {
    this.isBirthday = false;
    this.isAnniversary = false;
    this.isSpouseBirthday = false;
  }

  encircleDisableAlert() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: this.encircleDisableAlertMsg
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.encircleDiscount.patchValue(
          this.previousEncircleDiscountSelected,
          { emitEvent: false }
        );
      });
  }

  encircleChange(event) {
    if (!this.enableDiscountUpdate) {
      if (event.value === undefined) {
        this.previousEncircleDiscountSelected = this.encircleDiscount.value;
        this.selectedEncircle.emit(this.encircleDiscount.value);
        this.availableEncircle.emit({
          availableEncircleDiscounts: this.encircleDiscountsOptions,
          addedEncircleDiscounts: this.encircleDiscount.value
        });
      } else {
        this.encircleDisableAlert();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
