/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dto.request.ApproverEmailApprDto;
import com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto;
import com.titan.poss.workflow.repository.WorkflowDecisionsRepository;
import com.titan.poss.workflow.repository.WorkflowProcessRepository;

/**
 * 
 * This Class is called in BPMN User Task to Send Approval Email to L1 Approvers
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class TaskAssignmentListenerApproverL1 implements TaskListener {
		
	private static final Logger LOGGER = Logger.getLogger(TaskAssignmentListenerApproverL1.class.getName());

	@Autowired
	private EmailService emailService;
	
	@Autowired
	private WorkflowProcessRepository wfProcess;
	
	@Autowired
	private WorkflowDecisionsRepository workflowDecisionsRepository;

	@Override
	public void notify(DelegateTask delegateTask) {
		
		String workflowType = (String) delegateTask.getVariable("workflowType");
		String taskId = delegateTask.getId();
		String taskName = delegateTask.getName();
		
		LOGGER.log(Level.INFO, () -> "Task Id of Approver Assigned Task: " + taskId + "'.");	
		LOGGER.log(Level.INFO, () -> "Task Name of Approver Assigned Task: " + taskName + "'.");
		
		String processId = delegateTask.getProcessInstanceId();		
		String docNo = (String) delegateTask.getVariable("docNo");
		String fiscalYear = (String) delegateTask.getVariable("fiscalYear");
		
		List<ApproverRoleCodeandApproverEmailListDto> approverRoleCodeandApproverEmailDtoList1 = workflowDecisionsRepository.findApproverListByWFTypeAndLevel(workflowType, 1);
		
		List<ApproverEmailApprDto> listApproverEmailApprDto = new ArrayList<>();
		
		for(ApproverRoleCodeandApproverEmailListDto appRCAppEmail1:approverRoleCodeandApproverEmailDtoList1) {
			ApproverEmailApprDto approverEmailApprDto = new ApproverEmailApprDto();
			approverEmailApprDto.setApproverL1(appRCAppEmail1.getApproverRoleCode());
			approverEmailApprDto.setApproverEmailL1(appRCAppEmail1.getApproverEmail());
			listApproverEmailApprDto.add(approverEmailApprDto);
		}
		
		LOGGER.log(Level.INFO, () -> "List of Object containing Approver L1 and ApproverEmail L1: " + listApproverEmailApprDto + "'.");		
						
		Optional<WorkflowProcessDao> emailCntent = wfProcess.findById(processId);
		String emailCntentValue = emailCntent.map(WorkflowProcessDao::getEmailContent).orElse(null);
		LOGGER.log(Level.INFO, () -> "Email Content Values from Repository: " + emailCntentValue + "'.");
		
		Gson gson = new Gson();
		@SuppressWarnings("unchecked")
		Map<String,String> emailContent = gson.fromJson(emailCntentValue, Map.class);
		
		String filterValues = emailCntent.map(WorkflowProcessDao::getFilterValues).orElse(null);
		@SuppressWarnings("unchecked")
		Map<String,String> filterValuesContent = gson.fromJson(filterValues, Map.class);
		LOGGER.log(Level.INFO, () -> "Filter Data Content Values from Repository: " + filterValuesContent + "'.");
		
		
		
		emailContent.put("Workflow Type", workflowType);
		if (docNo != null)
			emailContent.put("Request No", docNo);
		if (fiscalYear != null)
			emailContent.put("Fiscal Year", fiscalYear);
		
		
		for (ApproverEmailApprDto list : listApproverEmailApprDto) {
			if (list.getApproverEmailL1() != null) {
				try {
					EmailDto mail = new EmailDto();
					mail.setTo(list.getApproverEmailL1());
					mail.setSubject(workflowType + " Workflow Approval Notification");

					Map<String, Object> model = new HashMap<>();
					model.put("assignee", list.getApproverL1());
					model.put("workflowType", workflowType);
					model.put("emailContent", emailContent);
					mail.setModel(model);
					if(filterValuesContent.get("typeOfRequest")!=null) {
						model.put("typeOfRequest", filterValuesContent.get("typeOfRequest"));
					}
					
					emailService.sendApprovalNotification(mail, "NotifyApproversL1.ftlh");
					LOGGER.log(Level.INFO, () -> "#### Task Assignment Email successfully sent to Approver with address: '"
							+ list.getApproverEmailL1() + "'####.");

				} catch (Exception e) {
					LOGGER.log(Level.WARNING, "Could not send email to assignee Approver " + list.getApproverL1() + "with Email Id: " + list.getApproverEmailL1() , e);
				}
			} else {
				LOGGER.log(Level.WARNING, () -> "Not sending email to Approver " + list.getApproverEmailL1()
						+ "', Approver does not have a valid email address.");
			}
		}

	}

}
