import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  FreezeRateEnum,
  MetalTypeEnum,
  NomineeDetails,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AddNomineePopupComponent,
  NomineeData
} from '../add-nominee-popup/add-nominee-popup.component';

@Component({
  selector: 'poss-web-co-details',
  templateUrl: './co-details.component.html',
  styleUrls: ['./co-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() coDetailsResponse = null;
  @Input() bgrAllowed = false;
  @Input() customerOrderId = null;
  @Input() relationshipTypes = [];
  @Input() totalGrossWeight = 0;
  @Input() totalOrderValue = 0;
  @Output() freeze = new EventEmitter<string>();
  @Output() bestRate = new EventEmitter<string>();
  @Output() addNomineeDetails = new EventEmitter<NomineeDetails>();
  @Output() prodToBeCollectedBy = new EventEmitter<string>();
  CODetailsForm: FormGroup;
  freezeRateOptions: string[] = [FreezeRateEnum.YES, FreezeRateEnum.NO];
  metalRate = {};
  isDisabled = true;
  metalTypeEnum = MetalTypeEnum;
  freezeRateEnum = FreezeRateEnum;
  weightUnit = 'gms';
  prodToBeCollectedByLabel: string;
  alertMsgForAddNominee: string;
  addedNomineeDetails: NomineeDetails = null;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.newCustomerOrder.productCollectedByLabel',
        'pw.addNominee.alertMsgForAddNominee'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.prodToBeCollectedByLabel =
          translatedMessages['pw.newCustomerOrder.productCollectedByLabel'];
        this.alertMsgForAddNominee =
          translatedMessages['pw.addNominee.alertMsgForAddNominee'];
      });
  }

  ngOnInit(): void {
    this.createCODetailsForm();
  }

  createCODetailsForm() {
    this.CODetailsForm = new FormGroup({
      freezeRate: new FormControl(FreezeRateEnum.NO),
      bestGoldRate: new FormControl(false),
      prodToBeCollectedBy: new FormControl(
        {
          value: null,
          disabled: this.customerOrderId ? false : true
        },
        [
          this.fieldValidatorsService.requiredField(
            this.prodToBeCollectedByLabel
          ),
          this.fieldValidatorsService.employeeNameField(
            this.prodToBeCollectedByLabel
          )
        ]
      )
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coDetailsResponse']) {
      if (this.coDetailsResponse && this.CODetailsForm) {
        this.metalRate = this.coDetailsResponse.metalRateList?.metalRates;
        this.addedNomineeDetails = this.coDetailsResponse.nomineeDetails?.data
          ? this.coDetailsResponse.nomineeDetails?.data
          : null;
        this.CODetailsForm.get('prodToBeCollectedBy').patchValue(
          this.coDetailsResponse?.collectedBy
            ? this.coDetailsResponse?.collectedBy
            : null
        );
        this.CODetailsForm.get('freezeRate').patchValue(
          this.coDetailsResponse.isBestRate
            ? null
            : this.coDetailsResponse.isFrozenRate
            ? FreezeRateEnum.YES
            : FreezeRateEnum.NO
        );
        this.CODetailsForm.get('bestGoldRate').patchValue(
          this.coDetailsResponse.isBestRate ? true : false
        );
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
        this.metalRate = null;
        this.addedNomineeDetails = null;
        if (this.CODetailsForm) {
          this.CODetailsForm.get('prodToBeCollectedBy').reset();
          this.CODetailsForm.get('freezeRate').patchValue(FreezeRateEnum.NO);
          this.CODetailsForm.get('bestGoldRate').patchValue(false);
        }
      }
    }

    if (changes['customerOrderId'] && this.CODetailsForm) {
      if (this.customerOrderId !== null) {
        this.CODetailsForm?.get('prodToBeCollectedBy').enable();
      } else {
        this.CODetailsForm?.get('prodToBeCollectedBy').disable();
      }
    }
  }

  addNominee(addedNomineeDetails) {
    const dialogRef = this.dialog.open(AddNomineePopupComponent, {
      data: { addedNomineeDetails, relationshipTypes: this.relationshipTypes },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: NomineeData) => {
      if (result.isSave) {
        if (result.nomineeDetails) {
          this.addNomineeDetails.emit(result.nomineeDetails);
        }
      } else {
        if (!this.addedNomineeDetails) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: this.alertMsgForAddNominee
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (!res) {
                this.addNominee(result.nomineeDetails);
              }
            });
        }
      }
    });
  }

  onSelectionChange(value) {
    if (this.coDetailsResponse) {
      this.metalRate = null;
      this.freeze.emit(value);
    }
  }

  onCheckboxChange(eventValue) {
    if (this.coDetailsResponse) {
      this.CODetailsForm.get('freezeRate').patchValue(null);
      this.metalRate = null;
      this.bestRate.emit(eventValue.checked);
    }
  }

  addProdToBeCollectedBy() {
    if (this.coDetailsResponse) {
      this.prodToBeCollectedBy.emit(
        this.CODetailsForm.get('prodToBeCollectedBy').value
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
