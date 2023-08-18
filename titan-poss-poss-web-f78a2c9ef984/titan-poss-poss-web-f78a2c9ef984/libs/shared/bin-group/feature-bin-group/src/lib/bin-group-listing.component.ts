import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';

import {
  AlertPopupServiceAbstraction,
  BinGroupDetails,
  BinGroupEnum,
  AlertPopupTypeEnum,
  MasterMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { BinGroupFacade } from '@poss-web/shared/bin-group/data-access-bin-group';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { BinGroupDetailsComponent } from '@poss-web/shared/bin-group/ui-bin-group-detail';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BinGroupViewComponent } from '@poss-web/shared/bin-group/ui-bin-group-view';
@Component({
  selector: 'poss-web-bin-group-listing',
  templateUrl: './bin-group-listing.component.html',
  styleUrls: ['./bin-group-listing.component.scss']
})
export class BinGroupListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  binGroupListing$: Observable<BinGroupDetails[]>;
  binGroupCount$: Observable<number>;
  destroy$ = new Subject<null>();
  binGroupDetailsForm: FormGroup;
  groupBinDetailsByCode$: BinGroupDetails;
  dialogData: BinGroupDetails;
  binGroupCode: string;
  isLoading$: Observable<boolean>;
  binGroupSaveResponse$: Observable<BinGroupDetails>;
  binGroupEditResponse$: Observable<BinGroupDetails>;
  searchElement$: Observable<BinGroupDetails[]>;
  hasSearchedBinGroup$: Observable<BinGroupDetails[]>;
  isSearching$: Observable<boolean>;
  error: CustomErrors;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  invalidSearch = false;
  noDataFoundMessage: any;
  viewMode: boolean;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private binGroupFacade: BinGroupFacade,
    private appSettingFacade: AppsettingFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.binGroupsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.binGroupsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

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

  ngOnInit() {
    this.binGroupFacade.resetBinGroupDialogData();
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
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.binGroupPageEvent.pageSize = pageSize;
        this.loadbinGroupDetails();
      });
    this.isLoading$ = this.binGroupFacade.getisLoading();
    this.isSearching$ = this.binGroupFacade.getIsSerchElements();
    this.binGroupListing$ = this.binGroupFacade.getBinGroupDetailsListing();
    this.binGroupCount$ = this.binGroupFacade.getTotalBinGroupDetails();
    this.binGroupFacade
      .getBinGroupDetailsByBinGroupCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.viewMode) {
            const dialogRef = this.dialog.open(BinGroupViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
          } else {
            this.groupBinDetailsByCode$ = data;
            const dialogRef = this.dialog.open(BinGroupDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: this.groupBinDetailsByCode$,
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(formData => {
              if (formData) {
                this.alertPopupService
                  .open({
                    type: AlertPopupTypeEnum.CONFIRM,
                    message: 'pw.alertPopup.saveConfirmation'
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((res: boolean) => {
                    if (res) {
                      this.createBinGroupFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
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

    this.isLoading$ = this.binGroupFacade.getisLoading();

    this.binGroupSaveResponse$ = this.binGroupFacade.getBinGroupSaveResponse();
    this.binGroupSaveResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const key = 'pw.inventoryConfiguration.successMsg';
          this.translate
            .get(key)
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.overlayNotification.show({
                type: OverlayNotificationType.TIMER,
                message: translatedMessage,
                hasClose: true,
                hasBackdrop: true
              });
              this.loadbinGroupDetails();
            });
        }
      });

    this.binGroupEditResponse$ = this.binGroupFacade.getBinGroupEditResponse();
    this.binGroupEditResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const key = 'pw.inventoryConfiguration.editSuccessMsg';
          this.translate
            .get(key)
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.overlayNotification.show({
                type: OverlayNotificationType.TIMER,
                message: translatedMessage,
                hasBackdrop: true
              });
              if (this.searchForm.value.searchValue) {
                this.search(this.searchForm.value.searchValue);
              } else {
                this.loadbinGroupDetails();
              }
            });
        }
      });
  }

  loadbinGroupDetails() {
    this.binGroupFacade.loadBinGroupDetailsListing(this.binGroupPageEvent);
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
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
    if (fieldValidation.alphabetWithSpaceField.pattern.test(searchValue)) {
      this.binGroupFacade.searchBinGroup(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }

  paginate(pageEvent: PageEvent) {
    this.binGroupPageEvent = pageEvent;
    this.loadbinGroupDetails();
  }

  getBinGroupNameView(binGroupCode: string) {
    this.viewMode = true;
    this.binGroupFacade.loadBinGroupDetailsByBinGroupCode(binGroupCode);
  }

  getBinGroupName(binGroupCode: string) {
    this.viewMode = false;
    if (binGroupCode !== BinGroupEnum.NEW) {
      this.binGroupFacade.loadBinGroupDetailsByBinGroupCode(binGroupCode);
    } else if (binGroupCode === BinGroupEnum.NEW) {
      const newFormData: BinGroupDetails = {
        binGroupCode: BinGroupEnum.NEW,
        description: '',
        isActive: true
      };
      const dialogRef = this.dialog.open(BinGroupDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: newFormData,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.createBinGroupFormDetails(data);
        }
      });
    }
  }

  createBinGroupFormDetails(data: any) {
    if (data.mode === BinGroupEnum.new) {
      this.binGroupFacade.saveBinGroupFormDetails({
        binGroupCode: data.binGroupCode,
        description: data.description,
        isActive: data.isActive
      });
    } else if (data.mode === BinGroupEnum.edit) {
      this.binGroupFacade.editBinGroupFormDetails({
        binGroupCode: data.binGroupCode,
        description: data.description,
        isActive: data.isActive
      });
    }
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_INV_038) {
      return;
    } else {
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
  }

  backArrow() {
    this.searchForm.reset();
    this.binGroupFacade.resetBinGroupDialogData();
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
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadbinGroupDetails();
  }
}
