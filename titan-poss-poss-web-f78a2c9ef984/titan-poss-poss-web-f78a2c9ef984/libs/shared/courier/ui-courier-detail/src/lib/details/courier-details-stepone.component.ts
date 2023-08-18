import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  CourierMaster,
  StatesSuccessPayload,
  CountrySuccessPayload,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import {
  HelperFunctions,
  TEMPLATE9
} from '@poss-web/shared/components/ui-dynamic-form';
import { CourierDetailsMainModel } from '@poss-web/shared/ui-master-form-models';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-courier-details-stepone',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [buttonNames]="[
        'pw.courierDetails.cancel',
        'pw.courierDetails.saveAndContinue'
      ]"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourierDetailsSteponeComponent implements OnInit, OnDestroy {
  @Input() courierDetails$: Observable<CourierMaster>;
  @Input() states$: Observable<StatesSuccessPayload[]>;
  @Input() countryData$: Observable<CountrySuccessPayload[]>;
  destroy$: Subject<null> = new Subject<null>();
  courier: CourierMaster;
  @Input() mode;
  @Input() permissions$: Observable<any>;
  @Output() formGroupCreated2 = new EventEmitter<FormGroup>();
  @Output() courierDetails: EventEmitter<{
    courierName: string;
    countryCode: string;
    address: string;
    stateName: string;
    townName: string;
    mailId: string;
    mobileNumber: number;
    contactPerson: string;
    isActive: boolean;
    description: string;
  }> = new EventEmitter();

  public currentStyle: string[];
  public formFields: any;
  isActive: boolean;
  ADD_EDIT_COURIER_PERMISSIONS = 'Courier Master - Add/Edit Courier Master';
  constructor(
    private hf: HelperFunctions,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.cdr.markForCheck();
    combineLatest([this.countryData$, this.states$, this.courierDetails$])
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe(results => {
        const form = this.prepareSet(results[0], results[1], results[2]);
        this.isActive = results[2].isActive;
        this.formFields = this.getInputs(form);
        this.currentStyle = this.getCssProp();
      });
  }
  prepareSet(countryData: any, states: any, courierDetails: CourierMaster) {
    this.courier = courierDetails;
    if (!states) {
      states = [];
    }
    if (courierDetails) {
      countryData = this.hf.patchValue(
        countryData,
        'id',
        'selected',
        courierDetails.countryCode,
        true
      );
    }
    if (courierDetails && states.length > 0) {
      states = this.hf.patchValue(
        states,
        'description',
        'selected',
        courierDetails.stateName,
        true
      );
    }

    const courierDetailsModel = new CourierDetailsMainModel(
      1,
      courierDetails
        ? courierDetails.courierName
          ? courierDetails.courierName
          : ''
        : '',
      // [
      //   {
      //     id: '1',
      //     name: '',
      //     checked: courierDetails ? courierDetails.isActive : true
      //   }
      // ],

      courierDetails
        ? courierDetails.address
          ? courierDetails.address
          : ''
        : '',

      courierDetails
        ? courierDetails.description
          ? courierDetails.description
          : ''
        : '',

      countryData,
      states,
      courierDetails
        ? courierDetails.townName
          ? courierDetails.townName
          : ''
        : '',
      courierDetails
        ? courierDetails.mailId
          ? courierDetails.mailId
          : ''
        : '',
      courierDetails
        ? courierDetails.mobileNumber
          ? courierDetails.mobileNumber
          : ''
        : '',

      courierDetails
        ? courierDetails.contactPerson
          ? courierDetails.contactPerson
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );
    return courierDetailsModel;
  }
  getCssProp() {
    const annot = (CourierDetailsSteponeComponent as any).__annotations__;
    return annot[0].styles;
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Courier Details Form',
      formDesc: 'Add location',
      formTemplate: TEMPLATE9
    };
  }
  addButton(formGroup: FormGroup) {
    this.courierDetails.emit({
      courierName: formGroup.value['1-courierName'],
      address: formGroup.value['1-address'],
      countryCode: formGroup.value['1-country'],
      stateName: formGroup.value['1-state'],
      townName: formGroup.value['1-city'],
      mailId: formGroup.value['1-emailId'],
      description: formGroup.value['1-description'],
      mobileNumber: Number(formGroup.value['1-phoneNumber']),
      contactPerson: formGroup.value['1-contactPerson'],
      isActive: this.mode === 'new' ? true : this.isActive
    });
  }
  deleteButton(formGroup: FormGroup) {
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
        }
      });
  }
  public formGroupCreated(formGroup: FormGroup) {
    this.formGroupCreated2.emit(formGroup);
    if (this.courier.courierName !== '') {
      formGroup.get('1-courierName').disable({ onlySelf: true });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
