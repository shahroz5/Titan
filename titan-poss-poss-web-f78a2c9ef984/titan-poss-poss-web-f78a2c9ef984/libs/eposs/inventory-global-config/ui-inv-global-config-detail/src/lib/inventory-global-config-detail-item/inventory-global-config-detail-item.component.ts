import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  InvglobalConfigurationFiledValue,
  UpdateFieldValuePayload
} from '@poss-web/shared/models';
import { InvGlobalConfigurationModel } from '@poss-web/shared/ui-master-form-models';
import { TEMPLATE12 } from '@poss-web/shared/components/ui-dynamic-form';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-inventory-global-config-detail-item',
  templateUrl: './inventory-global-config-detail-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryGlobalConfigDetailItemComponent
  implements OnInit, OnDestroy {
  @Input() invglobalConfigurationFiledValue$: Observable<
    InvglobalConfigurationFiledValue
  >;

  @Output() updatedFiledValue = new EventEmitter<UpdateFieldValuePayload>();

  destroy$ = new Subject<any>();
  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  /// above is dynamic form specific code

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    combineLatest([this.invglobalConfigurationFiledValue$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        const form = this.prepareSet(result[0]);
        this.formFields = this.getInputs(form);
        this.currentStyle = this.getCssProp();
      });
  }

  prepareSet(
    invglobalConfigurationFiledValue: InvglobalConfigurationFiledValue
  ) {
    const invGlobalConfig = new InvGlobalConfigurationModel(
      1,
      invglobalConfigurationFiledValue
        ? invglobalConfigurationFiledValue.maxTimeToMoveTranscToHistory
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    return invGlobalConfig;
  }

  getCssProp() {
    const annot = (InventoryGlobalConfigDetailItemComponent as any)
      .__annotations__;
    if (annot) {
      return annot[0].styles;
    }
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Inv Global Form',
      formDesc: 'Inv Global Config',
      formTemplate: TEMPLATE12
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    const maxTimeToMoveTranscToHistroy =
      formValues['1-maxTimeToMoveTranscToHistroy'];
    this.updatedFiledValue.emit({
      ruleDetails: {
        data: {
          maxTimeToMovTransHist: maxTimeToMoveTranscToHistroy
        },
        type: 'HISTORY_TIME_CONFIGURATION'
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
