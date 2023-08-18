import { NgModule } from '@angular/core';
import { OverlayNotificationComponent } from './overlay-notification.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { OverlayNotificationServiceAbstraction } from '@poss-web/shared/models';
import { OverlayNotificationService } from './overlay-notification.service';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  declarations: [OverlayNotificationComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],

  entryComponents: [OverlayNotificationComponent],
  providers: [
    {
      provide: OverlayNotificationServiceAbstraction,
      useClass: OverlayNotificationService
    }
  ]
})
export class SharedOverlayNotificationFeatureOverlayNotificationModule {}
