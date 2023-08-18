export enum FetchCOGridFieldsEnum {
  CUSTOMER_MOBILE_NO = 'mobileNumber',
  CUSTOMER_NAME = 'customerName',
  COM_ORDER_NO = 'comOrderNumber',
  COM_ORDER_DATE = 'comOrderDateTime',
  ITEM_CODE = 'itemCode',
  GROSS_WEIGHT = 'grossWeight',
  QUANTITY = 'quantity',
  REQUEST_TYPE = 'requestType',
  AUTO_STN = 'autostn',
  EXPECTED_DELIVERY_DATE = 'deliveryDateTime',
  ORDER_VALUE = 'orderValue',
  ROWID = 'rowId',
  SELECT = 'select'
}
// todo: to be corrected
export enum COProductGridFieldsEnum {
  VARIANT_CODE = 'itemCode',
  LOT_NUMBER = 'lotNumber',
  REQUEST_TYPE = 'requestType',
  ORDER_TYPE = 'subType',
  IS_AUTO_APPROVAL = 'isAutoStn',
  IS_ESCELETE_ORDER = 'ecelesteFlag',
  IS_SIZING = 'isSizing',
  REQUEST_BY = 'requestBy',
  REQUEST_BTQ = 'requestBtq',
  GROSS_WEIGHT = 'grossWeight',
  WEIGHT_PER_UNIT = 'wtPerUnit',
  DISCOUNT = 'totalDiscount',
  PRICE_PER_UNIT = 'totalValue',
  TOTAL_VALUE = 'finalValue',
  RSO_NAME = 'employeeCode',
  DELETE = 'delete',
  VIEW_CO = 'view_co',
  SELECT = 'select',
  ROWID = 'rowId'
}

export enum RequestTypeEnum {
  IBT = 'IBT',
  MTR = 'MTR',
  PROD = 'PROD',
  EA = 'EA',
  COM = 'COM'
}

export enum CODetailsViewGridFieldsEnum {
  DOC_NO = 'docNumber',
  CUSTOMER_NAME = 'customerName',
  DOC_DATE = 'docDate',
  LOCATION_CODE = 'locationCode',
  STATUS = 'status',
  NET_AMOUNT = 'netAmount',
  SUB_TXN_TYPE = 'subTxnType'
}

export enum CommonCOEnum {
  NOMINEE_DETAILS = 'NOMINEE_DETAILS',
  RELATIONSHIP_TYPE = 'RELATIONSHIP_TYPE'
}
