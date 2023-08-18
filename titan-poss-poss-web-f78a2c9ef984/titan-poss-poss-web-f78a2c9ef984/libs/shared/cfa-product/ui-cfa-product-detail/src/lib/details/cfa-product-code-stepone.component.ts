import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  HelperFunctions,
  TEMPLATE7
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  CFAProductCodeCheckItOuts,
  CFAProductCodeMainModel,
  CFAProductCodeDetails
} from '@poss-web/shared/ui-master-form-models';
import {
  AlertPopupServiceAbstraction,
  CFAProducts,
  AlertPopupTypeEnum,
  ItemTypesResponse,
  ProductGroupDetails,
  ProductType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-cfa-productcode-stepone',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [buttonNames]="[
        'pw.CFAProduct.cancelButtonText',
        'pw.CFAProduct.saveButtonText'
      ]"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CFAProductCodeSteponeComponent implements OnInit, OnDestroy {
  @Input() CFAProduct$: Observable<ProductGroupDetails>;
  @Input() productTypes$: Observable<ProductType[]>;
  @Input() itemTypes$: Observable<ItemTypesResponse[]>;
  @Input() plainStuddedType$: Observable<{ id: string; name: string }[]>;
  @Input() pricingType$: Observable<{ id: string; name: string }[]>;
  @Input() hallmarkingExcludeKaratType$: Observable<
    { id: string; name: string }[]
  >;
  @Input() mode;
  CFAProdcut: CFAProducts;
  CFAProductCode: string;

  @Output() CFAProductDetails: EventEmitter<{
    description: string;
    isActive: boolean;
    isMia: boolean;
    itemTypeCode: string;
    orgCode: string;
    plainStudded: string;
    plainStuddedGrf: string;
    plainStuddedGrn: string;
    plainStuddedTep: string;
    productGroupCode: string;
    pricingType: string;
    configDetails: {
      data: {};
      type: 'PRODUCT_GROUP_CONFIG';
    };
    pricingDetails: {
      data: {};
      type: 'PRODUCT_GROUP_PRICE';
    };
  }> = new EventEmitter();
  destroy$: Subject<null> = new Subject<null>();
  isActive: boolean;
  constructor(
    private hf: HelperFunctions,
    public dialog: MatDialog,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}
  public currentStyle: string[];
  public formFields: any;
  ngOnInit() {
    this.cdr.markForCheck();
    combineLatest([
      this.CFAProduct$,
      this.itemTypes$,
      this.plainStuddedType$,
      this.pricingType$,
      this.hallmarkingExcludeKaratType$
    ]).subscribe(results => {
      this.isActive = results[0].isActive;
      const form = this.prepareSet(
        results[0],
        results[1],
        results[2],
        results[3],
        results[4]
      );
      this.formFields = this.getInputs(form);
      this.currentStyle = this.getCssProp();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getCssProp() {
    const annot = (CFAProductCodeSteponeComponent as any).__annotations__;
    return annot[0].styles;
  }
  prepareSet(
    CFAProdcut: ProductGroupDetails,
    itemTypes: ItemTypesResponse[],
    plainStuddedType: { id: string; name: string }[],
    pricingType: { id: string; name: string }[],
    hallmarkingExcludeKaratType: { id: string; name: string }[]
  ) {
    let plainStuddedTypeGrn;
    let plainStuddedTypeGrf;
    let plainStuddedTypeTep;
    this.CFAProductCode = CFAProdcut
      ? CFAProdcut.productGroupCode
        ? CFAProdcut.productGroupCode
        : ''
      : '';
    if (CFAProdcut) {
      itemTypes = this.hf.patchValue(
        itemTypes,
        'id',
        'selected',
        CFAProdcut.itemTypeCode,
        true
      );
    }
    if (CFAProdcut) {
      plainStuddedType = this.hf.patchValue(
        plainStuddedType,
        'id',
        'selected',
        CFAProdcut.plainStudded,
        true
      );
    }
    if (CFAProdcut) {
      plainStuddedTypeGrn = this.hf.patchValue(
        plainStuddedType,
        'id',
        'selected',
        CFAProdcut.plainStuddedGrn,
        true
      );
    }

    if (CFAProdcut) {
      plainStuddedTypeGrf = this.hf.patchValue(
        plainStuddedType,
        'id',
        'selected',
        CFAProdcut.plainStuddedGrf,
        true
      );
    }
    if (CFAProdcut) {
      plainStuddedTypeTep = this.hf.patchValue(
        plainStuddedType,
        'id',
        'selected',
        CFAProdcut.plainStuddedTep,
        true
      );
    }

    if (CFAProdcut) {
      pricingType = this.hf.patchValue(
        pricingType,
        'id',
        'selected',
        CFAProdcut.pricingType,
        true
      );
    }

    if (CFAProdcut) {
      hallmarkingExcludeKaratType = this.hf.patchValue(
        hallmarkingExcludeKaratType,
        'id',
        'selected',
        CFAProdcut.hallmarkingExcludeKarat,
        true
      );
    }

    const CFAProductCode = new CFAProductCodeDetails(
      1,
      CFAProdcut
        ? CFAProdcut.productGroupCode
          ? CFAProdcut.productGroupCode
          : ''
        : '',
      CFAProdcut ? (CFAProdcut.description ? CFAProdcut.description : '') : '',
      CFAProdcut
        ? CFAProdcut.hallmarkingExcludeGrams
          ? CFAProdcut.hallmarkingExcludeGrams
          : null
        : null,
      [
        {
          id: '2',
          name: 'pw.CFAProduct.isMia',
          checked: CFAProdcut ? CFAProdcut.isMia : false
        }
      ],
      itemTypes,
      plainStuddedType,
      plainStuddedTypeGrn,
      plainStuddedTypeGrf,
      hallmarkingExcludeKaratType,
      this.fieldValidatorsService,
      this.translateService
    );

    const CFAProductCodeCheckItOut = new CFAProductCodeCheckItOuts(
      1,
      plainStuddedTypeTep,
      pricingType,
      [
        {
          id: '0',
          name: 'pw.CFAProduct.goldPriceMandatory',
          checked: CFAProdcut ? CFAProdcut.isGoldPriceMandatory : false
        },
        {
          id: '1',
          name: 'pw.CFAProduct.silverPriceMandatory',
          checked: CFAProdcut ? CFAProdcut.isSilverPriceMandatory : false
        },
        {
          id: '2',
          name: 'pw.CFAProduct.platinumPriceMandatory',
          checked: CFAProdcut ? CFAProdcut.isPlatinumPriceMandatory : false
        },
        {
          id: '3',
          name: 'pw.CFAProduct.stoneChargesMandatory',
          checked: CFAProdcut ? CFAProdcut.isStonePriceMandatory : false
        },

        {
          id: '4',
          name: 'pw.CFAProduct.makingChargesMandatory',
          checked: CFAProdcut ? CFAProdcut.isMakingChargeMandatory : false
        },
        {
          id: '5',
          name: 'pw.CFAProduct.isEligibleForLoyalityPoints',
          checked: CFAProdcut ? CFAProdcut.isEligibleForLoyaltyPoints : false
        },
        {
          id: '6',
          name: 'pw.CFAProduct.printGuarnteeCard',
          checked: CFAProdcut ? CFAProdcut.printGuranteeCard : false
        },
        {
          id: '7',
          name: 'pw.CFAProduct.isApplicableForGrn',
          checked: CFAProdcut ? CFAProdcut.isGRNEnabled : false
        },
        {
          id: '8',
          name: 'pw.CFAProduct.isAllowedForBestGoldRateLabel',
          checked: CFAProdcut ? CFAProdcut.isBestGoldRateEnabled : false
        },
        {
          id: '9',
          name: 'pw.CFAProduct.isAllowedForConversionLabel',
          checked: CFAProdcut ? CFAProdcut.isConversionEnabled : false
        },
        {
          id: '10',
          name: 'pw.CFAProduct.isAllowedForDigiGoldLabel',
          checked: CFAProdcut ? CFAProdcut.isAllowedForDigiGoldMandatory : false
        },
        {
          id: '11',
          name: 'pw.CFAProduct.isAllowedForTCSLable',
          checked: CFAProdcut ? CFAProdcut.isAllowedForTCS : false
        },
        {
          id: '12',
          name: 'pw.CFAProduct.isHallmarkedLable',
          checked: CFAProdcut ? CFAProdcut.isHallmarked : false
        },
        {
          id: '13',
          name: 'pw.CFAProduct.isSolitaireStuddedLabel',
          checked: CFAProdcut ? CFAProdcut.isSolitaireStudded : false
        }
      ],
      this.fieldValidatorsService,
      this.translateService
    );

    const CFAProductCodeMain = new CFAProductCodeMainModel(
      1,
      CFAProductCode,
      CFAProductCodeCheckItOut
    );
    return CFAProductCodeMain;
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'Product Group',
      formDesc: 'Add productGroup',
      formTemplate: TEMPLATE7
    };
  }
  addButton(formGroup: FormGroup) {
    this.CFAProductDetails.emit({
      isMia: formGroup.value['1-CFAProductCodeDetails']['1-isMia'][0],
      productGroupCode:
        formGroup.value['1-CFAProductCodeDetails']['1-CFAProductCode'],
      description: formGroup.value['1-CFAProductCodeDetails']['1-description'],
      itemTypeCode: formGroup.value['1-CFAProductCodeDetails']['1-metalType'],
      orgCode: 'TJEW',
      isActive: this.mode === 'new' ? true : this.isActive,
      pricingDetails: {
        data: {
          isGoldPriceMandatory:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][0],
          isSilverPriceMandatory:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][1],
          isPlatinumPriceMandatory:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][2],
          isStonePriceMandatory:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][3],
          isMakingChargeMandatory:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][4],
          isAllowedForDigiGoldMandatory:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][10]
        },
        type: 'PRODUCT_GROUP_PRICE'
      },
      configDetails: {
        data: {
          isEligibleForLoyaltyPoints:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][5],
          printGuranteeCard:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][6],
          isGRNEnabled:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][7],
          isBestGoldRateEnabled:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][8],
          isConversionEnabled:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][9],
          isAllowedForTCS:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][11],
          isHallmarked:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][12],
          isSolitaireStudded:
            formGroup.value['1-CFAProductCodeCheckItOuts']['1-checkBoxes'][13],
          hallmarkingExcludeGrams: Number(
            formGroup.value['1-CFAProductCodeDetails'][
              '1-hallmarkingExcludeGrams'
            ]
          ),
          hallmarkingExcludeKarat: formGroup.value['1-CFAProductCodeDetails'][
            '1-hallmarkingExcludeKaratType'
          ].map(i => Number(i))
        },
        type: 'PRODUCT_GROUP_CONFIG'
      },
      plainStudded:
        formGroup.value['1-CFAProductCodeDetails']['1-plainStudded'],
      plainStuddedGrf:
        formGroup.value['1-CFAProductCodeDetails']['1-plainStuddedGrf'],
      plainStuddedGrn:
        formGroup.value['1-CFAProductCodeDetails']['1-plainStuddedGrn'],
      plainStuddedTep:
        formGroup.value['1-CFAProductCodeCheckItOuts']['1-plainStuddedTep'],
      pricingType:
        formGroup.value['1-CFAProductCodeCheckItOuts']['1-pricingType']
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
    if (this.CFAProductCode) {
      formGroup.get('1-CFAProductCodeDetails').get('1-CFAProductCode').disable({
        onlySelf: true
      });
    }
  }
}
