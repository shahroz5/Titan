/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.workflow.dto.request.CamundaProcessVarObjectforRequestBody;
import com.titan.poss.workflow.dto.request.CamundaRequestBodyforListandCount;

/**
 * Class to Convert Input Object to JSON as String for Camunda Request Body
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CamundaReqBodyJSONMapper {
	
	public String camundaRequestBodyMapperCount(String workflowType, List<String> candidateGroups) {		
		
		CamundaRequestBodyforListandCount camundaReqModel = new CamundaRequestBodyforListandCount();			
		List<Object> listProcessVariables = new ArrayList<>();		
		CamundaProcessVarObjectforRequestBody processVariables = new CamundaProcessVarObjectforRequestBody();		
		processVariables.setName("workflowType");
		processVariables.setValue(workflowType);
		processVariables.setOperator("eq");
		listProcessVariables.add(processVariables);
		
		
		camundaReqModel.setProcessVariables(listProcessVariables);
		camundaReqModel.setCandidateGroups(candidateGroups);	
		
		//Creating the ObjectMapper object
	    ObjectMapper mapper = new ObjectMapper();
	    //Converting the Object to JSONString
	    String jsonMapped = null;
		try {
			jsonMapped = mapper.writeValueAsString(camundaReqModel);
		} catch (JsonProcessingException e) {
			throw new ServiceException("The Requested Pending Count for the Approver cannot be obtained.","ERR-WRFTASK-012");				
		}		
		
		return jsonMapped;
	}
	
	
public String camundaRequestBodyMapperList(String workflowType, List<String> candidateGroups, Map<String,String> filterParams, String createdAfter, String createdBefore) {		
		
		CamundaRequestBodyforListandCount camundaReqModel = new CamundaRequestBodyforListandCount();			
		List<Object> listProcessVariables = new ArrayList<>();		
		CamundaProcessVarObjectforRequestBody processVariables = new CamundaProcessVarObjectforRequestBody();		
		processVariables.setName("workflowType");
		processVariables.setValue(workflowType);
		processVariables.setOperator("eq");
		listProcessVariables.add(processVariables);		
		
		if(!(filterParams == null || filterParams.isEmpty())) {
			filterParams.forEach((key, value) -> {
				CamundaProcessVarObjectforRequestBody processVariables1 = new CamundaProcessVarObjectforRequestBody();			
				processVariables1.setName(key);
				processVariables1.setValue(value);
				processVariables1.setOperator("eq");
				listProcessVariables.add(processVariables1);				
			});
		}
		
		camundaReqModel.setProcessVariables(listProcessVariables);
		camundaReqModel.setCandidateGroups(candidateGroups);
		camundaReqModel.setCreatedAfter(createdAfter);
		camundaReqModel.setCreatedBefore(createdBefore);
		
		//Creating the ObjectMapper object
	    ObjectMapper mapper = new ObjectMapper();
	    //Converting the Object to JSONString
	    String jsonMapped = null;
		try {
			jsonMapped = mapper.writeValueAsString(camundaReqModel);
		} catch (JsonProcessingException e) {
			throw new ServiceException("The Requested Pending List for the Approver cannot be obtained.","ERR-WRFTASK-013");				
		}		
		
		return jsonMapped;
	}


}
