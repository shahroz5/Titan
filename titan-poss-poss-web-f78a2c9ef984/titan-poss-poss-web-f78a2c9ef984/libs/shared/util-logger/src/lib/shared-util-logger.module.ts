import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from './logger.service';

@NgModule({
  imports: [CommonModule],
  providers: [LoggerService]
})
export class SharedUtilLoggerModule {}
