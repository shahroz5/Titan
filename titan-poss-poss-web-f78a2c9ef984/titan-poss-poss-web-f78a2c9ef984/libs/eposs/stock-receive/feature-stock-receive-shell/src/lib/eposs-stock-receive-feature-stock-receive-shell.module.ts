import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReceiveShellComponent } from './stock-receive-shell/stock-receive-shell.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossStockReceiveFeatureStockReceiveListModule } from '@poss-web/eposs/stock-receive/feature-stock-receive-list';
import { AuthnGuard, AuthzGuard } from '@poss-web/shared/auth/feature-auth';

const routes: Routes = [
  {
    path: '',
    component: StockReceiveShellComponent,
    children: [
      {
        path: 'merchandise',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-receive/feature-stock-receive-merchandise'
          ).then(m => {
            return m.EpossStockReceiveFeatureStockReceiveMerchandiseModule;
          })
      },
      {
        path: 'boutique',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-receive/feature-stock-receive-boutique'
          ).then(m => {
            return m.EpossStockReceiveFeatureStockReceiveBoutiqueModule;
          })
      },
      {
        path: 'factory',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-receive/feature-stock-receive-factory'
          ).then(m => {
            return m.EpossStockReceiveFeatureStockReceiveFactoryModule;
          })
      },
      {
        path: 'cfa',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-receive/feature-stock-receive-cfa'
          ).then(m => {
            return m.EpossStockReceiveFeatureStockReceiveCfaModule;
          })
      },
      {
        path: 'history/:type',
        loadChildren: () =>
          import(
            '@poss-web/eposs/stock-receive/feature-stock-receive-history'
          ).then(m => {
            return m.EpossStockReceiveFeatureStockReceiveHistoryModule;
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
    EpossStockReceiveFeatureStockReceiveListModule
  ],
  declarations: [StockReceiveShellComponent]
})
export class EpossStockReceiveFeatureStockReceiveShellModule {}
