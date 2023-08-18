/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import com.titan.poss.core.domain.constant.ServiceTransactionEnum;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.dto.ServiceCashCollectedDto;
import com.titan.poss.core.dto.ServiceMetalRequestDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.dto.ServiceRevDto;
import com.titan.poss.core.dto.ServiceRevenueDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.ServicePossVendorDetailsDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.ServicePossAuditDao;
import com.titan.poss.integration.intg.repository.ServicePossAuditRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.ServicePOSS;
import com.titan.poss.integration.util.HttpClientUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PaymentCodeRevenueEnum;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Slf4j
@Service("IntegrationServicePOSS")
public class ServicePOSSImpl implements ServicePOSS {

	@Autowired
	private ServicePossAuditRepository spAuditRepository;

	@Autowired
	private VendorRepository vendorRepository;
	

	@Value("${cloud.aws.s3.expTime}")
	private String expTimeSeconds;

	@Autowired
	@Qualifier("ghs")
	private AmazonS3 s3eGHS;

	
	private static final String AUTHORIZATION = "Authorization";
	private static final String BASIC = "Basic ";
	private static final String ERR_INT_010 = "ERR-INT-21017";
	private static final String EXCEPTION_MSG = "Cannot connect to 'Service POSS' application, please try again";
	private static final String VENDOR_CODE = "SERVICE";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String SERVICE_UNAVAILBLE = "service poss server not availble";
    
//	private static final String ERR_INT_039 = "ERR-INT-039";
//	private static final String ERR_INT_040 = "ERR-INT-040";
//	private static final String ERR_INT_041 = "ERR-INT-041";
//	private static final String ERR_INT_042 = "ERR-INT-042";
//	private static final String ERR_INT_043 = "ERR-INT-043";
//	private static final String ERR_INT_044 = "ERR-INT-044";
//	private static final String ERR_INT_047 = "ERR-INT-047";
//	private static final String ERR_INT_048 = "ERR-INT-048";
	private static final String ERR_INT_100 = "ERR-INT-100";
//	private static final String ERR_INT_051 = "ERR-INT-051";
//	private static final String ERR_INT_052 = "ERR-INT-052";
//	private static final String ERR_INT_053 = "ERR-INT-053";
//	private static final String ERR_INT_054 = "ERR-INT-054";
	private static final String ERR_INT_055 = "ERR-INT-055";
//	private static final String ERR_INT_027 = "ERR-INT-027";
//	private static final String ERR_INT_078 = "ERR-INT-078";



//	@Override
//	public ListResponse<GhsCreditNoteDto> getCreditNotesFromServicePoss(String vendorCode) {
//		VendorDao vendor = validateVendor(vendorCode);
//		DownloadCreditNotesForLocation downloadCreditNotesForLocation = new DownloadCreditNotesForLocation();
//		downloadCreditNotesForLocation.setLocationCode(CommonUtil.getLocationCode());
//		ServicePossAuditDao ghsAudit = getInitialServiceAuditDetails(vendor);
//		DownloadCreditNotesForLocationResponse downloadCreditNotesForLocationResponse = servicePossClient
//				.getCreditNotesFromGhs(vendor, downloadCreditNotesForLocation, ghsAudit);
//		String request = new JSONObject().put("locationCode", CommonUtil.getLocationCode()).toString();
//		String response = getJsonValueFromJaxbObject(downloadCreditNotesForLocationResponse);
//		ListResponse<GhsCreditNoteDto> ghsCreditNoteDtoListResponse = new ListResponse<>();
//		List<GhsCreditNoteDto> ghsCreditNoteDtoList = new ArrayList<>();
//		if (downloadCreditNotesForLocationResponse.getDownloadCreditNotesForLocationResult()
//				.getPOSSCreditNoteDO() != null
//				&& !downloadCreditNotesForLocationResponse.getDownloadCreditNotesForLocationResult()
//						.getPOSSCreditNoteDO().isEmpty()) {
//			downloadCreditNotesForLocationResponse.getDownloadCreditNotesForLocationResult().getPOSSCreditNoteDO()
//					.forEach(possCreditNote -> {
//						GhsCreditNoteDto ghsCreditNoteDto = new GhsCreditNoteDto();
//						ghsCreditNoteDto.setCreditNoteType(possCreditNote.getCreditNoteType());
//						ghsCreditNoteDto.setAmount(possCreditNote.getAmount());
//						ghsCreditNoteDto.setGhsDocNo(possCreditNote.getDocNo());
//						ghsCreditNoteDto.setCnDocNo(possCreditNote.getPOSSCNNo());
//						ghsCreditNoteDto.setFiscalYear(possCreditNote.getFiscalYear());
//						if (possCreditNote.getCustomerDetails() != null) {
//							ghsCreditNoteDto.setCustomerName(possCreditNote.getCustomerDetails().getName());
//							ghsCreditNoteDto.setCustomerId(possCreditNote.getCustomerDetails().getCustomerID());
//							ghsCreditNoteDto.setMobileNumber(possCreditNote.getCustomerDetails().getMobileNo());
//							ghsCreditNoteDto.setUlpId(possCreditNote.getCustomerDetails().getULPMembershipID());
//						}
//						for (Map.Entry<String, Integer> entry : GhsConstantsUtil.getGhsconstants().entrySet()) {
//							if (possCreditNote.getStatus() == entry.getValue()) {
//								ghsCreditNoteDto.setStatus(CNStatus.TRANSFER_GHS.name());
//							}
//						}
//						ghsCreditNoteDtoList.add(ghsCreditNoteDto);
//					});
//			setFinalGhsAuditDetails(ghsAudit, request, response, Boolean.TRUE,
//					GhsTransactionEnum.GET_CREDITNOTE.name());
//		} else {
//			setFinalGhsAuditDetails(ghsAudit, request, NO_DATA, Boolean.FALSE,
//					GhsTransactionEnum.GET_CREDITNOTE.name());
//			throw new ServiceException(NO_DATA, ERR_INT_041);
//		}
//		ghsCreditNoteDtoListResponse.setResults(ghsCreditNoteDtoList);
//		return ghsCreditNoteDtoListResponse;
//	}

//	
//
//	@Override
//	public GhsCreditNoteTransferDto transferCreditNotesToServicePoss(String vendorCode,
//			GhsCreditNoteTransferDto ghsCreditNoteTransferDto) {
//		VendorDao vendor = validateVendor(vendorCode);
//		ServicePossAuditDao reference = getInitialServiceAuditDetails(vendor);
//		Gson gson = new Gson();
//		String jsonString = gson.toJson(ghsCreditNoteTransferDto);
//		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
//		setFinalGhsAuditDetails(reference, jsonObject.toString(), "TRANSFER_REQUEST_GHS_CN", Boolean.TRUE, "REFERENCE");
//		ServicePossAuditDao servicePossAudit = getInitialServiceAuditDetails(vendor);
//		InsertCNDetails insertCNDetails = getInsertCNDetails(ghsCreditNoteTransferDto, vendor);
//		String request = getJsonValueFromJaxbObject(insertCNDetails);
//		if (ghsCreditNoteTransferDto.getStatus().equalsIgnoreCase(GhsConstantsEnum.OPEN.name())) {
//			InsertCNDetailsResponse insertCNDetailsResponse = servicePossClient.transferCreditNotesToGhs(vendor,
//					insertCNDetails, servicePossAudit);
//			if (BooleanUtils.isTrue(insertCNDetailsResponse.isInsertCNDetailsResult())) {
//				setFinalGhsAuditDetails(servicePossAudit, request, getJsonValueFromJaxbObject(insertCNDetailsResponse),
//						Boolean.TRUE, GhsTransactionEnum.TRANSFER_CREDITNOTE.name());
//				return ghsCreditNoteTransferDto;
//			} else {
//				setFinalGhsAuditDetails(servicePossAudit, request, getJsonValueFromJaxbObject(insertCNDetailsResponse),
//						Boolean.FALSE, GhsTransactionEnum.TRANSFER_CREDITNOTE.name());
//				throw new ServiceException("Can't transfer credit note to GHS now, Try Again after Some time",
//						ERR_INT_042);
//			}
//		} else {
//			setFinalGhsAuditDetails(servicePossAudit, request, ghsCreditNoteTransferDto.getStatus(), Boolean.FALSE,
//					GhsTransactionEnum.TRANSFER_CREDITNOTE.name());
//			throw new ServiceException("Credit Notes with only status OPEN can be transferred to GHS", ERR_INT_048);
//		}
//	}
//
//
//	
//	private InsertCNDetails getInsertCNDetails(GhsCreditNoteTransferDto ghsCreditNoteTransferDto, VendorDao vendor) {
//		Integer customerId = getCustomerDetalils(ghsCreditNoteTransferDto, vendor);
//		POSSCreditNoteDO possCreditNoteDO = new POSSCreditNoteDO();
//		if (customerId > 0) {
//			possCreditNoteDO.setCustomerNo(customerId);
//			POSSCustomerMaster customer = new POSSCustomerMaster();
//			Gson gson = new Gson();
//			String jsonString = gson.toJson(ghsCreditNoteTransferDto.getCustomer());
//			JsonObject object = new JsonParser().parse(jsonString).getAsJsonObject();
//			JsonObject customerDao = new JsonObject();
//			JsonObject customerDetails = new JsonObject();
//			if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
//				customerDao = object.get(CUSTOMER).getAsJsonObject();
//				if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
//					customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
//							.getAsJsonObject().get("data").getAsJsonObject();
//				}
//			}
//			if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull()) {
//				customer.setULPMembershipID(customerDao.get(ULP_ID).getAsString());
//				customer.setTempULPID(customerDao.get(ULP_ID).getAsString());
//				customer.setLoyalityID(customerDao.get(ULP_ID).getAsString());
//			}
//			if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
//				customer.setMobileNo(CryptoUtil.decrypt(customerDao.get(MOBILE_NUMBER).getAsString(), MOBILE_NUMBER));
//			if (customerDao.get(EMAIL_ID) != null && !customerDao.get(EMAIL_ID).isJsonNull())
//				customer.setEmailID(CryptoUtil.decrypt(customerDao.get(EMAIL_ID).getAsString(), EMAIL_ID));
//			if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull()) {
//				customer.setBirthDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(BIRTHDAY))));
//			} else {
//				customer.setBirthDate(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
//			}
//			possCreditNoteDO.setAmount(ghsCreditNoteTransferDto.getAmount());
//			possCreditNoteDO.setLoginID(ghsCreditNoteTransferDto.getCreatedBy());
//			possCreditNoteDO.setCreatedDate(getXMLGregorianCalenderDate(ghsCreditNoteTransferDto.getCreatedDate()));
//			if (ghsCreditNoteTransferDto.getCreditNoteType().equals("ADV")) {
//				possCreditNoteDO.setCreditNoteType("Advance");
//			} else {
//				possCreditNoteDO.setCreditNoteType(ghsCreditNoteTransferDto.getCreditNoteType());
//			}
//
//			possCreditNoteDO.setDocDate(getXMLGregorianCalenderDate(ghsCreditNoteTransferDto.getDocDate()));
//			possCreditNoteDO.setDocNo(ghsCreditNoteTransferDto.getDocNo());
//			possCreditNoteDO.setLastModifiedID(ghsCreditNoteTransferDto.getLastModifiedBy());
//			possCreditNoteDO
//					.setLastModifiedDate(getXMLGregorianCalenderDate(ghsCreditNoteTransferDto.getLastModifiedDate()));
//			possCreditNoteDO.setLocationCode(CommonUtil.getLocationCode());
//			possCreditNoteDO.setRefDocNo(ghsCreditNoteTransferDto.getRefDocNo());
//			if (ghsCreditNoteTransferDto.getRefDocType().equals("ADV")) {
//				possCreditNoteDO.setRefDocType("Advance");
//			} else {
//				possCreditNoteDO.setRefDocType(ghsCreditNoteTransferDto.getRefDocType());
//			}
//
//			possCreditNoteDO.setRefFiscalYear(ghsCreditNoteTransferDto.getFiscalYear().intValue());
//			possCreditNoteDO.setStatus(GhsConstantsUtil.getGhsconstants().get(ghsCreditNoteTransferDto.getStatus()));
//			possCreditNoteDO.setFiscalYear(ghsCreditNoteTransferDto.getFiscalYear().intValue());
//			possCreditNoteDO.setRemarks(ghsCreditNoteTransferDto.getRemarks());
//			possCreditNoteDO.setTotalCashCollected(ghsCreditNoteTransferDto.getTotalCashCollected());
//			if(!StringUtils.isEmpty(ghsCreditNoteTransferDto.getAccountNumber())) {
//				possCreditNoteDO.setGHSAccNo(ghsCreditNoteTransferDto.getAccountNumber());
//			}
//			InsertCNDetails insertCNDetails = new InsertCNDetails();
//			insertCNDetails.setObjCNData(possCreditNoteDO);
//			return insertCNDetails;
//		} else {
//			throw new ServiceException("Error in customer sync for NAP and EGHS", "ERR-INT-094");
//		}
//
//	}

//	private Date getParsedDate(JsonElement jsonElement) {
//		Date dateToReturn = new Date();
//		try {
//			Long dateValue = jsonElement.getAsLong();
//			dateToReturn = CalendarUtils.convertStringToDate(
//					new SimpleDateFormat(DATE_FORMAT).format(java.sql.Date
//							.valueOf(Instant.ofEpochMilli(dateValue).atZone(ZoneId.systemDefault()).toLocalDate())),
//					DATE_FORMAT);
//		} catch (Exception e) {
//			dateToReturn = CalendarUtils.getCurrentDate();
//		}
//		return dateToReturn;
//	}
//
//	@Override
//	public GhsCreditNoteUpdateResponseDto updateCreditNoteAtServicePoss(int ghsDocNo, int fiscalYear, String vendorCode) {
//		VendorDao vendor = validateVendor(vendorCode);
//		UpdateCNAfterDownload updateCNAfterDownload = new UpdateCNAfterDownload();
//		updateCNAfterDownload.setCNlocationCode(CommonUtil.getLocationCode());
//		updateCNAfterDownload.setCNNo(ghsDocNo);
//		updateCNAfterDownload.setCNfiscalyear(fiscalYear);
//		JSONObject json = new JSONObject();
//		json.put("ghsDocNo", ghsDocNo);
//		json.put("fiscalYear", ghsDocNo);
//		json.put("locationCode", CommonUtil.getLocationCode());
//		String request = json.toString();
//		ServicePossAuditDao ghsAudit = getInitialServiceAuditDetails(vendor);
//		UpdateCNAfterDownloadResponse updateCNAfterDownloadResponse = servicePossClient.updateCreditNoteAtGhs(vendor,
//				updateCNAfterDownload, ghsAudit);
//		GhsCreditNoteUpdateResponseDto ghsCreditNoteUpdateResponseDto = new GhsCreditNoteUpdateResponseDto();
//		if (BooleanUtils.isTrue(updateCNAfterDownloadResponse.isUpdateCNAfterDownloadResult())) {
//			ghsCreditNoteUpdateResponseDto.setResponseCode(HttpStatus.valueOf(HttpStatus.OK.name()).toString());
//			ghsCreditNoteUpdateResponseDto.setResponseMessage("Credit Note successfully Updated in GHS");
//			setFinalGhsAuditDetails(ghsAudit, request, updateCNAfterDownloadResponse.toString(), Boolean.TRUE,
//					GhsTransactionEnum.UPDATE_CREDITNOTE.name());
//			return ghsCreditNoteUpdateResponseDto;
//		} else {
//			setFinalGhsAuditDetails(ghsAudit, request, updateCNAfterDownloadResponse.toString(), Boolean.FALSE,
//					GhsTransactionEnum.UPDATE_CREDITNOTE.name());
//			throw new ServiceException("Can't update the credit note details now", ERR_INT_043);
//		}
//	}


