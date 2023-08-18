export enum BodEodTypesEnum {
  BODPROCESS = 'bod-process',
  EODPROCESS = 'eod-process',
  BOD = 'BOD',
  EOD = 'EOD'
}

export enum BodEodEnum {
  TAB = 'tab',
  PENDING = 'pending',
  COMPLETED = 'completed',
  ERROR = 'error',
  INPROGRESS = 'inProgress',
  AVAILABLE = 'available',
  CLOSED = 'closed',
  TRUE = 'true',
  INVENTORY_FIR_MER_CLOSE = 'INVENTORY_FIR_MER_CLOSE',
  INVENTORY_IBT_CLOSE = 'INVENTORY_IBT_CLOSE',
  SALES_HOLD_TRANSACTIONS_DELETE = 'SALES_HOLD_TRANSACTIONS_DELETE',
  SALES_REMOVE_FROM_RESERVEBIN = 'SALES_REMOVE_FROM_RESERVEBIN',
  SALES_AB_SUSPEND = 'SALES_AB_SUSPEND',
  SALES_RO_AIRPAY_PAYMENTS_DELETE = 'SALES_RO_AIRPAY_PAYMENTS_DELETE',
  GHS_OFFLINE_BOD = 'GHS_OFFLINE_BOD',
  ERR_SALE_270 = 'ERR-SALE-270',
  ERR_INT_078 = 'ERR-INT-078',
  ERR_SALE_113 = 'ERR-SALE-113',
  ERR_SALE_136 = 'ERR-SALE-136',
  ERR_ENG_003 = 'ERR-ENG-003',
  ERR_SALE_189 = 'ERR-SALE-189',
  ERR_SALE_190 = 'ERR-SALE-190',
  ERR_SALE_242 = 'ERR-SALE-242',
  OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS = 'OFFLINE_GHS_EOD_REVENUE_COLLECTION_SUCCESS',
  GHS_BOD_PASSWORD_GENERATED = 'GHS_BOD_PASSWORD_GENERATED',
  EOD_PROCESS_COMPLETED = 'EOD_PROCESS_COMPLETED',
  BOD_PROCESS_COMPLETED = 'BOD_PROCESS_COMPLETED'
}

export enum BodEodStepsEnum {
  STEP1_PENDING = 'step1-pending',
  STEP1_COMPLETED = 'step1-completed',
  STEP1_ERROR = 'step1-error',
  STEP2_COMPLETED = 'step2-completed',
  STEP2_ERROR = 'step2-error',
  STEP3_COMPLETED = 'step3-completed',
  STEP3_ERROR = 'step3-error',
  STEP4_COMPLETED = 'step4-completed',
  STEP4_ERROR = 'step4-error',
  STEP5_COMPLETED = 'step5-completed',
  STEP5_ERROR = 'step5-error',
  STEP6_COMPLETED = 'step6-completed',
  STEP6_ERROR = 'step6-error',
  STEP7_COMPLETED = 'step7-completed',
  STEP7_ERROR = 'step7-error',
  STEP8_COMPLETED = 'step8-completed',
  STEP8_ERROR = 'step8-error',
  STEP9_COMPLETED = 'step9-completed',
  STEP9_ERROR = 'step9-error',
  STEP10_COMPLETED = 'step10-completed',
  STEP10_ERROR = 'step10-error',
  STEP11_COMPLETED = 'step11-completed',
  STEP11_ERROR = 'step11-error',
  STEP12_COMPLETED = 'step12-completed',
  STEP12_ERROR = 'step12-error',
  STEP13_COMPLETED = 'step13-completed',
  STEP13_ERROR = 'step13-error',
  STEP14_COMPLETED = 'step14-completed',
  STEP14_ERROR = 'step14-error'
}

export enum OfflineEghsBodGridEnum {
  AUTO_HEIGHT = 'autoHeight',
  LEFT = 'left',
  RIGHT = 'right',
  SINGLE = 'single'
}

export enum BodEodStatusEnum {
  CLOSED = 'CLOSED',
  BOD_IN_PROGRESS = 'BOD_IN_PROGRESS',
  OPEN = 'OPEN',
  EOD_IN_PROGRESS = 'EOD_IN_PROGRESS',
  API_FAILURE = 'API_FAILURE'
}
