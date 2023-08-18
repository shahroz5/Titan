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

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dto.request.ApproverEmailApprDto;
import com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto;
import com.titan.poss.workflow.repository.WorkflowDecisionsRepository;
import com.titan.poss.workflow.repository.WorkflowProcessRepository;

/**
 * This Class sends Email to Previous Approvers of Approve OR Reject Action taken by Subsequent Approvers
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class SendTaskEmailSendActivitytoPrevApprovers implements JavaDelegate {
	
	private static final Logger LOGGER = Logger.getLogger(SendTaskEmailSendActivitytoPrevApprovers.class.getName());

	@Autowired
	private EmailService emailService;

	@Value("${baseHostURL}")
	private String baseHostURL;
	
	@Autowired
	private WorkflowProcessRepository wfProcess;
	
	@Autowired
	private WorkflowDecisionsRepository workflowDecisionsRepository;

	@Override
	public void execute(DelegateExecution execution) throws Exception {		

		String workflowType = (String) execution.getVariable("workflowType");
		String docNo = (String) execution.getVariable("docNo");
		String fiscalYear = (String) execution.getVariable("fiscalYear");
		Boolean approvedL2 = (Boolean) execution.getVariable("approvedL2");
		String approverName = (String)execution.getVariable("approverNameL2");

		List<ApproverRoleCodeandApproverEmailListDto> approverRoleCodeandApproverEmailDtoList1 = workflowDecisionsRepository.findApproverListByWFTypeAndLevel(workflowType, 1);
				
		List<ApproverEmailApprDto> listApproverEmailApprDto = new ArrayList<>();
		
		for(ApproverRoleCodeandApproverEmailListDto appRCAppEmail1:approverRoleCodeandApproverEmailDtoList1) {
			ApproverEmailApprDto approverEmailApprDto = new ApproverEmailApprDto();
			approverEmailApprDto.setApproverL1(appRCAppEmail1.getApproverRoleCode());
			approverEmailApprDto.setApproverEmailL1(appRCAppEmail1.getApproverEmail());
			listApproverEmailApprDto.add(approverEmailApprDto);
		}
		
		
		LOGGER.log(Level.INFO, () -> "List of Object containing Approver L1 and ApproverEmail L1: " + listApproverEmailApprDto + "'.");
				
		Optional<WorkflowProcessDao> emailCntent = wfProcess.findById(execution.getProcessInstanceId());
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
					Map<String, Object> model = new HashMap<>();
					mail.setTo(list.getApproverEmailL1());
					

					
					if(filterValuesContent.get("typeOfRequest")!=null) {
						model.put("typeOfRequest", filterValuesContent.get("typeOfRequest"));
						if (approvedL2) {
							mail.setSubject(filterValuesContent.get("typeOfRequest") + " Discount Request Approval Notification by:" + approverName );
						} else {
							mail.setSubject(filterValuesContent.get("typeOfRequest") + " Discount Request Rejection Notification by: " + approverName );
						}
					}else {
						if(approvedL2) {
							mail.setSubject(workflowType + " Workflow Approval Notification by " + approverName);
						}
						else {
							mail.setSubject(workflowType + " Workflow Rejection Notification by " + approverName);
						}
					}
					
					model.put("assignee", list.getApproverL1());
					model.put("workflowType", workflowType);
					model.put("isApproved", approvedL2);
					model.put("approverL2", approverName);
					model.put("emailContent", emailContent);
					mail.setModel(model);
					emailService.sendApprovalNotification(mail, "NotifyPreviousApprovers.ftlh");
					LOGGER.log(Level.INFO, () -> "#### Approval/Rejection Notification Email Sent to Previous Approvers with Email Id: '"	+ list.getApproverEmailL1() + "'####.");

				} catch (Exception e) {
					LOGGER.log(Level.WARNING, "Could not send email to previous Approver " + list.getApproverL1() + "with Email Id: " + list.getApproverEmailL1(), e);
				}
			} else {
				LOGGER.log(Level.WARNING, () -> "Not sending email to Approver " + list.getApproverEmailL1() + "', Approver does not have a valid email address.");
			}
		}

	}

}
