import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CountryEffect } from './+state/country.effect';
import { COUNTRY_FEATURE_KEY, CountryReducer } from './+state/country.reducer';
import { CountryFacade } from './+state/country.facade';
import { CountryService } from './country.service';
@NgModule({
  imports: [CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(COUNTRY_FEATURE_KEY, CountryReducer),
    EffectsModule.forFeature([CountryEffect])],
    providers: [CountryFacade, CountryService]
})
export class SharedCountryMasterDataAccessCountryMasterModule {}
