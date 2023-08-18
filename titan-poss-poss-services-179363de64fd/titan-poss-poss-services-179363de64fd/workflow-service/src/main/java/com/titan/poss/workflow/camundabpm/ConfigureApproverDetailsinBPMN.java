/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto;
import com.titan.poss.workflow.repository.WorkflowDecisionsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ConfigureApproverDetailsinBPMN implements JavaDelegate{
	
	private static final Logger LOGGER = Logger.getLogger(ConfigureApproverDetailsinBPMN.class.getName());
	
	@Autowired
	private WorkflowDecisionsRepository workflowDecisionsRepository;
	
	@Override
	public void execute(DelegateExecution execution) throws Exception {
		
		String workflowType = (String) execution.getVariable("workflowType");		
		
		List<ApproverRoleCodeandApproverEmailListDto> approverRoleCodeandApproverEmailDtoList1 = workflowDecisionsRepository.findApproverListByWFTypeAndLevel(workflowType, 1);
		List<ApproverRoleCodeandApproverEmailListDto> approverRoleCodeandApproverEmailDtoList2 = workflowDecisionsRepository.findApproverListByWFTypeAndLevel(workflowType, 2);
		
		List<String> approverL1 = new ArrayList<>();
		List<String> approverEmailL1 = new ArrayList<>();
		List<String> approverL2 = new ArrayList<>();
		List<String> approverEmailL2 = new ArrayList<>();
		
		for(ApproverRoleCodeandApproverEmailListDto appRCAppEmail1:approverRoleCodeandApproverEmailDtoList1) {
			approverL1.add(appRCAppEmail1.getApproverRoleCode());
			approverEmailL1.add(appRCAppEmail1.getApproverEmail());			
		}
		
		LOGGER.log(Level.INFO, () -> "'Approver L1 Role Code List : '" + approverL1 + "'.");
		LOGGER.log(Level.INFO, () -> "'Approver L1 Email List : '" + approverEmailL1 + "'.");
		
		for (ApproverRoleCodeandApproverEmailListDto appRCAppEmail2 : approverRoleCodeandApproverEmailDtoList2) {
			approverL2.add(appRCAppEmail2.getApproverRoleCode());
			approverEmailL2.add(appRCAppEmail2.getApproverEmail());
		}
		
		LOGGER.log(Level.INFO, () -> "'Approver L2 Role Code List : '" + approverL2 + "'.");
		LOGGER.log(Level.INFO, () -> "'Approver L2 Email List : '" + approverEmailL2 + "'.");
		
		
		execution.setVariable("approverL1", approverL1);
		execution.setVariable("approverEmailL1",approverEmailL1);
		execution.setVariable("approverL2", approverL2);
		execution.setVariable("approverEmailL2", approverEmailL2);
		
		
	}
}
