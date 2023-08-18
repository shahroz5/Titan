/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.response.ReqApprovalDetailsDto;
import com.titan.poss.sales.service.IntegrationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("SalesEpossCallUtil")
public class EpossCallServiceImpl {

	@Autowired
	private IntegrationService integrationService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(EpossCallServiceImpl.class);

	public <T> T callEposs(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParamters,
			Object requestBody, Class<T> className) {

		ApiResponseDto epossResponseDto = integrationService.callEpossAPI(httpMethod, relativeUrl, requestParamters,
				requestBody);
		LOGGER.info("Response : "+epossResponseDto);
		System.out.println(epossResponseDto.getResponse());
		System.out.println(epossResponseDto.getHttpResponseCode());
		// if 200, then return response
		if (epossResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {

			return MapperUtil.mapObjToClass(epossResponseDto.getResponse(), className);
		} else {
			// re-throw the error

			String errCode = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.CODE);
			String errMssg = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.MESSAGE);

			// if code & message is there in response then show service exception
			if (StringUtils.isNotBlank(errCode) && StringUtils.isNotBlank(errMssg)) {
				Object errCause = null;
				Map<String, String> dynamicValue = null;
				if (epossResponseDto.getResponse() != null) {
					errCause = JsonUtils.getValueFromJson(epossResponseDto.getResponse(), CommonConstants.ERROR_CAUSE,
							Object.class);
					dynamicValue = JsonUtils.getValueFromJson(epossResponseDto.getResponse(),
							CommonConstants.DYNAMIC_VALUES, Map.class);
				}
				throw new ServiceException(errMssg, errCode, errCause,dynamicValue);

			} else {
				// if code & message not there, then throw generic error message

				throw new ServiceException(SalesConstants.CALL_TO_EPOSS_FAILED, SalesConstants.ERR_INT_025,
						epossResponseDto.getResponse());
			}
		}
	}

	public ReqApprovalDetailsDto createWorkflowProcess(JsonData headerData, JsonData requestData,
			Map<String, String> filterValues, String requestorRemarks, WorkflowTypeEnum workflowType) {

		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setFilterValues(filterValues);
		workflowProcessCreateDto.setHeaderData(headerData);
		workflowProcessCreateDto.setRequestData(requestData);
		workflowProcessCreateDto.setRequestorRemarks(requestorRemarks);

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, workflowType.name());
		WorkflowProcessCreateResponseDto workflowRes = callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL,
				reqParams, workflowProcessCreateDto, WorkflowProcessCreateResponseDto.class);

		ReqApprovalDetailsDto reqApprovalDto = new ReqApprovalDetailsDto();
		reqApprovalDto.setProcessId(workflowRes.getProcessId());
		reqApprovalDto.setRequestNo(workflowRes.getDocNo());

		return reqApprovalDto;
	}

	public WorkflowProcessGetResponseDto getProcessDetails(String processId, WorkflowTypeEnum workflowType) {

		Map<String, String> reqParams = Map.of(SalesUtil.WORKFLOW_TYPE, workflowType.name());
		return callEposs(HttpMethod.GET, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId, reqParams, null,
				WorkflowProcessGetResponseDto.class);
	}

	public String getProcessStatus(String processId, WorkflowTypeEnum workflowType) {

		return getProcessDetails(processId, workflowType).getApprovalStatus();
	}

	public void closeWorkflow(String processId, WorkflowTypeEnum workflowType) {

		callEposs(HttpMethod.POST, SalesUtil.WORKFLOW_PROCESS_URL + "/" + processId,
				Map.of(SalesUtil.WORKFLOW_TYPE, workflowType.name()), null, ApiResponseDto.class);
	}
	
	public CashMemoEntities callLegacyCashMemo(String locationCode,Integer docNo,Short fiscalYear,Boolean isGRNAllowed) {
        return integrationService.callLegacyCashMemo(locationCode, docNo, fiscalYear,isGRNAllowed);
    }

    public CashMemoEntities callLegacyTepCashMemo(String locationCode,Integer docNo,Short fiscalYear,Boolean isInterBrand,Boolean isFullValueTEP,List<CashMemoDetailsDao> cmDetailsList) {
        return integrationService.callLegacyTepCashMemo(locationCode, docNo, fiscalYear,isInterBrand,isFullValueTEP,cmDetailsList);
    }
	public List<CmForCustomerLegacyDto> callLegacyGetCmForCustomer(String locationCode, String itemCode, String customerMobileNo,
			String customerId, boolean isMigratedIgnored) {
		// TODO Auto-generated method stub
		return integrationService.callLegacyGetCmForCustomer(locationCode, itemCode, customerMobileNo, customerId, isMigratedIgnored);
	}
	
	/*
	 * public CashMemoEntities callLegacyTepCashMemo(String locationCode,Integer
	 * docNo,Short fiscalYear,Boolean isInterBrand) { return
	 * integrationService.callLegacyTepCashMemo(locationCode, docNo,
	 * fiscalYear,isInterBrand); }
	 */
}
