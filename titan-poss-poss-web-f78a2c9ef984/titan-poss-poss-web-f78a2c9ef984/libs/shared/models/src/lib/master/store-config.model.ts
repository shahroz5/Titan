// todo remove this file
export interface StoreConfig {
  address: string,
  brandCode: string,
  cfaCodeValue: string,
  cfaList: DetailsList[],
  configDetails: any,
  contactNo: string,
  countryCode: number,
  description: string,
  factoryCodeValue: string,
  factoryList:DetailsList[],
  fax: string,
  isActive: boolean,
  locationCode: string,
  locationEmail: string,
  locationFormat: string,
  locationTypeCode: string,
  ownerTypeCode: string,
  phoneNo: string,
  pincode: number,
  regionCode: string,
  registrationNo: string,
  stateCode: number,
  townCode: number
}
export interface DetailsList{
  address: string,
  brandCode: string,
  description: string,
  isActive: boolean,
  locationCode: string,
  locationTypeCode: string,
  phoneNo: string,
  regionCode: string,
  stateCode: number,
  townCode: number
}
