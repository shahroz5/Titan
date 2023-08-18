import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  StoreBin,
  BinToBinTransferItem,
  BinToBinTransferTypeEnum,
  ImageEvent,
  SelectDropDownOption
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-bin-to-bin-transfer-item-list',
  templateUrl: './bin-to-bin-transfer-item-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BinToBinTransferItemListComponent {
  @Input() isHistory = false;
  @Input() itemList: BinToBinTransferItem[] = [];
  @Input() canSelect = false;
  @Input() canDelete = false;
  @Input() isSelectAll = false;
  @Input() showSourceBin = false;
  @Input() showDestinationBin = false;
  @Input() count = 0;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @Input() selectedBin: string;

  @Input() bins: StoreBin[] = [];
  @Input() pageSizeOptions: number[] = [];
  @Input() defectTypeDescriptionList: SelectDropDownOption[];
  @Input() defectCodeDescriptionList: SelectDropDownOption[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() delete = new EventEmitter<string>();
  @Output() updateItem = new EventEmitter<BinToBinTransferItem>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();


  binToBinTransferTypeEnumRef = BinToBinTransferTypeEnum;
  minPageSize = 0;

  getMinPageSize = () =>
    this.pageSizeOptions.reduce(
      (a: number, b: number) => (a < b ? a : b),
      Number.MAX_SAFE_INTEGER
    );

  trackBy(_: number, item: BinToBinTransferItem) {
    return item.id;
  }

  paginate(event: PageEvent) {
    this.paginator.emit(event);
  }

  checkSameBinError(item: BinToBinTransferItem) {
    return item.isSelected && item.binCode === item.destinationBinCode;
  }

  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }
}
