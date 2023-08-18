import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  AppVersionByStatusRequestPayload,
  AppVersionsEnum,
  AppVersionStatusEnum,
  GetAppVersionDataByStatus,
  MonitoringDashboardEnum,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MatDialog } from '@angular/material/dialog';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-app-version-grid',
  templateUrl: './app-version-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppVersionGridComponent implements OnChanges, OnInit, OnDestroy {
  @Input() pageEvent: PageEvent;
  @Input() totalCount$: Observable<number>;
  @Input() pageSize: number[];
  @Input() getAppVersionDataByStatus: GetAppVersionDataByStatus[];
  @Input() statusList$: Observable<SelectDropDownOption[]>;
  @Input() selectedAppVersions$: Observable<SelectDropDownOption[]>;

  @Output() paginator = new EventEmitter<{
    pageDetails: PageEvent;
    formData: AppVersionByStatusRequestPayload;
  }>();
  @Output() getSelectedAppVersionNumbers = new EventEmitter<string>();
  @Output() searchAppVersionByStatus = new EventEmitter<
    AppVersionByStatusRequestPayload
  >();
  @Output() publishAppVersion = new EventEmitter<any>();
  @Output() deleteAppVersion = new EventEmitter<number>();

  totalRecordsCount: number = 0;
  rowDataAppVersionsListing = [];
  searchAppVersionByStatusForm: FormGroup;

  //For ag-grid
  gridApi: GridApi;
  columnApi: ColumnApi;
  domLayout = 'autoHeight';
  animateRows = true;
  rowHeight = 35;
  rowSelection = 'multiple';
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    flex: 1
  };
  columnDefs = [];

  //For Pagination
  pageSizeOptions = [];
  minPageSize: number;

  statusLabel: string;
  selectLocationLableText: string;
  searchLocationPlaceHolder: string;
  uiVersionLabel: string;
  apiVersionLabel: string;
  dbVersionLabel: string;
  downloadUrlLabel: string;
  locationCodeLabel: string;
  publishedButtonLabel: string;

  locationFilter = {
    brands: null,
    regions: null,
    levels: null,
    countries: null,
    states: null,
    towns: null
  };
  selectedLocation: SelectionDailogOption;
  locationForSelection: SelectionDailogOption[] = [];
  locationCode: string[] = [];
  showPublishButton = false;

  monitoringDashboardEnum = MonitoringDashboardEnum;

  component: AppVersionGridComponent = this;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    private fieldValidatorsService: FieldValidatorsService,
    private locationMappingFacade: LocationMappingFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.monitoringDashboard.status',
        'pw.monitoringDashboard.selectLocationCode',
        'pw.monitoringDashboard.searchByLocationCode',
        'pw.monitoringDashboard.uiVersion',
        'pw.monitoringDashboard.apiVersion',
        'pw.monitoringDashboard.dbVersion',
        'pw.monitoringDashboard.downloadUrl',
        'pw.monitoringDashboard.locationCode',
        'pw.monitoringDashboard.published'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.statusLabel = translatedMsg['pw.monitoringDashboard.status'];
        this.selectLocationLableText =
          translatedMsg['pw.monitoringDashboard.selectLocationCode'];
        this.searchLocationPlaceHolder =
          translatedMsg['pw.monitoringDashboard.searchByLocationCode'];
        this.uiVersionLabel = translatedMsg['pw.monitoringDashboard.uiVersion'];
        this.apiVersionLabel =
          translatedMsg['pw.monitoringDashboard.apiVersion'];
        this.dbVersionLabel = translatedMsg['pw.monitoringDashboard.dbVersion'];
        this.downloadUrlLabel =
          translatedMsg['pw.monitoringDashboard.downloadUrl'];
        this.locationCodeLabel =
          translatedMsg['pw.monitoringDashboard.locationCode'];
        this.publishedButtonLabel =
          translatedMsg['pw.monitoringDashboard.published'];
      });

    this.searchAppVersionByStatusForm = new FormGroup({
      selectRadioButton: new FormControl(
        this.monitoringDashboardEnum.POSS_UI_VERSION
      ),
      versionNo: new FormControl(''),
      status: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.statusLabel)
      ]),
      location: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['getAppVersionDataByStatus']) {
      this.rowDataAppVersionsListing = [];
      this.showPublishButton = false;
      if (
        !!this.getAppVersionDataByStatus &&
        this.getAppVersionDataByStatus.length > 0
      ) {
        this.getAppVersionDataByStatus.forEach(data => {
          this.rowDataAppVersionsListing.push({
            id: data.id,
            locationCode: data.locationCode,
            status: data.status,
            possUiVersion: data.possUiVersion,
            possServiceVersion: data.possServiceVersion,
            databaseVersion: data.databaseVersion,
            downloadUrl: data.downloadUrl,
            published:
              data.published === true
                ? AppVersionsEnum.PUBLISHED_YES
                : AppVersionsEnum.PUBLISHED_NO
          });
          if (
            data &&
            data.status === AppVersionStatusEnum.UPCOMMING &&
            !data.published
          ) {
            this.showPublishButton = true;
          }
        });
      }

      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.selectRadioChanged(this.monitoringDashboardEnum.POSS_UI_VERSION);
    this.totalCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => (this.totalRecordsCount = count));

    this.columnDefs = [
      {
        minWidth: 5,
        width: 5,
        pinned: 'left',
        lockPinned: true,
        cellStyle: params => {
          if (params.data.newlyAdded) {
            return { backgroundColor: '#1eb496', padding: '0px' };
          }
        }
      },
      {
        headerName: this.uiVersionLabel,
        field: 'possUiVersion',
        editable: false,
        suppressSizeToFit: true
      },
      {
        headerName: this.apiVersionLabel,
        field: 'possServiceVersion',
        editable: false,
        suppressSizeToFit: true
      },
      {
        headerName: this.dbVersionLabel,
        field: 'databaseVersion',
        editable: false,
        suppressSizeToFit: true
      },
      {
        headerName: this.downloadUrlLabel,
        field: 'downloadUrl',
        editable: false,
        resizable: true,
        minWidth: 250,
        width: 250,
        maxWidth: 400
      },
      {
        headerName: this.locationCodeLabel,
        field: 'locationCode',
        editable: false,
        suppressSizeToFit: true
      },
      {
        headerName: this.statusLabel,
        field: 'status',
        editable: false,
        suppressSizeToFit: true
      },
      {
        headerName: this.publishedButtonLabel,
        field: 'published',
        editable: false,
        suppressSizeToFit: true
      },
      {
        headerName: '',
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width',
        cellRenderer: 'deleteRowRenderer',
        suppressRowClickSelection: 'true'
        // onCellClicked: this.remove.bind(this)
      }
    ];

    this.locationMappingFacade.searchLocations(this.locationFilter);

    this.locationMappingFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: any) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  selectRadioChanged(selectedButton: string) {
    this.searchAppVersionByStatusForm.get('versionNo').setValue('');

    this.getSelectedAppVersionNumbers.emit(selectedButton);
  }

  openLocationPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.searchAppVersionByStatusForm.patchValue({
            location: selectedOption.id
          });
          this.locationCode = [selectedOption.id];
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  clearPopup() {
    this.locationCode = [];
    this.selectedLocation = null;
    this.searchAppVersionByStatusForm.patchValue({
      location: ''
    });
  }

  openConfirmDialogForDelete(componentInstance: any) {
    const alertMsgKey = 'pw.monitoringDashboard.deleteVersionConfirmationMsg';
    this.showAlertMessage(
      MonitoringDashboardEnum.DELETE,
      alertMsgKey,
      componentInstance
    );
  }

  getRequestPayload(): AppVersionByStatusRequestPayload {
    const requestPayload: AppVersionByStatusRequestPayload = {
      location: this.searchAppVersionByStatusForm.get('location').value,
      status: this.searchAppVersionByStatusForm.get('status').value,
      possUiVersion:
        this.searchAppVersionByStatusForm.get('selectRadioButton').value ===
          this.monitoringDashboardEnum.POSS_UI_VERSION &&
        this.searchAppVersionByStatusForm.get('versionNo').value
          ? this.searchAppVersionByStatusForm.get('versionNo').value
          : null,
      possServiceVersion:
        this.searchAppVersionByStatusForm.get('selectRadioButton').value ===
          this.monitoringDashboardEnum.API_VERSION &&
        this.searchAppVersionByStatusForm.get('versionNo').value
          ? this.searchAppVersionByStatusForm.get('versionNo').value
          : null,
      databaseVersion:
        this.searchAppVersionByStatusForm.get('selectRadioButton').value ===
          this.monitoringDashboardEnum.DB_VERSION &&
        this.searchAppVersionByStatusForm.get('versionNo').value
          ? this.searchAppVersionByStatusForm.get('versionNo').value
          : null
    };

    return requestPayload;
  }

  publishAll() {
    const alertMsgKey = 'pw.monitoringDashboard.publishVersionsConfirmationMsg';
    this.showAlertMessage(MonitoringDashboardEnum.PUBLISH, alertMsgKey);
  }

  searchVersionByStatus() {
    if (this.searchAppVersionByStatusForm.valid) {
      const payload = this.getRequestPayload();

      this.searchAppVersionByStatus.emit(payload);
    } else {
      this.searchAppVersionByStatusForm.markAllAsTouched();
    }
  }

  paginate(pageEvent) {
    const payload = this.getRequestPayload();

    const request = {
      pageDetails: pageEvent,
      formData: payload
    };
    this.paginator.emit(request);
  }

  showAlertMessage(type: string, message: string, versionDetails = null) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res && type === MonitoringDashboardEnum.PUBLISH) {
          this.publishAppVersion.emit();
        } else if (
          res &&
          type === MonitoringDashboardEnum.DELETE &&
          !!versionDetails &&
          versionDetails.id
        ) {
          this.deleteAppVersion.emit(versionDetails.id);
        }
      });
  }

  getContext() {
    return {
      componentParent: this.component,
      disableInput: true
    };
  }

  onGridSizeChanged() {
    this.gridApi.sizeColumnsToFit();
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
