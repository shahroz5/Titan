import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

import {
  OverlayNotificationServiceAbstraction,
  WalkInsDetails,
  CustomErrors,
  SaveWalkInDetailsRequestPayload,
  OverlayNotificationType,
  OverlayNotificationEventType,
  LocationSettingAttributesEnum,
  WalkInsCountRequestPayload,
  BankingAndRevenueMenuKeyEnum
} from '@poss-web/shared/models';
import { combineLatest, Observable, Subject } from 'rxjs';
import { WalkInsRecordFacade } from '@poss-web/poss/walk-ins/data-access-walk-ins-record';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { BodEodFacade } from '@poss-web/poss/bod-eod/data-access-bod-eod';
import { getBankingAndRevenueHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'poss-web-walk-ins-record',
  templateUrl: './walk-ins-record.component.html'
})
export class WalkInsRecordComponent implements OnInit, OnDestroy {
  walkInRecordFormGroup: FormGroup;
  noOfDaysForWalkIn = 0;
  numberOfInvoices: number;
  nonPurchasersCount = 0;

  alertMessageOne = '';
  alertMessageTwo = '';
  alertMessageThree = '';
  alertMessageFour = '';
  alertMessageFive = '';

  isWalkInsLoading$: Observable<boolean>;
  isEodProcessLoading$: Observable<boolean>;
  businessDate: number;
  purchasersCount: number;
  selectDateLabel: string;
  walkInsLabel: string;

  destroy$: Subject<null> = new Subject<null>();

