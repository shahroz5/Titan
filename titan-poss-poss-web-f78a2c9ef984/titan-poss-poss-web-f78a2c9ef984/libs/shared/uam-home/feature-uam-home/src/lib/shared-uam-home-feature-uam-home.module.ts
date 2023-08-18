import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiCardMenuModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  declarations: [HomeComponent]
})
export class SharedUamHomeFeatureUamHomeModule {}
