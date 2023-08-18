/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.GETTaskListDTO;
import com.titan.poss.workflow.dto.request.CamundaDateFormatDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CamundaOtherUtils {
	
	public CamundaProcessVarFilters returnApprListFilters(Pageable pageable, GETTaskListDTO getTaskListDTO, String workflowType, List<String> candidateGroups, CamundaDateFormatDto camundaDateFormatDto, String apprLocationCode, String camundaHostName) {
		
		int firstResult = pageable.getPageSize() * pageable.getPageNumber();
		int maxResults = pageable.getPageSize();

		Map<String, String> filterMapPendingList = new HashMap<>();
		if(getTaskListDTO != null) {
			filterMapPendingList = getTaskListDTO.getFilterParams();
			if (filterMapPendingList == null) {
				filterMapPendingList = new HashMap<>();
			}

			if (getTaskListDTO.getDocNo() != null) {
				filterMapPendingList.put("docNo", getTaskListDTO.getDocNo().toString());
			}

			if (getTaskListDTO.getFiscalYear() != null) {
				filterMapPendingList.put("fiscalYear", getTaskListDTO.getFiscalYear().toString());
			}
			if (apprLocationCode != null) {
				filterMapPendingList.put("approverLocationCode", apprLocationCode);
			}
		}

		// Create Body for Camunda Util Process Variables and Filters		
		CamundaProcessVarFilters camundaProcessVarFilters = new CamundaProcessVarFilters();
		camundaProcessVarFilters.setWorkflowType(workflowType);
		camundaProcessVarFilters.setCandidateGroups(candidateGroups);
		camundaProcessVarFilters.setFirstResult(firstResult);
		camundaProcessVarFilters.setMaxResults(maxResults);
		camundaProcessVarFilters.setFilterParams(filterMapPendingList);
		if(camundaDateFormatDto!=null) {
			camundaProcessVarFilters.setCreatedAfter(camundaDateFormatDto.getCreatedAfter());
			camundaProcessVarFilters.setCreatedBefore(camundaDateFormatDto.getCreatedBefore());
		}
		camundaProcessVarFilters.setCamundaHostName(camundaHostName);

		return camundaProcessVarFilters;
		
	}
}
