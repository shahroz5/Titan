import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  ItemDetailPopupserviceAbstraction,
  ItemDetailsPopupTabType,
  ItemOrderTypeEnum,
  ItemData,
  OtherReceiptsIssuesEnum
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsComponent implements OnInit {
  @Input() item: ItemData;
  @Input() type: string;
  @Input() hidePrice = false;
  @Input() hideWeight = false;
  @Input() locationCode = null;
  @Input() hideLotNumber = false;
  @Input() showHallmarkDetails = false;
  // todo: temp property added, to be deleted after implementing image changes in all modules
  @Input() toLoadImageUrlFromAPI = false;

  @Output() loadImageEvent = new EventEmitter<null>();

  matBadgeColor: string;
  otherIssuesTabEnumRef = OtherReceiptsIssuesEnum;

  constructor(
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction
  ) {}

  ngOnInit() {
    if (this.item.orderType) {
      switch (this.item.orderType.toUpperCase()) {
        case ItemOrderTypeEnum.PRIORITY:
          this.matBadgeColor = 'warn';
          break;
        case ItemOrderTypeEnum.REGUALR:
          this.matBadgeColor = 'primary';
          break;
        case ItemOrderTypeEnum.SPARE:
          this.matBadgeColor = 'accent';
          break;
      }
    }
  }

  openItemDetails() {
    this.itemDetailPopupservice.open({
      tabs: [ItemDetailsPopupTabType.STONE_DETAILS],
      currencyCode: this.item.currencyCode,
      weightUnit: this.item.weightUnit,
      headerDetails: {
        showTitle: true,
        itemCode: this.item.itemCode,
        lotNumber: this.item.lotNumber,
        productCategory: this.item.productCategory,
        productGroup: this.item.productGroup,
        grossWeight: this.item.stdWeight,
        calculateNetWight: true,
        getDescription: false,
        locationCode: this.locationCode
      }
    });
  }

  loadImage() {
    this.loadImageEvent.emit();
  }

  getTaxObjectLength(taxDetails) {
    if (typeof taxDetails === 'object') {
      if (Object.keys(taxDetails).length === 0) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
}