	@Override
	public ServiceCashCollectedDto getCashCollectedAtServicePoss(String mobileNo,String locationCode,
			String businessDate) {
		if (mobileNo == null)
			throw new ServiceException("mobileNo can't be empty", ERR_INT_100);
		log.info("Location code: {}, mobile number: {}, business date: {}", locationCode,
				mobileNo, businessDate); 
		ServiceRevDto serviceDto = new ServiceRevDto();
		serviceDto.setMobileNo(mobileNo);
		serviceDto.setLocationCode(locationCode);
		serviceDto.setBusinessDate(businessDate);
		VendorDao vendor = validateVendor(VENDOR_CODE);
		ServicePossAuditDao serviceAudit = getInitialServiceAuditDetails(vendor);
		ServicePossVendorDetailsDto servicePossVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
						ServicePossVendorDetailsDto.class));
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(servicePossVendorDetailsDto.getGetCashByCustomer() +businessDate +"/" +locationCode +"/" 
		+"MOBILE_NO/" +mobileNo);
        String url = servicePossVendorDetailsDto.getGetCashByCustomer() +businessDate +"/" +locationCode +"/" 
        		+"MOBILE_NO/" +mobileNo;
        ServiceCashCollectedDto resposeObj = getDataFromService(uriBuilder, servicePossVendorDetailsDto, vendor);
        setFinalServiceAuditDetails(serviceAudit, MapperUtil.getJsonString(serviceDto), 
				MapperUtil.getJsonString(resposeObj),Boolean.TRUE, ServiceTransactionEnum.CASH_COLLECTED_SERVICE.name(),url);
			return resposeObj;
	}

