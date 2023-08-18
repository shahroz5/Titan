/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.apache.commons.lang.BooleanUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.HttpMethod;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.fasterxml.jackson.databind.AnnotationIntrospector;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.GhsTransactionEnum;
import com.titan.poss.core.domain.constant.enums.GhsSchemeTypeEnum;
import com.titan.poss.core.dto.BoutiqueGoldPriceMasterDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayActivityDto;
import com.titan.poss.core.dto.CreditNoteStatusUpdateDto;
import com.titan.poss.core.dto.GhsAccountDetailsResponseDto;
import com.titan.poss.core.dto.GhsAccountMasterUpdateDto;
import com.titan.poss.core.dto.GhsCashResponseDto;
import com.titan.poss.core.dto.GhsCreditNoteTransferDto;
import com.titan.poss.core.dto.GhsCreditNoteUpdateResponseDto;
import com.titan.poss.core.dto.GhsDocsResponseDto;
import com.titan.poss.core.dto.GhsRedeemAccountDto;
import com.titan.poss.core.dto.GhsRedeemAccountResponseDto;
import com.titan.poss.core.dto.RevenueDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.GhsAccountDetailsStatusEnum;
import com.titan.poss.core.enums.GhsConstantsEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.GhsDiscountVoucherRedeemResponseDto;
import com.titan.poss.core.response.GhsDiscountVoucherResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.core.service.clients.SalesServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.VendorDataDto;
import com.titan.poss.integration.dto.request.CashCollectedAtGhsRequestDto;
import com.titan.poss.integration.dto.request.GhsAccountDetailsRequestDto;
import com.titan.poss.integration.dto.request.GhsBodRequestDto;
import com.titan.poss.integration.dto.request.GhsDiscountVoucherRedeemRequestDto;
import com.titan.poss.integration.dto.request.GhsTodayRevenueRequestDto;
import com.titan.poss.integration.dto.response.GhsCreditNoteDto;
import com.titan.poss.integration.dto.response.GhsTodayRevenueDto;
import com.titan.poss.integration.dto.response.PossCashPaidDetailsDto;
import com.titan.poss.integration.eghs.generated.BTQBODDone;
import com.titan.poss.integration.eghs.generated.BTQEODDone;
import com.titan.poss.integration.eghs.generated.BTQEODDoneResponse;
import com.titan.poss.integration.eghs.generated.CNDetailsForPassBook;
import com.titan.poss.integration.eghs.generated.CNDetailsForPassBookResponse;
import com.titan.poss.integration.eghs.generated.CheckBODStatus;
import com.titan.poss.integration.eghs.generated.CheckBODStatusResponse;
import com.titan.poss.integration.eghs.generated.CheckCNStatus;
import com.titan.poss.integration.eghs.generated.CheckCNStatusResponse;
import com.titan.poss.integration.eghs.generated.CheckCustomerAteGHS;
import com.titan.poss.integration.eghs.generated.CheckCustomerAteGHSResponse;
import com.titan.poss.integration.eghs.generated.CheckEODStatus;
import com.titan.poss.integration.eghs.generated.CheckEODStatusResponse;
import com.titan.poss.integration.eghs.generated.ClearAllActiveSessionForLocation;
import com.titan.poss.integration.eghs.generated.DeletePartialAccOnException;
import com.titan.poss.integration.eghs.generated.DeletePartialAccOnExceptionResponse;
import com.titan.poss.integration.eghs.generated.DiscountVoucherDetails;
import com.titan.poss.integration.eghs.generated.DownloadCreditNotesForLocation;
import com.titan.poss.integration.eghs.generated.DownloadCreditNotesForLocationResponse;
import com.titan.poss.integration.eghs.generated.GetACHdetailDOResponse;
import com.titan.poss.integration.eghs.generated.GetAttachments;
import com.titan.poss.integration.eghs.generated.GetAttachmentsResponse;
import com.titan.poss.integration.eghs.generated.GetGHAccountMasterForId;
import com.titan.poss.integration.eghs.generated.GetGHAccountMasterForIdResponse;
import com.titan.poss.integration.eghs.generated.GetRevenuePOSSReportNAP;
import com.titan.poss.integration.eghs.generated.GetRevenuePOSSReportNAPResponse;
import com.titan.poss.integration.eghs.generated.GetSIdetailDOResponse;
import com.titan.poss.integration.eghs.generated.GetTodaysGHSRevenueNAP;
import com.titan.poss.integration.eghs.generated.GetTodaysGHSRevenueNAPResponse;
import com.titan.poss.integration.eghs.generated.InsertCNDetails;
import com.titan.poss.integration.eghs.generated.InsertCNDetailsResponse;
import com.titan.poss.integration.eghs.generated.InstallmentDetailsForCashRestrictionNAPUpdated;
import com.titan.poss.integration.eghs.generated.InstallmentDetailsForCashRestrictionNAPUpdatedResponse;
import com.titan.poss.integration.eghs.generated.POSSBTQGoldPriceMasterDO;
import com.titan.poss.integration.eghs.generated.POSSCreditNoteDO;
import com.titan.poss.integration.eghs.generated.POSSCustomerMaster;
import com.titan.poss.integration.eghs.generated.POSSGetDiscountVoucherDetailsNAP;
import com.titan.poss.integration.eghs.generated.POSSGetDiscountVoucherDetailsNAPResponse;
import com.titan.poss.integration.eghs.generated.POSSGetInvalidDiscountVoucherDetailsNAP;
import com.titan.poss.integration.eghs.generated.POSSGetInvalidDiscountVoucherDetailsNAPResponse;
import com.titan.poss.integration.eghs.generated.POSSUpdateDiscountVoucher;
import com.titan.poss.integration.eghs.generated.POSSUpdateDiscountVoucherResponse;
import com.titan.poss.integration.eghs.generated.PossCustomerDetails;
import com.titan.poss.integration.eghs.generated.SavePossCustomer;
import com.titan.poss.integration.eghs.generated.SavePossCustomerResponse;
import com.titan.poss.integration.eghs.generated.UpdateCNAfterDownload;
import com.titan.poss.integration.eghs.generated.UpdateCNAfterDownloadResponse;
import com.titan.poss.integration.eghs.generated.UpdateGR;
import com.titan.poss.integration.eghs.generated.UpdateGRResponse;
import com.titan.poss.integration.eghs.generated.UpdateHoldStatusforAccountOnMaturity;
import com.titan.poss.integration.eghs.generated.UpdateHoldStatusforAccountOnMaturityResponse;
import com.titan.poss.integration.eghs.generated.UpdateThresholdAmountforLocation;
import com.titan.poss.integration.eghs.generated.UpdateThresholdAmountforLocationResponse;
import com.titan.poss.integration.intg.dao.GhsAuditDao;
import com.titan.poss.integration.intg.repository.GhsAuditRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.GhsService;
import com.titan.poss.integration.util.GhsConstantsUtil;
import com.titan.poss.sales.constants.PaymentCodeRevenueEnum;
import com.titan.poss.sales.constants.RevenueTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Slf4j
@Service("IntegrationGhsService")
public class GhsServiceImpl implements GhsService {

	@Autowired
	private GhsClient ghsClient;

	@Autowired
	private GhsAuditRepository ghsAuditRepository;

	@Autowired
	private VendorRepository vendorRepository;

	@Value("${cloud.aws.s3.expTime}")
	private String expTimeSeconds;

	@Autowired
	@Qualifier("ghs")
	private AmazonS3 s3eGHS;

	@Autowired
	private SalesServiceClient salesServiceClient;

	private static final String ERR_INT_039 = "ERR-INT-039";
	private static final String ERR_INT_040 = "ERR-INT-040";
	private static final String ERR_INT_041 = "ERR-INT-041";
	private static final String ERR_INT_042 = "ERR-INT-042";
	private static final String ERR_INT_043 = "ERR-INT-043";
	private static final String ERR_INT_044 = "ERR-INT-044";
	private static final String ERR_INT_047 = "ERR-INT-047";
	private static final String ERR_INT_048 = "ERR-INT-048";
	private static final String ERR_INT_049 = "ERR-INT-049";
	private static final String ERR_INT_051 = "ERR-INT-051";
	private static final String ERR_INT_052 = "ERR-INT-052";
	private static final String ERR_INT_053 = "ERR-INT-053";
	private static final String ERR_INT_054 = "ERR-INT-054";
	private static final String ERR_INT_055 = "ERR-INT-055";
	private static final String ERR_INT_027 = "ERR-INT-027";
	private static final String ERR_INT_078 = "ERR-INT-078";
	private static final String ERR_INT_101 ="ERR-INT-101";
	
	

	private static final String NO_DATA = "No data is present for the request";
	private static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
	private static final String CUSTOMER = "customer";
	private static final String CUSTOMER_LOCATION_MAPPING = "customerLocationMapping";
	private static final String CUSTOMER_LOCATION_MAPPING_ID = "customerLocationMappingId";
	private static final String CUSTOMER_DETAILS = "customerDetails";
	private static final String LOCATION_CODE = "locationCode";
	private static final String CREATED_BY = "createdBy";
	private static final String CREATED_DATE = "createdDate";
	private static final String LAST_MODIFIED_BY = "lastModifiedBy";
	private static final String LAST_MODIFIED_DATE = "lastModifiedDate";
	private static final String BIRTHDAY = "birthday";
	private static final String CUSTOMER_NAME = "customerName";
	private static final String TITLE = "title";
	private static final String EMAIL_ID = "emailId";
	private static final String IS_ACTIVE = "isActive";
	private static final String MOBILE_NUMBER = "mobileNumber";
	private static final String ANNIVERSARY = "anniversary";
	private static final String SPOUSE_BIRTH_DAY = "spouseBirthday";
	private static final String ULP_ID = "ulpId";
	private static final String CAN_SEND_SMS = "canSendSMS";
	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String CATCHMENT_NAME = "catchmentName";
	private static final String IS_HARD_COPY_SUBMITTED = "isHardCopySubmitted";
	private static final String CITY = "city";
	private static final String STATE = "state";
	private static final String ADDRESS_LINES = "addressLines";
	private static final String PIN_CODE = "pincode";
	private static final String CUSTOMER_ID = "customerId";
	private static final String ACCOUNT_INFO_NOT_AVAILABLE="Account information not available for :";

	@Override
	public ListResponse<GhsCreditNoteDto> getCreditNotesFromGhs(String vendorCode) {
		VendorDao vendor = validateVendor(vendorCode);
		DownloadCreditNotesForLocation downloadCreditNotesForLocation = new DownloadCreditNotesForLocation();
		downloadCreditNotesForLocation.setLocationCode(CommonUtil.getLocationCode());
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		DownloadCreditNotesForLocationResponse downloadCreditNotesForLocationResponse = ghsClient
				.getCreditNotesFromGhs(vendor, downloadCreditNotesForLocation, ghsAudit);
		String request = new JSONObject().put("locationCode", CommonUtil.getLocationCode()).toString();
		String response = getJsonValueFromJaxbObject(downloadCreditNotesForLocationResponse);
		ListResponse<GhsCreditNoteDto> ghsCreditNoteDtoListResponse = new ListResponse<>();
		List<GhsCreditNoteDto> ghsCreditNoteDtoList = new ArrayList<>();
		if (downloadCreditNotesForLocationResponse.getDownloadCreditNotesForLocationResult()
				.getPOSSCreditNoteDO() != null
				&& !downloadCreditNotesForLocationResponse.getDownloadCreditNotesForLocationResult()
						.getPOSSCreditNoteDO().isEmpty()) {
			downloadCreditNotesForLocationResponse.getDownloadCreditNotesForLocationResult().getPOSSCreditNoteDO()
					.forEach(possCreditNote -> {
						GhsCreditNoteDto ghsCreditNoteDto = new GhsCreditNoteDto();
						ghsCreditNoteDto.setCreditNoteType(possCreditNote.getCreditNoteType());
						ghsCreditNoteDto.setAmount(possCreditNote.getAmount());
						ghsCreditNoteDto.setGhsDocNo(possCreditNote.getDocNo());
						ghsCreditNoteDto.setCnDocNo(possCreditNote.getPOSSCNNo());
						ghsCreditNoteDto.setFiscalYear(possCreditNote.getFiscalYear());
						if (possCreditNote.getCustomerDetails() != null) {
							ghsCreditNoteDto.setCustomerName(possCreditNote.getCustomerDetails().getName());
							ghsCreditNoteDto.setCustomerId(possCreditNote.getCustomerDetails().getCustomerID());
							ghsCreditNoteDto.setMobileNumber(possCreditNote.getCustomerDetails().getMobileNo());
							ghsCreditNoteDto.setUlpId(possCreditNote.getCustomerDetails().getULPMembershipID());
						}
						for (Map.Entry<String, Integer> entry : GhsConstantsUtil.getGhsconstants().entrySet()) {
							if (possCreditNote.getStatus() == entry.getValue()) {
								ghsCreditNoteDto.setStatus(CNStatus.TRANSFER_GHS.name());
							}
						}
						ghsCreditNoteDtoList.add(ghsCreditNoteDto);
					});
			setFinalGhsAuditDetails(ghsAudit, request, response, Boolean.TRUE,
					GhsTransactionEnum.GET_CREDITNOTE.name());
		} else {
			setFinalGhsAuditDetails(ghsAudit, request, NO_DATA, Boolean.FALSE,
					GhsTransactionEnum.GET_CREDITNOTE.name());
			throw new ServiceException(NO_DATA, ERR_INT_041);
		}
		ghsCreditNoteDtoListResponse.setResults(ghsCreditNoteDtoList);
		return ghsCreditNoteDtoListResponse;
	}

	@Override
	public BoutiqueGoldPriceMasterDto updateGR(String vendorCode,
			BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto) {
		VendorDao vendor = validateVendor(vendorCode);
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		UpdateGR updateGR = getUpdateGR(boutiqueGoldPriceMasterDto, vendor);
		String request = getJsonValueFromJaxbObject(updateGR);
		UpdateGRResponse updateGRResponse = ghsClient.updateGR(vendor, updateGR, ghsAudit);
		log.info(MapperUtil.getJsonString(updateGRResponse));
		if (BooleanUtils.isTrue(updateGRResponse.isUpdateGRResult())) {
			setFinalGhsAuditDetails(ghsAudit, request, getJsonValueFromJaxbObject(updateGRResponse), Boolean.TRUE,
					GhsTransactionEnum.UPDATE_GR.name());
			return boutiqueGoldPriceMasterDto;
		} else {
			setFinalGhsAuditDetails(ghsAudit, request, getJsonValueFromJaxbObject(updateGRResponse), Boolean.FALSE,
					GhsTransactionEnum.UPDATE_GR.name());
			throw new ServiceException("Can't update the gold rate in GHS", ERR_INT_040);
		}
	}

