import { ItemDataAdaptor } from './../masters/item.adaptors';
import { ItemStoneDetails } from '@poss-web/shared/models';

export class StoneDetailsHelper {
  static getStoneDetails(data: any): ItemStoneDetails[] {
    const stoneDetails: ItemStoneDetails[] = [];
    for (const stone of data.results) {
      stoneDetails.push(ItemDataAdaptor.ItemStoneDetailsFromJson(stone));
    }
    return stoneDetails;
  }
}
