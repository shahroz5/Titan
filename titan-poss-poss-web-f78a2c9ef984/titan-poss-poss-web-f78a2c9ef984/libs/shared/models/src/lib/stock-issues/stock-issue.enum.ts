export enum StockIssueTypesEnum {
  FACTORY = 'factory',
  BOUTIQUE = 'boutique',
  MERCHANDISE = 'merchandise',
  OTHER_RECEIPTS = 'otherIssues',
  BTQ_CFA = 'cfa',
  OTHER_INVOICES = 'otherReturns',
  HISTORY = 'history',
  TEP_PLAIN = 'TEP_PLAIN',
  TEP_STUDDED = 'TEP_STUDDED',
  GEP = 'GEP',
  CANCEL = 'cancel'
}

export enum StockIssueStatusTypesEnum {
  SELECTED = 'SELECTED',
  APPROVED = 'APPROVED',
  RECEIVED = 'RECEIVED',
  ISSUE_REJECTED = 'ISSUE_REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum StockIssueAPIIssueTypesEnum {
  BTQ_FAC = 'BTQ_FAC',
  BTQ_BTQ = 'BTQ_BTQ',
  BTQ_MER = 'BTQ_MER',
  MER_BTQ = 'MER_BTQ'
}
export enum StockIssueAPIRequestTypesEnum {
  FAC = 'FAC',
  BTQ = 'BTQ',
  MER = 'MER',
  TEP_PLAIN = 'TEP_PLAIN',
  TEP_STUDDED = 'TEP_STUDDED',
  GEP = 'GEP',
  BTQ_BTQ = 'BTQ_BTQ',
  CFA = 'CFA',
  TEP_GOLD_COIN = 'TEP_GOLD_COIN',
  BTQ_CFA = 'BTQ_CFA',
  DEFECTIVE = 'DEFECTIVE',
  DIRECT_ISSUE = 'DIRECT_ISSUE'
}

export enum StockIssueItemStatusEnum {
  VERIFIED = 'VERIFIED',
  ISSUED = 'ISSUED'
}

export enum StockIssueeCarrierTypesEnum {
  COURIER = 'courier',
  EMPLOYEE = 'employee',
  HANDCARRY = 'HAND CARRY'
}

export enum StockIssueDetailsTabEnum {
  APPROVED_PRODUCTS_TAB = 0,
  SELECTED_PRODUCTS_TAB = 1
}