	private UpdateGR getUpdateGR(BoutiqueGoldPriceMasterDto boutiqueGoldPriceMasterDto, VendorDao vendor) {
		POSSBTQGoldPriceMasterDO possbtqGoldPriceMasterDO = new POSSBTQGoldPriceMasterDO();
		possbtqGoldPriceMasterDO.setLocationCode(CommonUtil.getLocationCode());
		possbtqGoldPriceMasterDO.setBTQPrice(boutiqueGoldPriceMasterDto.getBtqPrice());
		possbtqGoldPriceMasterDO.setRemarks(boutiqueGoldPriceMasterDto.getRemarks());
		possbtqGoldPriceMasterDO.setIsBTQEffective(boutiqueGoldPriceMasterDto.isBTQEffective());
		possbtqGoldPriceMasterDO.setLoginID(boutiqueGoldPriceMasterDto.getLoginID());
		possbtqGoldPriceMasterDO
				.setCreatedDate(getXMLGregorianCalenderDate(boutiqueGoldPriceMasterDto.getCreatedDate()));
		possbtqGoldPriceMasterDO.setLastModifiedID(boutiqueGoldPriceMasterDto.getLastModifiedID());
		possbtqGoldPriceMasterDO
				.setLastModifiedDate(getXMLGregorianCalenderDate(boutiqueGoldPriceMasterDto.getLastModifiedDate()));
		possbtqGoldPriceMasterDO
				.setApplicableDate(getXMLGregorianCalenderDate(boutiqueGoldPriceMasterDto.getApplicableDate()));
		UpdateGR updateGR = new UpdateGR();
		updateGR.setObjGR(possbtqGoldPriceMasterDO);
		return updateGR;
	}

	@Override
	public GhsCreditNoteTransferDto transferCreditNotesToGhs(String vendorCode,
			GhsCreditNoteTransferDto ghsCreditNoteTransferDto) {
		VendorDao vendor = validateVendor(vendorCode);
		GhsAuditDao reference = getInitialGhsAuditDetails(vendor);
		Gson gson = new Gson();
		String jsonString = gson.toJson(ghsCreditNoteTransferDto);
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		setFinalGhsAuditDetails(reference, jsonObject.toString(), "TRANSFER_REQUEST_GHS_CN", Boolean.TRUE, "REFERENCE");
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		InsertCNDetails insertCNDetails = getInsertCNDetails(ghsCreditNoteTransferDto, vendor);
		String request = getJsonValueFromJaxbObject(insertCNDetails);
		if (ghsCreditNoteTransferDto.getStatus().equalsIgnoreCase(GhsConstantsEnum.OPEN.name())) {
			InsertCNDetailsResponse insertCNDetailsResponse = ghsClient.transferCreditNotesToGhs(vendor,
					insertCNDetails, ghsAudit);
			if (BooleanUtils.isTrue(insertCNDetailsResponse.isInsertCNDetailsResult())) {
				setFinalGhsAuditDetails(ghsAudit, request, getJsonValueFromJaxbObject(insertCNDetailsResponse),
						Boolean.TRUE, GhsTransactionEnum.TRANSFER_CREDITNOTE.name());
				return ghsCreditNoteTransferDto;
			} else {
				setFinalGhsAuditDetails(ghsAudit, request, getJsonValueFromJaxbObject(insertCNDetailsResponse),
						Boolean.FALSE, GhsTransactionEnum.TRANSFER_CREDITNOTE.name());
				throw new ServiceException("Can't transfer credit note to GHS now, Try Again after Some time",
						ERR_INT_042);
			}
		} else {
			setFinalGhsAuditDetails(ghsAudit, request, ghsCreditNoteTransferDto.getStatus(), Boolean.FALSE,
					GhsTransactionEnum.TRANSFER_CREDITNOTE.name());
			throw new ServiceException("Credit Notes with only status OPEN can be transferred to GHS", ERR_INT_048);
		}
	}

