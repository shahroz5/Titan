export const fieldValidation = {
  emailField: {
    pattern: /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@.+\..+$/,
    maxLength: 254
  },
  amountField: {
    pattern: /^\d{1,9}(\.\d{1,2})?$/,
    maxLength: 9
  },
  amountNoDecimalField: {
    pattern: /^\d{1,9}$/,
    maxLength: 9
  },
  numbersField: {
    pattern: /^[0-9]*$/,
    maxLength: null
  },
  alphaNumericField: {
    pattern: /^[0-9A-Za-z]*$/
  },
  numberWithCapitalAlphabet: {
    pattern: /^[0-9A-Z]*$/
  },
  alphaNumericWithSpaceField: {
    pattern: /^[0-9A-Za-z\s]*$/
  },
  binCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,24}$/,
    maxLength: 25
  },
  binGroupCodeField: {
    pattern: /^[A-Z0-9][A-Z0-9\s]{0,24}$/,
    maxLength: 25
  },
  brandCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,19}$/,
    maxLength: 20
  },
  subBrandCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,19}$/,
    maxLength: 20
  },
  regionCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,19}$/,
    maxLength: 20
  },
  subRegionCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,19}$/,
    maxLength: 20
  },
  stoneCodeField: {
    pattern: /^[A-Za-z0-9]{0,20}$/,
    maxLength: 20
  },
  materialCodeField: {
    pattern: /^[A-Z]{1,2}$/,
    maxLength: 2
  },
  marketCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,19}$/,
    maxLength: 20
  },
  priceGroupTypeCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s&-]{0,19}$/,
    maxLength: 20
  },
  paymentCodeField: {
    pattern: /^[A-Za-z][A-Za-z\s]{0,19}$/,
    maxLength: 20
  },
  depreciationCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s<>=&%]{0,19}$/,
    maxLength: 20
  },
  cfaProductCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,19}$/,
    maxLength: 20
  },
  cfaCodeField: {
    pattern: /^[A-Z]{5}[0-9]{5,10}$/,
    maxLength: 15
  },
  colorField: {
    pattern: /^(?!\s).{1,50}$/,
    maxLength: 50
  },
  daysField: {
    pattern: /^[0-9]{1,4}$/,
    maxLength: 4
  },
  descriptionField: {
    pattern: /^(?!\s).{1,100}$/,
    maxLength: 100
  },
  gstNumberField: {
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    maxLength: 15
  },

  passportIdField: {
    pattern: /^[0-9A-Za-z]{0,20}$/,
    maxLength: 20
  },

  karatField: {
    pattern: /^((?:[0-9]|1[0-9]|2[0-3])(?:\.\d{1,3})?|24(?:\.000?)?)$/,
    maxLength: 6
  },
  factorField: {
    pattern: /^(?!0*(\.0+)?$)([0-1](?:\.\d{1,4})?|2(?:\.[0]{1,4})?)$/,
    maxLength: 6
  },
  mobileField: {
    pattern: /^([6-9])(?!\1+$)\d{9}$/,
    maxLength: 10
  },
  customerMobileField: {
    pattern: /^([1-9])(?!\1+$)\d{9}$/,
    maxLength: 10
  },
  nameWithSpaceField: {
    pattern: /^[a-zA-Z][a-zA-Z.'\s]{0,49}$/,
    maxLength: 50
  },
  valueStartEndField: {
    pattern: /^[0-9]*(\.[0-9]{0,2})?$/,
    maxLength: 5
  },
  purityField: {
    pattern: /(^100(\.0{1,7})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,7})?$)/,
    maxLength: 11
  },
  percentageField: {
    pattern: /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/,
    maxLength: 5
  },
  discountPercentageField: {
    pattern: /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/,
    maxLength: 6
  },
  pincodeField: {
    pattern: /^[1-9]{1}[0-9]{5}$/,
    maxLength: 6
  },
  otpField: {
    pattern: /^[0-9]{4}$/,
    maxLength: 4
  },
  encircleOtpField: {
    pattern: /^[0-9]{6}$/,
    maxLength: 6
  },
  alphabetsField: {
    pattern: /^[a-zA-Z]*$/,
    maxLength: null
  },
  toleranceField: {
    pattern: /(^(\.0{1,1})?$)|(^(([0-9])?|0)(\.[0-9]{1,3})?$)/,
    maxLength: 4
  },
  urlField: {
    pattern: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    maxLength: 1000
  },
  productCategoryField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s]{0,19}$/,
    maxLength: 20
  },
  addressField: {
    pattern: /^(?!\s)[A-Za-z0-9\s#/,.()]{1,40}$/,
    maxLength: 40
  },
  corporateAddressField: {
    pattern: /^(?!\s)[A-Za-z0-9\s#/,.()]{1,250}$/,
    maxLength: 250
  },
  approvalCodeField: {
    pattern: /^(?!\s).{0,20}$/,
    maxLength: 20
  },
  cityField: {
    pattern: /^[a-zA-Z][a-zA-Z\s]{0,24}$/,
    maxLength: 25
  },
  courierDocNoField: {
    pattern: /^[A-Za-z0-9]{0,30}$/,
    maxLength: 30
  },
  courierRoadPermitNoField: {
    pattern: /^[A-Za-z0-9\s-_/&]{0,30}$/,
    maxLength: 30
  },
  designationField: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9\s./-_&]{0,29}$/,
    maxLength: 30
  },
  pancardField: {
    pattern: /^[A-Za-z]{3}[PCAFHTpcafht]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/,
    maxLength: 10
  },
  quantityField: {
    pattern: /^[0-9]{0,4}$/,
    maxLength: 4
  },
  lockNumberField: {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,30}$/,
    maxLength: 30
  },
  reasonField: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9\s-/'()%.,_&]{0,249}$/,
    maxLength: 250
  },
  remarkField: {
    pattern: /^[a-zA-Z0-9](?!.*([\s-/'()%.,_&])\1{1})[a-zA-Z0-9\s-/'()%,_&]{0,248}[a-zA-Z0-9.]$/,
    maxLength: 250
  },
  roleCodeField: {
    pattern: /^[A-Za-z0-9][A-Za-z0-9\s-/&]{0,19}$/,
    maxLength: 20
  },
  stateField: {
    pattern: /^[a-zA-Z][a-zA-Z\s&]{0,29}$/,
    maxLength: 30
  },
  weightField: {
    pattern: /^[0-9]{0,4}(\.\d{1,3})?$/,
    maxLength: 8
  },
  townCodeField: {
    pattern: /^[0-9]*$/,
    maxLength: null
  },
  stateCodeField: {
    pattern: /^[A-Z]{2,3}$/,
    maxLength: 3
  },
  locationTypeCodeField: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9\s-/&]{0,24}$/,
    maxLength: 25
  },
  countryCodeField: {
    pattern: /^[A-Za-z]{3}$/,
    maxLength: 3
  },
  currencyCodeField: {
    pattern: /^[A-Za-z]{1,3}$/,
    maxLength: 3
  },
  uniCodeField: {
    pattern: /^(?!\s).{0,20}$/,
    maxLength: 20
  },
  itemCodeField: {
    pattern: /^[0-9a-zA-Z]{1,20}$/,
    maxLength: 20
  },
  productCodeField: {
    pattern: /^[a-zA-Z0-9]{0,20}$/,
    maxLength: 20
  },
  complexityCodeField: {
    pattern: /^[a-zA-Z0-9]{0,20}$/,
    maxLength: 20
  },
  stoneQualityField: {
    pattern: /^(?!\s).{0,20}$/,
    maxLength: 20
  },
  productGroupCodeField: {
    pattern: /^[a-zA-Z0-9]{0,20}$/,
    maxLength: 20
  },
  stoneTypeCodeField: {
    pattern: /^[A-Z]{1,20}$/,
    maxLength: 20
  },
  supplyChainCodeField: {
    pattern: /^[a-zA-Z0-9]{0,20}$/,
    maxLength: 20
  },
  productTypeCodeField: {
    pattern: /^[a-zA-Z][a-zA-Z\s]{0,19}$/,
    maxLength: 20
  },
  findingCodeField: {
    pattern: /^(?!\s).{0,4}$/,
    maxLength: 4
  },
  locationCodeField: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9\s]{0,19}$/,
    maxLength: 20
  },
  priceGroupCodeField: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9\s-/&]{0,19}$/,
    maxLength: 20
  },
  cinNumberField: {
    pattern: /^[a-zA-Z0-9]{21}$/,
    maxLength: 21
  },
  contactNoField: {
    pattern: /^[0-9-+]{1,20}$/,
    maxLength: 20
  },
  userCodeField: {
    pattern: /([0-9a-zA-Z][\\w.]{0,14}$) |(^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$)/,
    maxLength: null
  },
  requestNumberField: {
    pattern: /^[1-9][0-9]{0,8}$/,
    maxLength: 9
  },
  ulpIdField: {
    pattern: /^[37][0-9]{11}$/,
    maxLength: 12
  },
  employeeCodeField: {
    pattern: /^(?!0+$)[a-zA-Z0-9]{1,15}$/,
    maxLength: 15
  },
  employeeNameField: {
    pattern: /^[0-9a-zA-Z][\w/]{0,14}$|^[a-zA-Z]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/,
    maxLength: null
  },
  taxCodeField: {
    pattern: /^[A-Za-z\/]{3,10}$/,
    maxLength: null
  },
  taxClassCodeField: {
    pattern: /^[A-Z0-9]{3,5}$/,
    maxLength: null
  },
  stateTaxCodeField: {
    pattern: /^[0-9]{0,2}$/,
    maxLength: 2
  },
  customerNameField: {
    pattern: /^(?!.*([A-Za-z'.\s])\1{2})[A-Za-z][A-Za-z'.\s]{1,49}$/,
    maxLength: 50
  },
  customerSearchNameField: {
    pattern: /^(?!.*([A-Za-z'.\s])\1{2})[A-Za-z'.\s]{0,49}$/,
    maxLength: 50
  },
  InstitutionNameField: {
    pattern: /^(?!.*([A-Za-z0-9'.\s()])\1{2})[A-Za-z0-9][A-Za-z0-9'.\s()]{1,49}$/,
    maxLength: 50
  },
  countryNameField: {
    pattern: /^[a-zA-Z][a-zA-Z\s]{0,19}$/,
    maxLength: 20
  },
  alphabetWithSpaceField: {
    pattern: /^[a-zA-Z][a-zA-Z\s]*$/,
    maxLength: null
  },
  fiscalYearField: {
    pattern: /^[1-2][0-9]{3}$/,
    maxLength: 4
  },
  binNameField: {
    maxLength: 20
  },
  passwordField: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[\t \\~<])(?=.*[_\-+=!@%*&":.\/])(.{8,})$/,
    maxLength: 32
  },
  chequeDDNoField: {
    pattern: /^[0-9]{6,8}$/,
    maxLength: 8
  },
  giftCardField: {
    pattern: /^[0-9]{9,16}$/,
    maxLength: 16
  },
  giftVoucherField: {
    pattern: /^[0-9]{8,10}$/,
    maxLength: 10
  },
  giftCardPinField: {
    pattern: /^[0-9]{6}$/,
    maxLength: 6
  },
  costCenterPinField: {
    pattern: /^[0-9]{4}$/,
    maxLength: 4
  },
  singleNumberField: {
    pattern: /^[0-9]*$/,
    maxLength: 1
  },
  numberOfCardDigitsField: {
    pattern: /^\d{1,2}(?:,\d{1,2})*$/,
    maxLength: 20
  },
  transactionIdField: {
    pattern: /^[0-9A-Za-z]{1,30}$/,
    maxLength: 30
  },
  fitGlCodeField: {
    pattern: /^[0-9]{4,8}$/,
    maxLength: 8
  },
  localeField: {
    pattern: /^[A-Za-z-_#]{5,10}$/,
    maxLength: 10
  },
  maxNumberOfProducts: {
    pattern: /^[0-9]{0,3}$/,
    maxLength: 3
  },
  reqValidUpto: {
    pattern: /^[0-9]{0,4}$/,
    maxLength: 4
  },
  noOfRequestPerMonth: {
    pattern: /^[0-9]{0,3}$/,
    maxLength: 3
  },
  gcScannedCode: {
    pattern: /^[0-9]$/
  },
  referenceIdField: {
    pattern: /^[0-9A-Za-z]{5,30}$/,
    maxLength: 30
  },
  giftVoucherSerialNoField: {
    pattern: /^[0-9]{9,16}$/,
    maxLength: 16
  },
  ghVoucherNoField: {
    pattern: /^[0-9]{9,16}$/,
    maxLength: 16
  },
  binSeriesField: {
    pattern: /^[0-9A-Za-z]{3,8}$/,
    maxLength: 8
  },
  themeCodeField: {
    pattern: /^[0-9A-Za-z]{1,7}$/,
    maxLength: 7
  },
  merchantIdField: {
    pattern: /^[0-9]{1,12}$/,
    maxLength: 12
  },
  apiKeyField: {
    pattern: /^[0-9A-Za-z]{1,16}$/,
    maxLength: 16
  },
  bankNameField: {
    pattern: /^(?!\s).{1,50}$/,
    maxLength: 50
  },
  bankCodeField: {
    pattern: /^[0-9A-Za-z]{1,50}$/,
    maxLength: 50
  },
  giftVoucherSerialNumberSearchField: {
    pattern: /(^[\d]{7,15}){1}([-][\d]{2}){0,1}$/,
    maxLength: 16
  },
  cashbackNameField: {
    pattern: /^[0-9A-Za-z]{1,50}$/,
    maxLength: 50
  },
  focSchemeNameField: {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9!@#\$%^&\*()-+-]{0,49}$/,
    maxLength: 50
  },
  noOfTimesCardAllowedField: {
    pattern: /^[0-9]*$/,
    maxLength: 2
  },

  offsetField: {
    pattern: /(^(([0-3])?|0)(\.[0-9]{1,5})?$)/,
    maxLength: 6
  },

  cpgGroupNameField: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9\s-/'()%.,_&]{0,100}$/,
    maxLength: 100
  },
  commaSaperatedNumberField: {
    pattern: /^[0-9]+(,[0-9]+)*$/
  },

  zipcodeField: {
    pattern: /^[a-zA-Z0-9-]*$/,
    maxLength: null
  },

  numberOfPrintsAllowedField: {
    pattern: /^[0-9]*$/,
    maxLength: 3
  },

  passwordallowedCharPattern: {
    pattern: /^[0-9a-zA-Z`!@#$%^&*()_\-+={}[\]|:;"'>,./?]$/
  },

  timeField: {
    pattern: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
    maxLength: null
  },

  timeInHoursField: {
    pattern: /^(0?[1-9]|1[0-9]|2[0-3])$/,
    maxLength: 2
  },
  nonPeakTimeField: {
    pattern: /^(0?[0-9])$/,
    maxLength: 2
  },
  numberGreaterThanZeroPattern: {
    pattern: /^[1-9]\d*$/
    // pattern: /^(\d?[1-9]|[1-9]0)$/
  },

  weightValueConfigName: {
    pattern: /^[a-zA-Z][a-zA-Z\s:-]{0,49}$/,
    maxLength: 50
  },
  slabNameField: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9-.\s]*$/,
    maxLength: null
  },
  ifscCodeField: {
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    maxLength: 11
  },
  makingChargeField: {
    pattern: /^([1-9]\d?\d?|0)(\.\d{1,2})?$/,
    maxLenght: 6
  },
  noOfDaysForRazorPayPaymentExpiry: {
    pattern: /^[1-9][0-9]?$/,
    maxLength: 2
  },
  schemeCodeField: {
    pattern: /^(?!\s)[0-9A-Za-z\s-]{0,25}$/,
    maxLength: 25
  },
  utrNumberField: {
    pattern: /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z0-9]{1,25}$/,
    maxLength: 25
  },
  accountHolderField: {
    pattern: /^[a-zA-Z][a-zA-Z.'\s]{0,99}$/,
    maxLength: 100
  }
};
