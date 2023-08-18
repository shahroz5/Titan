import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog
} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {
  ProductCategoryDetails,
  ProductCategoryEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

import { TEMPLATE8 } from '@poss-web/shared/components/ui-dynamic-form';
import { ProductCategoryMaster } from '@poss-web/shared/ui-master-form-models';
@Component({
  selector: 'poss-web-product-category-details',
  templateUrl: './product-category-details.component.html',
  styleUrls: ['./product-category-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryDetailsComponent implements OnInit, OnDestroy {
  dialogData: ProductCategoryDetails;
  destroy$: Subject<null> = new Subject<null>();
  readOnly: boolean;
  productCategoryEnum: ProductCategoryEnum;

  productCategoryCode: string;
  description: string;
  isActive: boolean;
  hallmarkingCharges: string;
  hallmarkQuantity: number;
  isAllowedForHallmarking: boolean;
  isFOCForHallmarkingCharges: boolean;

  /// below is dynamic form specific code
  public currentStyle: string[];
  public formFields: any;
  isConversionEnabled: any;
  /// above is dynamic form specific code

  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    public dialogRef: MatDialogRef<ProductCategoryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }

  ngOnInit() {
    if (this.dialogData.productCategoryCode !== ProductCategoryEnum.NEW) {
      this.readOnly = true;
    }

    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  onCreate() {
    let mode = '';
    if (this.dialogData.productCategoryCode !== ProductCategoryEnum.NEW) {
      mode = ProductCategoryEnum.edit;
    } else {
      mode = ProductCategoryEnum.new;
    }

    const productCategoryDetailsData: Partial<ProductCategoryDetails> & {
      mode: string;
      productCode: string;
    } = {
      productCode: this.productCategoryCode,
      description: this.description,
      isActive: this.isActive,
      orgCode: this.dialogData.orgCode,
      isConversionEnabled: this.isConversionEnabled,
      hallmarkQuantity: Number(this.hallmarkQuantity),
      hallmarkDetails: {
        type: 'HALLMARK_DETAILS',
        data: {
          hallmarkingCharges: this.hallmarkingCharges,
          isAllowedForHallmarking: this.isAllowedForHallmarking,
          isFOCForHallmarkingCharges: this.isFOCForHallmarkingCharges
        }
      },
      mode
    };
    this.dialogRef.close(productCategoryDetailsData);
  }

  onClose() {
    this.dialogRef.close();
  }

  /// below is dynamic form specific code

  prepareSet() {
    const productCategory = new ProductCategoryMaster(
      1,
      this.dialogData.productCategoryCode === 'NEW'
        ? ''
        : this.dialogData.productCategoryCode,
      this.dialogData.description,
      this.dialogData.hallmarkDetails.data.hallmarkingCharges,
      this.dialogData.hallmarkQuantity,

      [
        {
          id: '1',
          name: 'pw.productCategory.isAllowedForHallmarking',
          checked: this.dialogData.hallmarkDetails.data.isAllowedForHallmarking
        },
        {
          id: '1',
          name: 'pw.productCategory.isFOCForHallmarkingCharges',
          checked: this.dialogData.hallmarkDetails.data
            .isFOCForHallmarkingCharges
        }
      ],
      [
        {
          id: '1',
          name: 'pw.productCategory.isConversionEnabled',
          checked: this.dialogData.isConversionEnabled
        }
      ],

      this.fieldValidatorsService,
      this.translateService
    );
    return productCategory;
  }

  getCssProp() {
    // const annot = (ProductCategoryDetailsComponent as any).__annotations__;
    // return annot[0].styles;
    return [];
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Product Category Form',
      formDesc: 'Product Category',
      formTemplate: TEMPLATE8
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();
    this.productCategoryCode = formValues['1-prodCatCode'];
    this.description = formValues['1-desctiption'];
    this.hallmarkingCharges = formValues['1-hallmarkingCharges'];
    this.hallmarkQuantity = formValues['1-hallmarkQuantity'];
    this.isAllowedForHallmarking = formValues['1-hallmarking'][0];
    this.isFOCForHallmarkingCharges = formValues['1-hallmarking'][1];
    this.isConversionEnabled = formValues['1-isConversionEnabled'][0];
    this.isActive = true; //formValues['1-IsActive'][0];
    this.onCreate();
    // this.tabOne.emit(formData);
  }

  deleteButton() {
    this.onClose();
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.dialogData.productCategoryCode !== 'NEW') {
      formGroup.get('1-prodCatCode').disable({ onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
