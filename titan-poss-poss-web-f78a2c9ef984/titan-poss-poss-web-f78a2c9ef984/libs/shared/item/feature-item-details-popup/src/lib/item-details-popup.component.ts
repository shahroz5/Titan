import { ErrorEnums } from '@poss-web/shared/util-error';
import { ItemDetailsPopupFacade } from '@poss-web/shared/item/data-access-item-details-popup';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ItemStoneDetails,
  ItemDetailsPopupData,
  ItemDetailsPopupTabType
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-item-details-popup',
  templateUrl: './item-details-popup.component.html',
  styleUrls: ['./item-details-popup.component.scss']
})
export class ItemDetailsPopupComponent implements OnInit, OnDestroy {
  stoneDetails$: Observable<ItemStoneDetails[]>;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject();
  showStoneDetailsError = false;
  showPriceDetails = false;
  showStoneDetails = false;
  stoneWeightUnit: string;
  pcDesc$: Observable<{}>;
  pgDesc$: Observable<{}>;
  prodCategoryDesc: string;
  prodGroupDesc: string;
  noDataFoundMessageStones;
  isCOMOrder = false;

  constructor(
    public dialogRef: MatDialogRef<ItemDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ItemDetailsPopupData,
    private itemDetailsFacade: ItemDetailsPopupFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService
  ) {
    this.showStoneDetails = this.data.tabs.includes(
      ItemDetailsPopupTabType.STONE_DETAILS
    );
    this.showPriceDetails = this.data.tabs.includes(
      ItemDetailsPopupTabType.PRICE_DETAILS
    );
    this.translate
      .get(['pw.entity.stoneEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.stoneEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageStones =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.isCOMOrder =
      this.data.headerDetails?.isCOMOrder === true ? true : false;
    if (this.showStoneDetails) {
      this.itemDetailsFacade.clear();
      this.isLoading$ = this.itemDetailsFacade.getIsLoading();
      this.stoneDetails$ = this.isCOMOrder
        ? this.itemDetailsFacade.getCOStoneDetails()
        : this.itemDetailsFacade.getStoneDetails();

      this.stoneDetails$.pipe(takeUntil(this.destroy$)).subscribe(stones => {
        if (stones.length !== 0) {
          this.stoneWeightUnit = stones[0].weightUnit;
        }
      });

      if (
        this.data.headerDetails.grossWeight &&
        this.data.headerDetails.calculateNetWight
      ) {
        this.stoneDetails$.pipe(takeUntil(this.destroy$)).subscribe(stones => {
          if (stones.length !== 0) {
            this.data.headerDetails.netWeight =
              this.data.headerDetails.grossWeight -
              stones
                // Converting to gms
                .map(s => s.stoneWeight * 0.2)
                .reduce((s1, s2) => s1 + s2, 0);
          } else {
            this.data.headerDetails.netWeight = 0;
          }
        });
      }

      if (this.isCOMOrder) {
        this.itemDetailsFacade.loadCOStoneDetails({
          itemCode: this.data.headerDetails.itemCode
        });
      } else {
        this.itemDetailsFacade.loadStoneDetails({
          itemCode: this.data.headerDetails.itemCode,
          lotNumber: this.data.headerDetails.lotNumber,
          locationCode: this.data.headerDetails.locationCode
        });
      }

      this.itemDetailsFacade
        .getError()
        .pipe(takeUntil(this.destroy$))
        .subscribe((error: CustomErrors) => {
          if (error) {
            this.errorHandler(error);
          }
        });
    }

    if (this.data.headerDetails.getDescription !== false) {
      this.itemDetailsFacade
        .getIsDescLoaded()
        .pipe(takeUntil(this.destroy$))
        .subscribe(desc => {
          if (!desc) {
            this.itemDetailsFacade.loadPcDesc();
            this.itemDetailsFacade.loadPgDesc();
          }
        });

      this.pcDesc$ = this.itemDetailsFacade.getPcDesc();
      this.pgDesc$ = this.itemDetailsFacade.getPgDesc();

      this.pcDesc$.pipe(takeUntil(this.destroy$)).subscribe(pc => {
        if (this.data.headerDetails.productCategory) {
          if (pc !== null) {
            this.prodCategoryDesc =
              pc[`${this.data.headerDetails.productCategory}`];
          } else {
            this.prodCategoryDesc = this.data.headerDetails.productCategory;
          }
        }
      });

      this.pgDesc$.pipe(takeUntil(this.destroy$)).subscribe(pg => {
        if (this.data.headerDetails.productGroup) {
          if (pg !== null) {
            this.prodGroupDesc = pg[`${this.data.headerDetails.productGroup}`];
          } else {
            this.prodGroupDesc = this.data.headerDetails.productGroup;
          }
        }
      });
    } else {
      this.prodCategoryDesc = this.data.headerDetails.productCategory;
      this.prodGroupDesc = this.data.headerDetails.productGroup;
    }
  }

  close() {
    this.dialogRef.close();
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_PRO_027) {
      this.showStoneDetailsError = true;
    } else {
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