	private InsertCNDetails getInsertCNDetails(GhsCreditNoteTransferDto ghsCreditNoteTransferDto, VendorDao vendor) {
		Integer customerId = getCustomerDetalils(ghsCreditNoteTransferDto, vendor);
		POSSCreditNoteDO possCreditNoteDO = new POSSCreditNoteDO();
		if (customerId > 0) {
			possCreditNoteDO.setCustomerNo(customerId);
			POSSCustomerMaster customer = new POSSCustomerMaster();
			Gson gson = new Gson();
			String jsonString = gson.toJson(ghsCreditNoteTransferDto.getCustomer());
			JsonObject object = new JsonParser().parse(jsonString).getAsJsonObject();
			JsonObject customerDao = new JsonObject();
			JsonObject customerDetails = new JsonObject();
			if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
				customerDao = object.get(CUSTOMER).getAsJsonObject();
				if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
					customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
							.getAsJsonObject().get("data").getAsJsonObject();
				}
			}
			if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull()) {
				customer.setULPMembershipID(customerDao.get(ULP_ID).getAsString());
				customer.setTempULPID(customerDao.get(ULP_ID).getAsString());
				customer.setLoyalityID(customerDao.get(ULP_ID).getAsString());
			}
			if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
				customer.setMobileNo(CryptoUtil.decrypt(customerDao.get(MOBILE_NUMBER).getAsString(), MOBILE_NUMBER));
			if (customerDao.get(EMAIL_ID) != null && !customerDao.get(EMAIL_ID).isJsonNull())
				customer.setEmailID(CryptoUtil.decrypt(customerDao.get(EMAIL_ID).getAsString(), EMAIL_ID));
			if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull()) {
				customer.setBirthDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(BIRTHDAY))));
			} else {
				customer.setBirthDate(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
			}
			possCreditNoteDO.setAmount(ghsCreditNoteTransferDto.getAmount());
			possCreditNoteDO.setLoginID(ghsCreditNoteTransferDto.getCreatedBy());
			possCreditNoteDO.setCreatedDate(getXMLGregorianCalenderDate(ghsCreditNoteTransferDto.getCreatedDate()));
			if (ghsCreditNoteTransferDto.getCreditNoteType().equals("ADV")) {
				possCreditNoteDO.setCreditNoteType("Advance");
			} else {
				possCreditNoteDO.setCreditNoteType(ghsCreditNoteTransferDto.getCreditNoteType());
			}

			possCreditNoteDO.setDocDate(getXMLGregorianCalenderDate(ghsCreditNoteTransferDto.getDocDate()));
			possCreditNoteDO.setDocNo(ghsCreditNoteTransferDto.getDocNo());
			possCreditNoteDO.setLastModifiedID(ghsCreditNoteTransferDto.getLastModifiedBy());
			possCreditNoteDO
					.setLastModifiedDate(getXMLGregorianCalenderDate(ghsCreditNoteTransferDto.getLastModifiedDate()));
			possCreditNoteDO.setLocationCode(CommonUtil.getLocationCode());
			possCreditNoteDO.setRefDocNo(ghsCreditNoteTransferDto.getRefDocNo());
			if (ghsCreditNoteTransferDto.getRefDocType().equals("ADV")) {
				possCreditNoteDO.setRefDocType("Advance");
			} else {
				possCreditNoteDO.setRefDocType(ghsCreditNoteTransferDto.getRefDocType());
			}

			possCreditNoteDO.setRefFiscalYear(ghsCreditNoteTransferDto.getFiscalYear().intValue());
			possCreditNoteDO.setStatus(GhsConstantsUtil.getGhsconstants().get(ghsCreditNoteTransferDto.getStatus()));
			possCreditNoteDO.setFiscalYear(ghsCreditNoteTransferDto.getFiscalYear().intValue());
			possCreditNoteDO.setRemarks(ghsCreditNoteTransferDto.getRemarks());
			possCreditNoteDO.setTotalCashCollected(ghsCreditNoteTransferDto.getTotalCashCollected());
			if (!StringUtils.isEmpty(ghsCreditNoteTransferDto.getAccountNumber())) {
				possCreditNoteDO.setGHSAccNo(ghsCreditNoteTransferDto.getAccountNumber());
			}
			InsertCNDetails insertCNDetails = new InsertCNDetails();
			insertCNDetails.setObjCNData(possCreditNoteDO);
			return insertCNDetails;
		} else {
			throw new ServiceException("Error in customer sync for NAP and EGHS", "ERR-INT-094");
		}

	}

	private Integer getCustomerDetalils(GhsCreditNoteTransferDto ghsCreditNoteTransferDto, VendorDao vendor) {
		Gson gson = new Gson();
		String jsonString = gson.toJson(ghsCreditNoteTransferDto.getCustomer());
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		POSSCustomerMaster customer = new POSSCustomerMaster();
		customer = createGHSCustomerCheck(jsonObject, customer, vendor);
		if (customer.getCustomerID() > 0)
			return customer.getCustomerID();
		else
			return 0;
	}

	private POSSCustomerMaster createGHSCustomerCheck(JsonObject object, POSSCustomerMaster customer,
			VendorDao vendor) {
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		JsonObject customerDao = new JsonObject();
		JsonObject customerlocationMappingDao = new JsonObject();
		JsonObject customerDetails = new JsonObject();
		if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
			customerDao = object.get(CUSTOMER).getAsJsonObject();
			if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
				customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
						.getAsJsonObject().get("data").getAsJsonObject();
			}
		}
		if (object.get(CUSTOMER_LOCATION_MAPPING) != null && !object.get(CUSTOMER_LOCATION_MAPPING).isJsonNull()) {
			customerlocationMappingDao = object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject();
		}
		if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull()) {
			customer.setULPMembershipID(customerDao.get(ULP_ID).getAsString());
			customer.setTempULPID(customerDao.get(ULP_ID).getAsString());
			customer.setLoyalityID(customerDao.get(ULP_ID).getAsString());
		}
		if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
			customer.setMobileNo(CryptoUtil.decrypt(customerDao.get(MOBILE_NUMBER).getAsString(), MOBILE_NUMBER));
		if (customerDao.get(EMAIL_ID) != null && !customerDao.get(EMAIL_ID).isJsonNull())
			customer.setEmailID(CryptoUtil.decrypt(customerDao.get(EMAIL_ID).getAsString(), EMAIL_ID));
		if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull()) {
			customer.setBirthDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(BIRTHDAY))));
		} else {
			customer.setBirthDate(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
		}
		if (customerDetails.get(ADDRESS_LINES) != null && !customerDetails.get(ADDRESS_LINES).isJsonNull()) {
			JsonArray jsonArrayResponse = customerDetails.get(ADDRESS_LINES).getAsJsonArray();
			String address1 = null;
			String address2 = null;
			String address3 = null;
			Integer size = jsonArrayResponse.size();
			if (size >= 1 && !StringUtils.isEmpty(jsonArrayResponse.get(0)))
				address1 = jsonArrayResponse.get(0).getAsString();
			if (size >= 2 && !StringUtils.isEmpty(jsonArrayResponse.get(1)))
				address1 = address1 + ", " + jsonArrayResponse.get(1).getAsString();
			customer.setAddress1(address1);
			if (size >= 3 && !StringUtils.isEmpty(jsonArrayResponse.get(2)))
				address2 = jsonArrayResponse.get(2).getAsString();
			customer.setAddress2(address2);
			if (size >= 4 && !StringUtils.isEmpty(jsonArrayResponse.get(3)))
				address3 = jsonArrayResponse.get(3).getAsString();
			customer.setAddress3(address3);
		}
		if (customerDetails.get(ANNIVERSARY) != null && !customerDetails.get(ANNIVERSARY).isJsonNull())
			customer.setAnniversaryDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(ANNIVERSARY))));
		if (customerDetails.get(CAN_SEND_SMS) != null && !customerDetails.get(CAN_SEND_SMS).isJsonNull())
			customer.setSendSms(customerDetails.get(CAN_SEND_SMS).getAsBoolean());
		if (customerDao.get(IS_ACTIVE) != null && !customerDao.get(IS_ACTIVE).isJsonNull())
			customer.setIsActive(customerDao.get(IS_ACTIVE).getAsBoolean());
		if (customerDetails.get(CATCHMENT_NAME) != null && !customerDetails.get(CATCHMENT_NAME).isJsonNull())
			customer.setCatchmentArea(customerDetails.get(CATCHMENT_NAME).getAsString());
		if (customerDetails.get(CITY) != null && !customerDetails.get(CITY).isJsonNull())
			customer.setCityName(customerDetails.get(CITY).getAsString());
		if (customerDetails.get(STATE) != null && !customerDetails.get(STATE).isJsonNull())
			customer.setStateName(customerDetails.get(STATE).getAsString());
		if (customerDao.get(CUST_TAX_NO) != null && !customerDao.get(CUST_TAX_NO).isJsonNull())
			customer.setPanCardNo(CryptoUtil.decrypt(customerDao.get(CUST_TAX_NO).getAsString(), CUST_TAX_NO));
		if (customerDao.get(CREATED_BY) != null && !customerDao.get(CREATED_BY).isJsonNull())
			customer.setCreatedBy(customerDao.get(CREATED_BY).getAsString());
		if (customerDao.get(CREATED_DATE) != null && !customerDao.get(CREATED_DATE).isJsonNull())
			customer.setCreatedDate(getXMLGregorianCalenderDate(getParsedDate(customerDao.get(CREATED_DATE))));
		customer.setLoginID(CommonUtil.getUserName());
		if (customerDao.get(LAST_MODIFIED_BY) != null && !customerDao.get(LAST_MODIFIED_BY).isJsonNull())
			customer.setLastModifiedID(customerDao.get(LAST_MODIFIED_BY).getAsString());
		if (customerDao.get(LAST_MODIFIED_DATE) != null && !customerDao.get(LAST_MODIFIED_DATE).isJsonNull())
			customer.setLastModifiedDate(
					getXMLGregorianCalenderDate(getParsedDate(customerDao.get(LAST_MODIFIED_DATE))));
		if (customerDao.get(CUSTOMER_NAME) != null && !customerDao.get(CUSTOMER_NAME).isJsonNull())
			customer.setName(CryptoUtil.decrypt(customerDao.get(CUSTOMER_NAME).getAsString(), CUSTOMER_NAME));
		if (customerDetails.get(PIN_CODE) != null && !customerDetails.get(PIN_CODE).isJsonNull())
			customer.setPinCode(customerDetails.get(PIN_CODE).getAsString());
		if (customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID) != null
				&& !customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID).isJsonNull()) {
			customer.setLocationCode(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(LOCATION_CODE).getAsString());
			customer.setCustomerNo(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(CUSTOMER_ID).getAsInt());
		}
		if (customerDetails.get(IS_HARD_COPY_SUBMITTED) != null
				&& !customerDetails.get(IS_HARD_COPY_SUBMITTED).isJsonNull())
			customer.setIsHardCopySubmitted(customerDetails.get(IS_HARD_COPY_SUBMITTED).getAsBoolean());
		customer.setIsULPActive(Boolean.TRUE);
		customer.setIsULPIssued(Boolean.TRUE);
		customer.setCity(10);
		customer.setState(3);
		CheckCustomerAteGHS checkCustomerAteGHS = new CheckCustomerAteGHS();
		checkCustomerAteGHS.setObjCustDetails(customer);
		CheckCustomerAteGHSResponse checkCustomerAteGHSResponse = ghsClient.checkCustomerAteGHSResponse(vendor,
				checkCustomerAteGHS, ghsAudit);
		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(checkCustomerAteGHS),
				getJsonValueFromJaxbObject(checkCustomerAteGHSResponse), Boolean.TRUE,
				GhsTransactionEnum.CUSTOMER_CHECK.name());
		savePossCustomerAsGhsCustomer(object, vendor);
		return checkCustomerAteGHSResponse.getCheckCustomerAteGHSResult().getPOSSCustomerMaster().get(0);

	}

	private void savePossCustomerAsGhsCustomer(JsonObject object, VendorDao vendor) {
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		PossCustomerDetails customer = new PossCustomerDetails();
		JsonObject customerDao = new JsonObject();
		JsonObject customerlocationMappingDao = new JsonObject();
		JsonObject customerDetails = new JsonObject();
		if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
			customerDao = object.get(CUSTOMER).getAsJsonObject();
			if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
				customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
						.getAsJsonObject().get("data").getAsJsonObject();
			}
		}
		if (object.get(CUSTOMER_LOCATION_MAPPING) != null && !object.get(CUSTOMER_LOCATION_MAPPING).isJsonNull()) {
			customerlocationMappingDao = object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject();
		}
		if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull()) {
			customer.setULPMembershipID(customerDao.get(ULP_ID).getAsString());
			customer.setTempULPID(customerDao.get(ULP_ID).getAsString());
			customer.setLoyalityID(customerDao.get(ULP_ID).getAsString());
		}
		if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
			customer.setMobileNo(CryptoUtil.decrypt(customerDao.get(MOBILE_NUMBER).getAsString(), MOBILE_NUMBER));
		if (customerDao.get(EMAIL_ID) != null && !customerDao.get(EMAIL_ID).isJsonNull())
			customer.setEmailID(CryptoUtil.decrypt(customerDao.get(EMAIL_ID).getAsString(), EMAIL_ID));
		if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull()) {
			customer.setBirthDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(BIRTHDAY))));
		} else {
			customer.setBirthDate(null);
		}
		if (customerDetails.get(ADDRESS_LINES) != null && !customerDetails.get(ADDRESS_LINES).isJsonNull()) {
			JsonArray jsonArrayResponse = customerDetails.get(ADDRESS_LINES).getAsJsonArray();
			String address1 = null;
			String address2 = null;
			String address3 = null;
			Integer size = jsonArrayResponse.size();
			if (size >= 1 && !StringUtils.isEmpty(jsonArrayResponse.get(0)))
				address1 = jsonArrayResponse.get(0).getAsString();
			if (size >= 2 && !StringUtils.isEmpty(jsonArrayResponse.get(1)))
				address1 = address1 + ", " + jsonArrayResponse.get(1).getAsString();
			customer.setAddress1(address1);
			if (size >= 3 && !StringUtils.isEmpty(jsonArrayResponse.get(2)))
				address2 = jsonArrayResponse.get(2).getAsString();
			customer.setAddress2(address2);
			if (size >= 4 && !StringUtils.isEmpty(jsonArrayResponse.get(3)))
				address3 = jsonArrayResponse.get(3).getAsString();
			customer.setAddress3(address3);
		}
		if (customerDetails.get(ANNIVERSARY) != null && !customerDetails.get(ANNIVERSARY).isJsonNull())
			customer.setAnniversaryDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(ANNIVERSARY))));
		if (customerDetails.get(CAN_SEND_SMS) != null && !customerDetails.get(CAN_SEND_SMS).isJsonNull())
			customer.setSendSms(customerDetails.get(CAN_SEND_SMS).getAsBoolean());
		if (customerDao.get(IS_ACTIVE) != null && !customerDao.get(IS_ACTIVE).isJsonNull())
			customer.setIsActive(customerDao.get(IS_ACTIVE).getAsBoolean());
		if (customerDetails.get(CATCHMENT_NAME) != null && !customerDetails.get(CATCHMENT_NAME).isJsonNull())
			customer.setCatchmentArea(customerDetails.get(CATCHMENT_NAME).getAsString());
		if (customerDetails.get(CITY) != null && !customerDetails.get(CITY).isJsonNull())
			customer.setCityName(customerDetails.get(CITY).getAsString());
		if (customerDetails.get(STATE) != null && !customerDetails.get(STATE).isJsonNull())
			customer.setStateName(customerDetails.get(STATE).getAsString());
		if (customerDao.get(CUST_TAX_NO) != null && !customerDao.get(CUST_TAX_NO).isJsonNull())
			customer.setPanCardNo(CryptoUtil.decrypt(customerDao.get(CUST_TAX_NO).getAsString(), CUST_TAX_NO));
		if (customerDao.get(CREATED_BY) != null && !customerDao.get(CREATED_BY).isJsonNull())
			customer.setCreatedBy(customerDao.get(CREATED_BY).getAsString());
		if (customerDao.get(CREATED_DATE) != null && !customerDao.get(CREATED_DATE).isJsonNull())
			customer.setCreatedDate(getXMLGregorianCalenderDate(getParsedDate(customerDao.get(CREATED_DATE))));
		customer.setLoginID(CommonUtil.getUserName());
		if (customerDao.get(LAST_MODIFIED_BY) != null && !customerDao.get(LAST_MODIFIED_BY).isJsonNull())
			customer.setLastModifiedID(customerDao.get(LAST_MODIFIED_BY).getAsString());
		if (customerDao.get(LAST_MODIFIED_DATE) != null && !customerDao.get(LAST_MODIFIED_DATE).isJsonNull())
			customer.setLastModifiedDate(
					getXMLGregorianCalenderDate(getParsedDate(customerDao.get(LAST_MODIFIED_DATE))));
		if (customerDao.get(CUSTOMER_NAME) != null && !customerDao.get(CUSTOMER_NAME).isJsonNull())
			customer.setName(CryptoUtil.decrypt(customerDao.get(CUSTOMER_NAME).getAsString(), CUSTOMER_NAME));
		if (customerDetails.get(PIN_CODE) != null && !customerDetails.get(PIN_CODE).isJsonNull())
			customer.setPinCode(customerDetails.get(PIN_CODE).getAsString());
		if (customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID) != null
				&& !customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID).isJsonNull()) {
			customer.setLocationCode(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(LOCATION_CODE).getAsString());
			customer.setCustomerNo(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(CUSTOMER_ID).getAsInt());
		}
		if (customerDao.get(TITLE) != null && !customerDao.get(TITLE).isJsonNull())
			customer.setPrefix(customerDao.get(TITLE).getAsString());
		if (customerDetails.get(IS_HARD_COPY_SUBMITTED) != null
				&& !customerDetails.get(IS_HARD_COPY_SUBMITTED).isJsonNull())
			customer.setIsHardCopySubmitted(customerDetails.get(IS_HARD_COPY_SUBMITTED).getAsBoolean());
		customer.setIsULPActive(Boolean.TRUE);
		customer.setIsULPIssued(Boolean.TRUE);
		customer.setCity(10);
		customer.setState(3);
		if (customerDetails.get(SPOUSE_BIRTH_DAY) != null && !customerDetails.get(SPOUSE_BIRTH_DAY).isJsonNull())
			customer.setSpouseBirthday(
					getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(SPOUSE_BIRTH_DAY))));
		SavePossCustomer savePossCustomer = new SavePossCustomer();
		savePossCustomer.setCustomerDetail(customer);
		SavePossCustomerResponse savePossCustomerResponse = ghsClient.saveCustomerAteGHSResponse(vendor,
				savePossCustomer, ghsAudit);
		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(savePossCustomer),
				getJsonValueFromJaxbObject(savePossCustomerResponse), Boolean.TRUE,
				GhsTransactionEnum.CUSTOMER_SAVE.name());

	}

	private Date getParsedDate(JsonElement jsonElement) {
		Date dateToReturn = new Date();
		try {
			Long dateValue = jsonElement.getAsLong();
			dateToReturn = CalendarUtils.convertStringToDate(
					new SimpleDateFormat(DATE_FORMAT).format(java.sql.Date
							.valueOf(Instant.ofEpochMilli(dateValue).atZone(ZoneId.systemDefault()).toLocalDate())),
					DATE_FORMAT);
		} catch (Exception e) {
			dateToReturn = CalendarUtils.getCurrentDate();
		}
		return dateToReturn;
	}

	@Override
	public GhsCreditNoteUpdateResponseDto updateCreditNoteAtGhs(int ghsDocNo, int fiscalYear, String vendorCode) {
		VendorDao vendor = validateVendor(vendorCode);
		UpdateCNAfterDownload updateCNAfterDownload = new UpdateCNAfterDownload();
		updateCNAfterDownload.setCNlocationCode(CommonUtil.getLocationCode());
		updateCNAfterDownload.setCNNo(ghsDocNo);
		updateCNAfterDownload.setCNfiscalyear(fiscalYear);
		JSONObject json = new JSONObject();
		json.put("ghsDocNo", ghsDocNo);
		json.put("fiscalYear", ghsDocNo);
		json.put("locationCode", CommonUtil.getLocationCode());
		String request = json.toString();
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		UpdateCNAfterDownloadResponse updateCNAfterDownloadResponse = ghsClient.updateCreditNoteAtGhs(vendor,
				updateCNAfterDownload, ghsAudit);
		GhsCreditNoteUpdateResponseDto ghsCreditNoteUpdateResponseDto = new GhsCreditNoteUpdateResponseDto();
		if (BooleanUtils.isTrue(updateCNAfterDownloadResponse.isUpdateCNAfterDownloadResult())) {
			ghsCreditNoteUpdateResponseDto.setResponseCode(HttpStatus.valueOf(HttpStatus.OK.name()).toString());
			ghsCreditNoteUpdateResponseDto.setResponseMessage("Credit Note successfully Updated in GHS");
			setFinalGhsAuditDetails(ghsAudit, request, updateCNAfterDownloadResponse.toString(), Boolean.TRUE,
					GhsTransactionEnum.UPDATE_CREDITNOTE.name());
			return ghsCreditNoteUpdateResponseDto;
		} else {
			setFinalGhsAuditDetails(ghsAudit, request, updateCNAfterDownloadResponse.toString(), Boolean.FALSE,
					GhsTransactionEnum.UPDATE_CREDITNOTE.name());
			throw new ServiceException("Can't update the credit note details now", ERR_INT_043);
		}
	}

	@Override
	public GhsDiscountVoucherResponseDto getDiscountVoucherDetails(String vendorCode, int discountVoucherNo,
			int accountNo) {
		VendorDao vendor = validateVendor(vendorCode);
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		JSONObject json = new JSONObject();
		json.put("discountVoucherNo", discountVoucherNo);
		json.put("accountNo", accountNo);
		String request = json.toString();
		POSSGetDiscountVoucherDetailsNAP pOSSGetDiscountVoucherDetailsNAP = new POSSGetDiscountVoucherDetailsNAP();
		pOSSGetDiscountVoucherDetailsNAP.setVoucherNo(discountVoucherNo);
		pOSSGetDiscountVoucherDetailsNAP.setAccNo(accountNo);
		GhsDiscountVoucherResponseDto ghsDiscountVoucherResponseDto;
		POSSGetDiscountVoucherDetailsNAPResponse pOSSGetDiscountVoucherDetailsNAPResponse = ghsClient
				.getDiscountVoucherDetails(vendor, pOSSGetDiscountVoucherDetailsNAP, ghsAudit);
		if (pOSSGetDiscountVoucherDetailsNAPResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
				.getDiscountVoucherDetails() != null
				&& !pOSSGetDiscountVoucherDetailsNAPResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().isEmpty()) {
			ghsDiscountVoucherResponseDto = getDiscountVoucherDetails(pOSSGetDiscountVoucherDetailsNAPResponse);
			setFinalGhsAuditDetails(ghsAudit, request,
					pOSSGetDiscountVoucherDetailsNAPResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
							.getDiscountVoucherDetails().toString(),
					Boolean.TRUE, GhsTransactionEnum.GET_DISCOUNT_VOUCHER.name());
			return ghsDiscountVoucherResponseDto;
		} else {
			setFinalGhsAuditDetails(ghsAudit, request, NO_DATA, Boolean.FALSE,
					GhsTransactionEnum.GET_DISCOUNT_VOUCHER.name());
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"DV - '" + discountVoucherNo + "' not found.",
					Map.of(SalesConstants.REMARKS, "No discount voucher available for the entered GHS A/C No."));
		}
	}

	private GhsDiscountVoucherResponseDto getDiscountVoucherDetails(
			POSSGetDiscountVoucherDetailsNAPResponse pOSSGetDiscountVoucherDetailsResponse) {
		GhsDiscountVoucherResponseDto ghsDiscountVoucherResponseDto = new GhsDiscountVoucherResponseDto();
		ghsDiscountVoucherResponseDto.setAccountNo(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getGHSAccountNo());
		ghsDiscountVoucherResponseDto.setAccountCustomerId(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getCustomerID());
		ghsDiscountVoucherResponseDto.setVoucherNo(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getVoucherNo());
		ghsDiscountVoucherResponseDto.setCustomerName(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getCustomerName());
		ghsDiscountVoucherResponseDto
				.setDiscountAmount(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().get(0).getGHSVoucherDiscount());
		ghsDiscountVoucherResponseDto.setMobileNo(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getMobileNo());
		ghsDiscountVoucherResponseDto
				.setInstallmentAmount(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().get(0).getTotalInstallmentAmount());
		ghsDiscountVoucherResponseDto.setNoOfInstallmentsPaid(
				pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().get(0).getNoOfInstallmentsPayed());
		ghsDiscountVoucherResponseDto.setIsGoldCoinAllowed(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).isIsAllowedGoldCoin());
		ghsDiscountVoucherResponseDto
				.setIssueDate(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().get(0).getCreatedDate().toGregorianCalendar().getTime());
		if (pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
				.getDiscountVoucherDetails().get(0).getRedeemedCMNo() != null)
			ghsDiscountVoucherResponseDto.setRedeemedCMId(pOSSGetDiscountVoucherDetailsResponse
					.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getRedeemedCMNo());
		if (pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
				.getDiscountVoucherDetails().get(0).getRedemptionDate() != null) {
			ghsDiscountVoucherResponseDto.setRedeemptionDate(
					pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
							.getDiscountVoucherDetails().get(0).getRedemptionDate().toGregorianCalendar().getTime());
		}
		ghsDiscountVoucherResponseDto.setGhScheme(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getSchemeCode());
		ghsDiscountVoucherResponseDto
				.setValidFrom(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().get(0).getValidFrom().toGregorianCalendar().getTime());
		ghsDiscountVoucherResponseDto
				.setValidTill(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().get(0).getValidTill().toGregorianCalendar().getTime());
		ghsDiscountVoucherResponseDto.setStatus(GhsConstantsUtil.getGhsDVStatusDetails()
				.get(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
						.getDiscountVoucherDetails().get(0).getVoucherStatus()));

		ghsDiscountVoucherResponseDto.setTitle(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getTitle());
		ghsDiscountVoucherResponseDto.setEmailID(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getMailID());
		ghsDiscountVoucherResponseDto.setUlpID(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getULPMembershipID());
		setGhsDvCustomerAddress(pOSSGetDiscountVoucherDetailsResponse, ghsDiscountVoucherResponseDto);

		return ghsDiscountVoucherResponseDto;
	}

	private void setGhsDvCustomerAddress(POSSGetDiscountVoucherDetailsNAPResponse pOSSGetDiscountVoucherDetailsResponse,
			GhsDiscountVoucherResponseDto ghsDiscountVoucherResponseDto) {
		ghsDiscountVoucherResponseDto.setCity(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getTownName());
		ghsDiscountVoucherResponseDto.setState(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getStateName());
		ghsDiscountVoucherResponseDto.setPinCode(pOSSGetDiscountVoucherDetailsResponse
				.getPOSSGetDiscountVoucherDetailsNAPResult().getDiscountVoucherDetails().get(0).getPinCode());
		List<String> address = new ArrayList<>();
		if (!StringUtils.isEmpty(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
				.getDiscountVoucherDetails().get(0).getAddress1())) {
			address.add(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
					.getDiscountVoucherDetails().get(0).getAddress1());
		}
		if (!StringUtils.isEmpty(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
				.getDiscountVoucherDetails().get(0).getAddress2())) {
			address.add(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
					.getDiscountVoucherDetails().get(0).getAddress2());
		}
		if (!StringUtils.isEmpty(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
				.getDiscountVoucherDetails().get(0).getAddress3())) {
			address.add(pOSSGetDiscountVoucherDetailsResponse.getPOSSGetDiscountVoucherDetailsNAPResult()
					.getDiscountVoucherDetails().get(0).getAddress3());
		}
		if (!CollectionUtil.isEmpty(address)) {
			ghsDiscountVoucherResponseDto.setAddress(address);
		}

	}

	@Override
	public GhsDiscountVoucherRedeemResponseDto redeemGhsDiscountVoucher(String vendorCode, String discountVoucherNo,
			int accountNo, String transactionId) {
		VendorDao vendor = validateVendor(vendorCode);
		POSSGetInvalidDiscountVoucherDetailsNAP pOSSGetInvalidDiscountVoucherDetails = new POSSGetInvalidDiscountVoucherDetailsNAP();
		pOSSGetInvalidDiscountVoucherDetails.setVoucherNo(discountVoucherNo);
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		GhsDiscountVoucherRedeemResponseDto ghsDiscountVoucherRedeemResponseDto = new GhsDiscountVoucherRedeemResponseDto();
		POSSGetInvalidDiscountVoucherDetailsNAPResponse pOSSGetInvalidDiscountVoucherDetailsResponse = ghsClient
				.getInvalidDiscountVoucherDetails(vendor, pOSSGetInvalidDiscountVoucherDetails, ghsAudit);
		if (!pOSSGetInvalidDiscountVoucherDetailsResponse.getPOSSGetInvalidDiscountVoucherDetailsNAPResult()
				.getInvalidDiscountVoucherDetails().isEmpty()
				&& pOSSGetInvalidDiscountVoucherDetailsResponse.getPOSSGetInvalidDiscountVoucherDetailsNAPResult()
						.getInvalidDiscountVoucherDetails().get(0).getVoucherNo() != null
				&& pOSSGetInvalidDiscountVoucherDetailsResponse.getPOSSGetInvalidDiscountVoucherDetailsNAPResult()
						.getInvalidDiscountVoucherDetails().get(0).getVoucherNo().equalsIgnoreCase(discountVoucherNo)) {
			throw new ServiceException("Invalid Discount Voucher", ERR_INT_027);

		}
		DiscountVoucherDetails discountVoucherDetails = new DiscountVoucherDetails();
		discountVoucherDetails.setStatus(1);
		POSSUpdateDiscountVoucher pOSSUpdateDiscountVoucher = getPOSSUpdateDiscountVoucher(discountVoucherNo,
				transactionId, discountVoucherDetails, accountNo);
		POSSUpdateDiscountVoucherResponse pOSSUpdateDiscountVoucherResponse = ghsClient.redeemGhsDiscountVoucher(vendor,
				pOSSUpdateDiscountVoucher);
		if (BooleanUtils.isTrue(pOSSUpdateDiscountVoucherResponse.isPOSSUpdateDiscountVoucherResult())) {
			ghsDiscountVoucherRedeemResponseDto.setAccountNo(accountNo);
			ghsDiscountVoucherRedeemResponseDto.setDiscountVoucherNo(discountVoucherNo);
			GhsDiscountVoucherRedeemRequestDto ghsDiscountVoucherRedeemRequestDto = new GhsDiscountVoucherRedeemRequestDto();
			ghsDiscountVoucherRedeemRequestDto.setAccountNo(accountNo);
			ghsDiscountVoucherRedeemRequestDto.setDiscountVoucherNo(discountVoucherNo);
			ghsDiscountVoucherRedeemRequestDto.setTransactionId(transactionId);
			setFinalGhsAuditDetails(ghsAudit, MapperUtil.getJsonString(ghsDiscountVoucherRedeemRequestDto),
					MapperUtil.getJsonString(ghsDiscountVoucherRedeemResponseDto), Boolean.TRUE,
					GhsTransactionEnum.REDEEM_DISCOUNT_VOUCHER.name());
		} else {
			throw new ServiceException("Can't update Discount voucher Details", ERR_INT_044);
		}

		return ghsDiscountVoucherRedeemResponseDto;
	}

	private POSSUpdateDiscountVoucher getPOSSUpdateDiscountVoucher(String discountVoucherNo, String transactionId,
			DiscountVoucherDetails discountVoucherDetails, int accountNo) {
		POSSUpdateDiscountVoucher pOSSUpdateDiscountVoucher = new POSSUpdateDiscountVoucher();
		discountVoucherDetails.setRedeemedCMNo(transactionId);
		discountVoucherDetails.setRedeemedLocation(CommonUtil.getLocationCode());
		discountVoucherDetails.setRedemptionDate(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
		discountVoucherDetails.setVoucherNo(Long.parseLong(discountVoucherNo));
		discountVoucherDetails.setGHSAccountNo(accountNo);
		pOSSUpdateDiscountVoucher.setModel(discountVoucherDetails);
		return pOSSUpdateDiscountVoucher;
	}

	@Override
	public BusinessDayActivityDto bodAtGhs(String vendorCode, BusinessDateDto businessDateDto) {
		VendorDao vendor = validateVendor(vendorCode);
		BTQBODDone bTQBODDone = new BTQBODDone();
		bTQBODDone.setLocationCode(CommonUtil.getLocationCode());
		bTQBODDone.setLoginID(CommonUtil.getUserName());
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		ghsAudit.setBusinessDate(businessDateDto.getBusinessDate());
		BooleanResponse isBodDone = checkBODStatus(vendorCode, businessDateDto, CommonUtil.getLocationCode());
		BusinessDayActivityDto businessDayActivityDto = new BusinessDayActivityDto();
		log.info("isBodDone {}",isBodDone);
		if(!isBodDone.getStatus()) {
		   try {
				log.info("inside bodAtGhs {}",isBodDone.getStatus());
				ghsClient.bodAtGhs(vendor, bTQBODDone, ghsAudit);
		   }catch (Exception e) {
			throw new ServiceException("Could not connect to GHS server. Please proceed with offline GHS BOD process",
					ERR_INT_078);
		   }
			GhsBodRequestDto ghsBodRequestDto = new GhsBodRequestDto();
			ghsBodRequestDto.setLocationCode(CommonUtil.getLocationCode());
			ghsBodRequestDto.setLoginId(CommonUtil.getUserName());
			businessDayActivityDto.setLocationCode(CommonUtil.getLocationCode());
			businessDayActivityDto.setBusinessDate(businessDateDto.getBusinessDate());
			setFinalGhsAuditDetails(ghsAudit, MapperUtil.getJsonString(ghsBodRequestDto),
					MapperUtil.getJsonString(businessDayActivityDto), Boolean.TRUE, GhsTransactionEnum.BOD.name());
			return businessDayActivityDto;
		} else {
			businessDayActivityDto.setLocationCode(CommonUtil.getLocationCode());
			businessDayActivityDto.setBusinessDate(businessDateDto.getBusinessDate());
			return businessDayActivityDto;
		}
	
	}

	@Override
	public BusinessDayActivityDto eodAtGhs(String vendorCode, BusinessDateDto businessDateDto) {
		VendorDao vendor = validateVendor(vendorCode);
		ClearAllActiveSessionForLocation clearAllActiveSessionForLocation = new ClearAllActiveSessionForLocation();
		clearAllActiveSessionForLocation.setLocCode(CommonUtil.getLocationCode());
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		ghsAudit.setBusinessDate(businessDateDto.getBusinessDate());
		ghsClient.clearAllActiveSessionAtEGHS(vendor, clearAllActiveSessionForLocation);
		BTQEODDone bTQEODDone = new BTQEODDone();
		bTQEODDone.setBusinessDate(getXMLGregorianCalenderDate(businessDateDto.getBusinessDate()));
		bTQEODDone.setLocationCode(CommonUtil.getLocationCode());
	    BooleanResponse isEodDone = checkEODStatus(vendorCode, businessDateDto, CommonUtil.getLocationCode());
	    log.info("isEodDone {}",isEodDone);
	    if (!isEodDone.getStatus()) {
	    	
			BTQEODDoneResponse bTQEODDoneResponse = ghsClient.bTQEODDone(vendor, bTQEODDone, ghsAudit);
			log.info(" isBTQEODDoneResult {}",bTQEODDoneResponse.isBTQEODDoneResult());
			ListResponse<GhsCreditNoteDto> ghsCreditNotes = null;
			if (bTQEODDoneResponse.isBTQEODDoneResult()) {
				try {
					ghsCreditNotes = getCreditNotesFromGhs(vendorCode);
				} catch (Exception e) {
					log.info("Error while getting credit Note Details from GHS");
				}
				if (ghsCreditNotes != null) {
					List<CreditNoteStatusUpdateDto> creditNoteStatusUpdateList = new ArrayList<>();
					ghsCreditNotes.getResults().forEach(creditNote -> {
						CreditNoteStatusUpdateDto creditNoteStatusUpdateDto = new CreditNoteStatusUpdateDto();
						creditNoteStatusUpdateDto.setGhsDocNo(creditNote.getGhsDocNo());
						creditNoteStatusUpdateDto.setFiscalYear(creditNote.getFiscalYear().shortValue());
						creditNoteStatusUpdateDto.setDocNo(creditNote.getCnDocNo());
						creditNoteStatusUpdateList.add(creditNoteStatusUpdateDto);
					});
					salesServiceClient.downloadCNfromEGHS(creditNoteStatusUpdateList);
				}
				BusinessDayActivityDto businessDayActivityDto = new BusinessDayActivityDto();
				businessDayActivityDto.setBusinessDate(businessDateDto.getBusinessDate());
				businessDayActivityDto.setLocationCode(CommonUtil.getLocationCode());
				setFinalGhsAuditDetails(ghsAudit, MapperUtil.getJsonString(businessDateDto),
						MapperUtil.getJsonString(businessDayActivityDto), Boolean.TRUE, GhsTransactionEnum.EOD.name());
				return businessDayActivityDto;
			} else {
				throw new ServiceException("Can't perform EOD at GHS", ERR_INT_047);
			}
		} else {
			BusinessDayActivityDto businessDayActivityDto = new BusinessDayActivityDto();
			businessDayActivityDto.setBusinessDate(businessDateDto.getBusinessDate());
			businessDayActivityDto.setLocationCode(CommonUtil.getLocationCode());
			return businessDayActivityDto;
		}
	}

	@Override
	public GhsAccountDetailsResponseDto getGhsAccountDetails(String vendorCode, int accountNo) {
		VendorDao vendor = validateVendor(vendorCode);
		GhsAccountDetailsResponseDto ghsAccountDetailsResponseDto;
		GetGHAccountMasterForId getGHAccountMasterForId = new GetGHAccountMasterForId();
		getGHAccountMasterForId.setAccountNumber(accountNo);
		getGHAccountMasterForId.setLocationCode(CommonUtil.getLocationCode());
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		GetGHAccountMasterForIdResponse getGHAccountMasterForIdResponse = ghsClient.getGhsAccountDetails(vendor,
				getGHAccountMasterForId, ghsAudit);
			if(getGHAccountMasterForIdResponse == null || getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult()==null) {
				throw new ServiceException(ACCOUNT_INFO_NOT_AVAILABLE, ERR_INT_101,Map.of("AccountNum", "" + accountNo));
			}
			else
			ghsAccountDetailsResponseDto = getGhsAccountDetailsResponseDto(getGHAccountMasterForIdResponse);
			
			//call GetACHdetailDO API
			GetACHdetailDOResponse aCHdetailDOResponse =ghsClient.IsACHAvailableforAccount(vendor,getGHAccountMasterForId, ghsAudit);
			if(null==aCHdetailDOResponse) {
				throw new ServiceException(ACCOUNT_INFO_NOT_AVAILABLE, ERR_INT_101,Map.of("AccountNum", "" + accountNo));
			}
			else
			ghsAccountDetailsResponseDto.setIsGetACHdetailAvailable(aCHdetailDOResponse.isGetACHdetailDOResult());
			
			//call GetSIdetailDO API
			GetSIdetailDOResponse sIdetailDOResponse =ghsClient.IsAutoDebitSIEnabled(vendor,getGHAccountMasterForId, ghsAudit);
			if(null==sIdetailDOResponse) {
				throw new ServiceException(ACCOUNT_INFO_NOT_AVAILABLE, ERR_INT_101,Map.of("AccountNum", "" + accountNo));
			}
			else
			ghsAccountDetailsResponseDto.setIsSIAutoDebitEnabled(sIdetailDOResponse.isGetSIdetailDOResult());
			
			GhsAccountDetailsRequestDto ghsAccountDetailsRequestDto = new GhsAccountDetailsRequestDto();
			ghsAccountDetailsRequestDto.setAccountNo(accountNo);
			setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(getGHAccountMasterForId),
					getJsonValueFromJaxbObject(getGHAccountMasterForIdResponse), Boolean.TRUE,
					GhsTransactionEnum.GET_ACCOUNT_DETAILS.name());

				return ghsAccountDetailsResponseDto;
	}
	
	

	private GhsAccountDetailsResponseDto getGhsAccountDetailsResponseDto(
			GetGHAccountMasterForIdResponse getGHAccountMasterForIdResponse) {
		GhsAccountDetailsResponseDto ghsAccountDetailsResponseDto = new GhsAccountDetailsResponseDto();
		ghsAccountDetailsResponseDto
				.setAccountNo(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getDocNo());
		ghsAccountDetailsResponseDto.setEnrolledLocationCode(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getLocationCode());
		ghsAccountDetailsResponseDto.setMaturityLocationCode(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getMaturityLocationCode());
		ghsAccountDetailsResponseDto
				.setSchemeCode(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getGHSchemeCode());
		ghsAccountDetailsResponseDto.setNoOfInstallmentPaid(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getNoOfInstallmentsPayed());
		ghsAccountDetailsResponseDto.setEnrolledDate(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult()
				.getCreatedDate().toGregorianCalendar().getTime());
		if (getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getDuration() != 0) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getDocDate()
					.toGregorianCalendar().getTime());
			calendar.add(Calendar.MONTH,
					getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getDuration());
			ghsAccountDetailsResponseDto.setMaturityDate(calendar.getTime());
		}
