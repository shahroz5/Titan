import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { InStockFacade } from '@poss-web/eposs/new-bin-request/data-access-bin-request';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  BinCodes,
  BinRequestDto,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  Command,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { BinRequestPopupComponent } from '@poss-web/eposs/new-bin-request/ui-bin-request-bin-list';

import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
const binRequestShortcutKey = 'InstockHomeComponent.PRIMARY_DROPDOWN';
@Component({
  selector: 'poss-web-new-bin-request',
  templateUrl: './new-bin-request.component.html',
  styleUrls: ['./new-bin-request.component.scss']
})
export class NewBinRequestComponent implements OnInit, OnDestroy {
  @ViewChild('searchBox')
  searchBox: ElementRef;

  searchForm = new FormControl();

  data$: Observable<any>;

  storeType$: Observable<boolean>;

  defaultInStockPath = '';
  defaultIBTPath = 'SENT';

  defaultOtherReceiptIssuePath = 'Exhibition';
  defaultConversionPath = 'search';
  defaultInStockConversionPath;
  show = false;
  isLoading: boolean;
  binCodesFirstLoad = true;
  mobileQuery: MediaQueryList;
  pageSize: number;
  binCodes: BinCodes[] = [];
  filteredBinCodes: BinCodes[] = [];

  user$: Observable<boolean>;
  hasNotification: boolean;
  destroy$: Subject<null> = new Subject<null>();
  permissions$: Observable<any[]>;
  BIN_LISTING_DRAWER = 'Inventory Instock Home - Bin Listing';

  hasSearchRegistered = false;
  key: any;
  constructor(
    private inStockFacade: InStockFacade,
    media: MediaMatcher,
    public dialog: MatDialog,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private permissionService: PermissionService,
    private elementPermission: ElementPermissionService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 991px)');
    this.translate
      .get(['pw.instock.successPopup2'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.key = translatedMessages['pw.instock.successPopup2'];
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.elementPermission
      .loadPermission(this.BIN_LISTING_DRAWER, this.permissions$)
      .pipe(take(1))
      .subscribe(val1 => {
        console.log('aba', val1);

        const availableTransactionCodes = val1.transactionCodes;
        const hasRequestPermission = availableTransactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.loadBinCodes();
        }
      });
    this.inStockFacade
      .getRequestBin()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.binRequestSuccessPopup(data);
        }
      });

    this.inStockFacade
      .getBinCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.binCodes = data;
          this.filteredBinCodes = this.binCodes;
        }
      });

    this.inStockFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });

    this.user$ = this.profiledatafacade.isBTQUser();

    this.inStockFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  searchInput() {
    if (!this.hasSearchRegistered) {
      fromEvent(this.searchBox.nativeElement, 'input')
        .pipe(debounceTime(1000), takeUntil(this.destroy$))
        .subscribe(() => {
          const searchValue = this.searchForm.value;
          if (searchValue !== '') {
            this.filteredBinCodes = this.binCodes.filter(option =>
              option.binCode
                ?.toLowerCase()
                ?.includes(searchValue?.toLowerCase())
            );
          } else {
            this.clearSearch();
          }
        });

      this.hasSearchRegistered = true;
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.filteredBinCodes = this.binCodes;
  }

  loadPermission = (element: string) => {
    this.elementPermission.loadPermission(element, this.permissions$);
  };

  loadBinCodes() {
    if (!this.isLoading) {
      this.inStockFacade.loadBinCodes();
      this.binCodesFirstLoad = false;
    }
  }

  binRequestPopup(): void {
    const dialogRef = this.dialog.open(BinRequestPopupComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.postNewBinRequest(result);
        }
      });
  }

  postNewBinRequest(binRequest: BinRequestDto) {
    this.inStockFacade.requestedBin(binRequest);
  }

  binRequestSuccessPopup(data): void {
    this.alertPopupService

      .open({
        type: AlertPopupTypeEnum.INFO,

        message: this.key + data.reqDocNo
      })

      .pipe(takeUntil(this.destroy$))

      .subscribe((res: boolean) => {
        if (res) {
          this.inStockFacade.resetDocNo();
        }
      });
  }

  shortcutEventHandler(command: Command) {
    if (command.name === binRequestShortcutKey) {
      this.binRequestPopup();
    }
  }

  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
