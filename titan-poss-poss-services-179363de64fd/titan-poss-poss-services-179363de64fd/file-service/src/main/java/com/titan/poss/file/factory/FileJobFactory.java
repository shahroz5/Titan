/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.factory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.repository.FileMasterRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class FileJobFactory {

	@Autowired
	private FileMasterRepository fileMasterRepository;

	public LaunchJobRequest getLaunchJobRequest(String fileGroup, String fileName, String fileAuditId, String param) {
		LaunchJobRequest jobRequest = null;
		switch (fileGroup.toUpperCase()) {
		case "AIRPAY_CONFIG":
			jobRequest = buildAirpayJobRequest(fileName, fileAuditId);
			break;

		case "GV_STATUS_UPDATE":
			jobRequest = buildGiftVoucherStatusUpdateJobRequest(fileName, fileAuditId);
			break;

		case "GV_VALIDITY_EXTEND":
			jobRequest = buildGiftVoucherExtendValidityJobRequest(fileName, fileAuditId);
			break;

		case "CARD_DETAILS":
			jobRequest = buildCardDetailsJobRequest(fileName, fileAuditId, param);
			break;

		case "PAYER_BANK":
			jobRequest = buildPayerBankJobRequest(fileName, fileAuditId);
			break;

		case "PAYMENT_HOSTNAME_MAPPING":
			jobRequest = buildPaymentHostnameMappingJobRequest(fileName, fileAuditId, param);
			break;

		case "GEP_CONFIG_EXCLUDE_MAPPING":
			jobRequest = buildGepConfigExcludeMappingJobRequest(fileName, fileAuditId, param);
			break;

		case "PRODUCT_PRICE_MAPPING":
			jobRequest = buildProductPriceMappingJobRequest(fileName, fileAuditId);
			break;

		case "TAX_CONFIG":
			jobRequest = buildTaxConfigJobRequest(fileName, fileAuditId);
			break;

		case "FIR":
			jobRequest = buildFirMerJobRequest(fileName, fileAuditId, "FIR");
			break;

		case "MER":
			jobRequest = buildFirMerJobRequest(fileName, fileAuditId, "MER");
			break;

		case "QCGC_CONFIG":
			jobRequest = buildQcgcJobRequest(fileName, fileAuditId);
			break;

		case "ITEM_GROUP_LEVEL_DISCOUNT":
			jobRequest = buildItemGroupLevelJobRequest(fileName, fileAuditId);
			break;

		case "BEST_DEAL_DISCOUNT":
			jobRequest = buildBestDealDiscountJobRequest(fileName, fileAuditId);
			break;

		case "DISCOUNT_EXCLUDE_ITEM_MAPPING":
			jobRequest = buildExcludeItemMappingJobRequest(fileName, fileAuditId, param);
			break;

		case "PRICE_LOGIC_TEST":
			jobRequest = buildPricingLogicTestJobRequest(fileName, fileAuditId);
			break;

		case "RAZORPAY_CONFIG":
			jobRequest = buildRazorpayJobRequest(fileName, fileAuditId);
			break;
			
		case "EMPLOYEE_LOAN_CONFIG":
			jobRequest = buildEmployeeLoanJobRequest(fileName, fileAuditId);
			break;
			
        case "COMPLEXITY_PRICE_GROUP_DETAILS":
            jobRequest = buildComplexityPriceGroupDetailsJobRequest(fileName, fileAuditId);
            break;

		default:
			throw new ServiceException("File not found", "ERR-FILE-014");
		}
		return jobRequest;

	}
	
	/**
	 * @param fileName
	 * @param fileAuditId
	 * @param param
	 * @return
	 */
	private LaunchJobRequest buildEmployeeLoanJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.EMPLOYEE_LOAN_CONFIG.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName,FileGroupEnum.EMPLOYEE_LOAN_CONFIG.toString(), CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}
    /**
     * @param fileName
     * @param fileAuditId
     * @param param
     * @return
     */
    private LaunchJobRequest buildComplexityPriceGroupDetailsJobRequest(String fileName, String fileAuditId) {
        LaunchJobRequest jobRequest = new LaunchJobRequest();
        jobRequest.setJobName(FileMasterJobNameEnum.COMPLEXITY_PRICE_GROUP_DETAILS.toString());
        Map<String, String> jobParam = getCommonJobParam(fileName,FileGroupEnum.COMPLEXITY_PRICE_GROUP_DETAILS.toString(), CommonUtil.getUserName(), fileAuditId);
        jobRequest.setJobParams(jobParam);
        return jobRequest;
    }

	/**
	 * @param fileName
	 * @param fileAuditId
	 * @param param
	 * @return
	 */
	private LaunchJobRequest buildExcludeItemMappingJobRequest(String fileName, String fileAuditId, String param) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.DISCOUNT_EXCLUDE_ITEM_MAPPING.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName,
				FileGroupEnum.DISCOUNT_EXCLUDE_ITEM_MAPPING.toString(), CommonUtil.getUserName(), fileAuditId);
		jobParam.put("discountId", param);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	/**
	 * @param fileName
	 * @param fileAuditId
	 * @return
	 */
	private LaunchJobRequest buildItemGroupLevelJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.ITEM_GROUP_LEVEL_DISCOUNT.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.ITEM_GROUP_LEVEL_DISCOUNT.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobParam.put("discount", "itemGroup");
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildBestDealDiscountJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.ITEM_GROUP_LEVEL_DISCOUNT.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.BEST_DEAL_DISCOUNT.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobParam.put("discount", "bestDeal");
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildProductPriceMappingJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.PRODUCT_PRICE_MAPPING.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.PRODUCT_PRICE_MAPPING.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildTaxConfigJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.TAX_CONFIG.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.TAX_CONFIG.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildGepConfigExcludeMappingJobRequest(String fileName, String fileAuditId, String param) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.GEP_CONFIG_EXCLUDE_MAPPING.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.GEP_CONFIG_EXCLUDE_MAPPING.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobParam.put("configId", param);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildPaymentHostnameMappingJobRequest(String fileName, String fileAuditId, String param) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.PAYMENT_HOSTNAME_MAPPING.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.PAYMENT_HOSTNAME_MAPPING.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobParam.put("paymentCode", param);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildPayerBankJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.PAYER_BANK.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.PAYER_BANK.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildCardDetailsJobRequest(String fileName, String fileAuditId, String param) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.CARD_DETAILS.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.CARD_DETAILS.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobParam.put("cashbackId", param);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildGiftVoucherExtendValidityJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.GIFT_VOUCHER_EXTEND_VALIDITY.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.GV_VALIDITY_EXTEND.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildGiftVoucherStatusUpdateJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.GIFT_VOUCHER_STATUS_UPDATE.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.GV_STATUS_UPDATE.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildAirpayJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.AIRPAY_CONFIG.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.AIRPAY_CONFIG.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildRazorpayJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.RAZORPAY_CONFIG.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.RAZORPAY_CONFIG.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildQcgcJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.QCGC_CONFIG.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.QCGC_CONFIG.toString(),
				CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildFirMerJobRequest(String fileName, String fileAuditId, String fileGroup) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.FIR_MER.toString());
		Map<String, String> jobParam = getCommonJobParam(fileName, fileGroup, CommonUtil.getUserName(), fileAuditId);
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private LaunchJobRequest buildPricingLogicTestJobRequest(String fileName, String fileAuditId) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileMasterJobNameEnum.PRICING_LOGIC_TEST_JOB.getValue());
		Map<String, String> jobParam = getCommonJobParam(fileName, FileGroupEnum.PRICE_LOGIC_TEST.toString(),
				CommonUtil.getUserName(), fileAuditId);

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
					.getRequest();
			jobParam.put(CommonConstants.AUTH_HEADER, request.getHeader(CommonConstants.AUTH_HEADER));
		}
		jobRequest.setJobParams(jobParam);
		return jobRequest;
	}

	private Map<String, String> getCommonJobParam(String fileName, String fileGroup, String user, String fileAuditId) {
		Map<String, String> jobParam = new HashMap<>();
		jobParam.put("fileName", fileName);
		jobParam.put("fileGroup", fileGroup);
		jobParam.put("user", user);
		jobParam.put("fileAuditId", fileAuditId);
		if (!StringUtils.isEmpty(CommonUtil.getAuthUser().getEmailId())) {
			jobParam.put("emailId", CommonUtil.getAuthUser().getEmailId());
		}
		List<FileMasterDao> fileMaster = fileMasterRepository.findByFileGroup(fileGroup);
		jobParam.put("sync", fileMaster.get(0).getSyncUpload().toString());

		return jobParam;
	}
}
