import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TEMPLATE19 } from '@poss-web/shared/components/ui-dynamic-form';
import {
  AlertPopupServiceAbstraction,
  BrandMasterDetails,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  PancardConfigFormModel,
  PancardConfigModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-pancard-config-form',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [buttonNames]="['pw.locationMaster.cancel', 'pw.locationMaster.save']"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton($event)"
      (invalidForm)="invalidForm($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `,
  styles: []
})
export class PancardConfigFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  @Input() brandMasterDetails: BrandMasterDetails;
  @Output() formOutput = new EventEmitter<BrandMasterDetails>();

  destroy$: Subject<null> = new Subject<null>();

  public formFields: any;
  public currentStyle: string[];

  ngOnInit(): void {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  prepareSet() {
    // ---------------------
    const panConfig_checkBox = [
      {
        id: '1',
        name: 'pw.brandMaster.isPancardmandatoryforcashmemo',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data
              .isPanCardMandatoryforCashMemo
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforCashMemo
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.brandMaster.isPancardmandatoryforadvance',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data
              .isPanCardMandatoryforAdvance
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforAdvance
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.brandMaster.isPancardmandatoryforGHS',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardMandatoryforGHS
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforGHS
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.brandMaster.isPancardmandatoryforGEP',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardMandatoryforGEP
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforGEP
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.brandMaster.isPancardmandatoryforCO',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardMandatoryforCO
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforCO
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.brandMaster.isPancardmandatoryforTEP',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardMandatoryforTEP
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforTEP
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.brandMaster.isPancardmandatoryforAcceptAdvance',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardMandatoryforAcceptAdvance
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforAcceptAdvance
            : false
          : false
      },
      {
        id: '8',
        name: 'pw.brandMaster.isPancardmandatoryforGiftCard',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardMandatoryforGiftCard
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforGiftCard
            : false
          : false
      },
      {
        id: '9',
        name: 'pw.brandMaster.isPancardmandatoryforGRF',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardMandatoryforGRF
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardMandatoryforGRF
            : false
          : false
      }
    ];

    const ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio = [
      {
        id: '1',
        name: 'pw.brandMaster.isPancardonsingleInvoice',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardOnSingleInvoice
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardOnSingleInvoice
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.brandMaster.isPancardonCumulativeInvoice',
        checked: this.brandMasterDetails.panCardDetails
          ? this.brandMasterDetails.panCardDetails.data.isPanCardOnCumulativeInvoice
            ? this.brandMasterDetails.panCardDetails.data
                .isPanCardOnCumulativeInvoice
            : false
          : false
      }
    ];

    const pancardConfigModel = new PancardConfigModel(
      1,
      panConfig_checkBox /* panConfig_checkBox */,
      ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio,
      this.brandMasterDetails.panCardDetails
        ? this.brandMasterDetails.panCardDetails.data
          ? this.brandMasterDetails.panCardDetails.data
              .configurationAmountForCashMemo
          : ''
        : '' /* configurationAmountForCashMemo */,
      this.brandMasterDetails.panCardDetails
        ? this.brandMasterDetails.panCardDetails.data
          ? this.brandMasterDetails.panCardDetails.data
              .configurationAmountForAdvance
          : ''
        : '' /* configurationAmountForAdvance */,
      this.brandMasterDetails.panCardDetails
        ? this.brandMasterDetails.panCardDetails.data
          ? this.brandMasterDetails.panCardDetails.data
              .configurationAmountForGHS
          : ''
        : '' /* configurationAmountForGHS */,
      this.brandMasterDetails.panCardDetails
        ? this.brandMasterDetails.panCardDetails.data
          ? this.brandMasterDetails.panCardDetails.data
              .configurationAmountForGEP
          : ''
        : '' /* configurationAmountForGEP */,
      this.brandMasterDetails.panCardDetails
      ? this.brandMasterDetails.panCardDetails.data
        ? this.brandMasterDetails.panCardDetails.data
            .configurationAmountForCO
        : ''
      : '' /* configurationAmountForCO */,
      this.brandMasterDetails.panCardDetails
      ? this.brandMasterDetails.panCardDetails.data
        ? this.brandMasterDetails.panCardDetails.data
            .configurationAmountForTEP
        : ''
      : '' /* configurationAmountForTEP */,
      this.brandMasterDetails.panCardDetails
      ? this.brandMasterDetails.panCardDetails.data
        ? this.brandMasterDetails.panCardDetails.data
            .configurationAmountForAcceptAdvance
        : ''
      : '' /* configurationAmountForAcceptAdvance */,
      this.brandMasterDetails.panCardDetails
      ? this.brandMasterDetails.panCardDetails.data
        ? this.brandMasterDetails.panCardDetails.data
            .configurationAmountForGiftCard
        : ''
      : '' /* configurationAmountForGiftCard */,
      this.brandMasterDetails.panCardDetails
      ? this.brandMasterDetails.panCardDetails.data
        ? this.brandMasterDetails.panCardDetails.data
            .configurationAmountForGRF
        : ''
      : '' /* configurationAmountForGRF */,
      this.brandMasterDetails.panCardDetails
        ? this.brandMasterDetails.panCardDetails.data
          ? this.brandMasterDetails.panCardDetails.data.editPanDetailsNumber
            ? this.brandMasterDetails.panCardDetails.data.editPanDetailsNumber.toString()
            : ''
          : ''
        : '' /* numberOfTimesCustomerCanChangePanDetails */,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new PancardConfigFormModel(1, pancardConfigModel);

    return detailsmain;
  }

  getCssProp() {
    // const annot = (LocationFormComponent as any).__annotations__;
    // return annot[0].styles;

    return [];
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'pw.brandMaster.panCardConfiguration',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const brandDetails: BrandMasterDetails = {
      brandCode: this.brandMasterDetails.brandCode,
      panCardDetails: {
        type: 'PANCARD_DETAILS',
        data: {
          configurationAmountForAdvance:
            formData['1-pancardConfigModel']['1-configurationAmountForAdvance'],
          configurationAmountForGHS:
            formData['1-pancardConfigModel']['1-configurationAmountForGHS'],
          configurationAmountForGEP:
            formData['1-pancardConfigModel']['1-configurationAmountForGEP'],
          configurationAmountForCashMemo:
            formData['1-pancardConfigModel'][
              '1-configurationAmountForCashMemo'
            ],
          configurationAmountForCO:
            formData['1-pancardConfigModel']['1-configurationAmountForCO'],
          configurationAmountForTEP:
            formData['1-pancardConfigModel']['1-configurationAmountForTEP'],
          configurationAmountForAcceptAdvance:
            formData['1-pancardConfigModel']['1-configurationAmountForAcceptAdvance'],
          configurationAmountForGiftCard:
            formData['1-pancardConfigModel']['1-configurationAmountForGiftCard'],
          configurationAmountForGRF:
            formData['1-pancardConfigModel']['1-configurationAmountForGRF'],
          editPanDetailsNumber:
            formData['1-pancardConfigModel'][
              '1-numberOfTimesCustomerCanChangePanDetails'
            ],
          isPanCardMandatoryforCashMemo:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][0],
          isPanCardMandatoryforAdvance:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][1],
          isPanCardMandatoryforGHS:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][2],
          isPanCardMandatoryforGEP:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][3],
          isPanCardMandatoryforCO:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][4],
          isPanCardMandatoryforTEP:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][5],
          isPanCardMandatoryforAcceptAdvance:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][6],
          isPanCardMandatoryforGiftCard:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][7],
          isPanCardMandatoryforGRF:
            formData['1-pancardConfigModel']['1-panConfig_checkBox'][8],
          isPanCardOnSingleInvoice:
            formData['1-pancardConfigModel']['1-ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio'] === '1',
          isPanCardOnCumulativeInvoice:
            formData['1-pancardConfigModel']['1-ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio'] === '2'
        }
      }
    };

    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.formOutput.emit(brandDetails);
        }
      });
  }

  public formGroupCreated() {
    // if (this.locationDetails.factoryCodeValue === LocationTypeLists.BTQ) {
    //   this.helperFunctions.setRequiredValidators(
    //     formGroup,
    //     '1-otpDetailsModel',
    //     '1-helpdeskEmailId',
    //     true
    //   );
    // } else {
    //   this.helperFunctions.setRequiredValidators(
    //     formGroup,
    //     '1-otpDetailsModel',
    //     '1-helpdeskEmailId',
    //     false
    //   );
    // }
  }

  invalidForm($event: boolean) {
    if ($event) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });
      // const dialogRef = this.dialog.open(ValidationAlertDialogComponent, {
      //   width: '500px',
      //   height: 'auto',
      //   disableClose: true,
      //   data: 'pw.inventoryMasters.invalidAlert'
      // });
      // dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  public deleteButton() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.inventoryMasters.cancelConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.ngOnDestroy();
          this.destroy$ = new Subject<null>();
          this.ngOnInit();
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