//		ghsAccountDetailsResponseDto
//				.setGoldRate(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getGoldRate());
		ghsAccountDetailsResponseDto.setTotalGhsAdvance(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getTotalInstallmentAmount());
		ghsAccountDetailsResponseDto.setBalance(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getTotalInstallmentAmount());
		ghsAccountDetailsResponseDto
				.setAccumulatedGoldWeight(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult()
						.getTotalGoldWeight().setScale(DomainConstants.WEIGHT_SCALE, RoundingMode.HALF_UP));
		ghsAccountDetailsResponseDto.setInstallmentAmount(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getInstallmentAmount());
		ghsAccountDetailsResponseDto.setIsProofsAvailable(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().isIdProofForGHS());
		ghsAccountDetailsResponseDto.setStatus(GhsConstantsUtil.getGhsStatusDetails()
				.get(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getStatus()));
		ghsAccountDetailsResponseDto
				.setAccountCustomerId(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult()
						.getCustomerDetails().getPOSSCustomerMaster().get(0).getCustomerID());
		ghsAccountDetailsResponseDto.setPassbookNo(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getPassBookSerialNo());
		ghsAccountDetailsResponseDto.setMobileNo(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult()
				.getCustomerDetails().getPOSSCustomerMaster().get(0).getMobileNo());
		ghsAccountDetailsResponseDto.setUlpId(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult()
				.getCustomerDetails().getPOSSCustomerMaster().get(0).getULPMembershipID());
		ghsAccountDetailsResponseDto.setEmailId(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult()
				.getCustomerDetails().getPOSSCustomerMaster().get(0).getEmailID());
		ghsAccountDetailsResponseDto
				.setDiscount(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getEstimatedDiscount());
		ghsAccountDetailsResponseDto.setMinUtilizationPct(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getUtilizationPercentage());
		List<String> addressDetails = new ArrayList<>();
		addressDetails.add(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getCustomerDetails()
				.getPOSSCustomerMaster().get(0).getAddress1());
		addressDetails.add(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getCustomerDetails()
				.getPOSSCustomerMaster().get(0).getAddress2());
		addressDetails.add(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getCustomerDetails()
				.getPOSSCustomerMaster().get(0).getAddress3());
		ghsAccountDetailsResponseDto.setAddress(addressDetails);
		ghsAccountDetailsResponseDto
				.setFiscalYear(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getFiscalYear());

		// GhsSchemeTypeEnum
		// get GHS scheme - 'FIXED' or 'GRAMMAGE' or 'RIVAAH'
		String ghsScheme = GhsSchemeTypeEnum.RIVAAH_SCHEME.name();
		if (BooleanUtils.isTrue(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().isGoldScheme())) {
			ghsScheme = GhsSchemeTypeEnum.GRAMMAGE_SCHEME.name();
		} else if (BooleanUtils.isTrue(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().isFixedInstallmentScheme())) {
			ghsScheme = GhsSchemeTypeEnum.FIXED_SCHEME.name();
		}

		ghsAccountDetailsResponseDto.setScheme(ghsScheme);

		// is redeemable
		ghsAccountDetailsResponseDto.setIsRedeemable(
				GhsAccountDetailsStatusEnum.OPEN.name().equals(ghsAccountDetailsResponseDto.getStatus()));
		// Rivaah discount %
		ghsAccountDetailsResponseDto
				.setDiscountMcPct(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getDiscountMC());
		ghsAccountDetailsResponseDto
				.setDiscountUcpPct(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getDiscountUCP());
		// set cash collected
		ghsAccountDetailsResponseDto.setCashCollected(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getTotalCashCollected());
		List<String> cfaProductCodes = new ArrayList<>();
		if (getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getCFAProductCodes() != null
				&& getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getCFAProductCodes()
						.getPOSSGHAccountMasterCFAProductCodeDO() != null
				&& !getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getCFAProductCodes()
						.getPOSSGHAccountMasterCFAProductCodeDO().isEmpty()) {
			getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getCFAProductCodes()
					.getPOSSGHAccountMasterCFAProductCodeDO()
					.forEach(cfaObect -> cfaProductCodes.add(cfaObect.getCFAProductCode()));

		}
		ghsAccountDetailsResponseDto.setCfaProductCodes(cfaProductCodes);
		ghsAccountDetailsResponseDto.setRequestStatus(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getRequestStatus());
		ghsAccountDetailsResponseDto.setIsCancelAccount(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().isIsCancelAccount());
		ghsAccountDetailsResponseDto.setIsChequeRealisationReq(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().isIsChequeRealisationReq());
		return ghsAccountDetailsResponseDto;
	}

	@Override
	public GhsCashResponseDto getCashCollectedAtGHS(String vendorCode, String ulpId, String mobileNo,
			String businessDate) {
		if (ulpId == null && mobileNo == null)
			throw new ServiceException("Both ulpId and mobileNo can't be empty", ERR_INT_049);
		log.info("Location code: {}, mobile number: {}, uilp id: {}, business date: {}", CommonUtil.getLocationCode(),
				mobileNo, ulpId, businessDate);
		VendorDao vendor = validateVendor(vendorCode);
		InstallmentDetailsForCashRestrictionNAPUpdated installmentDetailsForCashRestrictionNAPUpdated = new InstallmentDetailsForCashRestrictionNAPUpdated();
		installmentDetailsForCashRestrictionNAPUpdated.setLocationCode(CommonUtil.getLocationCode());
		installmentDetailsForCashRestrictionNAPUpdated.setMobileNo(mobileNo);
		installmentDetailsForCashRestrictionNAPUpdated.setULPMembershipID(ulpId);
		Date date = CalendarUtils.convertStringToDate(businessDate, CalendarUtils.SQL_DATE_FORMAT);
		installmentDetailsForCashRestrictionNAPUpdated.setPossBusinessDate(getXMLGregorianCalenderDate(date));
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		InstallmentDetailsForCashRestrictionNAPUpdatedResponse installmentDetailsForCashRestrictionResponse = ghsClient
				.getCashCollectedAtGHS(vendor, installmentDetailsForCashRestrictionNAPUpdated, ghsAudit);
		GhsCashResponseDto ghsCashResponseDto = new GhsCashResponseDto();
		if (installmentDetailsForCashRestrictionResponse != null && !CollectionUtil.isEmpty(
				installmentDetailsForCashRestrictionResponse.getInstallmentDetailsForCashRestrictionNAPUpdatedResult()
						.getInstallmentDetailsForCashRestrictionNAP())) {
			BigDecimal totalAmount = installmentDetailsForCashRestrictionResponse
					.getInstallmentDetailsForCashRestrictionNAPUpdatedResult()
					.getInstallmentDetailsForCashRestrictionNAP().stream().map(ghs -> ghs.getAmount())
					.reduce(BigDecimal.ZERO, BigDecimal::add);
			ghsCashResponseDto.setAmount(totalAmount);
			ghsCashResponseDto.setMobileNo(installmentDetailsForCashRestrictionResponse
					.getInstallmentDetailsForCashRestrictionNAPUpdatedResult()
					.getInstallmentDetailsForCashRestrictionNAP().get(0).getMobileNo());
			ghsCashResponseDto.setUlpId(installmentDetailsForCashRestrictionResponse
					.getInstallmentDetailsForCashRestrictionNAPUpdatedResult()
					.getInstallmentDetailsForCashRestrictionNAP().get(0).getULPMembershipID());
			CashCollectedAtGhsRequestDto cashCollectedAtGhsRequestDto = new CashCollectedAtGhsRequestDto();
			cashCollectedAtGhsRequestDto.setMobileNo(mobileNo);
			cashCollectedAtGhsRequestDto.setUlpId(ulpId);
			setFinalGhsAuditDetails(ghsAudit, MapperUtil.getJsonString(cashCollectedAtGhsRequestDto),
					MapperUtil.getJsonString(ghsCashResponseDto), Boolean.TRUE,
					GhsTransactionEnum.CASH_COLLECTED_GHS.name());
			return ghsCashResponseDto;
		} else {
			throw new ServiceException(NO_DATA, ERR_INT_041);
		}
	}

	@Override
	public GhsRedeemAccountResponseDto redemptionGhsAccount(String vendorCode,
			GhsRedeemAccountDto ghsAccountRedemptionDto) {
		VendorDao vendor = validateVendor(vendorCode);
		GhsRedeemAccountResponseDto ghsRedeemAccountResponseDto = new GhsRedeemAccountResponseDto();
		ghsRedeemAccountResponseDto.setAccountNo(ghsAccountRedemptionDto.getAccountNo());
		ghsRedeemAccountResponseDto.setRedemptionAmount(ghsAccountRedemptionDto.getRedemptionAmount());
		ghsRedeemAccountResponseDto.setStatus(Boolean.FALSE);
		try {
			GetGHAccountMasterForId getGHAccountMasterForId = new GetGHAccountMasterForId();
			getGHAccountMasterForId.setAccountNumber(ghsAccountRedemptionDto.getAccountNo());
			getGHAccountMasterForId.setLocationCode(CommonUtil.getLocationCode());
			GhsAuditDao ghsAudit1 = getInitialGhsAuditDetails(vendor);
			GetGHAccountMasterForIdResponse getGHAccountMasterForIdResponse = ghsClient.getGhsAccountDetails(vendor,
					getGHAccountMasterForId, ghsAudit1);
			
								
				setFinalGhsAuditDetails(ghsAudit1, getJsonValueFromJaxbObject(getGHAccountMasterForId),
						getJsonValueFromJaxbObject(getGHAccountMasterForIdResponse), Boolean.TRUE,
						GhsTransactionEnum.GET_ACCOUNT_DETAILS.name());
				UpdateThresholdAmountforLocation updateThresholdAmountforLocation = new UpdateThresholdAmountforLocation();
				updateThresholdAmountforLocation.setAmt(ghsAccountRedemptionDto.getRedemptionAmount().intValue());
				updateThresholdAmountforLocation
						.setBusinessDate(getXMLGregorianCalenderDate(ghsAccountRedemptionDto.getBusinessDate()));
				updateThresholdAmountforLocation.setLocCode(CommonUtil.getLocationCode());
				updateThresholdAmountforLocation.setOpr("SUB");
				GhsAuditDao ghsAudit2 = getInitialGhsAuditDetails(vendor);
				UpdateThresholdAmountforLocationResponse updateThresholdAmountforLocationResponse = ghsClient
						.updateThresholdAmountforLocation(vendor, updateThresholdAmountforLocation, ghsAudit2);
				setFinalGhsAuditDetails(ghsAudit2, getJsonValueFromJaxbObject(updateThresholdAmountforLocation),
						getJsonValueFromJaxbObject(updateThresholdAmountforLocationResponse), Boolean.TRUE,
						GhsTransactionEnum.UPDATE_THRESHOLD_AMOUNT.name());
				if (updateThresholdAmountforLocationResponse.isUpdateThresholdAmountforLocationResult()) {
//				CNDetailsForPassBook cNDetailsForPassBook = getCnDetailsForPassbook(ghsAccountRedemptionDto,
//						getGHAccountMasterForIdResponse);
//				GhsAuditDao ghsAudit3 = getInitialGhsAuditDetails(vendor);
//				CNDetailsForPassBookResponse cNDetailsForPassBookResponse = ghsClient.cNDetailsForPassBook(vendor,
//						cNDetailsForPassBook, ghsAudit3);
//				setFinalGhsAuditDetails(ghsAudit3, getJsonValueFromJaxbObject(cNDetailsForPassBook),
//						getJsonValueFromJaxbObject(cNDetailsForPassBookResponse), Boolean.TRUE,
//						GhsTransactionEnum.UPDATE_CN_PASSBOOOK.name());
//				if (cNDetailsForPassBookResponse.isCNDetailsForPassBookResult()) {
					UpdateHoldStatusforAccountOnMaturity updateHoldStatusforAccountOnMaturity = new UpdateHoldStatusforAccountOnMaturity();
					updateHoldStatusforAccountOnMaturity.setAccountNo(ghsAccountRedemptionDto.getAccountNo());
					updateHoldStatusforAccountOnMaturity.setStatus(3);
					GhsAuditDao ghsAudit4 = getInitialGhsAuditDetails(vendor);
					UpdateHoldStatusforAccountOnMaturityResponse updateHoldStatusforAccountOnMaturityResponse = ghsClient
							.updateHoldStatusforAccountOnMaturity(vendor, updateHoldStatusforAccountOnMaturity,
									ghsAudit4);
					setFinalGhsAuditDetails(ghsAudit4, getJsonValueFromJaxbObject(updateHoldStatusforAccountOnMaturity),
							getJsonValueFromJaxbObject(updateHoldStatusforAccountOnMaturityResponse), Boolean.TRUE,
							GhsTransactionEnum.UPDATE_HOLD_STATUS_MATURITY.name());
					if (!updateHoldStatusforAccountOnMaturityResponse.isUpdateHoldStatusforAccountOnMaturityResult()) {
						throw new ServiceException("Can't update hold status for account on maturity", ERR_INT_053);
					}
//				} else {
//					throw new ServiceException("Can't update the credit note details in GHS", ERR_INT_052);
//				}
				} else {
					throw new ServiceException("Can't update threshold amount for location", ERR_INT_051);
				}
				ghsRedeemAccountResponseDto.setStatus(Boolean.TRUE);
				return ghsRedeemAccountResponseDto;

		

		} catch (Exception e) {
			DeletePartialAccOnException deletePartialAccOnException = new DeletePartialAccOnException();
			deletePartialAccOnException.setAccountNo(ghsAccountRedemptionDto.getAccountNo());
			deletePartialAccOnException.setFiscalyear(ghsAccountRedemptionDto.getFiscalYear());
			deletePartialAccOnException.setLocationCode(CommonUtil.getLocationCode());
			GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
			DeletePartialAccOnExceptionResponse deletePartialAccOnExceptionResponse = ghsClient
					.deletePartialAccOnException(vendor, deletePartialAccOnException, ghsAudit);
			setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(deletePartialAccOnException),
					getJsonValueFromJaxbObject(deletePartialAccOnExceptionResponse), Boolean.TRUE,
					GhsTransactionEnum.DELETE_PARTIAL_ACCOUNT.name());
			if (!deletePartialAccOnExceptionResponse.isDeletePartialAccOnExceptionResult())
				throw new ServiceException("Can't delete partial account for exception", ERR_INT_052);

			return ghsRedeemAccountResponseDto;
		}

	}

	private CNDetailsForPassBook getCnDetailsForPassbook(GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto,
			GetGHAccountMasterForIdResponse getGHAccountMasterForIdResponse) {
		CNDetailsForPassBook cNDetailsForPassBook = new CNDetailsForPassBook();
		cNDetailsForPassBook.setMaturedRefDocNo(ghsAccountMasterUpdateDto.getMaturedDocNo());
		cNDetailsForPassBook.setMaturedRefDocType(ghsAccountMasterUpdateDto.getMaturedDocType());
		cNDetailsForPassBook.setMaturedRefFiscalYear(ghsAccountMasterUpdateDto.getFiscalYear());
		cNDetailsForPassBook.setIsNewCN(ghsAccountMasterUpdateDto.getIsNewCn());
		if (ghsAccountMasterUpdateDto.getGhsBonus() != null
				&& ghsAccountMasterUpdateDto.getGhsBonus().compareTo(BigDecimal.ZERO) != 0) {
			cNDetailsForPassBook.setGhsBonus(ghsAccountMasterUpdateDto.getGhsBonus());
		} else {
			cNDetailsForPassBook.setGhsBonus(
					getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getOpeningTotalBonusAmount());
		}
		cNDetailsForPassBook.setCNdocNo(ghsAccountMasterUpdateDto.getCnDocNo());
		cNDetailsForPassBook.setCNfiscalYear(ghsAccountMasterUpdateDto.getFiscalYear());
		cNDetailsForPassBook.setAmount(ghsAccountMasterUpdateDto.getRedemptionAmount());
		cNDetailsForPassBook.setGhsAccNo(ghsAccountMasterUpdateDto.getAccountNo());
		cNDetailsForPassBook
				.setGhsFiscalYear(getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getFiscalYear());
		cNDetailsForPassBook.setGhsLocationCode(
				getGHAccountMasterForIdResponse.getGetGHAccountMasterForIdResult().getLocationCode());
		cNDetailsForPassBook.setMaturedDate(getXMLGregorianCalenderDate(ghsAccountMasterUpdateDto.getBusinessDate()));
		return cNDetailsForPassBook;
	}

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

	private void setFinalGhsAuditDetails(GhsAuditDao ghsAudit, String request, String response,
			Boolean transactionStatus, String transactionType) {
		ghsAudit.setRequest(request);
		ghsAudit.setResponse(response);
		ghsAudit.setTransactionStatus(transactionStatus);
		ghsAudit.setHttpStatus(200);
		ghsAudit.setResponseTime(CalendarUtils.getCurrentDate());
		ghsAudit.setTransactionType(transactionType);
		ghsAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - ghsAudit.getRequestTime().getTime());
		ghsAuditRepository.save(ghsAudit);
	}

	private GhsAuditDao getInitialGhsAuditDetails(VendorDao vendor) {
		GhsAuditDao ghsAudit = new GhsAuditDao();
		Integer maxId = ghsAuditRepository.getMaxSeqNo(CommonUtil.getLocationCode());
		ghsAudit.setSequenceNo(++maxId);
		ghsAudit.setLocationCode(CommonUtil.getLocationCode());
		ghsAudit.setVendor(vendor);
		ghsAudit.setRequestTime(CalendarUtils.getCurrentDate());
		return ghsAudit;
	}

	private XMLGregorianCalendar getXMLGregorianCalenderDate(Date date) {

		XMLGregorianCalendar xmlDate;
		try {
			GregorianCalendar gregorianCalendar = new GregorianCalendar();
			gregorianCalendar.setTime(date);
			xmlDate = DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
		} catch (DatatypeConfigurationException e) {
			throw new ServiceException("error while parsing date", ERR_INT_054);
		}
		return xmlDate;
	}

	@Override
	public ListResponse<GhsDocsResponseDto> getGhsDocs(int customerId, int accountNo, String vendorCode) {
		VendorDao vendor = validateVendor(vendorCode);
		VendorDataDto vendorDataDto = MapperUtil.mapObjToClass(
				MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(), VendorDataDto.class);

		String signedUrl = null;
		GetAttachments getAttachments = new GetAttachments();
		getAttachments.setAccountId(accountNo);
		getAttachments.setCustomerId(customerId);
		GetAttachmentsResponse getAttachmentsResponse = ghsClient.getGhsIdProofs(vendor, getAttachments);
		List<GhsDocsResponseDto> ghsIdProofsResponseDtoList = new ArrayList<>();

		try {
			Date expiration = new Date();
			expiration.setTime(expiration.getTime() + (Integer.parseInt(expTimeSeconds) * 1000));
			for (int i = 0; i < getAttachmentsResponse.getGetAttachmentsResult().getPOSSAttachment().size(); i++) {
				GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(
						vendorDataDto.getBucket(),
						getAttachmentsResponse.getGetAttachmentsResult().getPOSSAttachment().get(i).getUrl())
								.withMethod(HttpMethod.GET).withExpiration(expiration);
				signedUrl = s3eGHS.generatePresignedUrl(generatePresignedUrlRequest).toString();
				GhsDocsResponseDto ghsDocsResponseDto = new GhsDocsResponseDto();
				ghsDocsResponseDto.setDocUrl(signedUrl);
				ghsDocsResponseDto.setDocName(
						getAttachmentsResponse.getGetAttachmentsResult().getPOSSAttachment().get(i).getName());
				ghsIdProofsResponseDtoList.add(ghsDocsResponseDto);
			}
		} catch (AmazonServiceException e) {
			throw new ServiceException(e.getMessage(), "Error while getting response from S3");

		} catch (SdkClientException e) {
			throw new ServiceException(e.getMessage(), "Error while connecting to S3");
		}
		return new ListResponse<>(ghsIdProofsResponseDtoList);
	}

	@Override
	public PossCashPaidDetailsDto getCashCollectedAtPOSS(String searchType, String searchValue, String businessDate,
			String locationCode) {

		return (PossCashPaidDetailsDto) MapperUtil.getObjectMapping(
				salesServiceClient.getTotalCashPaid(searchType, searchValue, businessDate, locationCode),
				new PossCashPaidDetailsDto());
	}

	@Override
	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenueForEod(BusinessDateDto businessDateDto,
			String vendorCode) {
		VendorDao vendor = validateVendor(vendorCode);
		GetRevenuePOSSReportNAP getRevenuePOSSReport = new GetRevenuePOSSReportNAP();
		getRevenuePOSSReport.setBusinessDate(getXMLGregorianCalenderDate(businessDateDto.getBusinessDate()));
		getRevenuePOSSReport.setLocCode(CommonUtil.getLocationCode());
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		GetRevenuePOSSReportNAPResponse getRevenuePOSSReportNAPResponse;
		try {
			getRevenuePOSSReportNAPResponse = ghsClient.getGhsTodayRevenueEod(vendor, getRevenuePOSSReport, ghsAudit);
		} catch (Exception e) {
			throw new ServiceException(" Could not connect to GHS server, unable to collect today's revenue",
					ERR_INT_039);
		}
		if (!getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail().isEmpty()) {
			ListResponse<GhsTodayRevenueDto> ghsTodayRevenueDtoList = getRevenueResponseDetails(
					getRevenuePOSSReportNAPResponse);
			GhsTodayRevenueRequestDto ghsTodayRevenueRequestDto = new GhsTodayRevenueRequestDto();
			ghsTodayRevenueRequestDto.setLocationCode(CommonUtil.getLocationCode());
			ghsTodayRevenueRequestDto.setBusinessDate(businessDateDto.getBusinessDate());
			setFinalGhsAuditDetails(ghsAudit, MapperUtil.getJsonString(ghsTodayRevenueRequestDto),
					MapperUtil.getJsonString(ghsTodayRevenueDtoList), Boolean.TRUE,
					GhsTransactionEnum.GET_REVENUE_EOD.name());
			return ghsTodayRevenueDtoList;
		} else {
			throw new ServiceException(NO_DATA, ERR_INT_041);
		}
	}

	@Override
	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenue(BusinessDateDto businessDate, String vendorCode) {
		VendorDao vendor = validateVendor(vendorCode);
		GetTodaysGHSRevenueNAP getTodaysGHSRevenueNAP = new GetTodaysGHSRevenueNAP();
		getTodaysGHSRevenueNAP.setBusinessDate(getXMLGregorianCalenderDate(businessDate.getBusinessDate()));
		getTodaysGHSRevenueNAP.setLocCode(CommonUtil.getLocationCode());
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		GetTodaysGHSRevenueNAPResponse getTodaysGHSRevenueNAPResponse;
		try {
			getTodaysGHSRevenueNAPResponse = ghsClient.getGhsTodayRevenue(vendor, getTodaysGHSRevenueNAP, ghsAudit);
		} catch (Exception e) {
			throw new ServiceException("Could not connect to GHS server, unable to collect today's revenue",
					ERR_INT_039);
		}
		if (!getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue().isEmpty()) {
			ListResponse<GhsTodayRevenueDto> ghsTodayRevenueDtoList = getTodaysRevenueResponseDetails(
					getTodaysGHSRevenueNAPResponse);
			GhsTodayRevenueRequestDto ghsTodayRevenueRequestDto = new GhsTodayRevenueRequestDto();
			ghsTodayRevenueRequestDto.setLocationCode(CommonUtil.getLocationCode());
			ghsTodayRevenueRequestDto.setBusinessDate(businessDate.getBusinessDate());
			setFinalGhsAuditDetails(ghsAudit, MapperUtil.getJsonString(ghsTodayRevenueRequestDto),
					MapperUtil.getJsonString(ghsTodayRevenueDtoList), Boolean.TRUE,
					GhsTransactionEnum.GET_TODAY_REVENUE.name());
			return ghsTodayRevenueDtoList;
		} else {
			throw new ServiceException(NO_DATA, ERR_INT_041);
		}
	}

	private ListResponse<GhsTodayRevenueDto> getRevenueResponseDetails(
			GetRevenuePOSSReportNAPResponse getRevenuePOSSReportNAPResponse) {
		ListResponse<GhsTodayRevenueDto> revenueDetails = new ListResponse<>();
		List<GhsTodayRevenueDto> ghsTodaysRevenueList = new ArrayList<>();
		GhsTodayRevenueDto ghsTodayRevenueDto = new GhsTodayRevenueDto();
		ghsTodayRevenueDto.setRevenueType(RevenueTypeEnum.GHS.name());
		List<RevenueDto> revenueDtos = new ArrayList<>();
		RevenueDto revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CASH.name());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getCashAmount());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getReversalCash());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CARD.name());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getCCRevenue());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getReversalCC());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.AIRPAY.name());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getAirPayAmount());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getRevAirPay());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.DD.name());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getDDAmount());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getReversalDD());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CHEQUE.name());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getChequeAmount());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getReversalCheque());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.WALLET.name());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getPayTMAmount());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getRevPayTM());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.EMPLOYEE_LOAN.name());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getEmpSalDeductionAmount());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getReversalEmpSaldeduction());
		revenueDto.setRevenues(revenueDto.getPayments().subtract(revenueDto.getReturns()));
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.ROPAYMENT.getPaymentcode());
		revenueDto.setPayments(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getRefundRO());
		revenueDto.setReturns(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getRefundRO());
		revenueDto.setRevenues(getRevenuePOSSReportNAPResponse.getGetRevenuePOSSReportNAPResult().getGHRevenueDetail()
				.get(0).getRefundRO());
		revenueDtos.add(revenueDto);
		ghsTodayRevenueDto.setRevenues(revenueDtos);
		ghsTodaysRevenueList.add(ghsTodayRevenueDto);
		revenueDetails.setResults(ghsTodaysRevenueList);
		return revenueDetails;
	}

	private ListResponse<GhsTodayRevenueDto> getTodaysRevenueResponseDetails(
			GetTodaysGHSRevenueNAPResponse getTodaysGHSRevenueNAPResponse) {
		ListResponse<GhsTodayRevenueDto> revenueDetails = new ListResponse<>();
		List<GhsTodayRevenueDto> ghsTodaysRevenueList = new ArrayList<>();
		GhsTodayRevenueDto ghsTodayRevenueDto = new GhsTodayRevenueDto();
		ghsTodayRevenueDto.setRevenueType(RevenueTypeEnum.GHS.name());
		List<RevenueDto> revenueDtos = new ArrayList<>();
		RevenueDto revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CASH.name());
		revenueDto.setRevenues(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
				.get(0).getCashAmount());
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CARD.name());
		revenueDto.setRevenues(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
				.get(0).getCCRevenue());
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.DD.name());
		revenueDto.setRevenues(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
				.get(0).getDDAmount());
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.CHEQUE.name());
		revenueDto.setRevenues(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
				.get(0).getChequeAmount());
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.EMPLOYEE_LOAN.name());
		revenueDto.setRevenues(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
				.get(0).getEmpSalDeductionAmount());
		revenueDtos.add(revenueDto);
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.AIRPAY.name());
		revenueDto.setRevenues(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
				.get(0).getAirPayAmount());
		revenueDtos.add(revenueDto);
		/*
		 * revenueDto = new RevenueDto();
		 * revenueDto.setPaymentCode(PaymentCodeRevenueEnum.UPI.name());
		 * revenueDto.setRevenues(getTodaysGHSRevenueNAPResponse.
		 * getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
		 * .get(0).getUPIAmount());
		 */
		revenueDto = new RevenueDto();
		revenueDto.setPaymentCode(PaymentCodeRevenueEnum.ROPAYMENT.getPaymentcode());
