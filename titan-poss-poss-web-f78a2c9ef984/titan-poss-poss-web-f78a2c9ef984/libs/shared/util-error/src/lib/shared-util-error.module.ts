import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorHandler } from './app-error-handler.service';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }]
})
export class SharedUtilErrorModule {}
