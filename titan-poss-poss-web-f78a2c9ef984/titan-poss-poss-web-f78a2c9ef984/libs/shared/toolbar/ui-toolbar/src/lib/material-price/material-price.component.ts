import {
  Component,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { MetalPrice, MetalTypeEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-material-price',
  templateUrl: './material-price.component.html',
  styleUrls: ['./material-price.component.scss']
})
export class MaterialPriceComponent implements OnChanges {
  @Input() metalPrice: MetalPrice[];
  @Input() currencyCode: string;
  withDefaultGold: MetalPrice[] = [];
  withoutDefaultGold: MetalPrice[] = [];


  ngOnChanges(changes: SimpleChanges): void {
    this.withDefaultGold = this.metalPrice
      .filter(
        value =>
          value.offset === 1 &&
          value.metalTypeCode === MetalTypeEnum.GOLD &&
          value.karatage === 22
      )
      .map((x: any) => {
        return { ...x, ratePerUnit: Math.round(x.ratePerUnit) };
      });

    this.withoutDefaultGold = this.metalPrice.filter(
      value => value.metalTypeCode !== MetalTypeEnum.GOLD || value.offset !== 1
    );
  }
}