//		
//		revenueDto.setPayments(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
//				.get(0).getRefundRO());
//		revenueDto.setReturns(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
//				.get(0).getRefundRO());
		revenueDto.setRevenues(new BigDecimal(-1).multiply(getTodaysGHSRevenueNAPResponse.getGetTodaysGHSRevenueNAPResult().getGHTodaysRevenue()
				.get(0).getRefundRO()));
		revenueDtos.add(revenueDto);
		ghsTodayRevenueDto.setRevenues(revenueDtos);
		ghsTodaysRevenueList.add(ghsTodayRevenueDto);
		revenueDetails.setResults(ghsTodaysRevenueList);
		return revenueDetails;
	}

	@Override
	public void updateDiscountVoucher(String vendorCode, String discountVoucherNo, int accountNo, String transactionId,
			String status) {
		VendorDao vendor = validateVendor(vendorCode);
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		DiscountVoucherDetails discountVoucherDetails = new DiscountVoucherDetails();
		if (status.equalsIgnoreCase(TransactionStatusEnum.REVERSED.name()))
			discountVoucherDetails.setStatus(0);
		else
			discountVoucherDetails.setStatus(1);
		POSSUpdateDiscountVoucher pOSSUpdateDiscountVoucher = getPOSSUpdateDiscountVoucher(discountVoucherNo,
				transactionId, discountVoucherDetails, accountNo);
		POSSUpdateDiscountVoucherResponse pOSSUpdateDiscountVoucherResponse = ghsClient.redeemGhsDiscountVoucher(vendor,
				pOSSUpdateDiscountVoucher);
		if (pOSSUpdateDiscountVoucherResponse != null
				&& pOSSUpdateDiscountVoucherResponse.isPOSSUpdateDiscountVoucherResult()) {
			setFinalGhsAuditDetails(ghsAudit, discountVoucherNo, pOSSUpdateDiscountVoucherResponse.toString(),
					Boolean.TRUE, GhsTransactionEnum.REVERSE_REDEMPTION.name());

		} else {
			throw new ServiceException("Can't update Discount voucher Details", ERR_INT_044);
		}
	}

	private String getJsonValueFromJaxbObject(Object object) {
		ObjectMapper mapper = new ObjectMapper();
		String result = null;
		AnnotationIntrospector introspector = new JacksonAnnotationIntrospector();
		mapper.setAnnotationIntrospector(introspector);
		try {
			result = mapper.writeValueAsString(object);
		} catch (Exception e) {
			throw new ServiceException("Error Serializing JAXB Object", "ERR-INT-095", e.getMessage());
		}
		return result;
	}

	@Override
	public GhsAccountMasterUpdateDto updateGhsAccountMaster(String vendorCode,
			GhsAccountMasterUpdateDto ghsAccountMasterUpdateDto) {
		VendorDao vendor = validateVendor(vendorCode);
		updateGhsAccountMasterStatus(vendorCode, ghsAccountMasterUpdateDto.getAccountNo(),
				GhsAccountDetailsStatusEnum.OPEN.name());
		GetGHAccountMasterForId getGHAccountMasterForId = new GetGHAccountMasterForId();
		getGHAccountMasterForId.setAccountNumber(ghsAccountMasterUpdateDto.getAccountNo());
		getGHAccountMasterForId.setLocationCode(CommonUtil.getLocationCode());
		GhsAuditDao ghsAudit1 = getInitialGhsAuditDetails(vendor);
		GetGHAccountMasterForIdResponse getGHAccountMasterForIdResponse = ghsClient.getGhsAccountDetails(vendor,
				getGHAccountMasterForId, ghsAudit1);
		setFinalGhsAuditDetails(ghsAudit1, getJsonValueFromJaxbObject(getGHAccountMasterForId),
				getJsonValueFromJaxbObject(getGHAccountMasterForIdResponse), Boolean.TRUE,
				GhsTransactionEnum.GET_ACCOUNT_DETAILS.name());
		CNDetailsForPassBook cNDetailsForPassBook = getCnDetailsForPassbook(ghsAccountMasterUpdateDto,
				getGHAccountMasterForIdResponse);
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		CNDetailsForPassBookResponse cNDetailsForPassBookResponse = ghsClient.cNDetailsForPassBook(vendor,
				cNDetailsForPassBook, ghsAudit);
		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(cNDetailsForPassBook),
				getJsonValueFromJaxbObject(cNDetailsForPassBookResponse), Boolean.TRUE,
				GhsTransactionEnum.UPDATE_CN_PASSBOOOK.name());
		UpdateHoldStatusforAccountOnMaturity updateHoldStatusforAccountOnMaturity = new UpdateHoldStatusforAccountOnMaturity();
		updateHoldStatusforAccountOnMaturity.setAccountNo(ghsAccountMasterUpdateDto.getAccountNo());
		updateHoldStatusforAccountOnMaturity.setStatus(3);
		GhsAuditDao ghsAudit4 = getInitialGhsAuditDetails(vendor);
		ghsClient.updateHoldStatusforAccountOnMaturity(vendor, updateHoldStatusforAccountOnMaturity, ghsAudit4);
		if (cNDetailsForPassBookResponse.isCNDetailsForPassBookResult()) {
			return ghsAccountMasterUpdateDto;
		} else {
			throw new ServiceException("Can't update the credit note details in GHS", ERR_INT_052);
		}
	}

	@Override
	public BooleanResponse updateGhsAccountMasterStatus(String vendorCode, Integer accountNo, String status) {
		BooleanResponse response = new BooleanResponse();
		VendorDao vendor = validateVendor(vendorCode);
		UpdateHoldStatusforAccountOnMaturity updateHoldStatusforAccountOnMaturity = new UpdateHoldStatusforAccountOnMaturity();
		updateHoldStatusforAccountOnMaturity.setAccountNo(accountNo);
		if (status.equals(GhsAccountDetailsStatusEnum.OPEN.name()))
			updateHoldStatusforAccountOnMaturity.setStatus(0);
		else
			updateHoldStatusforAccountOnMaturity.setStatus(5);
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		UpdateHoldStatusforAccountOnMaturityResponse updateHoldStatusforAccountOnMaturityResponse = ghsClient
				.updateHoldStatusforAccountOnMaturity(vendor, updateHoldStatusforAccountOnMaturity, ghsAudit);
		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(updateHoldStatusforAccountOnMaturity),
				getJsonValueFromJaxbObject(updateHoldStatusforAccountOnMaturityResponse), Boolean.TRUE,
				GhsTransactionEnum.UPDATE_HOLD_STATUS_MATURITY.name());
		if (updateHoldStatusforAccountOnMaturityResponse.isUpdateHoldStatusforAccountOnMaturityResult())
			response.setStatus(Boolean.TRUE);
		else
			response.setStatus(Boolean.FALSE);
		return response;
	}

	@Override
	public BooleanResponse checkBODStatus(String vendorCode, BusinessDateDto businessDateDto, String locationCode) {
		BooleanResponse response = new BooleanResponse();
		VendorDao vendor = validateVendor(vendorCode);
		CheckBODStatus checkBODStatus = new CheckBODStatus();
		checkBODStatus.setBusinessDate(getXMLGregorianCalenderDate(businessDateDto.getBusinessDate()));
		checkBODStatus.setLocationCode(locationCode);
		/*
		 * JSONObject json = new JSONObject(); json.put("businessDate",
		 * getXMLGregorianCalenderDate(businessDate)); json.put("locationCode",
		 * locationCode);
		 */ GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		    ghsAudit.setBusinessDate(businessDateDto.getBusinessDate());
		CheckBODStatusResponse checkBODStatusResponse = ghsClient.checkBODStatus(vendor, checkBODStatus, ghsAudit);
		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(checkBODStatus),
				getJsonValueFromJaxbObject(checkBODStatusResponse), Boolean.TRUE,
				GhsTransactionEnum.CHECK_BOD_STATUS.name());
		response.setStatus(checkBODStatusResponse.isCheckBODStatusResult());
		return response;
	}
	

    @Override
	public BooleanResponse checkEODStatus(String vendorCode, BusinessDateDto businessDateDto, String locationCode) {
		log.info("inside eod status method");
		BooleanResponse response = new BooleanResponse();
		VendorDao vendor = validateVendor(vendorCode);
		CheckEODStatus checkEODStatus = new CheckEODStatus();
		checkEODStatus.setBusinessDate(getXMLGregorianCalenderDate(businessDateDto.getBusinessDate()));
		checkEODStatus.setLocationCode(locationCode);
		
		 GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		 ghsAudit.setBusinessDate(businessDateDto.getBusinessDate());
		CheckEODStatusResponse checkEODStatusResponse = ghsClient.checkEODStatus(vendor, checkEODStatus, ghsAudit);
		log.info("eod response status {}",checkEODStatusResponse.isCheckEODStatusResult());
		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(checkEODStatus),
				getJsonValueFromJaxbObject(checkEODStatusResponse), Boolean.TRUE,
				GhsTransactionEnum.CHECK_EOD_STATUS.name());
		response.setStatus(checkEODStatusResponse.isCheckEODStatusResult());
		return response;
	}

	@Override
	public StringResponse checkCNStatus(int ghsDocNo, int fiscalYear, String vendorCode) {

		StringResponse stringResponse = new StringResponse();
		VendorDao vendor = validateVendor(vendorCode);
		CheckCNStatus checkCNStatus = new CheckCNStatus();
		checkCNStatus.setLocationCode(CommonUtil.getLocationCode());
		checkCNStatus.setCNNo(ghsDocNo);
		checkCNStatus.setCNFiscalYear(fiscalYear);
		JSONObject json = new JSONObject();
		json.put("ghsDocNo", ghsDocNo);
		json.put("fiscalYear", ghsDocNo);
		json.put("locationCode", CommonUtil.getLocationCode());
		String request = json.toString();
		GhsAuditDao ghsAudit = getInitialGhsAuditDetails(vendor);
		CheckCNStatusResponse checkCNStatusResponse = ghsClient.checkCNStatus(vendor, checkCNStatus, ghsAudit);
		setFinalGhsAuditDetails(ghsAudit, getJsonValueFromJaxbObject(checkCNStatus),
				getJsonValueFromJaxbObject(checkCNStatusResponse), Boolean.TRUE,
				GhsTransactionEnum.CHECK_CN_STATUS.name());
		stringResponse.setStatus(checkCNStatusResponse.getCheckCNStatusResult().substring(0,
				checkCNStatusResponse.getCheckCNStatusResult().indexOf(',')));
		return stringResponse;
	}

