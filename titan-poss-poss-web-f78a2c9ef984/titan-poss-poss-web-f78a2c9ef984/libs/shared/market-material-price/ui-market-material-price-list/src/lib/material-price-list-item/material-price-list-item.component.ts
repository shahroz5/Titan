import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { MaterialPriceList } from '@poss-web/shared/models';
import * as moment from 'moment';
@Component({
  selector: 'poss-web-material-price-list-item',
  templateUrl: './material-price-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialPriceListItemComponent implements OnInit {
  @Input() materialPriceItem: MaterialPriceList;
  @Output() itemDetails = new EventEmitter<{ id: number; priceType: string }>();
  priceType: string;


  view(id: any) {
    this.itemDetails.emit({ id: id, priceType: this.priceType });
  }
  ngOnInit() {
    this.priceType =
      this.materialPriceItem.priceType === 'D' ? 'Daily' : 'Forced';
  }
}
