/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.util.Map;

import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import com.fasterxml.jackson.databind.AnnotationIntrospector;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.GhsVendorDetailsDto;
import com.titan.poss.integration.eghs.generated.BTQBODDone;
import com.titan.poss.integration.eghs.generated.BTQBODDoneResponse;
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
import com.titan.poss.integration.eghs.generated.ClearAllActiveSessionForLocationResponse;
import com.titan.poss.integration.eghs.generated.DeletePartialAccOnException;
import com.titan.poss.integration.eghs.generated.DeletePartialAccOnExceptionResponse;
import com.titan.poss.integration.eghs.generated.DownloadCreditNotesForLocation;
import com.titan.poss.integration.eghs.generated.DownloadCreditNotesForLocationResponse;
import com.titan.poss.integration.eghs.generated.GetACHdetailDOResponse;
import com.titan.poss.integration.eghs.generated.GetAttachments;
import com.titan.poss.integration.eghs.generated.GetAttachmentsResponse;
import com.titan.poss.integration.eghs.generated.GetGHAccountMasterForId;
import com.titan.poss.integration.eghs.generated.GetGHAccountMasterForIdResponse;
import com.titan.poss.integration.eghs.generated.GetGHSInstallmentAmount;
import com.titan.poss.integration.eghs.generated.GetGHSInstallmentAmountResponse;
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
import com.titan.poss.integration.eghs.generated.POSSGetDiscountVoucherDetailsNAP;
import com.titan.poss.integration.eghs.generated.POSSGetDiscountVoucherDetailsNAPResponse;
import com.titan.poss.integration.eghs.generated.POSSGetInvalidDiscountVoucherDetailsNAP;
import com.titan.poss.integration.eghs.generated.POSSGetInvalidDiscountVoucherDetailsNAPResponse;
import com.titan.poss.integration.eghs.generated.POSSUpdateDiscountVoucher;
import com.titan.poss.integration.eghs.generated.POSSUpdateDiscountVoucherResponse;
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

import ch.qos.logback.classic.Logger;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
public class GhsClient extends WebServiceGatewaySupport {

	private static final String DOWNLOAD_CREDIT_NOTES_FOR_LOCATION = "DownloadCreditNotesForLocation";
	private static final String INSERT_CN_DETAILS = "InsertCNDetails";
	private static final String UPDATE_CNA_AFTER_DOWNLOAD = "UpdateCNAfterDownload";
	private static final String GET_REVENUE_POSS_REPORT_NAP = "GetRevenuePOSSReport_NAP";
	private static final String POSS_GET_DISCOUNT_VOUCHER_DETAILS = "POSS_GetDiscountVoucherDetails_NAP";
	private static final String POSS_GET_INVALID_DISCOUNT_VOUCHER_DETAILS = "POSS_GetInvalidDiscountVoucherDetails_NAP";
	private static final String POSS_UPDATE_DISCOUNT_VOUCHER = "POSS_UpdateDiscountVoucher";
	private static final String BTQ_BOD_DONE = "BTQBODDone";
	private static final String CLEAR_ALL_ACTIVE_SESSION_FOR_LOCATION = "ClearAllActiveSessionForLocation";
	private static final String BTQ_EOD_DONE = "BTQEODDone";
	private static final String GET_GHS_ACCOUNT_MASTER_FOR_ID = "GetGHAccountMasterForId";
	private static final String GET_ACH_DETAIL_DO = "GetACHdetailDO";
	private static final String GET_SI_DETAIL_DO = "GetSIdetailDO";
	
	private static final String INSTALLMENT_DETAILS_FOR_CASH_RESTRICTION = "InstallmentDetailsForCashRestriction_NAPUpdated";
	private static final String UPDATE_THRESHOLD_AMOUNT_FOR_LOCATION = "UpdateThresholdAmountforLocation";
	private static final String DELETE_PARTIAL_ACC_ON_EXCEPTION = "DeletePartialAccOnException";
	private static final String CN_DETAILS_FOR_PASSBOOK = "CNDetailsForPassBook";
	private static final String UPDATE_HOLD_STATUS_FOR_ACCOUNT_ON_MATURITY = "UpdateHoldStatusforAccountOnMaturity";
	private static final String GET_ATTACHMENT_RESPONSE = "GetAttachments";
	private static final String GET_GHS_INSTALLMENT_AMOUNT = "GetGHSInstallmentAmount";
	private static final String GET_TODAYS_GHS_REVENUE_NAP = "GetTodaysGHSRevenue_NAP";
	private static final String CHECK_EGHS_CUSTOMER = "CheckCustomerAteGHS";
	private static final String SAVE_EGHS_CUSTOMER = "SavePossCustomer";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String GHS_CLIENT_COMMUNICATION_ERROR = "Cannot connect to {vendorName} application, please try again";
	private static final String GHS = "GHS";
	private static final String VENDOR_NAME = "vendorName";
	private static final String CHECK_CN_STATUS ="CheckCNStatus";
	private static final String CHECK_BOD_STATUS ="CheckBODStatus";
	private static final String CHECK_EOD_STATUS ="CheckEODStatus";
	private static final String UPDATE_GR ="UpdateGR";

