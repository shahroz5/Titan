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
  import {
    HelperFunctions,
    TEMPLATE19
  } from '@poss-web/shared/components/ui-dynamic-form';
  import {
    AlertPopupServiceAbstraction,
    AlertPopupTypeEnum,
    LocationApiKeyEnum,
    LocationMasterDetails,
    OverlayNotificationServiceAbstraction
  } from '@poss-web/shared/models';
import { ServicePossFormDetailsModel, ServicePossMainFormModel } from '@poss-web/shared/ui-master-form-models';
  import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
  import { Subject } from 'rxjs';
  import { takeUntil } from 'rxjs/operators';
  
  @Component({
    selector: 'poss-web-service-poss-form',
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
  export class ServicePossFormComponent implements OnInit, OnDestroy {
    constructor(
      private translateService: TranslateService,
      private fieldValidatorsService: FieldValidatorsService,
      private cdr: ChangeDetectorRef,
      private helperFunctions: HelperFunctions,
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
      const servicePossDetailsCheckbox = [
        {
          id: '1',
          name: 'pw.locationMaster.IsServicePossMandatory',
          checked: this.locationDetails.serviceDetails
            ? this.locationDetails.serviceDetails.data.isServiceMandatory
              ? this.locationDetails.serviceDetails.data.isServiceMandatory
              : false
            : false
        },
      ];
  
      const servicePossFormDetailsModel = new ServicePossFormDetailsModel(
        1,
        servicePossDetailsCheckbox,
        this.fieldValidatorsService,
        this.translateService
      );
  
      const detailsmain = new ServicePossMainFormModel(1, servicePossFormDetailsModel);
  
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
        formName: 'pw.locationMaster.ServicePoss',
        formDesc: '',
        formTemplate: TEMPLATE19
      };
    }
  
    public addButton(formGroup: FormGroup) {
      const formData = formGroup.getRawValue();
  
      const locationDetails: LocationMasterDetails = {
        locationCode: this.locationDetails.locationCode,
  
        serviceDetails: {
          type: LocationApiKeyEnum.SERVICE_POSS_DETAILS,
          data: {
            isServiceMandatory: formData['1-ServicePossDetails']['1-servicePossDetailsCheckbox'][0]
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
  
      }
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
  