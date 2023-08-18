import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAuthDataAccessAuthModule } from '@poss-web/shared/auth/data-access-auth';
import { LocationSettingsFeatureService } from './location-settings.service';
import { SharedProfileDataAccessProfileModule } from '@poss-web/shared/profile/data-access-profile';

@NgModule({
  imports: [
    CommonModule,
    SharedAuthDataAccessAuthModule,
    SharedProfileDataAccessProfileModule
  ],
  providers: [LocationSettingsFeatureService]
})
export class SharedLocationSettingsFeatureLocationSettingsModule {}
