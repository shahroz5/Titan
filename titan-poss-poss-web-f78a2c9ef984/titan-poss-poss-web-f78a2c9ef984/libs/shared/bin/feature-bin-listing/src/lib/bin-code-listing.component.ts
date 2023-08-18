import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  TemplateRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import {
  FormGroup,
  FormControl,
} from '@angular/forms';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { Subject, fromEvent, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

import {
  CustomErrors,
  SaveBinCodeFormPayload,
  BinGroupDetails,
  BinCodeSaveModel,
  LocationMappingPost,
  BinCodesByBinGroup,
  LocationList,
  BinCodeList,
  BinCodeEditModel,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
} from '@poss-web/shared/models';
import { BinFacade } from '@poss-web/shared/bin/data-access-bin';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { BinGroupFacade } from '@poss-web/shared/bin-group/data-access-bin-group';
import { LocationMappingServiceAbstraction } from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { BinCodeDialogComponent } from '@poss-web/shared/bin/ui-bin-popup';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { BinViewComponent } from '@poss-web/shared/bin/ui-bin-view';

@Component({
  selector: 'poss-web-bin-code-listing',
  templateUrl: './bin-code-listing.component.html',
  styleUrls: ['./bin-code-listing.component.scss']
})
export class BinCodeListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject<null>();
  binCodeNewFormDetails: SaveBinCodeFormPayload;
  @Output() binGroupDropdown = new EventEmitter<BinGroupDetails[]>();
  binGroupDropdownPopUp: any;

  binCodeSaveNewResponse$: Observable<SaveBinCodeFormPayload>;
  binCodeEditResponse$: Observable<BinCodeEditModel>;
  binCodeList$: Observable<BinCodeList[]>;
  editClicked = false;
  mode: string;
  binCodeCount$: Observable<number>;
  locationData: BinCodeList;
  rowClicked = false;
  location: Location;
  readOnly: boolean;
  isBinCodeLoading$: Observable<boolean>;
  binCodeEditedFormDetails: BinCodeSaveModel;
  binCodesByBinGroup$: Observable<any>;
  dropdownSelection: string = null;
  binCodes: BinCodesByBinGroup[] = [];
  isToggleChanged: boolean;
  error: CustomErrors;
  search$: void;
  clearClicked: boolean;
  binCodesForLocationMapping: string[] = [];
  locationMappingList$: Observable<LocationList[]>;
  selectedLocations: LocationList[];
  locationMappingSelected: boolean;
  mappingData: LocationMappingPost;
  addedLocation: string[] = [];
  removedLocation: string[] = [];
  searchElement: BinCodesByBinGroup[] = [];
  invalidSearch = false;

  @ViewChild('locationMappingContentTemplate', { static: true })
  locationMappingContentTemplateRef: TemplateRef<any>;

  locationList: { id: string; description: string }[];
  locationMappingResponse$: Observable<LocationMappingPost>;
  isLoading$: Observable<boolean>;
  checked: boolean;
  isSearching$: Observable<boolean>;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  binGroupSelect: any;
  noDataFoundMessage: any;
  binGroup: any;
  selectedBinGroup: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private binFacade: BinFacade,
    private binGroupFacade: BinGroupFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private locationMappingServiceAbstraction: LocationMappingServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.binCodesEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.binCodesEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  binCodePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  binGroupPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  binCode: string = null;

  ngOnInit() {
    this.isToggleChanged = false;

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.isToggleChanged = true;

      this.dropdownSelection = params.binGroup;
      this.binCode = params.binCode;
    });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.binCodePageEvent.pageSize = pageSize;
        // this.loadbinCodeDetails();
      });

    this.binFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.binCodes = [];
          this.error = error;
          this.errorHandler(error);
        }
      });

    this.binGroupFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.error = error;
          this.errorHandler(error);
        }
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.loadInitialBinCodeDetails();
    this.isBinCodeLoading$ = this.binFacade.getBinCodeIsLoading();
    this.isLoading$ = this.binGroupFacade.getisLoading();
    this.isSearching$ = this.binFacade.getIsSerchElements();
    this.binCodesByBinGroup$ = this.binFacade.getBinCodesByBinGroup();
    this.binCodesByBinGroup$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.binCodes = data;
      } else {
        this.isToggleChanged = false;
        this.binCodes = [];
      }
    });
    this.binCodeCount$ = this.binFacade.getTotalBinCodeDetails();
    this.binFacade.resetBinCodeDialogData();
    this.binGroupFacade
      .getBinGroupDetailsListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.length > 0) {
          this.binGroupSelect = [];
          data.forEach(val => {
            const binGroupCode = {};
            binGroupCode['value'] = val.binGroupCode;
            binGroupCode['description'] = val.binGroupCode;
            this.binGroupSelect.push(binGroupCode);
          });
          this.binGroupDropdownPopUp = data;
          if (this.binCode !== undefined) {
            const bincode = {
              binCode: this.binCode,
              description: '',
              isActive: true
            };
            console.log(bincode, 'bincode');

            this.onEdit(bincode);
          }
        }
      });

    this.binCodeSaveNewResponse$ = this.binFacade.getBinCodeNewSaveResponse();
    this.binCodeSaveNewResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const key = 'pw.inventoryConfiguration.successMsgBinCode';
          this.showNotification(key);
          if (this.dropdownSelection) this.loadbinCodeDetails();
        }
      });

    this.binCodeEditResponse$ = this.binFacade.getBinCodeEditSaveResponse();
    this.binCodeEditResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification(
              'pw.inventoryConfiguration.editSuccessMsgBinCode'
            );
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          if (this.isToggleChanged && this.searchForm.value.searchValue) {
            this.search(this.searchForm.value.searchValue);
          } else if (this.isToggleChanged) {
            this.loadbinCodeDetails();
            // this.binFacade.loadBinCodesByBinGroupCode(
            //   this.dropdownSelection
            // );
          }
        }
      });

    this.locationMappingList$ = this.binFacade.getLocationsByBinCodesAndBinGroup();
    this.locationMappingList$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.locationList = data;
      if (this.locationMappingSelected) {
        this.locationMappingServiceAbstraction
          .open({
            selectedLocations: this.locationList,
            template: this.locationMappingContentTemplateRef
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            if (res && res.type === 'apply') {
              this.selectedLocations = res.data.selectedLocations;
              for (const item of res.data.addedLocations) {
                this.addedLocation = Object.assign([], this.addedLocation);
                this.addedLocation.push(item.id);
              }
              for (const item of res.data.removedLocations) {
                this.removedLocation = Object.assign([], this.removedLocation);
                this.removedLocation.push(item.id);
              }

              this.mappingData = {
                addLocations: this.addedLocation,
                binCodes: this.binCodesForLocationMapping,
                removeLocations: this.removedLocation
              };
              const mappingDetails = {
                binGroup: this.dropdownSelection,
                data: this.mappingData
              };
              this.binFacade.saveLocationMappingDetails(mappingDetails);
            }
            this.addedLocation = [];
            this.removedLocation = [];
          });
      }

      // if (this.locationMappingSelected) {
      //   this.locationMappingService
      //     .open({
      //       selectedLocations: this.locationList,
      //       template: this.locationMappingContentTemplateRef
      //     })
      //     .pipe(takeUntil(this.destroy$))
      //     .subscribe((res: LocationMappingServiceResponse) => {
      //       if (res.type === 'apply') {
      //         this.selectedLocations = res.data.selectedLocations;
      //         for (const item of res.data.addedLocations) {
      //           this.addedLocation = Object.assign([], this.addedLocation);
      //           this.addedLocation.push(item.id);
      //         }
      //         for (const item of res.data.removedLocations) {
      //           this.removedLocation = Object.assign([], this.removedLocation);
      //           this.removedLocation.push(item.id);
      //         }

      //         this.mappingData = {
      //           addLocations: this.addedLocation,
      //           binCodes: this.binCodesForLocationMapping,
      //           removeLocations: this.removedLocation
      //         };
      //         const mappingDetails = {
      //           binGroup: this.dropdownSelection,
      //           data: this.mappingData
      //         };
      //         this.binFacade.saveLocationMappingDetails(mappingDetails);
      //       }
      //       this.addedLocation = [];
      //       this.removedLocation = [];
      //     });
      // }
    });

    this.locationMappingResponse$ = this.binFacade.getLocationMappingResponse();
    this.locationMappingResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.binCodesForLocationMapping = null;
          const key = 'pw.inventoryConfiguration.locationMappingMsg';
          this.showNotification(key);
          this.loadbinCodeDetails();
          // this.translate
          //   .get(key)
          //   .pipe(takeUntil(this.destroy$))
          //   .subscribe((translatedMessage: string) => {
          //     // this.binFacade.loadBinCodesByBinGroupCode(this.dropdownSelection);
          //   });
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_INV_029) {
      return;
    }
    if (this.dropdownSelection) {
      this.binCodesByBinGroup$
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (this.isToggleChanged) {
            this.isToggleChanged = false;
            this.loadbinCodeDetails();
            // this.binFacade.loadBinCodesByBinGroupCode(this.dropdownSelection);
          } else if (data !== null) {
            this.binCodes = data;
          } else {
            this.binCodes = [];
          }
        });
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue: string) {
    this.selectedBinGroup = null;
    console.log(this.dropdownSelection, 'this.selectedBinGroup');

    if (fieldValidation.alphaNumericWithSpaceField.pattern.test(searchValue)) {
      this.binFacade.searchBinName({
        binCode: searchValue.toUpperCase(),
        binGroupCode: this.dropdownSelection ? this.dropdownSelection : null
      });
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }

  paginate(pageEvent: PageEvent) {
    this.binCodePageEvent = pageEvent;
    this.loadbinCodeDetails();
    // this.binFacade.loadBinCodeDetailsListing(this.binCodePageEvent);
  }

  selectedDropdown(event: any) {
    this.binFacade.resetBinCodeDialogData();
    this.locationMappingSelected = false;
    this.binCodesForLocationMapping = [];
    this.searchForm.reset();
    this.dropdownSelection = event.value;
    this.searchElement = null;
    this.binCodes = [];
    if (event.value) {
      // this.binFacade.loadBinCodesByBinGroupCode(event.value);
      this.binFacade.loadBinCodesByBinGroupCode({
        binGroupCode: event.value,
        pageIndex: this.binCodePageEvent.pageIndex,
        pageSize: this.binCodePageEvent.pageSize
      });
    }
  }

  loadInitialBinCodeDetails() {
    this.binGroupFacade.loadBinGroupDetailsListing(this.binGroupPageEvent);
  }
  loadbinCodeDetails() {
    this.binFacade.loadBinCodesByBinGroupCode({
      binGroupCode: this.dropdownSelection,
      pageIndex: this.binCodePageEvent.pageIndex,
      pageSize: this.binCodePageEvent.pageSize
    });
  }

  addNew() {
    this.mode = 'new';
    if (this.binGroupDropdownPopUp && this.mode === 'new') {
      const dialogRef = this.dialog.open(BinCodeDialogComponent, {
        width: '500px',
        height: 'auto',
        data: { editData: null, dropDown: this.binGroupDropdownPopUp },
        disableClose: true
      });
      if (this.mode === 'new') {
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(formdata => {
            if (formdata) {
              this.binCodeNewFormDetails = {
                binCode: formdata.binCode,
                binGroups: [formdata.binGroupCode],
                description: formdata.description
              };
              this.binFacade.saveBinCodeNewFormDetails(
                this.binCodeNewFormDetails
              );
              this.mode = '';
            }
          });
      }
    }
  }

  // editDropdownSelection(selectedDropdown: string) {
  //   this.binFacade.loadBinCodesByBinGroupCode({
  //     binGroupCode: selectedDropdown,
  //     pageIndex: this.binCodePageEvent.pageIndex,
  //     pageSize: this.binCodePageEvent.pageSize
  //   });
  // }

  viewMode: boolean;
  onView(binCode) {
    this.viewMode = true;
    const dialogRef = this.dialog.open(BinViewComponent, {
      width: '500px',
      height: 'auto',
      data: {
        dropDown: this.binGroupDropdownPopUp,
        editData: binCode,
        binGroup: this.dropdownSelection
      },
      disableClose: true
    });
  }

  onEdit(binCode) {
    this.viewMode = false;
    const dialogRef = this.dialog.open(BinCodeDialogComponent, {
      width: '500px',
      height: 'auto',
      data: {
        dropDown: this.binGroupDropdownPopUp,
        editData: binCode,
        binGroup: this.dropdownSelection
      },
      disableClose: true
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(formdata => {
        if (formdata) {
          if (this.binCode !== undefined) {
            this.mode = 'new';
            this.binCodeNewFormDetails = {
              binCode: this.binCode,
              binGroups: [this.dropdownSelection],
              description: formdata.description
            };
            this.binFacade.saveBinCodeNewFormDetails(
              this.binCodeNewFormDetails
            );
          } else {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  console.log(formdata, 'formdata');

                  this.binFacade.saveBinCodeEditedFormDetails(formdata);
                }
              });
          }
          if (this.mode === 'new') {
            this.dropdownSelection = undefined;
            this.mode = '';
          }
        }
      });
  }

  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  onToggleChange(event, selectedBinCode) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.checked
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.isToggleChanged = true;
          const toggleData = {
            binGroups: null,
            binCode: selectedBinCode.binCode,
            binGroupCode: this.dropdownSelection,
            isActive: event.checked,
            description: selectedBinCode.description
          };
          this.binFacade.saveBinCodeEditedFormDetails(toggleData);
        } else if (this.searchForm.value.searchValue) {
          this.search(this.searchForm.value.searchValue);
        } else {
          this.loadbinCodeDetails();
          // this.binFacade.loadBinCodesByBinGroupCode(this.dropdownSelection);
        }
      });
  }

  onCheckbox(event, selectedBinCode: BinCodeSaveModel) {
    if (event === true) {
      this.binCodesForLocationMapping = Object.assign(
        [],
        this.binCodesForLocationMapping
      );
      this.binCodesForLocationMapping.push(selectedBinCode.binCode);
    } else {
      this.binCodesForLocationMapping = this.binCodesForLocationMapping.filter(
        removeBinCode => removeBinCode !== selectedBinCode.binCode
      );
    }
  }

  onLocationMapping() {
    const payload = {
      binGroup: this.dropdownSelection,
      binCodes: this.binCodesForLocationMapping
    };
    this.locationMappingSelected = true;
    if (this.binCodesForLocationMapping !== null) {
      if (this.binCodesForLocationMapping.length > 0) {
        this.binFacade.loadLocationsByBinCodesAndBinGroup(payload);
      } else {
        this.showNotification(
          'pw.inventoryConfiguration.locationMappingErrorMsg'
        );
      }
    } else {
      this.showNotification(
        'pw.inventoryConfiguration.locationMappingErrorMsg'
      );
    }
  }

  // showTimerNotification(translatedMessage: string) {
  //   this.overlayNotification.show({
  //     type: OverlayNotificationType.TIMER,
  //     message: translatedMessage,
  //     hasBackdrop: true
  //   });
  // }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  clearSearch() {
    this.binFacade.resetBinCodeDialogData();
    this.invalidSearch = false;
    this.searchForm.reset();
    if (this.dropdownSelection) {
      this.loadbinCodeDetails();
      // this.binFacade.loadBinCodesByBinGroupCode(this.dropdownSelection);
    }
  }

  backArrow() {
    this.selectedBinGroup = null;
    this.searchForm.reset();
    this.binGroupFacade.resetBinGroupDialogData();
    this.binFacade.resetBinCodeDialogData();
    this.ngOnDestroy();
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.INVENTORY_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
