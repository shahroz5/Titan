import { TemplateRef, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export enum OverlayNotificationEventType {
  CLOSE,
  TRUE,
  FALSE
}

export enum OverlayNotificationType {
  SIMPLE,
  SUCCESS,
  ERROR,
  TIMER,
  PROGRESS,
  ACTION,
  MULTI_ACTION,
  CUSTOM
}

export interface OverlayNotificationEventRef {
  eventType?: OverlayNotificationEventType;
  data: any;
  selectedId?: number;
}

export interface OverlayNotificationError {
  code: string;
  message: string;
  traceId: string;
  timeStamp: string;
  error: Error | HttpErrorResponse;
  dynamicValues?: {
    ruleType: string;
  };
}

export interface OverLayNotificationConfig {
  type: OverlayNotificationType;
  message?: string;
  template?: TemplateRef<any>;
  time?: number;
  hasBackdrop?: boolean;
  buttonText?: string;
  hasRemarks?: boolean;
  isRemarksMandatory?: boolean;
  hasClose?: boolean;
  error?: OverlayNotificationError;
  buttons?: {
    id: number;
    text: string;
    css?: string;
    hasRemarksValidation?: boolean;
  }[];
  remarksValue?: string;
}

export class OverlayNotificationRef {
  events = new EventEmitter<OverlayNotificationEventRef>();
  remarksEvent = new EventEmitter<string>();
}

export abstract class OverlayNotificationServiceAbstraction {
  public abstract show(
    config: OverLayNotificationConfig
  ): OverlayNotificationRef;

  public abstract close();
  public abstract focus();
}
