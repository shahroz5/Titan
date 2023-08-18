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
import {
  ButtonType,
  CommandButton,
  TEMPLATE19
} from '@poss-web/shared/components/ui-dynamic-form';

import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  BrandMasterDetails,
  PermissionData
} from '@poss-web/shared/models';
import {
  BrandDetailsModel,
  BrandMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-brand-details-form',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [commandButtons]="commandButtons"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton()"
      (invalidForm)="invalidForm($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `,
  styles: []
})
export class BrandDetailsFormComponent implements OnInit, OnDestroy {
  // { name: 'pw.locationMaster.cancel' },
  //       { name: 'pw.locationMaster.save' }
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private elementPermission: ElementPermissionService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  @Input() brandMasterDetails: BrandMasterDetails;
  @Input() permissions$: Observable<any>;
  @Output() formOutput = new EventEmitter<BrandMasterDetails>();

  destroy$: Subject<null> = new Subject<null>();

  EDIT_BRAND_PERMISSION = 'Product Masters - Add/Edit Brand Master';

  commandButtons: CommandButton[] = [];

  public formFields: any;
  public currentStyle: string[];

  ngOnInit(): void {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
    this.commandButtons = [
      {
        name: 'pw.locationMaster.cancel',
        cssClassName: 'pw-btn pw-primary-btn',
        type: ButtonType.CANCEL,
        permission: this.loadPermission(this.EDIT_BRAND_PERMISSION)
      },
      {
        name: 'pw.locationMaster.save',
        cssClassName: 'pw-btn pw-accent-btn',
        type: ButtonType.SUBMIT,
        permission: this.loadPermission(this.EDIT_BRAND_PERMISSION)
      }
    ];
  }

  loadPermission(element: string): Observable<PermissionData> {
    return this.elementPermission.loadPermission(element, this.permissions$);
  }

  prepareSet() {
    // ---------------------

    const isInterBrandTEPAllowed = [
      {
        id: '1',
        name: 'pw.brandMaster.isInterbrandTEPallowed',
        checked: this.brandMasterDetails.configDetails
          ? this.brandMasterDetails.configDetails.data.isInterbrandTEPAllowed
            ? this.brandMasterDetails.configDetails.data.isInterbrandTEPAllowed
            : false
          : false
      }
    ];

    const referCashPaymentConfig = [
      {
        id: '1',
        name: 'pw.brandMaster.referCashpaymentconfig',
        checked: this.brandMasterDetails.configDetails
          ? this.brandMasterDetails.configDetails.data.referCashPaymentConfig
            ? this.brandMasterDetails.configDetails.data.referCashPaymentConfig
            : false
          : false
      }
    ];

    const digiGoldConfig = [
      {
        id: '1',
        name: 'pw.brandMaster.isCustomerMandatoryForDigiGold',
        checked: this.brandMasterDetails.configDetails
          ? this.brandMasterDetails.configDetails.data
              .isCustomerMandatoryForDigiGold
            ? this.brandMasterDetails.configDetails.data
                .isCustomerMandatoryForDigiGold
            : false
          : false
      }
    ];

    const brandDetailsModel = new BrandDetailsModel(
      1,
      // isActive, /* minUtilizationForGRN */
      this.brandMasterDetails.brandCode /* brandCode */,
      this.brandMasterDetails.brandCode /* brandName */,
      isInterBrandTEPAllowed,
      this.brandMasterDetails.configDetails?.data
        ?.minUtilizationPercentageforGRN
        ? this.brandMasterDetails.configDetails?.data
            ?.minUtilizationPercentageforGRN
        : '' /* minUtilizationForGRN */,
      this.brandMasterDetails.configDetails?.data
        ?.minUtilizationPercentageforGRF
        ? this.brandMasterDetails.configDetails?.data
            ?.minUtilizationPercentageforGRF
        : '' /* minUtilizationForGRF */,
      // this.brandMasterDetails.configDetails?.data?.dummyMobNo
      //   ? this.brandMasterDetails.configDetails?.data?.dummyMobNo
      //   : '' /* dummyMobNo */,
      referCashPaymentConfig,
      this.brandMasterDetails.configDetails?.data?.numberOfPrintsAllowed
        ? this.brandMasterDetails.configDetails?.data?.numberOfPrintsAllowed
        : '' /* numberOfPrintsAllowed */,
      this.brandMasterDetails.configDetails?.data?.passwordConfigForCashDeposit
        ? this.brandMasterDetails.configDetails?.data
            ?.passwordConfigForCashDeposit
        : '' /* passwordConfigForCashDeposit */,
      this.brandMasterDetails.configDetails?.data?.airpayPaymentExpiry
        ? this.brandMasterDetails.configDetails?.data?.airpayPaymentExpiry
        : '' /* airpayPaymentExpiry */,
      this.brandMasterDetails.configDetails?.data?.razorpayPaymentExpiry
        ? this.brandMasterDetails.configDetails?.data?.razorpayPaymentExpiry
        : '',
      digiGoldConfig,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new BrandMainFormModel(1, brandDetailsModel);

    return detailsmain;
  }

  getCssProp() {
    // const annot = (LocationFormComponent as any).__annotations__;
    // return annot[0].styles;

    return [
      `
    .isActive {
      position: absolute;
      top: 15px;
      right: 0px;
      width: 150px;
     }
     `
    ];
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'pw.brandMaster.brandDetails',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const brandDetails: BrandMasterDetails = {
      brandCode: formData['1-brandDetailsModel']['1-brandCode'],
      description: formData['1-brandDetailsModel']['1-brandCode'],
      orgCode: this.brandMasterDetails.orgCode,
      // isActive: formData['1-brandDetailsModel']['1-isActive'][0],
      isActive: this.brandMasterDetails?.isActive
        ? this.brandMasterDetails?.isActive
        : false,
      configDetails: {
        type: 'CONFIG_DETAILS',
        data: {
          numberOfPrintsAllowed:
            formData['1-brandDetailsModel']['1-numberOfPrintsAllowed'],
          // dummyMobNo: formData['1-brandDetailsModel']['1-dummyMobNo'],
          isInterbrandTEPAllowed:
            formData['1-brandDetailsModel']['1-isInterBrandTEPAllowed'][0],
          minUtilizationPercentageforGRN:
            formData['1-brandDetailsModel']['1-minUtilizationForGRN'],
          minUtilizationPercentageforGRF:
            formData['1-brandDetailsModel']['1-minUtilizationForGRF'],
          referCashPaymentConfig:
            formData['1-brandDetailsModel']['1-referCashPaymentConfig'][0],
          passwordConfigForCashDeposit:
            formData['1-brandDetailsModel']['1-passwordConfigForCashDeposit'],
          airpayPaymentExpiry:
            formData['1-brandDetailsModel']['1-airpayPaymentExpiry'],
          razorpayPaymentExpiry:
            formData['1-brandDetailsModel']['1-razorpayPaymentExpiry'],
          isCustomerMandatoryForDigiGold:
            formData['1-brandDetailsModel'][
              '1-isCustomerMandatoryForDigiGold'
            ][0]
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

  public formGroupCreated(formGroup: FormGroup) {
    if (this.brandMasterDetails.brandCode) {
      formGroup
        .get('1-brandDetailsModel')
        .get('1-brandCode')
        .disable({ onlySelf: true });
    }
  }

  invalidForm($event: boolean) {
    if ($event) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });
      //   const dialogRef = this.dialog.open(ValidationAlertDialogComponent, {
      //     width: '500px',
      //     height: 'auto',
      //     disableClose: true,
      //     data: 'pw.inventoryMasters.invalidAlert'
      //   });
      //   dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
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
