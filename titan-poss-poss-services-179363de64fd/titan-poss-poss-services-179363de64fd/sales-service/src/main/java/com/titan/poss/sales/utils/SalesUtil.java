/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.dto.MetalRateDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.InvoiceDocumentTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.SalesPaymentDto;

/**
 * Util class fo sales.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class SalesUtil {

	private SalesUtil() {
		throw new IllegalArgumentException("Sales Util class");
	}

	public static final String WORKFLOW_TYPE = "workflowType";
	public static final String TEP_WORKFLOW_TYPE = "TEP_APPROVAL_WORKFLOW";
	public static final String TEP_EXCEPTION_WORKFLOW_TYPE = "TEP_EXCEPTION_APPROVAL_WORKFLOW";
	public static final String MANUAL_FULL_VALUE_TEP_WORKFLOW = "MANUAL_FULL_VALUE_TEP";
	public static final String MANUAL_TEP_WORKFLOW = "MANUAL_TEP";
	public static final String FULL_VALUE_TEP_WORKFLOW = "FULL_VALUE_TEP";
	public static final String CREDIT_NOTE_WORKFLOW_TYPE = "creditNoteWorkFlowType";
	public static final String WORKFLOW_APPROVAL_STATUS = "approvalStatus";
	public static final String IS_APPROVING = "approved";
	public static final String PROCESS_ID = "processId";
	public static final String FTEP_APPROVAL_DETAILS = "FTEP_APPROVAL_DETAILS";

	public static final String VENDOR_CODE = "vendorCode";
	public static final String TASK_ID = "taskId";
	public static final String TASK_NAME = "taskName";
	public static final String REQUEST_APPROVER_L1 = "REQUEST_APPROVER_L1";
	public static final String SRC_BTQ_LOCATION = "srcBtqCode";
	public static final String CN_STATUS = "cnStatus";
	public static final String DEST_BTQ_LOCATION = "destBtqCode";
	public static final String DEST_CN_ID = "destCnId";
	public static final String WORKFLOW_PROCESS_URL = "api/workflow/v2/workflow-process";
	public static final String INTEGRATION_EGHS_CREDITNOTE_URL = "api/integration/v2/ghs/credit-notes";
	public static final String INVENTORY_GET_DOCNUMBER_URL = "api/inventory/v2/stock-managements/docnumber";
	public static final String INVENTORY_UPDATE_HALLMARK_FLAG = "api/inventory/v2/stock-managements/items";
	public static final String GET_CN_TRANSFER_URL = "api/sales/v2/credit-note/eposs/ibt-transfer/history";
	public static final String CREATE_REFUND_REQUEST_EPOSS_URL = "api/sales/v2/refund/eposs";
	public static final String REFUND_REQUEST_TXN_TYPE = "txnType";
	public static final String REFUND_REQUEST_STATUS = "status";
	public static final String UPDATE_LOT_NUMBER_DETAILS_URL = "api/product/v2/lot-details/update-lot-details";
	public static final String FILE_TYPE = "text/csv";

	public static final String INVENTORY_UPDATE_CUTPIECE_URL = "api/product/v2/lot-details/update-cut-piece-lot-details";
	public static final String FISCAL_YEAR = "fiscalYear";

	public static final String CREDIT_NOTE_TYPE = "creditNoteType";

	// public static final String WORKFLOW_PROCESS_URL =
	// "workflow/v2/workflow-process";
	// public static final String CREDITNOTE_EPOSS_URL =
	// "/sales/v2/credit-note/eposs";
	public static final String CREDITNOTE_EPOSS_URL = "api/sales/v2/credit-note/eposs";
	public static final String CASHMEMO_EPOSS_URL = "api/sales/v2/cash-memos/eposs";
	// public static final String WORKFLOW_TASK_URL = "workflow/v2/workflow-task";
	public static final String WORKFLOW_TASK_URL = "api/workflow/v2/workflow-task";
	public static final String SALES_BASE_SERVICE_URL = "/api/sales/v2";
	public static final String PRODUCT_BASE_SERVICE_URL = "api/product/v2";
	public static final String CUST_SERVICE_URL = SALES_BASE_SERVICE_URL + "/customers";

	public static final String WEIGHT_DETAILS = "WEIGHT_DETAILS";

	public static Boolean checkTranscationStatusForUpdate(String status) {

		Boolean isTxnUpdateable = true;
		if (TransactionStatusEnum.CONFIRMED.name().equals(status)
				|| TransactionStatusEnum.closedStatusList().contains(status)) {
			isTxnUpdateable = false;
		}
		return isTxnUpdateable;
	}

	public static Boolean checkTranscationStatusForPayment(String status, String txnType) {

		Boolean isTxnUpdateable = true;
		if (TransactionStatusEnum.closedStatusList().contains(status)
				|| TransactionStatusEnum.SUSPENDED.name().equals(status)) {
			isTxnUpdateable = false;
		}
		if (!TransactionTypeEnum.AB.name().equals(txnType) && (TransactionStatusEnum.CONFIRMED.name().equals(status))) {
			isTxnUpdateable = false;
		}
		return isTxnUpdateable;
	}

	public static SalesPaymentDto mapDtoWithStatus(Object obj, String status) {

		SalesPaymentDto paymentDto = (SalesPaymentDto) MapperUtil.getDtoMapping(obj, SalesPaymentDto.class);
		paymentDto.setStatus(status);

		return paymentDto;
	}

	// Method to validate whether transaction date and Business date are same or
	// not
	public static Boolean isSameDay(Date txnDate, Date businessDate) {

		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");

		Boolean isSameDay = true;

		if (dateFormat.format(txnDate).compareTo(dateFormat.format(businessDate)) != 0)
			isSameDay = false;

		return isSameDay;

	}

	public static List<String> getBinGroupCodeBasedOnLocationCode(boolean isFOCItemSaleable) {
		List<String> binGroupCodeList=new ArrayList<>();
		if(isFOCItemSaleable)
			binGroupCodeList.add(CommonConstants.FOC);
		
		//allow CustomerOrder Bin items for sale temporarily
		binGroupCodeList.add(CommonConstants.CUSTOM_ORDER_BIN);
		
		if (UserTypeEnum.L1.name().equals(CommonUtil.getLoggedInUserType())
				|| UserTypeEnum.L2.name().equals(CommonUtil.getLoggedInUserType())) {
			binGroupCodeList.add(SalesConstants.L1_L2_STN);
		}
		else {
			binGroupCodeList.add(SalesConstants.L3_PURCFA);
		}
		return binGroupCodeList;
	}

	public static Map<String, List<String>> getBinGroupCodeAndCodeBasedOnLocationCode(boolean isFOCItemSaleable) {

		Map<String, List<String>> validBinGroupAndCodes = new HashMap<>();
		validBinGroupAndCodes.put(CommonConstants.TEP_BIN_CODE, List.of(CommonConstants.TEP_SALE_BIN_CODE));
		if(isFOCItemSaleable)
		validBinGroupAndCodes.put(CommonConstants.FOC, null);
		
		//allow CustomerOrder Bin items for sale temporarily
		validBinGroupAndCodes.put(CommonConstants.CUSTOM_ORDER_BIN, null);

		if (UserTypeEnum.L1.name().equals(CommonUtil.getLoggedInUserType())
				|| UserTypeEnum.L2.name().equals(CommonUtil.getLoggedInUserType())) {
			validBinGroupAndCodes.put(SalesConstants.L1_L2_STN, null);
		} else {
			validBinGroupAndCodes.put(SalesConstants.L3_PURCFA, null);
		}

		return validBinGroupAndCodes;
	}

	public static Map<String, List<String>> getCreditNoteStatusMap() {
		Map<String, List<String>> statusMap = new HashMap<>();
		List<String> redeemedList = new ArrayList<>();
		List<String> suspendList = new ArrayList<>();
		List<String> cancelList = new ArrayList<>();
		List<String> openList = new ArrayList<>();
		List<String> transferIbtList = new ArrayList<>();
		List<String> pendingList = new ArrayList<>();

		List<String> blockedGhsList = new ArrayList<>();

//OPEN, CANCELLED, REDEEMED, SUSPENED, TRANSFERED
		suspendList.add(CNStatus.OPEN.toString());

		cancelList.add(CNStatus.OPEN.toString());
		// to redeem it should be in open or 'REDEMPTION_PENDING' status
		redeemedList.add(CNStatus.OPEN.toString());
		redeemedList.add(CNStatus.REDEMPTION_PENDING.toString());

		openList.add(CNStatus.OPEN.toString());
		openList.add(CNStatus.SUSPENDED.toString());
		openList.add(CNStatus.TRANSFER_GHS.toString());
		blockedGhsList.add(CNStatus.OPEN.toString());

		transferIbtList.add(CNStatus.OPEN.toString());

		pendingList.add(CNStatus.OPEN.toString());
		pendingList.add(CNStatus.SUSPENDED.toString());

		statusMap.put(CNStatus.SUSPENDED.toString(), suspendList);
		statusMap.put(CNStatus.CANCELLED.toString(), cancelList);
		statusMap.put(CNStatus.REDEEMED.toString(), redeemedList);
		statusMap.put(CNStatus.TRANSFER_IBT.toString(), transferIbtList);
		statusMap.put(CNStatus.TRANSFER_GHS.toString(), blockedGhsList);
		return statusMap;
	}

	public static boolean isPaymentGroupToBeConsidered(String paymentGroup) {

		return (paymentGroup != null && (PaymentGroupEnum.WALLET.name().equals(paymentGroup)
				|| PaymentGroupEnum.BANK_LOAN.name().equals(paymentGroup)));
	}

	public static boolean paymentStatusCheckForRedemption(String status) {

		return (PaymentStatusEnum.OPEN.name().equals(status));

	}
	
	public static boolean hasExcelFormat(MultipartFile file) {
	    if (!FILE_TYPE.equals(file.getContentType())) {
	      return false;
	    }
	    return true;
	  }
	public static String addHyphen(String priceInWords) {
		String HYPHEN = "-";
	 	String SPACE = " ";
	 	String BLANK = "";
	 	List<String> highSeriesList = Arrays.asList("Crore","Lakh","Thousand","Hundred","And");
		List<String> priceWordsList = Arrays.asList(priceInWords.split(SPACE));
		String temp=BLANK;
		String finalString=BLANK;
		for(String priceWord : priceWordsList) {
			temp=temp+priceWord+SPACE;
			if(highSeriesList.contains(priceWord)) {
				temp = temp.replace(priceWord, BLANK).trim().replace(SPACE, HYPHEN);
				finalString = finalString + (temp.isBlank() ? BLANK : temp + SPACE)  +  priceWord +SPACE;
				temp=BLANK;
			}
			
		}
		return (finalString + temp.trim().replace(SPACE, HYPHEN)).toLowerCase();
	}
	
	public static Map<String, List<MetalRateDto>> sortBasiMetalDetails(List<MetalRateDto> basicMetalDetails) {
		Map<String, List<MetalRateDto>> basicMetalsMap = new HashMap<String, List<MetalRateDto>>();
		Comparator<MetalRateDto> comparator = Comparator
                .comparing(MetalRateDto::getMetalTypeCode)
                .thenComparing(MetalRateDto::getKaratage, Comparator.reverseOrder())
                .thenComparing(MetalRateDto::getPurity, Comparator.reverseOrder());
		List<MetalRateDto> sortedMetalDetails = basicMetalDetails.stream()
				.sorted(comparator)
				.collect(Collectors.toList());
		sortedMetalDetails.stream().forEach(detail->{
			if(basicMetalsMap.containsKey(detail.getMetalTypeCode())) {
				basicMetalsMap.get(detail.getMetalTypeCode()).add(detail);
			}else {
				List<MetalRateDto> metalList = new ArrayList<MetalRateDto>();
				metalList.add(detail);
				basicMetalsMap.put(detail.getMetalTypeCode(),metalList);
			}
		});
		return basicMetalsMap;		
	}

	
	public static void setPaymentDescription(SalesPaymentDto paymentDto) {
		String description;
		PaymentCodeEnum paymentCode;
		if (PaymentGroupEnum.REGULAR.name().equals(paymentDto.getPaymentGroup())) {
			paymentCode = PaymentCodeEnum.valueOfPaymentCode(paymentDto.getPaymentCode().toUpperCase());
		} else {
			paymentCode = PaymentCodeEnum.valueOfPaymentCode(paymentDto.getPaymentGroup().toUpperCase());
		}
		switch(paymentCode) {
		case CHEQUE:
			description = "Cheque No "+paymentDto.getInstrumentNo() + " dt "+ SalesDateUtil.convertDateFormat(paymentDto.getPaymentDate()) + "on " + paymentDto.getBankName();
			break;
		default:
			description = "";
			break;
		}			
		paymentDto.setPaymentDescription(description);	
	}

}