//	private CNDetailsForPassBook getCnDetailsForPassbook(GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto,
//			GetGHAccountMasterForIdResponse getGHAccountMasterForIdResponse) {
//		CNDetailsForPassBook cNDetailsForPassBook = new CNDetailsForPassBook();
//		cNDetailsForPassBook.setMaturedRefDocNo(ghsAccountMasterUpdateDto.getMaturedDocNo());
//		cNDetailsForPassBook.setMaturedRefDocType(ghsAccountMasterUpdateDto.getMaturedDocType());
//		cNDetailsForPassBook.setMaturedRefFiscalYear(ghsAccountMasterUpdateDto.getFiscalYear());
//		cNDetailsForPassBook.setIsNewCN(ghsAccountMasterUpdateDto.getIsNewCn());
//		if (ghsAccountMasterUpdateDto.getGhsBonus() != null
//				&& ghsAccountMasterUpdateDto.getGhsBonus().compareTo(BigDecimal.ZERO) != 0) {
//			cNDetailsForPassBook.setGhsBonus(ghsAccountMasterUpdateDto.getGhsBonus());
//		} else {
//			cNDetailsForPassBook.setGhsBonus(
//					getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getOpeningTotalBonusAmount());
//		}
//		cNDetailsForPassBook.setCNdocNo(ghsAccountMasterUpdateDto.getCnDocNo());
//		cNDetailsForPassBook.setCNfiscalYear(ghsAccountMasterUpdateDto.getFiscalYear());
//		cNDetailsForPassBook.setAmount(ghsAccountMasterUpdateDto.getRedemptionAmount());
//		cNDetailsForPassBook.setGhsAccNo(ghsAccountMasterUpdateDto.getAccountNo());
//		cNDetailsForPassBook
//				.setGhsFiscalYear(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getFiscalYear());
//		cNDetailsForPassBook.setGhsLocationCode(
//				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getLocationCode());
//		cNDetailsForPassBook.setMaturedDate(getXMLGregorianCalenderDate(ghsAccountMasterUpdateDto.getBusinessDate()));
//		return cNDetailsForPassBook;
//	}
//
	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException("Vendor is not active", "ERR-INT-017");
		}
		checkIfRequiredFieldsAreThere(vendor);
		return vendor;
	}

	private void checkIfRequiredFieldsAreThere(VendorDao vendor) {
		Set<String> missingFields = new HashSet<>();
		addIfMissing(vendor.getBaseurl(), "base url", missingFields);
		if (!CollectionUtils.isEmpty(missingFields))
			throw new ServiceException("Some Required fields are missing", ERR_INT_055, missingFields);
	}

	private void addIfMissing(String val, String toAdd, Set<String> missingFields) {
		if (StringUtils.isEmpty(val))
			missingFields.add(toAdd);
	}

	@Override
	public Map<String, List<ServicePossRevenueDto>>getServicePossTodayRevenueForEod(ServicePossRequestDto servicePossRequestDto) {
		VendorDao vendor = validateVendor(VENDOR_CODE);
		servicePossRequestDto.setBusinessDate(servicePossRequestDto.getBusinessDate());
		servicePossRequestDto.setLocationCode(CommonUtil.getLocationCode());
		ServicePossAuditDao serviceAudit = getInitialServiceAuditDetails(vendor);
		ServicePossVendorDetailsDto servicePossVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
						ServicePossVendorDetailsDto.class));
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(servicePossVendorDetailsDto.getGetEODRevenueByDate());
		String username = servicePossVendorDetailsDto.getUsername();
		String password = servicePossVendorDetailsDto.getPassword();
		String basicAuth = username + ":" + password;
		String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);
		Gson gson = new Gson();
		String jsonString = gson.toJson(servicePossRequestDto);
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			sendPostRequest.setEntity(new StringEntity(jsonObject.toString()));
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, 1,
					30, null);
		} catch (Exception e) {

			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
		}
		Map<String, List<ServicePossRevenueDto>> results = new HashMap();
		List<ServicePossRevenueDto> response = new ArrayList<>();
		String resposeObj;
		if (httpResponseUtil.getHttpResponseCode() == 200
				&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			resposeObj = httpResponseUtil.getResponse();
			getServiceRevenueResData(resposeObj,response);
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
		}
		results.put("results", response);
		String url = servicePossVendorDetailsDto.getGetEODRevenueByDate();
		setFinalServiceAuditDetails(serviceAudit, MapperUtil.getJsonString(servicePossRequestDto), 
				MapperUtil.getJsonString(results),Boolean.TRUE, ServiceTransactionEnum.GET_EOD_REVENUE.name(),url);
		return results;
		

	}

	@Override
	public Map<String, List<ServicePossRevenueDto>> getServicePossTodayRevenue(ServicePossRequestDto servicePossRequestDto) {
		VendorDao vendor = validateVendor(VENDOR_CODE);
		servicePossRequestDto.setBusinessDate(servicePossRequestDto.getBusinessDate());
		servicePossRequestDto.setLocationCode(CommonUtil.getLocationCode());
		ServicePossAuditDao serviceAudit = getInitialServiceAuditDetails(vendor);
		ServicePossVendorDetailsDto servicePossVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
						ServicePossVendorDetailsDto.class));
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(servicePossVendorDetailsDto.getGetRevenueByDate());
		String username = servicePossVendorDetailsDto.getUsername();
		String password = servicePossVendorDetailsDto.getPassword();
		String basicAuth = username + ":" + password;
		String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);
		Gson gson = new Gson();
		String jsonString = gson.toJson(servicePossRequestDto);
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			sendPostRequest.setEntity(new StringEntity(jsonObject.toString()));
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, 1,
					30, null);
		} catch (Exception e) {

			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
		}
		Map<String, List<ServicePossRevenueDto>> results = new HashMap();
		List<ServicePossRevenueDto> response = new ArrayList<>();
		String resposeObj;
		if (httpResponseUtil.getHttpResponseCode() == 200
				&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			resposeObj = httpResponseUtil.getResponse();
			getServiceRevenueResData(resposeObj,response);
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
		}
		results.put("results", response);
		String url = servicePossVendorDetailsDto.getGetRevenueByDate();
		setFinalServiceAuditDetails(serviceAudit, MapperUtil.getJsonString(servicePossRequestDto), 
				MapperUtil.getJsonString(results),Boolean.TRUE, ServiceTransactionEnum.GET_TODAY_REVENUE.name(),url);
		return results;
	} 
	

	private void getServiceRevenueResData(String resposeObj,List<ServicePossRevenueDto> response) {
		JsonReader reader = new JsonReader(new StringReader(resposeObj));
		reader.setLenient(true);
		JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
		JsonArray jsonArray = jsonObject.get("results").getAsJsonArray();
		for(int i=0 ; i <jsonArray.size(); i++) {
			JsonObject result = jsonArray.get(i).getAsJsonObject();	
			ServicePossRevenueDto servicePossRevenue = new ServicePossRevenueDto();
			servicePossRevenue.setRevenueType(result.get("revenuetype").getAsString());
			JsonArray revenueArray = result.get("revenues").getAsJsonArray();
			List<ServiceRevenueDto> revenueDtoList = new ArrayList<>();
			for(int j=0 ; j <revenueArray.size(); j++) {
				JsonObject revenueObj = revenueArray.get(j).getAsJsonObject();
				ServiceRevenueDto revenueDto = new ServiceRevenueDto();
				if(!revenueObj.get("revenues").isJsonNull())
				revenueDto.setRevenues(revenueObj.get("revenues").getAsBigDecimal());
				if(!revenueObj.get("paymentcode").isJsonNull())
					if(revenueObj.get("paymentcode").getAsString().equals(PaymentCodeRevenueEnum.RAZORPAY.name())) {
						revenueDto.setPaymentCode(PaymentCodeEnum.RAZOR_PAY.getPaymentcode());
					}else {
						revenueDto.setPaymentCode(revenueObj.get("paymentcode").getAsString());			
					}
				if(!revenueObj.get("payments").isJsonNull())
				revenueDto.setPayments(revenueObj.get("payments").getAsBigDecimal());
				if(!revenueObj.get("returns").isJsonNull())
				revenueDto.setReturns(revenueObj.get("returns").getAsBigDecimal());	
				revenueDtoList.add(revenueDto);	
			}
			servicePossRevenue.setRevenues(revenueDtoList);		
			response.add(servicePossRevenue);	
			}
		
	}
	
