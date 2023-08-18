import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  EditItemComponent,
  InputValidatorComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  GiftCardsGridEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  StoneDetail
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-tep-stone-details-list-grid',
  templateUrl: './tep-stone-details-list-grid.component.html',
  styleUrls: ['./tep-stone-details-list-grid.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepStoneDetailsListGridComponent
  implements OnInit, OnChanges, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  rowSelection = GiftCardsGridEnum.SINGLE;
  _resize$: Observable<any>;
  domLayout = GiftCardsGridEnum.AUTO_HEIGHT;
  animateRows = true;
  rowHeight = 35;
  currentColumnName = null;
  currentRowIndex: number;
  totalAmount: number;
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    resizable: true
  };
  columnDefs = [];
  rowData = [];
  tepStoneDetailsListGridComponent: any = this;
  totalStoneWeight = 0;

  destroy$: Subject<null> = new Subject<null>();

  @Input() stonesDetailList: StoneDetail[] = [];
  @Input() isRequestApproval: boolean;
  @Input() isTepRequestApprovedScenario: boolean;

  @Output() updatedRowData: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private currencySymbolService: CurrencySymbolService,
    private weightFormatterService: WeightFormatterService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService,
    private cd: ChangeDetectorRef,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit(): void {
    const stoneCodeLabel = 'pw.tep.stoneCodeLabel';
    const actualNoOfStonesLabel = 'pw.tep.actualNoOfStonesLabel';
    const noOfStonesReturnedLabel = 'pw.tep.noOfStonesReturnedLabel';
    const exchangeStoneValueLabel = 'pw.tep.exchangeStoneValueLabel';
    const deductionLabel = 'pw.tep.deductionLabel';
    const totalCaratsLabel = 'pw.tep.totalCaratsLabel';
    const ratePerCaratsLabel = 'pw.tep.ratePerCaratsLabel';
    const beforeDeductionStoneValueLabel =
      'pw.tep.beforeDeductionStoneValueLabel';

    this.translate
      .get([
        stoneCodeLabel,
        actualNoOfStonesLabel,
        noOfStonesReturnedLabel,
        exchangeStoneValueLabel,
        deductionLabel,
        totalCaratsLabel,
        ratePerCaratsLabel,
        beforeDeductionStoneValueLabel
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        if (!this.isRequestApproval) {
          this.columnDefs = [
            {
              headerName: translatedMessages[stoneCodeLabel] + '.',
              field: 'stoneCode'
            },
            {
              headerName: 'Stone Type',
              field: 'stoneTypeCode'
            },
            {
              headerName: translatedMessages[actualNoOfStonesLabel],
              field: 'actualNoOfStones'
            },
            {
              headerName: translatedMessages[noOfStonesReturnedLabel],
              field: 'noOfStonesReturned',
              editable: () =>
                this.isTepRequestApprovedScenario ? false : true,
              cellEditor: GiftCardsGridEnum.INPUT_VALIDATOR,
              singleClickEdit: true,
              cellRendererSelector: params => {
                return {
                  component: GiftCardsGridEnum.EDIT_ITEM_COMPONENT
                };
              },
              valueFormatter: params => {
                if (params && params.value && params.value.isValid) {
                  if (
                    params &&
                    params.value &&
                    (params.value.value || params.value.value === 0)
                  ) {
                    if (params.value.value !== params.value.oldValue) {
                      if (
                        params.data &&
                        Number(params.data.noOfStonesReturned.value) <=
                          Number(params.data.actualNoOfStones)
                      ) {
                        this.getUpdatedRowData();
                      } else {
                        this.showAlertNotification(
                          'No. of stones returned should be less than or equal to actual no. of stones.'
                        );
                      }
                    }
                    return params.value.value;
                  } else {
                    return '';
                  }
                } else {
                  if (
                    params &&
                    params.value &&
                    params.value.value &&
                    !params.value.isValid
                  ) {
                    this.showAlertNotification(
                      'Decimal points, special characters or alphabhets are not allowed in No. of stones returned field.'
                    );
                    return params.value.value;
                  } else {
                    if (params.value && params.value.value === '') {
                      this.showAlertNotification(
                        'No. of stones returned should not be empty.'
                      );
                    } else {
                      return typeof params.value === 'object'
                        ? params.value.value
                          ? params.value.value
                          : ''
                        : params.value;
                    }
                  }
                }
              },
              cellClass: 'pw-fourth-color',
              cellClassRules: {
                'pw-gray-border': params => {
                  return (
                    params.value &&
                    params.value.isValid === true &&
                    params.value.value !== ''
                  );
                },
                'pw-error-border': params => {
                  return (
                    (params.value && params.value.isValid === false) ||
                    (params.value && params.value.value === '')
                  );
                }
              }
            },
            {
              headerName: `${
                translatedMessages[exchangeStoneValueLabel]
              } (${this.currencySymbolService.get('INR')})`,
              field: 'exchangeStoneValue',
              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  'INR',
                  false
                );
              }
            },
            {
              headerName: `${
                translatedMessages[deductionLabel]
              } (${this.currencySymbolService.get('INR')})`,
              field: 'deduction',
              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  'INR',
                  false
                );
              }
            },
            {
              headerName: translatedMessages[totalCaratsLabel],
              field: 'totalCarats',
              valueFormatter: params => {
                return this.weightFormatterService.format(params.value);
              }
            },
            {
              headerName: `${
                translatedMessages[ratePerCaratsLabel]
              } (${this.currencySymbolService.get('INR')})`,
              field: 'ratePerCarats',
              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  'INR',
                  false
                );
              }
            },
            {
              headerName: `${
                translatedMessages[beforeDeductionStoneValueLabel]
              } (${this.currencySymbolService.get('INR')})`,
              field: 'beforeDeductionStoneValue',
              valueFormatter: params => {
                return this.currencyFormatterService.format(
                  params.value,
                  'INR',
                  false
                );
              }
            }
          ];
        } else {
          this.columnDefs = [
            {
              headerName: translatedMessages[stoneCodeLabel] + '.',
              field: 'stoneCode'
            },
            {
              headerName: 'Stone Type',
              field: 'stoneTypeCode'
            },
            {
              headerName: translatedMessages[actualNoOfStonesLabel],
              field: 'actualNoOfStones'
            },
            {
              headerName: translatedMessages[noOfStonesReturnedLabel],
              field: 'noOfStonesReturned'
            },

            {
              headerName: translatedMessages[totalCaratsLabel],
              field: 'totalCarats',
              isWeight: true,
              editable: () => true,
              cellEditor: GiftCardsGridEnum.INPUT_VALIDATOR,
              singleClickEdit: true,
              cellRendererSelector: params => {
                return {
                  component: GiftCardsGridEnum.EDIT_ITEM_COMPONENT
                };
              },
              valueFormatter: params => {
                if (params && params.value && params.value.isValid) {
                  if (params && params.value && params.value.value) {
                    this.getUpdatedCaratsData();
                    return this.weightFormatterService.format(
                      params.value.value
                    );
                  } else {
                    return '';
                  }
                } else {
                  return '';
                }
              },
              cellClass: 'pw-fourth-color',
              cellClassRules: {
                'pw-gray-border': params => {
                  return (
                    params.value &&
                    params.value.isValid === true &&
                    params.value.value !== ''
                  );
                },
                'pw-error-border': params => {
                  return (
                    (params.value && params.value.isValid === false) ||
                    (params.value && params.value.value === '')
                  );
                }
              }
            }
          ];
        }
      });
  }

  ngOnChanges() {
    this.rowData = [];
    if (this.stonesDetailList && this.stonesDetailList.length > 0) {
      this.stonesDetailList.forEach((stonesDetails: StoneDetail) => {
        const noOfStonesReturned = stonesDetails.measuredNoOfStones;
        // const totalStoneWeight = this.totalStoneWeight
        //   ? this.totalStoneWeight
        //   : (Number(stonesDetails.stoneWeight) *
        //       Number(stonesDetails.noOfStones)) /
        //     Number(noOfStonesReturned);
        // this.totalStoneWeight = totalStoneWeight;
        const totalStoneWeight = Number(stonesDetails.totalStoneWeight);
        this.rowData = [
          ...this.rowData,
          {
            stoneCode: stonesDetails.stoneCode,
            stoneTypeCode: stonesDetails.stoneTypeCode,
            actualNoOfStones: stonesDetails.noOfStones,
            noOfStonesReturned: noOfStonesReturned,
            exchangeStoneValue: stonesDetails.finalStoneValue,
            deduction: stonesDetails.deductionValue,
            totalCarats: stonesDetails.stoneWeight,
            ratePerCarats: stonesDetails.ratePerCarat,
            beforeDeductionStoneValue: stonesDetails.measuredValue,
            totalStoneWeight: totalStoneWeight
          }
        ];
      });
      this.cd.markForCheck();
    }
  }

  showAlertNotification(message: string): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          const stoneRowData = this.rowData.map(rowItem => {
            if (
              rowItem &&
              rowItem.noOfStonesReturned &&
              typeof rowItem.noOfStonesReturned === 'object'
            ) {
              return {
                ...rowItem,
                noOfStonesReturned: rowItem.noOfStonesReturned.oldValue
              };
            } else {
              return rowItem;
            }
          });
          this.rowData = [...stoneRowData];
          this.api.setRowData(this.rowData);
        }
      });
  }

  getUpdatedRowData() {
    let rowData = [];
    if (this.api) {
      this.api.forEachNode(node => {
        const noOfStonesReturned =
          node.data.noOfStonesReturned && node.data.noOfStonesReturned.value
            ? node.data.noOfStonesReturned.value
            : node.data.noOfStonesReturned;
        const nodeObject = {
          ...node.data,
          noOfStonesReturned:
            node.data.noOfStonesReturned && node.data.noOfStonesReturned.value
              ? node.data.noOfStonesReturned.value
              : node.data.noOfStonesReturned &&
                !node.data.noOfStonesReturned.value
              ? node.data.noOfStonesReturned
              : 0,
          totalCarats:
            ((Number(node.data.totalStoneWeight) * Number(noOfStonesReturned)) /
            Number(node.data.actualNoOfStones)).toFixed(3)
        };
        rowData.push(nodeObject);
      });
      this.rowData = rowData;
      this.cd.markForCheck();
      this.updatedRowData.emit(rowData);
    }
  }

  getUpdatedCaratsData() {
    let rowData = [];
    this.api.forEachNode(node => {
      const nodeObject = {
        ...node.data,
        totalCarats:
          node.data.totalCarats && node.data.totalCarats.value
            ? node.data.totalCarats.value
            : node.data.totalCarats && !node.data.totalCarats.value
            ? node.data.totalCarats
            : 0
      };
      rowData.push(nodeObject);
    });
    this.updatedRowData.emit(rowData);
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      editItemComponent: EditItemComponent
    };
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  selectionChange(id, rowKey, fieldName) {
    console.log(id, rowKey, fieldName, 'chevk selection change');
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length === 0) {
      this.api.showNoRowsOverlay();
    }
    this.api.sizeColumnsToFit();
  }

  getContext() {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this.tepStoneDetailsListGridComponent,
      validators: {
        noOfStonesReturned: [
          this.fieldValidatorsService.requiredField('No. Of Stones Returned'),
          this.fieldValidatorsService.numbersField('No. of Stones Returned')
        ],
        totalCarats: [this.fieldValidatorsService.weightField('Total Carats')]
      },
      gridApi: this.api
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
