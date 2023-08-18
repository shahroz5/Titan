import {
  ChangeDetectionStrategy,
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
  AlertPopupTypeEnum,
  LocationApiKeyEnum,
  LocationMasterDetails
} from '@poss-web/shared/models';
import {
  TcsDetailsModel,
  TcsMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tcs-form',
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TcsFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
    public dialog: MatDialog
  ) {}

  @Input() locationDetails: LocationMasterDetails;
  @Output() formOutput = new EventEmitter<LocationMasterDetails>();

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
    const tcsDetailsCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.isTcsApplicable',
        checked: this.locationDetails.tcsDetails
          ? this.locationDetails.tcsDetails.data.isTcsApplicable
            ? this.locationDetails.tcsDetails.data.isTcsApplicable
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isApplicableLocations',
        checked: this.locationDetails.tcsDetails
          ? this.locationDetails.tcsDetails.data.isApplicableLocations
            ? this.locationDetails.tcsDetails.data.isApplicableLocations
            : false
          : false
      }
    ];

    const tcsDetailsModel = new TcsDetailsModel(
      1,
      tcsDetailsCheckbox,
      this.locationDetails.tcsDetails
        ? this.locationDetails.tcsDetails.data.locationPanNumber
          ? this.locationDetails.tcsDetails.data.locationPanNumber
          : ''
        : '',
      this.locationDetails.tcsDetails
        ? this.locationDetails.tcsDetails.data.tcsStartDate
          ? this.locationDetails.tcsDetails.data.tcsStartDate
          : ''
        : '',
      this.locationDetails.tcsDetails
        ? this.locationDetails.tcsDetails.data.tcsApplicableDate
          ? this.locationDetails.tcsDetails.data.tcsApplicableDate
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new TcsMainFormModel(1, tcsDetailsModel);

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
      formName: 'pw.locationMaster.TCSDETAILS',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      tcsDetails: {
        type: LocationApiKeyEnum.LOCATION_TCS_DETAILS,
        data: {
          isTcsApplicable:
            formData['1-tcsDetailsModel']['1-tcsDetailsCheckbox'][0],
          isApplicableLocations:
            formData['1-tcsDetailsModel']['1-tcsDetailsCheckbox'][1],
          locationPanNumber: formData['1-tcsDetailsModel']['1-tcsPanNumber'],
          tcsStartDate: formData['1-tcsDetailsModel']['1-tcsStartDate'],
          tcsApplicableDate:
            formData['1-tcsDetailsModel']['1-tcsApplicableDate']
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
          this.formOutput.emit(locationDetails);
        }
      });
  }

  public formGroupCreated(formGroup: FormGroup) {
    // if (this.locationDetails.locationTypeCode === LocationTypeLists.BTQ) {
    //   this.translateService
    //     .get('pw.locationMaster.otpEmail')
    //     .toPromise()
    //     .then(fieldNameTranslate => {
    //       this.helperFunctions.setConditionalValidators(
    //         formGroup,
    //         '1-otpDetailsModel',
    //         '1-helpdeskEmailId',
    //         [
    //           this.fieldValidatorsService.emailField(fieldNameTranslate),
    //           this.fieldValidatorsService.requiredField(fieldNameTranslate),
    //           Validators.required
    //         ]
    //       );
    //     });
    // } else {
    //   this.translateService
    //     .get('pw.locationMaster.otpEmail')
    //     .toPromise()
    //     .then(fieldNameTranslate => {
    //       this.helperFunctions.setConditionalValidators(
    //         formGroup,
    //         '1-otpDetailsModel',
    //         '1-helpdeskEmailId',
    //         [this.fieldValidatorsService.emailField(fieldNameTranslate)]
    //       );
    //     });
    // }
  }

  public deleteButton() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.cancelConfirmation'
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
