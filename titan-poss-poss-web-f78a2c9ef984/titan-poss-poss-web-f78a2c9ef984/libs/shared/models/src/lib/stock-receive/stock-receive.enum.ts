export enum StockReceiveTypesEnum {
  FAC_BTQ = 'factory',
  BTQ_BTQ = 'boutique',
  CFA_BTQ = 'cfa',
  MER_BTQ = 'merchandise',
  HISTORY = 'history'
}
export enum StockReceiveHistoryTypesEnum {
  factory = 'factory',
  boutique = 'boutique',
  cfa = 'cfa',
  merchandise = 'merchandise'
}

export enum StockReceiveAPITypesEnum {
  FAC_BTQ = 'FAC_BTQ',
  BTQ_BTQ = 'BTQ_BTQ',
  CFA_BTQ = 'CFA_BTQ',
  MER_BTQ = 'MER_BTQ'
}

export enum StockReceiveTabEnum {
  NON_VERIFIED = 'nonverified',
  VERIFIED = 'verified'
}

export enum StockStatusEnum {
  ISSUED = 'ISSUED',
  PUBLISHED = 'PUBLISHED',
  RECEIVED = 'RECEIVED'
}

export enum StockReceiveItemStatusEnum {
  VERIFIED = 'VERIFIED',
  ISSUED = 'ISSUED'
}

export enum StockReceiveTypeFieldEnum {
  STN = 'transferType',
  INVOICE = 'invoiceType'
}

export enum StockReceiveCFAInvoiceTypeFieldEnum {
  CFA_INVOICE = 'CFA_INVOICE',
  CFA_INVOICE_ORACLE = 'CFA_INVOICE_ORACLE'
}

export enum StockItemBinGroupCodeEnum {
  STN = 'STN',
  PURCFA = 'PURCFA',
  DISPUTE = 'DISPUTE',
  DEFECTIVE = 'DEFECTIVE',
  CUSTOMERORDERBIN = 'CUSTOMERORDERBIN',
  SPARE = 'SPARE',
  HALLMARKDISPUTEBIN = 'HALLMARKDISPUTEBIN',
  FOC = 'FOC'
}
export enum StockItemBinCodeEnum {
  ZERO_BIN = 'ZEROBIN',
  HALLMARKDISPUTEBIN = 'HALLMARKDISPUTEBIN',
  FOC = 'FOC'
}

export enum StockReceiveCarrierTypesEnum {
  COURIER = 'courier',
  EMPLOYEE = 'employee'
}

export enum StockReceiveProductCategoryCodeEnum {
  COIN = 'Z'
}