  //For ag-grid
  api: GridApi;
  columnApi: ColumnApi;
  domLayout = 'autoHeight';
  animateRows = true;
  rowHeight = 35;
  rowSelection = 'single';
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    flex: 1
  };
  columnDefs = [];
  walkInsRowData = [];
  component: WalkInsRecordComponent = this;

  datesToDisplayForWalkIns = [];

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    public translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private walkInsRecordFacade: WalkInsRecordFacade,
    private bodEodFacade: BodEodFacade,

    private overlayNotification: OverlayNotificationServiceAbstraction,
    private router: Router,
    private locationSettingsFacade: LocationSettingsFacade,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {
    this.translate
      .get(['pw.walkins.selectDate', 'pw.walkins.walkIns'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.selectDateLabel = translatedMsg['pw.walkins.selectDate'];
        this.walkInsLabel = translatedMsg['pw.walkins.walkIns'];
      });

    this.walkInRecordFormGroup = new FormGroup({
      walkIns: new FormControl('', [
        this.fieldValidatorsService.numbersField(this.walkInsLabel),
        this.fieldValidatorsService.requiredField(this.walkInsLabel)
      ]),
      selectDate: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.selectDateLabel)
      ])
    });
  }

  ngOnInit(): void {
    this.bodEodFacade.resetState();

    this.isWalkInsLoading$ = this.walkInsRecordFacade.getIsLoading();
    this.isEodProcessLoading$ = this.bodEodFacade.getIsLoading();

    combineLatest([
      this.bodEodFacade.getBusinessDayDate().pipe(filter(date => !!date)),
      this.locationSettingsFacade
        .getLocationSetting(LocationSettingAttributesEnum.STORE_NO_OF_DAYS)
        .pipe(filter(days => days !== null))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([eodBusinessDate, configuredNoOfdays]) => {
        this.businessDate = eodBusinessDate;

        if (configuredNoOfdays !== '' && configuredNoOfdays !== null) {
          this.noOfDaysForWalkIn = Number(configuredNoOfdays);

          // Constructing dates based on configuration
          for (let i = 0; i <= this.noOfDaysForWalkIn; i++) {
            const date = moment(this.businessDate).subtract(i, 'days');

            const formattedDate = moment(date, this.dateFormat);

            this.datesToDisplayForWalkIns.push(moment(formattedDate));
          }
        }
      });

    this.walkInsRecordFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
    this.bodEodFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
    this.bodEodFacade.loadCurrentDayBodStatus();
    this.getTranslatedAlertMessages();

    this.walkInsRecordFacade
      .getWalksInCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((walkInsCount: number) => {
        this.walkInRecordFormGroup.get('walkIns').setValue(walkInsCount);
      });
    this.walkInsRecordFacade
      .getPurchasersCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((purchasersCount: number) => {
        this.purchasersCount = purchasersCount;

        this.nonPurchasersCount =
          Number(this.walkInRecordFormGroup.get('walkIns').value) -
          this.purchasersCount;
      });
    this.walkInsRecordFacade
      .getNumberOfInvoices()
      .pipe(takeUntil(this.destroy$))
      .subscribe((numberOfInvoices: number) => {
        this.numberOfInvoices = numberOfInvoices;
      });

    this.walkInRecordFormGroup
      .get('selectDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(selectedDate => {
        if (!!selectedDate) {
          const walkInsRequestPayload: WalkInsCountRequestPayload = {
            businessDate: moment(selectedDate).valueOf()
          };

          this.walkInsRecordFacade.loadWalkInDetails(walkInsRequestPayload);
        }
      });

    this.walkInRecordFormGroup
      .get('walkIns')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((walkInsData: number) => {
        this.walkInsRecordFacade.setWalksInCount(walkInsData);

        this.nonPurchasersCount =
          Number(this.walkInRecordFormGroup.get('walkIns').value) -
          this.purchasersCount;
      });

    this.walkInsRecordFacade
      .getSaveWalkInDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((responseData: WalkInsDetails) => {
        if (responseData) {
          this.clearWalkInsRecord();
          this.showNotification('pw.walkins.successMessage', true);
        }
      });

    this.getColumnDefs();
    this.loadWalkInsHistoryDate();
  }

  myFilterFunction = (d: Date | null): boolean => {
    const filteredDatesToDisplay = this.datesToDisplayForWalkIns.filter(
      date => {
        return (
          this.walkInsRowData.filter(data => {
            const convertedDate = moment(data.businessDate);
            return convertedDate.isSame(date);
          }).length === 0
        );
      }
    );

    const result = filteredDatesToDisplay.find(x => {
      if (d !== undefined) {
        return x.isSame(d);
      }
      return false;
    });
    if (!result === true) {
      return false;
    } else {
      return true;
    }
  };

  loadWalkInsHistoryDate() {
    this.walkInsRecordFacade.loadWalkInsHistoryDate();
    this.walkInsRecordFacade
      .getWalkInsHistoryData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(historyData => {
        this.walkInsRowData = [];
        if (!!historyData && historyData.length > 0) {
          historyData.forEach(data => {
            this.walkInsRowData.push({
              businessDate: data.businessDate,
              walkIns: data.walkins,
              noOfInvoices: data.noOfInvoice,
              purchasersCount: data.purchaserCount,
              nonPurchasersCount: data.nonPurchaserCount
            });
          });
        }
      });
  }

  getColumnDefs() {
    const businessDate = 'pw.walkins.businessDate';
    const walkIns = 'pw.walkins.walkIns';
    const noOfInvoices = 'pw.walkins.noOfInvoices';
    const purchasersCount = 'pw.walkins.purchasersCount';
    const nonPurchasersCount = 'pw.walkins.nonPurchasersCount';

    this.translate
      .get([
        businessDate,
        walkIns,
        noOfInvoices,
        purchasersCount,
        nonPurchasersCount
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
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
            headerName: translatedMessages[businessDate],
            field: 'businessDate'
          },
          {
            headerName: translatedMessages[walkIns],
            field: 'walkIns'
          },
          {
            headerName: translatedMessages[noOfInvoices],
            field: 'noOfInvoices'
          },
          {
            headerName: translatedMessages[purchasersCount],
            field: 'purchasersCount'
          },
          {
            headerName: translatedMessages[nonPurchasersCount],
            field: 'nonPurchasersCount'
          }
        ];
      });
  }

  showNotification(key: string, refreshViewGrid: boolean) {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe(event => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              if (refreshViewGrid) {
                this.walkInsRecordFacade.loadWalkInsHistoryDate();
              }
            }
          });
      });
  }

  cancelWalkInsRecord() {
    this.back();
  }

  clearWalkInsRecord() {
    this.walkInsRecordFacade.clearWalkInDetails();
    this.walkInRecordFormGroup.reset();
  }

  saveWalkInDetails() {
    const walkInsCount = Number(
      this.walkInRecordFormGroup.get('walkIns').value
    );
    const selectedDateForWalkIns = Number(
      this.walkInRecordFormGroup.get('selectDate').value
    );
    const nonPurchasersCount = Number(this.nonPurchasersCount);

    if (walkInsCount < this.purchasersCount) {
      this.showNotification(this.alertMessageFive, false);
    } else if (this.purchasersCount > walkInsCount) {
      this.showAlertNotification(this.alertMessageThree);
    } else if (nonPurchasersCount < 0) {
      this.showAlertNotification(this.alertMessageFour);
    } else {
      if (this.walkInRecordFormGroup.valid) {
        const saveWalkInDetailsRequestPayload: SaveWalkInDetailsRequestPayload = {
          businessDate: selectedDateForWalkIns,

          noOfInvoice: this.numberOfInvoices,
          walkins: walkInsCount,
          nonPurchaserCount: nonPurchasersCount,
          purchaserCount: this.purchasersCount
        };

        this.walkInsRecordFacade.saveWalkInDetails(
          saveWalkInDetailsRequestPayload
        );
      } else {
        this.walkInRecordFormGroup.markAllAsTouched();
      }
    }
  }

  getTranslatedAlertMessages() {
    const alertMessage1 =
      'pw.walkins.noOfWalkInsCannotBeLessThanNoOfConversions';
    const alertMessage2 = 'pw.walkins.conversionShouldNotBeGreaterThanInvoices';
    const alertMessage3 = 'pw.walkins.purchasersCannotBeMoreThanWalkIns';
    const alertMessage4 = 'pw.walkins.nonPurchasersCannotBeLessThanZero';
    const alertMessage5 = 'pw.walkins.walkInsCannotbeLessThenPurchasers';
    this.translate
      .get([
        alertMessage1,
        alertMessage2,
        alertMessage3,
        alertMessage4,
        alertMessage5
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.alertMessageOne = translatedMessages[alertMessage1];
        this.alertMessageTwo = translatedMessages[alertMessage2];
        this.alertMessageThree = translatedMessages[alertMessage3];
        this.alertMessageFour = translatedMessages[alertMessage4];
        this.alertMessageFive = translatedMessages[alertMessage5];
      });
  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getContext() {
    return {
      componentParent: this.component,
      disableInput: true
    };
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  back() {
    this.router.navigate([getBankingAndRevenueHomeRouteUrl()], {
      queryParams: {
        menu: BankingAndRevenueMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.walkInRecordFormGroup.reset();
    this.walkInsRecordFacade.resetWalkInDetails();

    this.destroy$.next();
    this.destroy$.complete();
  }
}