//	@Override
//	public GhsCustomerDto saveCustomerGhs(String vendorCode, Object customerObject) {
//		VendorDao vendor = validateVendor(vendorCode);
//		Gson gson = new Gson();
//		String jsonString = gson.toJson(customerObject);
//		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
//		GhsAuditDao ghsAudit1 = getInitialGhsAuditDetails(vendor);
//		CheckCustomerAteGHS checkCustomerAteGHS = new CheckCustomerAteGHS();
//		POSSCustomerMaster customer = new POSSCustomerMaster();
//		customer = createGHSCustomerCheck(jsonObject);
//		checkCustomerAteGHS.setObjCustDetails(customer);
//		CheckCustomerAteGHSResponse checkCustomerAteGHSResponse = ghsClient.checkCustomerAteGHSResponse(vendor,
//				checkCustomerAteGHS, ghsAudit1);
//		setFinalGhsAuditDetails(ghsAudit1, getJsonValueFromJaxbObject(checkCustomerAteGHS),
//				getJsonValueFromJaxbObject(checkCustomerAteGHSResponse), Boolean.TRUE,
//				GhsTransactionEnum.CUSTOMER_CHECK.name());
//		SavePossCustomer savePossCustomer = new SavePossCustomer();
//		PossCustomerDetails possCustomer = new PossCustomerDetails();
//		possCustomer = saveGHSCustomer(jsonObject);
//		savePossCustomer.setCustomerDetail(possCustomer);
//		GhsAuditDao ghsAudit2 = getInitialGhsAuditDetails(vendor);
//		SavePossCustomerResponse savePossCustomerResponse = ghsClient.saveCustomerAteGHSResponse(vendor,
//				savePossCustomer, ghsAudit2);
//		setFinalGhsAuditDetails(ghsAudit2, getJsonValueFromJaxbObject(savePossCustomer),
//				getJsonValueFromJaxbObject(savePossCustomerResponse), Boolean.TRUE,
//				GhsTransactionEnum.CUSTOMER_SAVE.name());
//		if (checkCustomerAteGHSResponse.getCheckCustomerAteGHSResult() != null
//				&& checkCustomerAteGHSResponse.getCheckCustomerAteGHSResult().getPOSSCustomerMaster() != null
//				&& !checkCustomerAteGHSResponse.getCheckCustomerAteGHSResult().getPOSSCustomerMaster().isEmpty()) {
//			if (!savePossCustomerResponse.getSavePossCustomerResult().getName()
//					.equalsIgnoreCase(jsonObject.get(CUSTOMER).getAsJsonObject().get(CUSTOMER_NAME).getAsString())) {
//				Map<String, String> errorMap = new HashMap<>();
//				errorMap.put(savePossCustomerResponse.getSavePossCustomerResult().getName(),
//						jsonObject.get(CUSTOMER).getAsJsonObject().get(CUSTOMER_NAME).getAsString());
//				throw new ServiceException("Error in customer sync for NAP and EGHS", "ERR-INT-094", errorMap);
//			}
//			GhsCustomerDto ghsCustomer = new GhsCustomerDto();
//			ghsCustomer.setCustomerId(checkCustomerAteGHSResponse.getCheckCustomerAteGHSResult().getPOSSCustomerMaster()
//					.get(0).getCustomerID());
//			return ghsCustomer;
//		} else {
//			throw new ServiceException("Error in customer sync for NAP and EGHS", "ERR-INT-094");
//		}
//	}