	public InsertCNDetailsResponse transferCreditNotesToGhs(VendorDao vendor, InsertCNDetails insertCNDetails,
			GhsAuditDao ghsAudit) {
		InsertCNDetailsResponse response;
		String cnDetails=getJsonValueFromJaxbObject(insertCNDetails);
		log.info("cn details: "+cnDetails);
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + INSERT_CN_DETAILS).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (InsertCNDetailsResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl, insertCNDetails,
					new SoapActionCallback(soapActionUrl));
			log.info("ghs soap response: "+response.isInsertCNDetailsResult());
			String result=getJsonValueFromJaxbObject(response);
			log.info("ghs soap result: "+result);
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}
	public UpdateGRResponse updateGR(VendorDao vendor, UpdateGR updateGR, GhsAuditDao ghsAudit) {
		UpdateGRResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + UPDATE_GR).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (UpdateGRResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					updateGR, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
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
	
	public DownloadCreditNotesForLocationResponse getCreditNotesFromGhs(VendorDao vendor,
			DownloadCreditNotesForLocation downloadCreditNotesForLocation, GhsAuditDao ghsAudit) {
		DownloadCreditNotesForLocationResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + DOWNLOAD_CREDIT_NOTES_FOR_LOCATION).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (DownloadCreditNotesForLocationResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					downloadCreditNotesForLocation, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public UpdateCNAfterDownloadResponse updateCreditNoteAtGhs(VendorDao vendor,
			UpdateCNAfterDownload updateCNAfterDownload, GhsAuditDao ghsAudit) {
		UpdateCNAfterDownloadResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + UPDATE_CNA_AFTER_DOWNLOAD).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (UpdateCNAfterDownloadResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					updateCNAfterDownload, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;

	}

	public GetRevenuePOSSReportNAPResponse getGhsTodayRevenueEod(VendorDao vendor,
			GetRevenuePOSSReportNAP getRevenuePOSSReport, GhsAuditDao ghsAudit) {
		GetRevenuePOSSReportNAPResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + GET_REVENUE_POSS_REPORT_NAP).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (GetRevenuePOSSReportNAPResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					getRevenuePOSSReport, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public POSSGetDiscountVoucherDetailsNAPResponse getDiscountVoucherDetails(VendorDao vendor,
			POSSGetDiscountVoucherDetailsNAP pOSSGetDiscountVoucherDetailsNAP, GhsAuditDao ghsAudit) {
		POSSGetDiscountVoucherDetailsNAPResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + POSS_GET_DISCOUNT_VOUCHER_DETAILS).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (POSSGetDiscountVoucherDetailsNAPResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					pOSSGetDiscountVoucherDetailsNAP, new SoapActionCallback(soapActionUrl));

		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public POSSGetInvalidDiscountVoucherDetailsNAPResponse getInvalidDiscountVoucherDetails(VendorDao vendor,
			POSSGetInvalidDiscountVoucherDetailsNAP pOSSGetInvalidDiscountVoucherDetails, GhsAuditDao ghsAudit) {

		POSSGetInvalidDiscountVoucherDetailsNAPResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString((MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class)).getData()
								.getSoapAction()
						+ "/" + POSS_GET_INVALID_DISCOUNT_VOUCHER_DETAILS)
				.build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (POSSGetInvalidDiscountVoucherDetailsNAPResponse) getWebServiceTemplate().marshalSendAndReceive(
					baseUrl, pOSSGetInvalidDiscountVoucherDetails, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public POSSUpdateDiscountVoucherResponse redeemGhsDiscountVoucher(VendorDao vendor,
			POSSUpdateDiscountVoucher pOSSUpdateDiscountVoucher) {

		POSSUpdateDiscountVoucherResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + POSS_UPDATE_DISCOUNT_VOUCHER).build().toUriString();
		try {
			response = (POSSUpdateDiscountVoucherResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					pOSSUpdateDiscountVoucher, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public BTQBODDoneResponse bodAtGhs(VendorDao vendor, BTQBODDone bTQBODDone, GhsAuditDao ghsAudit) {

		BTQBODDoneResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + BTQ_BOD_DONE).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (BTQBODDoneResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl, bTQBODDone,
					new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public ClearAllActiveSessionForLocationResponse clearAllActiveSessionAtEGHS(VendorDao vendor,
			ClearAllActiveSessionForLocation clearAllActiveSessionForLocation) {

		ClearAllActiveSessionForLocationResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + CLEAR_ALL_ACTIVE_SESSION_FOR_LOCATION).build().toUriString();
		try {
			response = (ClearAllActiveSessionForLocationResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					clearAllActiveSessionForLocation, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public BTQEODDoneResponse bTQEODDone(VendorDao vendor, BTQEODDone bTQEODDone, GhsAuditDao ghsAudit) {

		BTQEODDoneResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + BTQ_EOD_DONE).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (BTQEODDoneResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl, bTQEODDone,
					new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public GetGHAccountMasterForIdResponse getGhsAccountDetails(VendorDao vendor,
			GetGHAccountMasterForId getGHAccountMasterForId, GhsAuditDao ghsAudit) {

		GetGHAccountMasterForIdResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + GET_GHS_ACCOUNT_MASTER_FOR_ID).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (GetGHAccountMasterForIdResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					getGHAccountMasterForId, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}
	
	public GetSIdetailDOResponse IsAutoDebitSIEnabled(VendorDao vendor,
			GetGHAccountMasterForId getGHAccountMasterForId, GhsAuditDao ghsAudit) {

		GetSIdetailDOResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + GET_SI_DETAIL_DO).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (GetSIdetailDOResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					getGHAccountMasterForId, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}
	
	public GetACHdetailDOResponse IsACHAvailableforAccount(VendorDao vendor,
			GetGHAccountMasterForId getGHAccountMasterForId, GhsAuditDao ghsAudit) {

		GetACHdetailDOResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + GET_ACH_DETAIL_DO).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (GetACHdetailDOResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					getGHAccountMasterForId, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public InstallmentDetailsForCashRestrictionNAPUpdatedResponse getCashCollectedAtGHS(VendorDao vendor,
			InstallmentDetailsForCashRestrictionNAPUpdated installmentDetailsForCashRestrictionNAPUpdated,
			GhsAuditDao ghsAudit) {

		InstallmentDetailsForCashRestrictionNAPUpdatedResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString((MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class)).getData()
								.getSoapAction()
						+ "/" + INSTALLMENT_DETAILS_FOR_CASH_RESTRICTION)
				.build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (InstallmentDetailsForCashRestrictionNAPUpdatedResponse) getWebServiceTemplate()
					.marshalSendAndReceive(baseUrl, installmentDetailsForCashRestrictionNAPUpdated,
							new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public UpdateThresholdAmountforLocationResponse updateThresholdAmountforLocation(VendorDao vendor,
			UpdateThresholdAmountforLocation updateThresholdAmountforLocation, GhsAuditDao ghsAudit) {

		UpdateThresholdAmountforLocationResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + UPDATE_THRESHOLD_AMOUNT_FOR_LOCATION).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (UpdateThresholdAmountforLocationResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					updateThresholdAmountforLocation, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public DeletePartialAccOnExceptionResponse deletePartialAccOnException(VendorDao vendor,
			DeletePartialAccOnException deletePartialAccOnException, GhsAuditDao ghsAudit) {

		DeletePartialAccOnExceptionResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + DELETE_PARTIAL_ACC_ON_EXCEPTION).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (DeletePartialAccOnExceptionResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					deletePartialAccOnException, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public GetGHSInstallmentAmountResponse getGHSInstallmentAmount(VendorDao vendor,
			GetGHSInstallmentAmount getGHSInstallmentAmount) {

		GetGHSInstallmentAmountResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + GET_GHS_INSTALLMENT_AMOUNT).build().toUriString();
		try {
			response = (GetGHSInstallmentAmountResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					getGHSInstallmentAmount, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public CNDetailsForPassBookResponse cNDetailsForPassBook(VendorDao vendor,
			CNDetailsForPassBook cNDetailsForPassBook, GhsAuditDao ghsAudit) {

		CNDetailsForPassBookResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + CN_DETAILS_FOR_PASSBOOK).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (CNDetailsForPassBookResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					cNDetailsForPassBook, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public UpdateHoldStatusforAccountOnMaturityResponse updateHoldStatusforAccountOnMaturity(VendorDao vendor,
			UpdateHoldStatusforAccountOnMaturity updateHoldStatusforAccountOnMaturity, GhsAuditDao ghsAudit) {

		UpdateHoldStatusforAccountOnMaturityResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder
				.fromUriString((MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class)).getData()
								.getSoapAction()
						+ "/" + UPDATE_HOLD_STATUS_FOR_ACCOUNT_ON_MATURITY)
				.build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (UpdateHoldStatusforAccountOnMaturityResponse) getWebServiceTemplate().marshalSendAndReceive(
					baseUrl, updateHoldStatusforAccountOnMaturity, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public GetAttachmentsResponse getGhsIdProofs(VendorDao vendor, GetAttachments getAttachments) {
		GetAttachmentsResponse getAttachmentsResponse = new GetAttachmentsResponse();
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + GET_ATTACHMENT_RESPONSE).build().toUriString();
		try {
			getAttachmentsResponse = (GetAttachmentsResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					getAttachments, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return getAttachmentsResponse;
	}

	public GetTodaysGHSRevenueNAPResponse getGhsTodayRevenue(VendorDao vendor,
			GetTodaysGHSRevenueNAP getTodaysGHSRevenueNAP, GhsAuditDao ghsAudit) {
		GetTodaysGHSRevenueNAPResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + GET_TODAYS_GHS_REVENUE_NAP).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (GetTodaysGHSRevenueNAPResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					getTodaysGHSRevenueNAP, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public CheckCustomerAteGHSResponse checkCustomerAteGHSResponse(VendorDao vendor,
			CheckCustomerAteGHS checkCustomerAteGHS, GhsAuditDao ghsAudit) {
		CheckCustomerAteGHSResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + CHECK_EGHS_CUSTOMER).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (CheckCustomerAteGHSResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					checkCustomerAteGHS, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public SavePossCustomerResponse saveCustomerAteGHSResponse(VendorDao vendor, SavePossCustomer savePossCustomer,
			GhsAuditDao ghsAudit) {
		SavePossCustomerResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + SAVE_EGHS_CUSTOMER).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (SavePossCustomerResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					savePossCustomer, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;

	}

	public CheckCNStatusResponse checkCNStatus(VendorDao vendor,
			CheckCNStatus checkCNStatus, GhsAuditDao ghsAudit) {
		CheckCNStatusResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + CHECK_CN_STATUS).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (CheckCNStatusResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					checkCNStatus, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}

	public CheckBODStatusResponse checkBODStatus(VendorDao vendor, CheckBODStatus checkBODStatus,
			GhsAuditDao ghsAudit) {
		CheckBODStatusResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + CHECK_BOD_STATUS).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (CheckBODStatusResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					checkBODStatus, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}
	
	public CheckEODStatusResponse checkEODStatus(VendorDao vendor, CheckEODStatus checkEODStatus,
			GhsAuditDao ghsAudit) {
		CheckEODStatusResponse response;
		String baseUrl = UriComponentsBuilder.fromUriString(vendor.getBaseurl()).build().toUriString();
		String soapActionUrl = UriComponentsBuilder.fromUriString((MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), GhsVendorDetailsDto.class))
						.getData().getSoapAction()
				+ "/" + CHECK_EOD_STATUS).build().toUriString();
		ghsAudit.setUrl(soapActionUrl);
		try {
			response = (CheckEODStatusResponse) getWebServiceTemplate().marshalSendAndReceive(baseUrl,
					checkEODStatus, new SoapActionCallback(soapActionUrl));
		} catch (Exception e) {
			throw new ServiceException(GHS_CLIENT_COMMUNICATION_ERROR, ERR_INT_010, e.getMessage(),
					Map.of(VENDOR_NAME, GHS));
		}
		return response;
	}




}