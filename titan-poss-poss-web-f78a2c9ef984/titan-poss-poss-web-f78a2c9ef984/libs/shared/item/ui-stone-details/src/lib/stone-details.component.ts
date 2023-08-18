import { ItemStoneDetails } from '@poss-web/shared/models';
import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'poss-web-stone-details',
  templateUrl: './stone-details.component.html',
  styleUrls: ['./stone-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoneDetailsComponent {
  @Input() stoneDetails: ItemStoneDetails[];
  @Input() currencyCode: string;
  @Input() weightUnit: string;
  stoneDetailsColumns: string[] = [
    'stoneCode',
    'description',
    'quality',
    'color',
    'noOfStones',
    'ratePerCarat',
    'stoneWeight',
    'price'
  ];



  getTotalPrice(): number {
    return this.stoneDetails
      .map(stone => stone.price)
      .reduce((price1, price2) => price1 + price2, 0);
  }

  getTotalWeight(): number {
    return this.stoneDetails
      .map(stone => stone.stoneWeight)
      .reduce((weight1, weight2) => weight1 + weight2, 0);
  }

  getTotalQuantity(): number {
    return this.stoneDetails
      .map(stone => stone.noOfStones)
      .reduce((qty1, qty2) => qty1 + qty2, 0);
  }
}
