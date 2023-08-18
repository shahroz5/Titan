import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinDataService } from './bin.data.service';
import { BinGroupDataService } from './bin-group.data.service';
import { BrandDataService } from './brand.data.service';
import { CountryDataService } from './country.data.service';
import { CourierDataService } from './courier.data.service';
import { ItemDataService } from './item.data.service';
import { LocationDataService } from './location.data.service';
import { LovDataService } from './lov.data.service';
import { ProductCategoryDataService } from './product-category.data.service';
import { RegionDataService } from './region.data.service';
import { StateDataService } from './state.data.service';
import { StoreConfigDataService } from './store-config.data.service';
import { StoreUserDataService } from './store-user.data.service';
import { TownDataService } from './town.data.service';
import { PinCodeDataService } from './pincodes.data.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    BinGroupDataService,
    BinDataService,
    BrandDataService,
    CountryDataService,
    CourierDataService,
    ItemDataService,
    LocationDataService,
    LovDataService,
    ProductCategoryDataService,
    RegionDataService,
    StateDataService,
    StoreConfigDataService,
    StoreUserDataService,
    TownDataService,
    PinCodeDataService
  ]
})
export class SharedMastersDataAccessMastersModule {}
