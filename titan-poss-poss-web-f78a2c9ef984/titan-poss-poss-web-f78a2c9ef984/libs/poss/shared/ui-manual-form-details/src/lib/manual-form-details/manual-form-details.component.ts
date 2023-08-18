import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import {
  ManualBillRequest,
  TransactionTypeEnum,
  ValidationTypesEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-manual-form-details',
  templateUrl: './manual-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualFormDetailsComponent
  implements OnInit, OnDestroy, OnChanges {
  manualBillForm: FormGroup = new FormGroup({});
  destroy$: Subject<null> = new Subject<null>();
  ValidationTypesEnumRef = ValidationTypesEnum;
  TxnTypesEnumRef = TransactionTypeEnum;
  validationTypeLabel: string;
  detailsFlag = false;
  billDetails: ManualBillRequest;
  validationTypes = [];
  @Input() customerId = null;
  @Input() detailsFlag$: Observable<boolean>;
  @Input() txnType: string;
  @Input() manualBillDetails = null;
  @Input() imageUrl: string;
  @Input() bussinessDay: number;
  @Input() setFocus = false;
  @Input() resetValidationType$: Observable<null>;

  @Output() validate = new EventEmitter<ManualBillRequest>();
  @Output() validationType = new EventEmitter<string>();
  @Output() uploadFileEvent = new EventEmitter<any>();

  @ViewChild(SelectDropdownComponent)
  selectDropdownRef: SelectDropdownComponent;

  @Input() permit = '';

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get(['pw.manualCashMemo.validationTypeLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.validationTypeLabel =
          translatedMsg['pw.manualCashMemo.validationTypeLabel'];
      });
  }

  ngOnInit(): void {
    if (this.txnType === TransactionTypeEnum.TEP) {
      this.validationTypes = [
        {
          value: ValidationTypesEnum.PASSWORD,
          description: ValidationTypesEnum.PASSWORD
        }
      ];
    } else {
      this.validationTypes = [
        {
          value: ValidationTypesEnum.PASSWORD,
          description: ValidationTypesEnum.PASSWORD
        },
        {
          value: ValidationTypesEnum.APPROVAL,
          description: ValidationTypesEnum.APPROVAL
        }
      ];
    }
    this.manualBillForm = this.createForm();
    this.detailsFlag$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.detailsFlag = data;
      });
    this.resetValidationType$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.manualBillForm
        .get(['validationType'])
        .patchValue(ValidationTypesEnum.PASSWORD, { emitEvent: false });
    });
    this.manualBillForm.get(['validationType']).valueChanges.subscribe(val => {
      if (val) {
        this.validationType.emit(val);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['manualBillDetails']) {
      this.billDetails = this.manualBillDetails;
    }

    if (changes['setFocus']) {
      if (this.setFocus) {
        setTimeout(() => {
          this.selectDropdownRef.focus();
        }, 100);
      }
    }
  }

  createForm() {
    return new FormGroup({
      validationType: new FormControl(ValidationTypesEnum.PASSWORD, [
        this.fieldValidatorsService.requiredField(this.validationTypeLabel)
      ])
    });
  }

  validateBill(event: ManualBillRequest) {
    // this.billDetails = event;
    this.validate.emit(event);
  }

  uploadFile(event) {
    this.uploadFileEvent.emit(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
