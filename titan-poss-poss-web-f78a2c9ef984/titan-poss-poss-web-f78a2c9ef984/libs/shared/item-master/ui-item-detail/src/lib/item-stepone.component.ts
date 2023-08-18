import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { ItemModelViewPartOne } from '@poss-web/shared/ui-master-form-models';
import { ItemModelViewPartTwo } from '@poss-web/shared/ui-master-form-models';
import { ItemViewMainModel } from '@poss-web/shared/ui-master-form-models';
import { ItemDetails } from '@poss-web/shared/models';

import {
  TEMPLATE18
} from '@poss-web/shared/components/ui-dynamic-form';

import { UiViewStonesPopupComponent } from './ui-view-stones-popup/ui-view-stones-popup.component';

@Component({
  selector: 'poss-web-item-stepone',
  template: `
    <div class="row mt-3">
      <div class="col-12">
        <div class="pw-form-card">
          <div class="row">
            <mat-form-field class="col-lg-2 col-3">
              <p class="pw-fourth-color">
                {{ 'pw.itemMaster.itemMasterCode' | translate }}
              </p>
              <input
                readonly
                matInput
                class="pw-single-bordered-input mt-2 mb-1"
                value="{{ itemCode }}"
                type="text"
              />
            </mat-form-field>
            <mat-form-field class="col-lg-8 col-5">
              <p class="pw-fourth-color">
                {{ 'pw.itemMaster.itemMasterDescription' | translate }}
              </p>
              <input
                readonly
                matInput
                class="pw-single-bordered-input mt-2 mb-1"
                value="{{ description }}"
                type="text"
              />
            </mat-form-field>
            <div class="col-auto pw-detail-card__right-container mt-2">
              <span class="pw-detail-card__icon-text">{{ this.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
    <div class="row">
      <div class="col-auto ml-auto mb-4">
        <button class="pw-btn pw-primary-btn" (click)="ViewStones(stoneData)">
          {{ 'pw.itemMaster.itemViewStonesButtonLabel' | translate }}
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSteponeComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  itemCode: string;
  itemDetails: ItemDetails;
  @Input() itemByItemCode$: Observable<ItemDetails>;
  @Input() stoneData;

  public currentStyle: string[];
  public formFields: any;

  itemDetailsUrl: string;
  description: string;
  status: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    combineLatest([this.itemByItemCode$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        if (results) {
          const form = this.prepareSet(results[0]);
          this.formFields = this.getInputs(form);
          this.currentStyle = this.getCssProp();
        }
      });
  }

  prepareSet(itemDetails: ItemDetails) {
    this.itemCode = itemDetails
      ? itemDetails.itemCode
        ? itemDetails.itemCode
        : ''
      : '';
    this.description = itemDetails
      ? itemDetails.description
        ? itemDetails.description
        : ''
      : '';
    if (itemDetails.isActive) {
      this.status = 'Active';
    } else {
      this.status = 'In-Active';
    }
    let detailsmain = null;

    const itemPartOne = new ItemModelViewPartOne(
      1,
      itemDetails
        ? itemDetails.stoneWeight
          ? itemDetails.stoneWeight
          : ''
        : '',
      itemDetails ? (itemDetails.indentType ? itemDetails.indentType : '') : '',
      [
        {
          id: '1',
          name: 'pw.itemMaster.itemMasterIsConsignment',
          checked: itemDetails
            ? itemDetails.isConsignable
              ? itemDetails.isConsignable
              : false
            : false
        }
      ],

      itemDetails
        ? itemDetails.maxWeightDeviation
          ? itemDetails.maxWeightDeviation
          : ''
        : '',
      itemDetails ? (itemDetails.stdWeight ? itemDetails.stdWeight : '') : '',
      itemDetails.productCode,
      itemDetails.brandCode,
      itemDetails.productType,
      itemDetails.materialCode,
      itemDetails.supplyChainCode,
      itemDetails ? (itemDetails.itemNature ? itemDetails.itemNature : '') : '',
      itemDetails ? (itemDetails.stdPrice ? itemDetails.stdPrice : '') : '',
      itemDetails
        ? itemDetails.stoneCharges
          ? itemDetails.stoneCharges
          : ''
        : '',
      itemDetails ? (itemDetails.leadTime ? itemDetails.leadTime : '') : '',
      itemDetails ? (itemDetails.hsnSacCode ? itemDetails.hsnSacCode : '') : '',
      itemDetails ? (itemDetails.purity ? itemDetails.purity : '') : ''
    );

    const itemPartTwo = new ItemModelViewPartTwo(
      1,
      itemDetails ? itemDetails.CFAproductCode : '',
      itemDetails ? itemDetails.complexityCode : '',
      itemDetails ? itemDetails.inventoryType : '',
      itemDetails ? itemDetails.pricingType : '',
      itemDetails ? (itemDetails.taxClass ? itemDetails.taxClass : '') : '',
      itemDetails ? itemDetails.findingCode : '',
      itemDetails ? (itemDetails.size ? itemDetails.size : '') : '',
      itemDetails ? (itemDetails.finishing ? itemDetails.finishing : '') : '',
      itemDetails ? itemDetails.pricingGroupType : '',
      itemDetails ? itemDetails.priceFactor : '',
      itemDetails ? (itemDetails.karatage ? itemDetails.karatage : '') : '',
      itemDetails
        ? itemDetails.diamondKaratage
          ? itemDetails.diamondKaratage
          : ''
        : '',
      itemDetails
        ? itemDetails.diamondClarity
          ? itemDetails.diamondClarity
          : ''
        : '',
      itemDetails
        ? itemDetails.diamondColour
          ? itemDetails.diamondColour
          : ''
        : '',
      [
        {
          id: '1',
          name: 'pw.itemMaster.itemMasterPerGram',
          checked: itemDetails
            ? itemDetails.perGram
              ? itemDetails.perGram
              : false
            : false
        },

        {
          id: '2',
          name: 'pw.itemMaster.itemMasterSaleable',
          checked: itemDetails
            ? itemDetails.saleable
              ? itemDetails.saleable
              : false
            : false
        },
        {
          id: '3',
          name: 'pw.itemMaster.itemMasterReturnable',
          checked: itemDetails
            ? itemDetails.returnable
              ? itemDetails.returnable
              : false
            : false
        },
        {
          id: '4',
          name: 'pw.itemMaster.itemMasterIndentable',
          checked: itemDetails
            ? itemDetails.indentable
              ? itemDetails.indentable
              : false
            : false
        }
        // {
        //   id: '5',
        //   name: 'pw.itemMaster.itemMasterInterBrandAcceptable',
        //   checked: itemDetails.interBrandAcceptable
        //     ? itemDetails.interBrandAcceptable
        //     : false
        // }
      ]
    );
    detailsmain = new ItemViewMainModel(1, itemPartOne, itemPartTwo);

    return detailsmain;
  }

  getCssProp() {
    const annot = (ItemSteponeComponent as any).__annotations__;
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
      formName: 'Item Master Form',
      formDesc: 'Item Master',
      formTemplate: TEMPLATE18
    };
  }
  ViewStones(stoneData) {
    this.dialog.open(UiViewStonesPopupComponent, {
      width: '437px',
      height: 'auto',
      disableClose: true,
      data: { itemCode: this.itemCode, stones: stoneData }
    });
  }

  public formGroupCreated(formGroup: FormGroup, itemDetails: ItemDetails) {
    this.itemByItemCode$.pipe(takeUntil(this.destroy$)).subscribe(results => {
      formGroup.get('1-itemPartTwo').get('1-checkBoxes').disable({
        onlySelf: true
      });
      formGroup.get('1-itemPartOne').get('1-isConsignment').disable({
        onlySelf: true
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
