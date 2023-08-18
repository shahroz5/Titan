import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Permission } from './permission.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [Permission],
  exports: [Permission]
})
export class SharedPermissionUiPermissionModule {}