//	@Override
//	public StringResponse checkCNStatus(int ghsDocNo, int fiscalYear, String vendorCode) {
//
//		StringResponse stringResponse = new StringResponse();
//		VendorDao vendor = validateVendor(vendorCode);
//		CheckCNStatus checkCNStatus = new CheckCNStatus();
//		checkCNStatus.setLocationCode(CommonUtil.getLocationCode());
//		checkCNStatus.setCNNo(ghsDocNo);
//		checkCNStatus.setCNFiscalYear(fiscalYear);
//		JSONObject json = new JSONObject();
//		json.put("ghsDocNo", ghsDocNo);
//		json.put("fiscalYear", ghsDocNo);
//		json.put("locationCode", CommonUtil.getLocationCode());
//		String request = json.toString();
//		ServicePossAuditDao ghsAudit = getInitialServiceAuditDetails(vendor);
//		CheckCNStatusResponse checkCNStatusResponse = servicePossClient.checkCNStatus(vendor, checkCNStatus, ghsAudit);
//		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(checkCNStatus),
//				getJsonValueFromJaxbObject(checkCNStatusResponse), Boolean.TRUE,
//				GhsTransactionEnum.CHECK_CN_STATUS.name());
//		stringResponse.setStatus(checkCNStatusResponse.getCheckCNStatusResult().substring(0,
//				checkCNStatusResponse.getCheckCNStatusResult().indexOf(',')));
//		return stringResponse;
//	}
	
	
	private ServiceCashCollectedDto getDataFromService(UriComponentsBuilder uriBuilder,
			ServicePossVendorDetailsDto servicePossVendorDetailsDto, VendorDao vendor) {

		String username = servicePossVendorDetailsDto.getUsername();
		String password = servicePossVendorDetailsDto.getPassword();
		String basicAuth = username + ":" + password;
		String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));
		HttpGet sendGetRequest = new HttpGet(uriBuilder.toUriString());
		sendGetRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendGetRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			   log.info("checking httpResponseUtil :{} ",httpResponseUtil);
		} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
		}
		 ServiceCashCollectedDto serviceCashCollectedDto = new  ServiceCashCollectedDto();

		if (httpResponseUtil.getHttpResponseCode() == 200
				&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			 Object obj = MapperUtil.getJsonFromString(httpResponseUtil.getResponse());
			serviceCashCollectedDto = MapperUtil.getObjectMapperInstance().convertValue(obj, ServiceCashCollectedDto.class);
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
		}

		return serviceCashCollectedDto;
	}

	@Override
	public Object updateBtqMetalRate(List<ServiceMetalRequestDto> serviceMetalRequestDtoList) {
		VendorDao vendor = validateVendor(VENDOR_CODE);
		ServicePossAuditDao serviceAudit = getInitialServiceAuditDetails(vendor);
		ServicePossVendorDetailsDto servicePossVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
						ServicePossVendorDetailsDto.class));
		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(servicePossVendorDetailsDto.getGetUpdateBtqMetalRate());
		String username = servicePossVendorDetailsDto.getUsername();
		String password = servicePossVendorDetailsDto.getPassword();
		String basicAuth = username + ":" + password;
		String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);
		Gson gson = new Gson();
		String jsonString = gson.toJson(serviceMetalRequestDtoList);
		JsonArray jsonArray = new JsonParser().parse(jsonString).getAsJsonArray();
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			sendPostRequest.setEntity(new StringEntity(jsonArray.toString()));
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, 1,
					30, null);
			 log.info("checking httpResponseUtil :{} ",httpResponseUtil);
		} catch (Exception e) {

			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
		}
		Object resposeObj = new Object();
		if (httpResponseUtil.getHttpResponseCode() == 200
				&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			resposeObj = httpResponseUtil.getResponse();
		} else {
			return resposeObj;
			//throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
		}
		String url = servicePossVendorDetailsDto.getGetUpdateBtqMetalRate();
		setFinalServiceAuditDetails(serviceAudit, MapperUtil.getJsonString(serviceMetalRequestDtoList), 
				MapperUtil.getJsonString(resposeObj),Boolean.TRUE, ServiceTransactionEnum.UPDATE_BTQ_METALRATE.name(),url);
		return resposeObj;
	}
	
	private ServicePossAuditDao getInitialServiceAuditDetails(VendorDao vendor) {
		ServicePossAuditDao serviceAudit = new ServicePossAuditDao();
		Integer maxId = spAuditRepository.getMaxSeqNo(CommonUtil.getLocationCode());
		serviceAudit.setSequenceNo(++maxId);
		serviceAudit.setLocationCode(CommonUtil.getLocationCode());
		serviceAudit.setVendor(vendor);
		serviceAudit.setRequestTime(CalendarUtils.getCurrentDate());
		return serviceAudit;
	}
	
	private void setFinalServiceAuditDetails(ServicePossAuditDao serviceAudit, String request, String response,
			Boolean transactionStatus, String transactionType,String httpUrl) {
		serviceAudit.setRequest(request);
		serviceAudit.setResponse(response);
		serviceAudit.setTransactionStatus(transactionStatus);
		serviceAudit.setHttpStatus(200);
		serviceAudit.setResponseTime(CalendarUtils.getCurrentDate());
		serviceAudit.setTransactionType(transactionType);
		serviceAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - serviceAudit.getRequestTime().getTime());
		serviceAudit.setUrl(httpUrl);
		spAuditRepository.save(serviceAudit);
	}




}
