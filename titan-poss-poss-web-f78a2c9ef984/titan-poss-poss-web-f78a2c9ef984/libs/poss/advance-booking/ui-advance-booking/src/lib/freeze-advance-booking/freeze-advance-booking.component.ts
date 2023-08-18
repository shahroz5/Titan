import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  OnInit,
  DoCheck
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  AdvanceBookingDetailsResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  FreezeRateEnum,
  MetalTypeEnum,
  SubTransactionTypeEnum
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-freeze-advance-booking',
  templateUrl: './freeze-advance-booking.component.html',
  styleUrls: ['./freeze-advance-booking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreezeAdvanceBookingComponent
  implements OnChanges, OnDestroy, OnInit, DoCheck {
  @Input() advanceBookingDetailsResponse: AdvanceBookingDetailsResponse;
  @Input() currencyCode: string;
  @Input() enableFreeze: string;
  @Input() bgrAllowed = false;
  @Input() isCnRedeemed = false;
  @Input() selectedFOCSchemesCount = 0;
  @Output() freeze = new EventEmitter<string>();
  @Output() bestRate = new EventEmitter<string>();
  @Output() prodToBeCollectedByEvent = new EventEmitter<string>();

  bestGoldRate = false;
  disabled = true;
  options: string[] = [FreezeRateEnum.YES, FreezeRateEnum.NO];
  metalRate: any;
  metalTypeEnum = MetalTypeEnum;
  freezeRateEnum = FreezeRateEnum;
  freezeRate = new FormControl(FreezeRateEnum.NO);
  prodToBeCollectedBy: FormControl;
  grfCNErrorMsg2: string;
  destroy$: Subject<null> = new Subject<null>();
  freezeFOCRelatedAlert: string;
  prodToBeCollectedByLabel: string;
  permissions$: Observable<any[]>;
  prodToBeCollectedByInput = false;

  AB_ADD_EDIT_SUBMENU = 'Customer Transaction Status-AB Add/Edit Submenu';

  constructor(
    private alertPopupService: AlertPopupServiceAbstraction,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.translate
    .get([
      'pw.productGrid.grfCNErrorMsg2',
      'pw.advanceBooking.freezeFOCRelatedAlert',
      'pw.advanceBooking.productCollectedByLabel'
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe((translatedMessages: any) => {
      this.grfCNErrorMsg2 =
      translatedMessages['pw.productGrid.grfCNErrorMsg2'];
      this.freezeFOCRelatedAlert =
      translatedMessages['pw.advanceBooking.freezeFOCRelatedAlert'];
      this.prodToBeCollectedByLabel =
      translatedMessages['pw.advanceBooking.productCollectedByLabel'];
    });
    
    this.prodToBeCollectedBy = new FormControl(
      {
        value: null,
        disabled: this.advanceBookingDetailsResponse?.id ? false : true
      },
      [
        this.fieldValidatorsService.requiredField(
          this.prodToBeCollectedByLabel
        ),
        this.fieldValidatorsService.employeeNameField(
          this.prodToBeCollectedByLabel
        )
      ]
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['advanceBookingDetailsResponse']) {
      if (!this.advanceBookingDetailsResponse) {
        this.freezeRate.patchValue(FreezeRateEnum.NO);
        this.bestGoldRate = false;
        this.metalRate = null;
      }
      if (this.advanceBookingDetailsResponse) {
        this.metalRate = this.advanceBookingDetailsResponse.metalRateList?.metalRates;
        this.freezeRate.patchValue(
          this.advanceBookingDetailsResponse.isBestRate
            ? null
            : this.advanceBookingDetailsResponse.isFrozenRate
            ? FreezeRateEnum.YES
            : FreezeRateEnum.NO
        );
        if (
          this.advanceBookingDetailsResponse.subTxnType !==
          SubTransactionTypeEnum.MANUAL_AB
        ) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        this.bestGoldRate = this.advanceBookingDetailsResponse.isBestRate
          ? true
          : false;
        this.prodToBeCollectedBy.enable();
        this.prodToBeCollectedBy.patchValue(
          this.advanceBookingDetailsResponse?.collectedBy
            ? this.advanceBookingDetailsResponse?.collectedBy
            : null
        );
      } else {
        this.disabled = true;
        this.metalRate = null;
        this.prodToBeCollectedBy.disable();
        this.prodToBeCollectedBy.reset();
      }
    }
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  onSelectionChange(value) {
    if (this.selectedFOCSchemesCount > 0) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.INFO,
          message: this.freezeFOCRelatedAlert
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (value === FreezeRateEnum.YES)
            this.freezeRate.patchValue(FreezeRateEnum.NO);
          else if (value === FreezeRateEnum.NO)
            this.freezeRate.patchValue(FreezeRateEnum.YES);
        });
    } else {
      if (this.isCnRedeemed && value === FreezeRateEnum.NO) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message: this.grfCNErrorMsg2
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            this.freezeRate.patchValue(FreezeRateEnum.YES);
          });
      } else {
        if (this.advanceBookingDetailsResponse) {
          this.metalRate = null;
          this.freeze.emit(value);
        }
      }
    }
  }

  onCheckboxChange(value) {
    if (this.selectedFOCSchemesCount > 0) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.INFO,
          message: this.freezeFOCRelatedAlert
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.bestGoldRate = !value;
          this.cdr.detectChanges();
        });
    } else {
      if (this.advanceBookingDetailsResponse) {
        this.freezeRate.patchValue(null);
        this.metalRate = null;
        this.bestRate.emit(value);
      }
    }
  }

  addProdToBeCollectedBy() {
    if (this.advanceBookingDetailsResponse) {
      this.prodToBeCollectedByInput=true
      this.emitProdToBeCollectedBy(this.prodToBeCollectedByInput)
    }
  }
  
  emitProdToBeCollectedBy(prodToBeCollectedByEventValue){
    if(prodToBeCollectedByEventValue){
      this.prodToBeCollectedByEvent.emit(this.prodToBeCollectedBy.value);
    }else{
      this.prodToBeCollectedByEvent.emit(' ');  
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngDoCheck() {
    if(this.prodToBeCollectedByInput && this.prodToBeCollectedBy.value == ""){
      this.prodToBeCollectedByInput = false
      this.emitProdToBeCollectedBy(this.prodToBeCollectedByInput)
    }
  }
}
