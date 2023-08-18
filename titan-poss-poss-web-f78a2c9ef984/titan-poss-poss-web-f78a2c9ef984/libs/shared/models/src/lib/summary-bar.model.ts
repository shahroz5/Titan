import { EventEmitter } from '@angular/core';

export class SummaryBarRef {
  events = new EventEmitter<SummaryBarEventRef>();
}

export interface SummaryBarEventRef {
  eventType: SummaryBarEventType;
  remarks?: any;
}


export enum SummaryBarType {
  SUMMARY_BAR,
  GIFT_CARD,
  WALK_INs,
  GEP,
  AB,
  AB_NEW,
  AB_MB,
  BC,
  MB,
  FOC,
  ADV,
  GRF,
  GRN,
  GRN_APPROVAL,
  TEP,
  TEP_VIEW,
  CUT_PIECE_TEP,
  MERGE_GRF,
  CN,
  CM_HISTORY,
  BC_HISTORY,
  CO
}

export enum SummaryBarEventType {
  HOLD,
  CLAER,
  PRINT,
  PRINT_ANNEXURE,
  COA,
  CONVERT,
  CONFRIM,
  CONFRIM_GRN,
  GRN_SEND_FOR_APPROVAL,
  DELETE,
  CANCELWITHRETURN,
  CONFIRMCANCEL,
  CANCELWITHCN,
  CREATEGRF,
  CANCEL_AB,
  REGULARIZE_AB,
  ACTIVATE_AB,
  CANCEL_REQUEST_AB,
  ACTIVATE_REQUEST_AB,
  FREEZE,
  ADD_PAYMENT,
  SAVE,
  CANCEL,
  CANCEL_TEP,
  REFUND,
  GENERATE_CN,
  TEP_REQUEST_APPROVAL,
  TEP_EXCEPTION,
  REGULARIZE_GRF,
  SUSPEND_AB
}

export abstract class SummaryBarServiceAbstraction {
  public abstract close();
  public abstract open(
    summaryBarType: SummaryBarType,
    data?: any
  ): SummaryBarRef;
  public abstract openFocSummaryBar(type: string): SummaryBarRef;
  public abstract openManualBillSummaryBar(type: any): SummaryBarRef;
}

export enum SummaryBarCNTypesEnum {
  CN_TRANSFER_RAISE_REQUEST,
  CN_TRANSFER_CANCEL_REQUEST,
  CN_TRANSFER_APPROVE_REJECT,
  CN_TRANSFER_INWARD,
  CN_CANCEL_REQUEST,
  CN_DOWNLOAD,
  REMOVE_GOLD_RATE,
  ACTIVATE_CN,
  TRANSFER_TO_EGHS,
  CONFIRM,
  CN_REQUEST_FOR_APPROVAL,
  CN_CANCEL,
  PRINT
}
