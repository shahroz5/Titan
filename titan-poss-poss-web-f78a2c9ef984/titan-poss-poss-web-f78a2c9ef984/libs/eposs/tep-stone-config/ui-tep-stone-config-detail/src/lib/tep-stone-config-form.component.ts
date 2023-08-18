import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPStoneConfig,
  TEPStoneConfigDetails,
  TEPStoneConfigEnum,
  TEPStoneConfigGridEnum,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-stone-config-form',
  templateUrl: './tep-stone-config-form.component.html',
  styles: []
})
export class TepStoneConfigFormComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  configNameTranslate: string;
  stoneTypeCodeTranslate: string;
  descriptionTranslate: string;
  stoneQualityTranslate: string;
  rangeTranslate: string;
  deductionPercentTranslate: string;
  removeTranslate: string;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    public dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translationService
      .get([
        'pw.tepStoneConfig.configName',
        'pw.tepStoneConfig.stoneTypeCodeTranslate',
        'pw.tepStoneConfig.descriptionTranslate',
        'pw.tepStoneConfig.stoneQualityTranslate',
        'pw.tepStoneConfig.rangeTranslate',
        'pw.tepStoneConfig.deductionPercentTranslate',
        'pw.tepStoneConfig.removeTranslate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.configNameTranslate =
          translatedMsg['pw.tepStoneConfig.configName'];
        this.stoneTypeCodeTranslate =
          translatedMsg['pw.tepStoneConfig.stoneTypeCodeTranslate'];
        this.descriptionTranslate =
          translatedMsg['pw.tepStoneConfig.descriptionTranslate'];
        this.stoneQualityTranslate =
          translatedMsg['pw.tepStoneConfig.stoneQualityTranslate'];
        this.rangeTranslate = translatedMsg['pw.tepStoneConfig.rangeTranslate'];
        this.deductionPercentTranslate =
          translatedMsg['pw.tepStoneConfig.deductionPercentTranslate'];
        this.removeTranslate =
          translatedMsg['pw.tepStoneConfig.removeTranslate'];
      });
  }

  @Input() tepStoneConfig: TEPStoneConfig;
  @Input() tepStoneConfigDetailsList$: Observable<TEPStoneConfigDetails[]>;
  @Input() tepStoneConfigStoneType: TEPStoneConfigStoneType[];
  tepStoneConfigStoneTypeList: { value: string; description: string }[];
  @Input() tepStoneConfigQualities: TEPStoneConfigQualities[];
  tepStoneConfigQualitiesList: { value: string; description: string }[];
  @Input() tepStoneConfigRange: TEPStoneConfigRange[];
  tepStoneConfigRangeList: { value: string; description: string }[];

  @Output() tepStoneConfigFormOutput = new EventEmitter<TEPStoneConfig>();
  @Output() tepStoneConfigDetailsFormOutput = new EventEmitter<{
    mode: TEPStoneConfigGridEnum;
    formData: TEPStoneDetailsModify;
  }>();
  @Output() editGridValue = new EventEmitter<TEPStoneConfigDetails[]>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  @Output() stoneTypeCodeGridSearch = new EventEmitter<string>();
  @Output() clearGridSearch = new EventEmitter<boolean>();

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  component: any = this;

  pageSizeOptions: number[] = [];
  minPageSize = 0;

  tepStoneConfigForm: FormGroup;
  tepStoneConfigDetailsForm: FormGroup;

  destroy$: Subject<null> = new Subject<null>();
  hasSelectedRow = false;
  disabled = true;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  // Ag Grid
  defaultColDef = {
    suppressMovable: true
  };

  gridAPI: GridApi;
  columnDefs = [];
  rowData = [];
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  context = this;
  themeCodesColumnDefs = [];
  itemCodeColumnDefs = [];
  tepStoneConfigDetailsGridData: TEPStoneConfigDetails[] = [];
  selectedConfig: TEPStoneConfigDetails[] = [];
  // Ag Grid end

  ngOnInit(): void {
    this.tepStoneConfigStoneTypeList = this.getTepStoneConfigStoneType(
      this.tepStoneConfigStoneType
    );

    this.tepStoneConfigQualitiesList = this.getTepStoneConfigQualities(
      this.tepStoneConfigQualities
    );

    this.tepStoneConfigRangeList = this.getTepStoneConfigRange(
      this.tepStoneConfigRange
    );

    this.tepStoneConfigForm = new FormGroup({
      configName: new FormControl(this.tepStoneConfig?.description || '', [
        this.fieldValidatorsService.requiredField(this.configNameTranslate),
        this.fieldValidatorsService.descriptionField(this.configNameTranslate),
        this.fieldValidatorsService.maxLength(100, this.configNameTranslate)
      ]),
      isActive: new FormControl(this.tepStoneConfig?.isActive || false)
    });

    this.tepStoneConfigDetailsForm = new FormGroup({
      stoneTypeCode: new FormControl(
        null,
        this.fieldValidatorsService.requiredField(this.stoneTypeCodeTranslate)
      ),
      stoneTypeCodeDescription: new FormControl(
        { value: null, disabled: true },
        this.fieldValidatorsService.requiredField(this.descriptionTranslate)
      ),
      stoneQuality: new FormControl(
        null,
        this.fieldValidatorsService.requiredField(this.stoneQualityTranslate)
      ),
      rangeId: new FormControl(
        null,
        this.fieldValidatorsService.requiredField(this.rangeTranslate)
      ),
      deductionPercentage: new FormControl(null, [
        this.fieldValidatorsService.requiredField(
          this.deductionPercentTranslate
        ),
        this.fieldValidatorsService.percentageField(
          this.deductionPercentTranslate
        )
      ])
    });

    this.setGrid();

    this.tepStoneConfigDetailsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.tepStoneConfigDetailsGridData = [];
        let i = 0;
        list.forEach(data => {
          i++;
          this.tepStoneConfigDetailsGridData.push({
            ...data,
            description: this.getStoneDescription(data.stoneTypeCode),
            rowId: i,
            range: this.tepStoneConfigRange.filter(
              x => x.id === data.rangeId
            )[0].range
          });
        });
        this.setRowData(this.tepStoneConfigDetailsGridData);
      });

    this.tepStoneConfigDetailsForm
      .get('stoneTypeCode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        const description = this.tepStoneConfigStoneType.filter(
          item => item.stoneTypeCode === val
        )[0]?.description;

        this.tepStoneConfigDetailsForm
          .get('stoneTypeCodeDescription')
          .setValue(description);
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.stoneTypeCodeGridSearch.emit(searchValue);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearGridSearch.emit(true);

  }

  getStoneDescription(stoneTypeCode: string) {
    return this.tepStoneConfigStoneType.find(
      val => val.stoneTypeCode === stoneTypeCode
    )?.description;
  }

  setRowData(tepStoneConfigDetailsGridData: TEPStoneConfigDetails[]) {
    this.gridAPI?.setRowData(tepStoneConfigDetailsGridData);
  }

  ngOnChanges() {
    if (this.tepStoneConfig.configId) {
      this.disabled = false;
    }
  }

  onSubmit() {
    if (
      this.tepStoneConfig?.description !== '' &&
      !this.tepStoneConfig?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.tepStoneConfigForm.valid) {
        const formData = this.tepStoneConfigForm.getRawValue();
        const data: TEPStoneConfig = {
          configId: this.tepStoneConfig.configId,
          description: formData.configName,
          itemCode: null,
          configType: TEPStoneConfigEnum.TEP_STONE,
          isActive: formData.isActive
        };

        this.tepStoneConfigFormOutput.emit(data);
      }
    }
  }
  showMessage(key: string) {
    this.translationService
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

  openLocationMapping() {
    if (
      this.tepStoneConfig?.description !== '' &&
      !this.tepStoneConfig?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
  }

  // Ag grid
  setGrid() {
    this.themeCodesColumnDefs = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        minWidth: 35,
        width: 40,
        pinned: 'left',
        suppressMovable: true,
        lockPinned: true
      },
      {
        headerName: this.stoneTypeCodeTranslate,
        field: 'stoneTypeCode',
        minWidth: 150,
        width: 100,
        suppressMovable: true
      },
      {
        headerName: this.descriptionTranslate,
        field: 'description',
        minWidth: 150,
        width: 100,
        suppressMovable: true
      },
      {
        headerName: this.stoneQualityTranslate,
        field: 'stoneQuality',
        minWidth: 150,
        width: 100,
        suppressMovable: true
      },
      {
        headerName: this.rangeTranslate,
        field: 'range',
        minWidth: 150,
        width: 100,
        suppressMovable: true
      },
      {
        headerName: 'rangeId',
        field: 'rangeId',
        width: 1,
        hide: true
      },
      {
        headerName: 'rowId',
        field: 'rowId',
        width: 1,
        hide: true
      },
      {
        headerName: this.deductionPercentTranslate,
        field: 'dedutionPercent',
        minWidth: 150,
        width: 100,
        suppressMovable: true
      },
      {
        headerName: '',
        field: 'id',
        cellRenderer: 'deleteRowRenderer',
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width'
      }
    ];
  }

  gridReady(params: GridReadyEvent) {
    this.gridAPI = params.api;
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  getContext() {
    return {
      componentParent: this.component
    };
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event);
    }
  }

  openConfirmDialogForDelete(event: any) {


    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.hasSelectedRow = false;

          const removeStones: string[] = [
            this.tepStoneConfigDetailsGridData[event.rowIndex].id
          ];

          if (!this.tepStoneConfig.configId) {
            this.tepStoneConfigDetailsGridData.splice(event.rowIndex, 1);

            this.setRowData(this.tepStoneConfigDetailsGridData);

            const formData = {
              addStones: this.tepStoneConfigDetailsGridData
            };

            this.tepStoneConfigDetailsFormOutput.emit({
              mode: TEPStoneConfigGridEnum.ADD,
              formData
            });
          } else {
            const formData: TEPStoneDetailsModify = {
              removeStones
            };

            this.tepStoneConfigDetailsFormOutput.emit({
              mode: TEPStoneConfigGridEnum.REMOVE,
              formData
            });
          }
        }
      });
  }

  onGridSizeChanged(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  selectionChanged(grid) {
    if (grid.api.getSelectedRows().length) {
      this.selectedConfig = grid.api.getSelectedRows();
      this.hasSelectedRow = true;
    } else {
      this.hasSelectedRow = false;
    }
  }
  // Ag grid ends

  onStoneDetailsSubmit() {
    if (
      this.tepStoneConfig?.description !== '' &&
      !this.tepStoneConfig?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.tepStoneConfigDetailsForm.valid) {
        const details = this.tepStoneConfigDetailsForm.getRawValue();
        this.tepStoneConfigDetailsForm.reset();
        this.tepStoneConfigDetailsForm.markAsPristine();
        this.tepStoneConfigDetailsForm.markAsUntouched();
        this.tepStoneConfigDetailsForm.updateValueAndValidity();

        let formData: TEPStoneDetailsModify;

        if (!this.tepStoneConfig.configId) {
          const addStonesIn: TEPStoneConfigDetails = {
            dedutionPercent: details.deductionPercentage,
            rangeId: details.rangeId,
            rowId: this.tepStoneConfigDetailsGridData.length + 1,
            stoneQuality: details.stoneQuality,
            stoneTypeCode: details.stoneTypeCode
          };
          this.tepStoneConfigDetailsGridData.push(addStonesIn);
          this.setRowData(this.tepStoneConfigDetailsGridData);

          formData = {
            addStones: this.tepStoneConfigDetailsGridData
          };
        } else {
          const addStones: TEPStoneConfigDetails[] = [
            {
              dedutionPercent: details.deductionPercentage,
              rangeId: details.rangeId,
              rowId: this.tepStoneConfigDetailsGridData.length + 1,
              stoneQuality: details.stoneQuality,
              stoneTypeCode: details.stoneTypeCode
            }
          ];
          const updateStones = this.tepStoneConfigDetailsGridData;

          formData = {
            addStones,
            updateStones
          };
        }

        this.tepStoneConfigDetailsFormOutput.emit({
          mode: TEPStoneConfigGridEnum.ADD,
          formData
        });
      }
    }
  }

  editValue() {
    if (
      this.tepStoneConfig?.description !== '' &&
      !this.tepStoneConfig?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.editGridValue.emit(this.selectedConfig);
    }
  }

  getTepStoneConfigStoneType(data: TEPStoneConfigStoneType[]) {
    return data.map(val => {
      return {
        value: val.stoneTypeCode,
        description: val.stoneTypeCode
      };
    });
  }

  getTepStoneConfigQualities(data: TEPStoneConfigQualities[]) {
    return data.map(val => {
      return {
        value: val.name,
        description: val.name
      };
    });
  }

  getTepStoneConfigRange(data: TEPStoneConfigRange[]) {
    return data.map(val => {
      return {
        value: val.id,
        description: val.range
      };
    });
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
