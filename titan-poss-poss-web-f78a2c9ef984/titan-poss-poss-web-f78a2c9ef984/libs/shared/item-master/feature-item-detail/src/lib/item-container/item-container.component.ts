import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ItemStones,
  OverlayNotificationType,
  OverlayNotificationEventType,
  ItemDetails
} from '@poss-web/shared/models';

import {
  getProductMasterItemRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ItemFacade } from '@poss-web/shared/item-master/data-access-item-master';

@Component({
  selector: 'poss-web-item-container',
  templateUrl: './item-container.component.html'
})
export class ItemContainerComponent implements OnInit, OnDestroy {
  @Input() itemDetailsByCode$: ItemDetails;
  // itemByItemCode$: Observable<ItemDetails>;
  itemByItemCode$: Observable<any>;

  stoneData$: Observable<ItemStones[]>;
  destroy$: Subject<null> = new Subject<null>();
  isSaving$: boolean;
  hasError$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  itemDetailsUrl: string;
  itemCode: string;
  constructor(
    private itemFacade: ItemFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const fromPath = this.route.pathFromRoot[2];
    this.itemCode = decodeURIComponent(fromPath.snapshot.params['_itemCode']);
    this.itemByItemCode$ = this.itemFacade.getitemDetailsByitemCode();
    this.stoneData$ = this.itemFacade.getItemStones();

    // this.itemDetailsUrl = getItemDetailsRouteUrl(this.itemCode);
    this.itemFacade.loadItemDetailsByitemCode(this.itemCode);
    this.itemFacade.loadItemStones(this.itemCode);

    this.isLoading$ = this.itemFacade.getisLoading();
    this.itemFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            // this.itemFacade.resetItemDetailsByitemCode();
            this.router.navigate([getProductMasterItemRouteUrl()]);
            this.overlayNotification.close();
          });
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.itemFacade.resetItemDetailsByitemCode();
  }
}
