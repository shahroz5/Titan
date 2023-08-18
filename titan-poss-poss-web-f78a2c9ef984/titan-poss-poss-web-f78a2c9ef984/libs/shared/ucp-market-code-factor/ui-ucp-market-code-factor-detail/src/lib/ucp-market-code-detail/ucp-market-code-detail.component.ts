import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  Input
} from '@angular/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';

import { ucpMarketCodeEnum } from '@poss-web/shared/models';
import { UcpMarketCodeFactorMaster } from '@poss-web/shared/ui-master-form-models';
import {
  TEMPLATE8,
  HelperFunctions
} from '@poss-web/shared/components/ui-dynamic-form';

@Component({
  selector: 'poss-web-ucp-market-code-detail',
  templateUrl: './ucp-market-code-detail.component.html'
})
export class UcpMarketCodeDetailComponent implements OnInit, OnDestroy {
  @Input() marketCodes: Observable<any>;
  @Input() productGroups: Observable<any>;
  dialogData: any;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  complexityPriceGroupEnum: ucpMarketCodeEnum;

  id: string;
  marketCode: string;
  ucpCfa: string;
  ucpFactor: string;

  public currentStyle: string[];
  public formFields: any;

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<UcpMarketCodeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public dialog: MatDialog,
    private hf: HelperFunctions
  ) {
    this.dialogData = data;
  }

  ngOnInit() {
    if (this.dialogData.ucpMarketCode.id !== ucpMarketCodeEnum.new) {
      this.readOnly = true;
    }
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.ucpMarketCode.id !== ucpMarketCodeEnum.new) {
      mode = ucpMarketCodeEnum.edit;
    } else {
      mode = ucpMarketCodeEnum.new;
    }

    this.dialogRef.close({
      id: this.dialogData.ucpMarketCode.id,
      marketCode: this.marketCode,
      ucpFactor: this.ucpFactor,
      ucpCfa: this.ucpCfa,

      mode: mode
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  prepareSet() {
    const marketCodeDetails = this.prepareMarketCode(
      this.dialogData.marketCode
    );
    const productGroupDetails = this.prepareProductGroup(
      this.dialogData.productGroup
    );
    const ucpMarketCodeFactor = new UcpMarketCodeFactorMaster(
      1,
      marketCodeDetails,
      productGroupDetails,

      this.dialogData.ucpMarketCode
        ? this.dialogData.ucpMarketCode.ucpFactor
        : '',

      this.fieldValidatorsService,
      this.translateService
    );
    return ucpMarketCodeFactor;
  }

  prepareMarketCode(marketCodeDetails) {
    const marketCode = this.hf.patchValue(
      marketCodeDetails,
      'id',
      'selected',
      this.dialogData.ucpMarketCode.marketCode
        ? this.dialogData.ucpMarketCode.marketCode
        : '',
      true
    );

    return marketCode;
  }

  prepareProductGroup(productGroupDetails) {
    const productGroup = this.hf.patchValue(
      productGroupDetails,
      'id',
      'selected',
      this.dialogData.ucpMarketCode.ucpCfa
        ? this.dialogData.ucpMarketCode.ucpCfa
        : '',
      true
    );

    return productGroup;
  }

  getCssProp() {
    const annot = (UcpMarketCodeDetailComponent as any).__annotations__;
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
      formName: 'UCP Market Code Form',
      formDesc: 'UCP Market Code',
      formTemplate: TEMPLATE8
    };
  }
  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();

    this.marketCode = formValues['1-marketCode'];
    this.ucpCfa = formValues['1-ucpCfa'];
    this.ucpFactor = formValues['1-ucpFactor'];

    this.onCreate();
  }

  deleteButton() {
    this.onClose();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