//	private POSSCustomerMaster createGHSCustomerCheck(JsonObject object) {
//		POSSCustomerMaster customer = new POSSCustomerMaster();
//		JsonObject customerDao = new JsonObject();
//		JsonObject customerlocationMappingDao = new JsonObject();
//		JsonObject customerDetails = new JsonObject();
//		if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
//			customerDao = object.get(CUSTOMER).getAsJsonObject();
//			if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
//				customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
//						.getAsJsonObject().get("data").getAsJsonObject();
//			}
//		}
//		if (object.get(CUSTOMER_LOCATION_MAPPING) != null && !object.get(CUSTOMER_LOCATION_MAPPING).isJsonNull()) {
//			customerlocationMappingDao = object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject();
//		}
//		if (customerDao.get(CUSTOMER_NAME) != null && !customerDao.get(CUSTOMER_NAME).isJsonNull())
//			customer.setName(customerDao.get(CUSTOMER_NAME).getAsString());
//		if (customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID) != null
//				&& !customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID).isJsonNull()) {
//			customer.setLocationCode(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
//					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(LOCATION_CODE).getAsString());
////			customer.setCustomerNo(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
////					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(CUSTOMER_ID).getAsInt());
//		}
//		if (customerDao.get(TITLE) != null && !customerDao.get(TITLE).isJsonNull())
//			customer.setPrefix(customerDao.get(TITLE).getAsString());
////		if (customerDao.get(EMAIL_ID) != null && !customerDao.get(EMAIL_ID).isJsonNull())
////			customer.setEmailID(customerDao.get(EMAIL_ID).getAsString());
//		if (customerDao.get(IS_ACTIVE) != null && !customerDao.get(IS_ACTIVE).isJsonNull())
//			customer.setIsActive(customerDao.get(IS_ACTIVE).getAsBoolean());
//		if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
//			customer.setMobileNo(customerDao.get(MOBILE_NUMBER).getAsString());
//		if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull()) {
//			customer.setBirthDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(BIRTHDAY))));
//		} else {
//			customer.setBirthDate(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
//		}
//		if (customerDetails.get(ANNIVERSARY) != null && !customerDetails.get(ANNIVERSARY).isJsonNull())
//			customer.setAnniversaryDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(ANNIVERSARY))));
//		if (customerDetails.get(PIN_CODE) != null && !customerDetails.get(PIN_CODE).isJsonNull())
//			customer.setPinCode(customerDetails.get(PIN_CODE).getAsString());
//		if (customerDao.get(CREATED_BY) != null && !customerDao.get(CREATED_BY).isJsonNull())
//			customer.setCreatedBy(customerDao.get(CREATED_BY).getAsString());
//		customer.setLoginID(CommonUtil.getUserName());
//		if (customerDao.get(CREATED_DATE) != null && !customerDao.get(CREATED_DATE).isJsonNull())
//			customer.setCreatedDate(getXMLGregorianCalenderDate(getParsedDate(customerDao.get(CREATED_DATE))));
//		if (customerDao.get(LAST_MODIFIED_BY) != null && !customerDao.get(LAST_MODIFIED_BY).isJsonNull())
//			customer.setLastModifiedID(customerDao.get(LAST_MODIFIED_BY).getAsString());
//		if (customerDao.get(LAST_MODIFIED_DATE) != null && !customerDao.get(LAST_MODIFIED_DATE).isJsonNull())
//			customer.setLastModifiedDate(
//					getXMLGregorianCalenderDate(getParsedDate(customerDao.get(LAST_MODIFIED_DATE))));
//		if (customerDetails.get(SPOUSE_BIRTH_DAY) != null && !customerDetails.get(SPOUSE_BIRTH_DAY).isJsonNull())
//			customer.setSpouseBirthday(
//					getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(SPOUSE_BIRTH_DAY))));
////		if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull())
////			customer.setULPMembershipID(customerDao.get(ULP_ID).getAsString());
//		if (customerDetails.get(CAN_SEND_SMS) != null && !customerDetails.get(CAN_SEND_SMS).isJsonNull())
//			customer.setSendSms(customerDetails.get(CAN_SEND_SMS).getAsBoolean());
////		if (customerDao.get(CUST_TAX_NO) != null && !customerDao.get(CUST_TAX_NO).isJsonNull())
////			customer.setPanCardNo(customerDao.get(CUST_TAX_NO).getAsString());
//		if (customerDetails.get(CATCHMENT_NAME) != null && !customerDetails.get(CATCHMENT_NAME).isJsonNull())
//			customer.setCatchmentArea(customerDetails.get(CATCHMENT_NAME).getAsString());
//		if (customerDetails.get(IS_HARD_COPY_SUBMITTED) != null
//				&& !customerDetails.get(IS_HARD_COPY_SUBMITTED).isJsonNull())
//			customer.setIsHardCopySubmitted(customerDetails.get(IS_HARD_COPY_SUBMITTED).getAsBoolean());
//		if (customerDetails.get(CITY) != null && !customerDetails.get(CITY).isJsonNull())
//			customer.setCityName(customerDetails.get(CITY).getAsString());
//		if (customerDetails.get(STATE) != null && !customerDetails.get(STATE).isJsonNull())
//			customer.setStateName(customerDetails.get(STATE).getAsString());
//		if (customerDetails.get(ADDRESS_LINES) != null && !customerDetails.get(ADDRESS_LINES).isJsonNull()) {
//			JsonArray jsonArrayResponse = customerDetails.get(ADDRESS_LINES).getAsJsonArray();
//			String address1 = null;
//			String address2 = null;
//			Integer size = jsonArrayResponse.size();
//			if (size >= 1 && !StringUtils.isEmpty(jsonArrayResponse.get(0)))
//				address1 = jsonArrayResponse.get(0).getAsString();
//			if (size >= 2 && !StringUtils.isEmpty(jsonArrayResponse.get(1)))
//				address1 = address1 + ", " + jsonArrayResponse.get(1).getAsString();
//			customer.setAddress1(address1);
//			if (size >= 3 && !StringUtils.isEmpty(jsonArrayResponse.get(2)))
//				address2 = jsonArrayResponse.get(2).getAsString();
//			if (size >= 4 && !StringUtils.isEmpty(jsonArrayResponse.get(3)))
//				address2 = address2 + ", " + jsonArrayResponse.get(3).getAsString();
//			customer.setAddress2(address2);
//		}
//		return customer;
//	}
//
//	private PossCustomerDetails saveGHSCustomer(JsonObject object) {
//		PossCustomerDetails customer = new PossCustomerDetails();
//		JsonObject customerDao = new JsonObject();
//		JsonObject customerlocationMappingDao = new JsonObject();
//		JsonObject customerDetails = new JsonObject();
//		if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
//			customerDao = object.get(CUSTOMER).getAsJsonObject();
//			if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
//				customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
//						.getAsJsonObject().get("data").getAsJsonObject();
//			}
//		}
//		if (object.get(CUSTOMER_LOCATION_MAPPING) != null && !object.get(CUSTOMER_LOCATION_MAPPING).isJsonNull()) {
//			customerlocationMappingDao = object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject();
//		}
//		if (customerDao.get(CUSTOMER_NAME) != null && !customerDao.get(CUSTOMER_NAME).isJsonNull())
//			customer.setName(customerDao.get(CUSTOMER_NAME).getAsString());
//		if (customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID) != null
//				&& !customerlocationMappingDao.get(CUSTOMER_LOCATION_MAPPING_ID).isJsonNull())
//			customer.setLocationCode(object.get(CUSTOMER_LOCATION_MAPPING).getAsJsonObject()
//					.get(CUSTOMER_LOCATION_MAPPING_ID).getAsJsonObject().get(LOCATION_CODE).getAsString());
//		if (customerDao.get(TITLE) != null && !customerDao.get(TITLE).isJsonNull())
//			customer.setPrefix(customerDao.get(TITLE).getAsString());
////		if (customerDao.get(EMAIL_ID) != null && !customerDao.get(EMAIL_ID).isJsonNull())
////			customer.setEmailID(customerDao.get(EMAIL_ID).getAsString());
//		if (customerDao.get(IS_ACTIVE) != null && !customerDao.get(IS_ACTIVE).isJsonNull())
//			customer.setIsActive(customerDao.get(IS_ACTIVE).getAsBoolean());
//		if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
//			customer.setMobileNo(customerDao.get(MOBILE_NUMBER).getAsString());
//		if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull()) {
//			customer.setBirthDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(BIRTHDAY))));
//		} else {
//			customer.setBirthDate(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
//		}
//		if (customerDetails.get(ANNIVERSARY) != null && !customerDetails.get(ANNIVERSARY).isJsonNull())
//			customer.setAnniversaryDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(ANNIVERSARY))));
//		if (customerDetails.get(PIN_CODE) != null && !customerDetails.get(PIN_CODE).isJsonNull())
//			customer.setPinCode(customerDetails.get(PIN_CODE).getAsString());
//		if (customerDao.get(CREATED_BY) != null && !customerDao.get(CREATED_BY).isJsonNull())
//			customer.setCreatedBy(customerDao.get(CREATED_BY).getAsString());
//		if (customerDao.get(CREATED_DATE) != null && !customerDao.get(CREATED_DATE).isJsonNull())
//			customer.setCreatedDate(getXMLGregorianCalenderDate(getParsedDate(customerDao.get(CREATED_DATE))));
//		customer.setLoginID(CommonUtil.getUserName());
//		if (customerDao.get(LAST_MODIFIED_BY) != null && !customerDao.get(LAST_MODIFIED_BY).isJsonNull())
//			customer.setLastModifiedID(customerDao.get(LAST_MODIFIED_BY).getAsString());
//		if (customerDao.get(LAST_MODIFIED_DATE) != null && !customerDao.get(LAST_MODIFIED_DATE).isJsonNull())
//			customer.setLastModifiedDate(
//					getXMLGregorianCalenderDate(getParsedDate(customerDao.get(LAST_MODIFIED_DATE))));
//		if (customerDetails.get(SPOUSE_BIRTH_DAY) != null && !customerDetails.get(SPOUSE_BIRTH_DAY).isJsonNull())
//			customer.setSpouseBirthday(
//					getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(SPOUSE_BIRTH_DAY))));
////		if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull())
////			customer.setULPMembershipID(customerDao.get(ULP_ID).getAsString());
//		if (customerDetails.get(CAN_SEND_SMS) != null && !customerDetails.get(CAN_SEND_SMS).isJsonNull())
//			customer.setSendSms(customerDetails.get(CAN_SEND_SMS).getAsBoolean());
////		if (customerDao.get(CUST_TAX_NO) != null && !customerDao.get(CUST_TAX_NO).isJsonNull())
////			customer.setPanCardNo(customerDao.get(CUST_TAX_NO).getAsString());
//		if (customerDetails.get(CATCHMENT_NAME) != null && !customerDetails.get(CATCHMENT_NAME).isJsonNull())
//			customer.setCatchmentArea(customerDetails.get(CATCHMENT_NAME).getAsString());
//		if (customerDetails.get(IS_HARD_COPY_SUBMITTED) != null
//				&& !customerDetails.get(IS_HARD_COPY_SUBMITTED).isJsonNull())
//			customer.setIsHardCopySubmitted(customerDetails.get(IS_HARD_COPY_SUBMITTED).getAsBoolean());
//		if (customerDetails.get(CITY) != null && !customerDetails.get(CITY).isJsonNull())
//			customer.setCityName(customerDetails.get(CITY).getAsString());
//		if (customerDetails.get(STATE) != null && !customerDetails.get(STATE).isJsonNull())
//			customer.setStateName(customerDetails.get(STATE).getAsString());
//		if (customerDetails.get(ADDRESS_LINES) != null && !customerDetails.get(ADDRESS_LINES).isJsonNull()) {
//			JsonArray jsonArrayResponse = customerDetails.get(ADDRESS_LINES).getAsJsonArray();
//			String address1 = null;
//			String address2 = null;
//			Integer size = jsonArrayResponse.size();
//			if (size >= 1 && !StringUtils.isEmpty(jsonArrayResponse.get(0)))
//				address1 = jsonArrayResponse.get(0).getAsString();
//			if (size >= 2 && !StringUtils.isEmpty(jsonArrayResponse.get(1)))
//				address1 = address1 + ", " + jsonArrayResponse.get(1).getAsString();
//			customer.setAddress1(address1);
//			if (size >= 3 && !StringUtils.isEmpty(jsonArrayResponse.get(2)))
//				address2 = jsonArrayResponse.get(2).getAsString();
//			if (size >= 4 && !StringUtils.isEmpty(jsonArrayResponse.get(3)))
//				address2 = address2 + ", " + jsonArrayResponse.get(3).getAsString();
//			customer.setAddress2(address2);
//		}
//		return customer;
//	}
//

