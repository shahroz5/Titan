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
  LocationMasterDetails,
  OverlayNotificationServiceAbstraction,
} from '@poss-web/shared/models';
import {
  FocDetailsModel,
  FocMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-foc-form',
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
    >
    </poss-web-dynamic-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
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
    const focDetailsCheckbox1 = [
      {
        id: '1',
        name: 'pw.locationMaster.BintobintransferallowedforFOCitems',
        checked: this.locationDetails.offerDetails
          ? this.locationDetails.offerDetails.data
              .bintobintransferallowedforFOCitems
            ? this.locationDetails.offerDetails.data
                .bintobintransferallowedforFOCitems
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.IsTEPsaleableitemsareallowedforFOC',
        checked: this.locationDetails.offerDetails
          ? this.locationDetails.offerDetails.data
              .isTEPsaleableitemsallowedforFOC
            ? this.locationDetails.offerDetails.data
                .isTEPsaleableitemsallowedforFOC
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.isTEPallowedforFOCitems',
        checked: this.locationDetails.offerDetails
          ? this.locationDetails.offerDetails.data.isTEPallowedforFOCitems
            ? this.locationDetails.offerDetails.data.isTEPallowedforFOCitems
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.isFOCitemssaleable',
        checked: this.locationDetails.offerDetails
          ? this.locationDetails.offerDetails.data.isFOCitemssaleable
            ? this.locationDetails.offerDetails.data.isFOCitemssaleable
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.enableEmployeeDiscount',
        checked: this.locationDetails.offerDetails
          ? this.locationDetails.offerDetails.data.isEmployeeDiscount
            ? this.locationDetails.offerDetails.data.isEmployeeDiscount
            : false
          : false
      }
    ];

    const focDetailsModel = new FocDetailsModel(
      1,
      focDetailsCheckbox1,
      this.locationDetails.offerDetails
        ? this.locationDetails.offerDetails.data.maxWeightforFOC
          ? this.locationDetails.offerDetails.data.maxWeightforFOC
          : ''
        : '',
      this.locationDetails.offerDetails
        ? this.locationDetails.offerDetails.data.maxValueforFOC
          ? this.locationDetails.offerDetails.data.maxValueforFOC
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new FocMainFormModel(1, focDetailsModel);

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
      formName: 'pw.locationMaster.FOC',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      offerDetails: {
        type: LocationApiKeyEnum.OFFER_DETAILS,
        data: {
          maxWeightforFOC: formData['1-focDetailsModel']['1-maxWeight'],
          maxValueforFOC: formData['1-focDetailsModel']['1-maxValue'],
          bintobintransferallowedforFOCitems:
            formData['1-focDetailsModel']['1-focDetailsCheckbox1'][0],
          isTEPsaleableitemsallowedforFOC:
            formData['1-focDetailsModel']['1-focDetailsCheckbox1'][1],
          isTEPallowedforFOCitems:
            formData['1-focDetailsModel']['1-focDetailsCheckbox1'][2],
          isFOCitemssaleable:
            formData['1-focDetailsModel']['1-focDetailsCheckbox1'][3],
          isEmployeeDiscount:
            formData['1-focDetailsModel']['1-focDetailsCheckbox1'][4]
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
