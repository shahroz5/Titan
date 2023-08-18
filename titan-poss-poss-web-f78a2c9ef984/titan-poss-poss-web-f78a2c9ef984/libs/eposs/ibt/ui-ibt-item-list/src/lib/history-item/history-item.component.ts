import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import {
  InterBoutiqueTransferRequestTypesEnum,
  InterBoutiqueTransferStatusTypesEnum,
  ItemList,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-history-item',
  templateUrl: './history-item.component.html'
})
export class HistoryItemComponent implements OnInit, OnDestroy {
  @Input() item: ItemList;
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  itemData: ItemData;

  interBoutiqueTransferRequestTypesEnumRef = InterBoutiqueTransferRequestTypesEnum;
  interBoutiqueTransferStatusTypesEnumRef = InterBoutiqueTransferStatusTypesEnum;

  itemForm: FormGroup;
  weightToDisplay: string;
  quantityToDisplay: number;
  requestId: number;
  requestType: string;
  disabled: boolean;
  status: string;
  statusColor: string;

  destroy$: Subject<null> = new Subject<null>();
  reqBtqType: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {}

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
      isStudded: this.item.isStudded,
      isHallmarked:
        this.item?.itemDetails?.data?.isHallMarking === 'true' ||
        this.item?.itemDetails?.data?.isHallMarking === true
          ? true
          : false,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
    };
    this.requestId = this.activatedRoute.snapshot.params['requestId'];
    this.reqBtqType = this.activatedRoute.snapshot.params['actionType'];
    this.weightToDisplay = this.item.stdWeight.toFixed(3);
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
  
  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id,
      imageUrl: this.item.imageURL
    });
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status: string) {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
