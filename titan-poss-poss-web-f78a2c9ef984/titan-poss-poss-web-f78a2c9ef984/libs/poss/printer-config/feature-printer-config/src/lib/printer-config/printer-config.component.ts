import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrinterConfigurationFacade } from '@poss-web/poss/printer-config/data-access-printer-config';
import { AddPrinterPopupComponent } from '@poss-web/poss/printer-config/ui-printer-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CustomErrors, LocationSettingAttributesEnum, Lov, OverlayNotificationEventRef, OverlayNotificationServiceAbstraction, OverlayNotificationType, PrinterConfigDetails, SelectDropDownOption, SortItem } from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-printer-config',
  templateUrl: './printer-config.component.html',
  styleUrls: []
})
export class PrinterConfigComponent implements OnInit, OnDestroy {
  formData: FormData = new FormData();
  destroy$: Subject<null> = new Subject<null>();

  printerConfigPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  printerList$: Observable<PrinterConfigDetails[]>;
  totalElements$: Observable<number>;
  isLoading$: Observable<boolean>;
  count = 0;
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Desc' };
  PrintErrorText = '';

  context = this;
  printerNames: SelectDropDownOption[] = [];

  length = 0;
  PrinterList: PrinterConfigDetails[] = [];
  docTypeList: SelectDropDownOption[] = [];

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number;
  // MatPaginator Output
  pageEvent: PageEvent;
  isSearching = false;
  hostName = '';
  locationCode = '';
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private printerConfigurationFacade: PrinterConfigurationFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,

    private locationSettingsFacade: LocationSettingsFacade
  ) {
    this.translate
      .get(['pw.printerConfiguration.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.printerConfiguration.printError'];
      });
  }

  ngOnInit() {
    this.printerConfigurationFacade.loadDocType();

    this.printerConfigurationFacade
      .GetPrinterNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.printerNames = data.map(value => ({
          value: value,
          description: value
        }));
      });

    this.appSettingFacade
      .getHostName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.hostName = data;
      });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.printerConfigPageEvent.pageSize = data;
        this.pageSize = data;
        this.loadConfiguration(this.defaultSort);
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.componentInit();
  }

  componentInit() {
    this.printerList$ = this.printerConfigurationFacade.GetPrinterList();
    this.isLoading$ = this.printerConfigurationFacade.getIsLoading();
    this.printerConfigurationFacade.loadPrinterNameList();
    this.totalElements$ = this.printerConfigurationFacade.getTotalElements();
    this.printerConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data) {
          this.locationCode = data;
        }
      });

    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data) {
          this.count = data;
        }
      });

    this.printerList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PrinterConfigDetails[]) => {
        this.PrinterList = data;

        this.length = data.length;
      });

    this.printerConfigurationFacade
      .getDocTypeResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Lov[]) => {
        this.docTypeList = data
          .filter(value => value.isActive === true)
          .map((res: Lov) => ({
            value: res.code,
            description: res.code
          }));
      });
  }

  back() {
    this.router.navigate([`configuration/home`]);
  }
  sort(sortItem: SortItem) {
    if (sortItem) {
      this.defaultSort = sortItem;
    } else {
      this.defaultSort = { colId: 'createdDate', sort: 'Desc' };
    }
    this.loadConfiguration(this.defaultSort);
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        // Action based event
      });
  }

  ngOnDestroy(): void {
    this.printerConfigurationFacade.clearResponse();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConfiguration(sortField?: SortItem) {
    this.printerConfigurationFacade.loadPrinterList(
      this.printerConfigPageEvent,
      sortField
    );
  }

  paginate(pageEvent: PageEvent) {
    this.printerConfigPageEvent = pageEvent;
    this.loadConfiguration(this.defaultSort);
  }

  openAddPrinter() {
    this.dialog
      .open(AddPrinterPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          hostName: this.hostName,
          locationCode: this.locationCode,
          docType: this.docTypeList,
          //this.docTypeList,
          printerName: this.printerNames
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PrinterConfigDetails) => {
        if (res) {
          this.printerConfigurationFacade.addPrinter(res);
        }
      });
  }

  delete(printer) {
    if (printer) {
      this.printerConfigurationFacade.deletePrinter(printer);
    }
  }
}
