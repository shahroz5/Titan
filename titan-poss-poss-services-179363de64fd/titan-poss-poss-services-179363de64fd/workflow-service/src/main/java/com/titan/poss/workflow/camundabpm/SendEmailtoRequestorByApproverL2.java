/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import java.util.HashMap;
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
import com.titan.poss.workflow.repository.WorkflowProcessRepository;

/**
 * This Class sends Email to Requestor of Approve OR Reject Action taken by L2 Approvers
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class SendEmailtoRequestorByApproverL2 implements JavaDelegate {
	private static final Logger LOGGER = Logger.getLogger(SendEmailtoRequestorByApproverL2.class.getName());

	@Autowired
	private EmailService emailService;

	@Value("${baseHostURL}")
	private String baseHostURL;
	
	@Autowired
	private WorkflowProcessRepository wfProcess;

	@Override
	public void execute(DelegateExecution execution) throws Exception {
		
		String workflowType = (String) execution.getVariable("workflowType");
		String docNo = (String) execution.getVariable("docNo");
		String fiscalYear = (String) execution.getVariable("fiscalYear");
		Boolean approvedL2 = (Boolean) execution.getVariable("approvedL2");
		String requestorEmail = (String) execution.getVariable("requestorEmail");
		String requestor = (String) execution.getVariable("requestor");		
		String approverNameL2 = (String)execution.getVariable("approverNameL2");
				
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

		if (requestorEmail != null) {
			try {
				EmailDto mail = new EmailDto();
				Map<String, Object> model = new HashMap<>();
				mail.setTo(requestorEmail);
				

				if(filterValuesContent.get("typeOfRequest")!=null) {
					model.put("typeOfRequest", filterValuesContent.get("typeOfRequest"));
					if (approvedL2) {
						mail.setSubject(filterValuesContent.get("typeOfRequest") + " Discount Request Notification by:" + approverNameL2 + " User.");
					} else {
						mail.setSubject(filterValuesContent.get("typeOfRequest") + " Discount Request Rejection Notification by: " + approverNameL2 + " user.");
					}
				}else {
					if (approvedL2) {
						mail.setSubject(workflowType + " Workflow Approval Notification by: " + approverNameL2 + " User.");
					} else {
						mail.setSubject(workflowType + " Workflow Rejection Notification by: " + approverNameL2 + " User.");
					}
				}
				
				
				model.put("requestor", requestor);
				model.put("workflowType", workflowType);
				model.put("isApproved", approvedL2);
				model.put("approverName", approverNameL2);
				model.put("emailContent", emailContent);
				mail.setModel(model);
				emailService.sendApprovalNotification(mail, "RequestorNotificationTemplate.ftlh");
				LOGGER.log(Level.INFO, () -> "#### Approval/Rejection Notification Email Sent to Requestor with Email Id: '" + requestorEmail + "'####.");

			} catch (Exception e) {
				LOGGER.log(Level.WARNING, "Could not send email to Requestor " + requestor + "with Email Id: " + requestorEmail, e);
			}
		} else {
			LOGGER.log(Level.WARNING, () -> "Not sending email to Requestor " + requestorEmail	+ "', Requestor does not have a valid email address.");
		}
	}
	
}
