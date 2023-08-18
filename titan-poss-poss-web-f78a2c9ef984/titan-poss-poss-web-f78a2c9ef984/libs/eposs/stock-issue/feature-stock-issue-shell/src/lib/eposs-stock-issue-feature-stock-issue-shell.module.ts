import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockIssueShellComponent } from './stock-issue-shell/stock-issue-shell.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { EpossStockIssueFeatureStockIssueListModule } from '@poss-web/eposs/stock-issue/feature-stock-issue-list';
import { AuthnGuard, AuthzGuard } from '@poss-web/shared/auth/feature-auth';

const routes: Routes = [
  {
    path: '',
    component: StockIssueShellComponent,
    children: [
      {
        path: 'cancel',
        loadChildren: () =>
          import('@poss-web/eposs/stock-issue/feature-stock-issue-cancel').then(
            m => {
              return m.EpossStockIssueFeatureStockIssueCancelModule;
            }
          )
      },
      {
        path: 'merchandise',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-issue/feature-stock-issue-merchandise'
          ).then(m => {
            return m.EpossStockIssueFeatureStockIssueMerchandiseModule;
          })
      },
      {
        path: 'boutique',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-issue/feature-stock-issue-boutiques'
          ).then(m => {
            return m.EpossStockIssueFeatureStockIssueBoutiquesModule;
          })
      },
      {
        path: 'factory',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-issue/feature-stock-issue-factory'
          ).then(m => {
            return m.EpossStockIssueFeatureStockIssueFactoryModule;
          })
      },
      {
        path: 'history/:type',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-issue/feature-stock-issue-history'
          ).then(m => {
            return m.EpossStockIssueFeatureStockIssueHistoryModule;
          }),
        canActivate: [AuthnGuard, AuthzGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiCardListModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedPermissionUiPermissionModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    EpossStockIssueFeatureStockIssueListModule
  ],
  declarations: [StockIssueShellComponent]
})
export class EpossStockIssueFeatureStockIssueShellModule {}
