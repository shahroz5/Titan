import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { takeUntil } from 'rxjs/operators';
import { OtherReceiptsIssuesEnum, ItemData, ImageEvent } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-history-item',
  templateUrl: './history-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryItemComponent implements OnInit, OnDestroy {
  @Input() item: any;
  @Input() tabType: OtherReceiptsIssuesEnum;
  @Input() type: string;
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  itemData: ItemData;
  status: string;
  statusColor: string;
  destroy$: Subject<null> = new Subject<null>();
  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.itemData = {
      itemCode: this.item.itemCode,
      lotNumber: this.item.lotNumber,
      productGroup: this.item.productGroupDesc,
      productCategory: this.item.productCategoryDesc,
      stdValue: this.item.stdValue,
      stdWeight: this.item.stdWeight,
      currencyCode: this.item.currencyCode,
      weightUnit: this.item.weightUnit,
      imageURL: this.item.imageURL,
      thumbnailURL: this.item.thumbnailImageURL,
      mfgDate: this.item.mfgDate,
      orderType: null,
      isStudded: this.item.isStudded,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage,
      isHallmarked:this.item.isHallmarked,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.itemData = {
        ...this.itemData,
        imageURL: this.item.imageURL,
        thumbnailURL: this.item.thumbnailImageURL,
        isLoadingImage: this.item.isLoadingImage,
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
      };
    }
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status?: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }
  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id,
      imageUrl: this.item.imageURL
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
