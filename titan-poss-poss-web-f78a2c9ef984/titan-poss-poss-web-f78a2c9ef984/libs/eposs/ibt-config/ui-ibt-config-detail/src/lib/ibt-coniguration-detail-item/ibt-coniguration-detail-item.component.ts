import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  ConfigurationModel,
  IbtConfigurationValueModel,
  IbtConfigurationMainModel
} from '@poss-web/shared/ui-master-form-models';
import {
  AlertPopupServiceAbstraction,
  IbtConfiguration,
  IbtConfigurationResponse,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  TEMPLATE15,
  CommandButton,
  ButtonType
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ibt-coniguration-detail-item',
  templateUrl: './ibt-coniguration-detail-item.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbtConigurationDetailItemComponent implements OnInit, OnDestroy {
  @Input() ibtConfiguration$: Observable<IbtConfigurationResponse>;

  @Output() saveIbtConfiguration = new EventEmitter<IbtConfiguration>();
  @Output() formGroupCreatedTwo = new EventEmitter<FormGroup>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  destroy$ = new Subject<any>();
  configId: string;
  ibtConfigDetails: IbtConfigurationResponse;
  /// below is dynamic form specific code

  public formFields: any;

  public currentStyle: string[];

  /// above is dynamic form specific code
  commandButtons: CommandButton[] = [
    {
      name: 'Location Mapping',
      cssClassName: 'pw-btn pw-primary-btn',
      type: ButtonType.BUTTON
    },
    {
      name: 'Save',
      cssClassName: 'pw-btn pw-accent-btn',
      type: ButtonType.SUBMIT
    }
  ];

  commandButtonOutput: QueryList<ElementRef>;

  constructor(
    public activatedRoute: ActivatedRoute,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  commandButtonsOutput($event) {
    this.commandButtonOutput = $event;
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.configId = params['_configId'];
        if (this.configId && this.configId === 'new') {
          this.newIBT();
        } else if (this.configId && this.configId !== 'new') {
          this.ibtCreated();
        }
      });
  }

  newIBT() {
    this.commandButtonOutput.forEach(el => {
      if (el.nativeElement.innerHTML.trim() === 'Location Mapping') {
        el.nativeElement.disabled = true;
      }
    });
  }

  ibtCreated() {
    this.commandButtonOutput.forEach(el => {
      if (el.nativeElement.innerHTML.trim() === 'Location Mapping') {
        el.nativeElement.disabled = false;
      }
    });
  }
  public buttonClick(btn: CommandButton) {
    if (btn.name === 'Location Mapping') {
      this.openLocationMappingEvent.emit(true);
    }
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.configId = params['_configId'];
      });

    this.ibtConfiguration$
      .pipe(takeUntil(this.destroy$))
      .subscribe((configDetails: IbtConfigurationResponse) => {
        if (configDetails) {
          this.ibtConfigDetails = configDetails;
        }
      });

    combineLatest([this.ibtConfiguration$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.currentStyle = [''];
        const form = this.prepareSet(result[0]);
        this.formFields = this.getInputs(form);
      });
  }

  prepareSet(ibtConfiguration: IbtConfigurationResponse) {
    const configForm = new ConfigurationModel(
      1,
      ibtConfiguration ? ibtConfiguration.description : '',
      this.fieldValidatorsService,
      this.translateService
    );
    const ibtConfigFieldCodeValue = new IbtConfigurationValueModel(
      1,
      ibtConfiguration ? ibtConfiguration.maxReqPerMonth : '',
      ibtConfiguration ? ibtConfiguration.maxProductsPerStn : '',
      ibtConfiguration ? ibtConfiguration.maxValPerStn : '',
      ibtConfiguration ? ibtConfiguration.validRequestTime : '',
      this.fieldValidatorsService,
      this.translateService
    );
    const ibtConfigMainForm = new IbtConfigurationMainModel(
      1,
      configForm,
      ibtConfigFieldCodeValue
    );
    return ibtConfigMainForm;
  }

  getCssProp() {
    const annot = (IbtConigurationDetailItemComponent as any).__annotations__;
    return annot[0].styles;
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'Ibt Configuration',
      formDesc: 'Ibt Configuration',
      formTemplate: TEMPLATE15
    };
  }

  addButton(formGroup: FormGroup) {
    console.log('details', this.ibtConfigDetails);
    if (
      this.ibtConfigDetails?.description !== '' &&
      !this.ibtConfigDetails.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const formValues = formGroup.getRawValue();
      const configName = formValues['1-configuration']['1-configName'];
      const maxReqPerMonth = Number(
        formValues['1-ibtConfiguration']['1-noOfRequestPerMonth']
      );
      const maxProductsPerStn = Number(
        formValues['1-ibtConfiguration']['1-maxNoOfProductsPerStn']
      );
      const maxValPerStn = Number(
        formValues['1-ibtConfiguration']['1-maxValuePerStn']
      );
      const validRequestTime = Number(
        formValues['1-ibtConfiguration']['1-reqValidUpto']
      );
      const saveIbtConfiguration = {
        description: configName,
        ruleDetails: {
          data: {
            maxProductsPerStn: maxProductsPerStn,
            maxReqPerMonth: maxReqPerMonth,
            maxValPerStn: maxValPerStn,
            validRequestTime: validRequestTime
          },
          type: 'IBT_CONFIGURATIONS'
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
            this.saveIbtConfiguration.emit(saveIbtConfiguration);
          }
        });
    }
  }
  showMessage(key: string) {
    this.translateService
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  public formGroupCreated(formGroup: FormGroup) {
    const configurationSubForm: FormGroup = <FormGroup>(
      formGroup.get('1-configuration')
    );
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.configId = params['_configId'];

        if (this.configId && this.configId !== 'new') {
          configurationSubForm.get('1-configName').disable({ onlySelf: true });
        }
      });
    this.formGroupCreatedTwo.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