//	private POSSCustomerMaster createCustomer(JsonObject object) {
//		POSSCustomerMaster customer = new POSSCustomerMaster();
//		JsonObject customerDao = new JsonObject();
//		JsonObject customerDetails = new JsonObject();
//		if (object.get(CUSTOMER) != null && !object.get(CUSTOMER).isJsonNull()) {
//			customerDao = object.get(CUSTOMER).getAsJsonObject();
//			if (customerDao.get(CUSTOMER_DETAILS) != null && !customerDao.get(CUSTOMER_DETAILS).isJsonNull()) {
//				customerDetails = new JsonParser().parse(customerDao.get(CUSTOMER_DETAILS).getAsString())
//						.getAsJsonObject().get("data").getAsJsonObject();
//			}
//		}
//		if (customerDao.get(MOBILE_NUMBER) != null && !customerDao.get(MOBILE_NUMBER).isJsonNull())
//			customer.setMobileNo(customerDao.get(MOBILE_NUMBER).getAsString());
//		if (customerDao.get(ULP_ID) != null && !customerDao.get(ULP_ID).isJsonNull())
//			customer.setULPMembershipID(customerDao.get(ULP_ID).getAsString());
//		if (customerDetails.get(BIRTHDAY) != null && !customerDetails.get(BIRTHDAY).isJsonNull()) {
//			customer.setBirthDate(getXMLGregorianCalenderDate(getParsedDate(customerDetails.get(BIRTHDAY))));
//		} else {
//			customer.setBirthDate(getXMLGregorianCalenderDate(CalendarUtils.getCurrentDate()));
//		}
//		return customer;
//	}

}
