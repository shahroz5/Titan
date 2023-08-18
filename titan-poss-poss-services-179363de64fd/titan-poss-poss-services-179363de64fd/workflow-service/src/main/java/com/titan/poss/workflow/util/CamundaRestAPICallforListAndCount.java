/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;

import com.titan.poss.workflow.dto.response.ApproverPendingCountResponseDto;
import com.titan.poss.workflow.dto.response.CamundaGetLISTResponse;
import com.titan.poss.workflow.dto.response.WorkflowTaskApproveCountDto;
import com.titan.poss.core.exception.ServiceException;

/**
 * Camunda Rest API Call for List And Count
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CamundaRestAPICallforListAndCount {
	
	int taskCount;
	
	private static final Logger LOGGER = Logger.getLogger(CamundaRestAPICallforListAndCount.class.getName());
	
	public WorkflowTaskApproveCountDto pendingCount(String workflowType, List<String> candidateGroups, String camundaHostName) {	
		
	    String jsonMappedCount = null;
	    CamundaReqBodyJSONMapper camundaReqBodyJSONMapper = new CamundaReqBodyJSONMapper();
	    jsonMappedCount = camundaReqBodyJSONMapper.camundaRequestBodyMapperCount(workflowType, candidateGroups);
		
		Long pendingCount;
		try {
		 pendingCount = (long) pendingApprovalStatusUtil(jsonMappedCount, camundaHostName);
		}
		catch(Exception e) {
			throw new ServiceException("The Count API did not fetch Count due to one or more reasons. Please Check the Service Logs","ERR-WRFTASK-013");
		}
		 
		 WorkflowTaskApproveCountDto wfTaskApproveDto = new WorkflowTaskApproveCountDto();
		 wfTaskApproveDto.setTaskStatus("PENDING");
		 wfTaskApproveDto.setWorkflowType(workflowType);
		 wfTaskApproveDto.setCount(pendingCount);
		
		 return wfTaskApproveDto;
		 
	}
	
		
	public List<CamundaGetLISTResponse> pendingTaskLists(CamundaProcessVarFilters camundaProcessVarFilters) {
				
		String jsonMappedList = null;
	    CamundaReqBodyJSONMapper camundaReqBodyJSONMapper = new CamundaReqBodyJSONMapper();
	    jsonMappedList = camundaReqBodyJSONMapper.camundaRequestBodyMapperList(camundaProcessVarFilters.getWorkflowType(), camundaProcessVarFilters.getCandidateGroups(), camundaProcessVarFilters.getFilterParams(), camundaProcessVarFilters.getCreatedAfter(), camundaProcessVarFilters.getCreatedBefore());
		 
		 List<CamundaGetLISTResponse> camundaGetListResponse;
		 try {
		 camundaGetListResponse = pendingList(jsonMappedList, camundaProcessVarFilters.getFirstResult(), camundaProcessVarFilters.getMaxResults(), camundaProcessVarFilters.getCamundaHostName());
		 }
		 catch(Exception e) {
			 throw new ServiceException("The Pending List cannot be obtained","ERR-WRFTASK-014");
		 }
	
		 return camundaGetListResponse;
		 
	}
		
	public int pendingApprovalStatusUtil(String camundaReqModel, String camundaHostName) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		String url = "http://" + camundaHostName + "/camunda/rest/task/count";
		// set `Content-Type` header
		headers.setContentType(MediaType.APPLICATION_JSON);
		// set `accept` header
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));		
		
		HttpEntity<String> request = new HttpEntity<>(camundaReqModel, headers);
		
		ResponseEntity<ApproverPendingCountResponseDto> response = restTemplate.postForEntity(url, request, ApproverPendingCountResponseDto.class);
		return response.getBody().getCount();
	}
	
	public List<CamundaGetLISTResponse> pendingList(String camundaReqModel, int firstResult, int maxResults, String camundaHostName) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		LOGGER.log(Level.INFO, () -> "firstResult: " + firstResult);
		LOGGER.log(Level.INFO, () -> "maxResults: " + maxResults);
		String url = "http://" + camundaHostName + "/camunda/rest/task";
		// set `Content-Type` header
		headers.setContentType(MediaType.APPLICATION_JSON);
		// set `accept` header
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));		
		
		HttpEntity<String> request = new HttpEntity<>(camundaReqModel, headers);
		
		ResponseEntity<CamundaGetLISTResponse[]> response = restTemplate.postForEntity(url, request, CamundaGetLISTResponse[].class);
		CamundaGetLISTResponse[] getList = response.getBody();
		
		List<CamundaGetLISTResponse> arrayList = new ArrayList<>();
		for(CamundaGetLISTResponse list: getList) {
			CamundaGetLISTResponse camundaGetListResponse = new CamundaGetLISTResponse();
			camundaGetListResponse.setId(list.getId());
			camundaGetListResponse.setName(list.getName());
			camundaGetListResponse.setProcessInstanceId(list.getProcessInstanceId());
			arrayList.add(camundaGetListResponse);
		}		
		
		return arrayList;
	}
}
