import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { SelectionDailogOption } from '@poss-web/shared/components/ui-selection-dialog';
import {
  AddLocationPriceGroup,
  LocationPriceGroupMapping,
  LocationPriceGroupMappingList
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-price-group-mapping-form',
  templateUrl: './price-group-mapping-form.component.html',
  styles: [
    `
      .max-content {
        width: max-content;
      }
    `
  ]
})
export class PriceGroupMappingFormComponent
  implements OnInit, OnChanges, OnDestroy {
  constructor(
    private translationService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.translationService
      .get([
        'pw.priceGroupMapping.priceGroupCode',
        'pw.priceGroupMapping.priceGroupTypeCode',
        'pw.priceGroupMapping.remove'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.priceGroupCodeTranslate =
          translatedMsg['pw.priceGroupMapping.priceGroupCode'];
        this.priceGroupTypeCodeTranslate =
          translatedMsg['pw.priceGroupMapping.priceGroupTypeCode'];
        this.removeTranslate = translatedMsg['pw.priceGroupMapping.remove'];
      });
  }

  priceGroupCodeTranslate: string;
  priceGroupTypeCodeTranslate: string;
  removeTranslate: string;

  @Input() selectedLocation: SelectionDailogOption;
  @Input() selectedPriceGroupCode: SelectionDailogOption;
  @Input() selectedPriceGroupTypeCode: SelectionDailogOption;
  @Input() locationPriceGroupMappingList$: Observable<
    LocationPriceGroupMappingList[]
  >;
  @Output() clearLocationSelection = new EventEmitter<boolean>();
  @Output() clearProductGroupCodeSelection = new EventEmitter<boolean>();
  @Output() clearProductGroupTypeCodeSelection = new EventEmitter<boolean>();

  @Output() openLocationSelectionPopup = new EventEmitter<boolean>();
  @Output() openPriceGroupCodeSelectionPopup = new EventEmitter<boolean>();
  @Output() openPriceGroupTypeCodeSelectionPopup = new EventEmitter<boolean>();

  @Output() LocationPriceGroupMapping = new EventEmitter<
    LocationPriceGroupMapping
  >();

  // Ag Grid
  gridAPI: GridApi;
  columnDefs = [];
  rowData = [];
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  context = this;
  themeCodesColumnDefs = [];
  itemCodeColumnDefs = [];
  defaultColDef = {
    wrapText: true,
    autoHeight: true,
    suppressMovable: true
  };
  locationPriceGroupMappingGridData: LocationPriceGroupMappingList[] = [];

  locationCode: string = null;
  priceGroupCode: string = null;
  priceGroupTypeCode: string = null;
  destroy$: Subject<null> = new Subject<null>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  ngOnInit(): void {
    this.setGrid();

    this.locationPriceGroupMappingList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(locationPriceGroupMappingList => {
        this.locationPriceGroupMappingGridData = [];
        locationPriceGroupMappingList.forEach(data => {
          this.locationPriceGroupMappingGridData.push({
            id: data.id,
            priceGroup: data.priceGroup,
            pricingGroupType: data.pricingGroupType
          });
        });
      });

    this.gridAPI?.setRowData(this.locationPriceGroupMappingGridData);

    this.cdr.detectChanges();
  }

  ngOnChanges(): void {
    this.locationCode = this.selectedLocation?.id || '';
    this.priceGroupCode = this.selectedPriceGroupCode?.id || '';
    this.priceGroupTypeCode = this.selectedPriceGroupTypeCode?.id || '';
  }

  openLocationSelection() {
    this.openLocationSelectionPopup.emit(true);
  }
  openPriceGroupCodeSelection() {
    this.openPriceGroupCodeSelectionPopup.emit(true);
  }
  openPriceGroupTypeCodeSelection() {
    this.openPriceGroupTypeCodeSelectionPopup.emit(true);
  }

  clearLocation() {
    this.locationCode = '';
    this.clearLocationSelection.emit(true);
  }
  clearProductGroupCode() {
    this.priceGroupCode = '';
    this.clearProductGroupCodeSelection.emit(true);
  }
  clearProductGroupTypeCode() {
    this.priceGroupTypeCode = '';
    this.clearProductGroupTypeCodeSelection.emit(true);
  }

  addPriceGroupMapping() {
    const addLocationPriceGroup: AddLocationPriceGroup[] = [
      {
        priceGroup: this.priceGroupCode,
        pricingGroupType: this.priceGroupTypeCode
      }
    ];

    const locationPriceGroupMapping: LocationPriceGroupMapping = {
      addPriceGroup: addLocationPriceGroup,
      removePriceGroup: []
    };

    this.LocationPriceGroupMapping.emit(locationPriceGroupMapping);
  }

  getContext() {
    return {
      validators: [],
      disableCheckBox: true
    };
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  gridReady(params: GridReadyEvent) {
    this.gridAPI = params.api;
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.cellRenderer === 'deleteRowRenderer') {
      this.LocationPriceGroupMapping.emit({
        addPriceGroup: [],
        removePriceGroup: [
          this.locationPriceGroupMappingGridData[clickEvent.rowIndex].id
        ]
      });
      // this.tepProductGroupMappingGridData.splice(clickEvent.rowIndex, 1);
      // this.gridAPI.setRowData(this.tepProductGroupMappingGridData);
    }
  }
  onGridSizeChanged(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  setGrid() {
    this.themeCodesColumnDefs = [
      {
        headerName: this.priceGroupCodeTranslate,
        field: 'priceGroup',
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.priceGroupTypeCodeTranslate,
        field: 'pricingGroupType',
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.removeTranslate,
        field: 'id',
        cellRenderer: 'deleteRowRenderer',
        // width: 15,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width'
      }
    ];
  }


onCellFocused(event) {
	this.isFocusing = true;
	this.focusedHeaderName = event.column.colDef.headerName;
	this.currentRowIndex = Number(event.rowIndex);
	this.currentRowField = event.column.colDef.field;
	var node = this.gridAPI.getDisplayedRowAtIndex(this.currentRowIndex);
  this.currentRowInfo = this.gridAPI.getValue(this.currentRowField, node);
}

focusOut(event) {
	this.isFocusing = false;
}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
