/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Email Send Task Listener for L3 Approver
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class TaskAssignmentListenerL3 implements TaskListener {
	
	private static final Logger LOGGER = Logger.getLogger(TaskAssignmentListenerL3.class.getName());

	@Autowired
	private EmailService emailService;
	
	@Override
	public void notify(DelegateTask delegateTask) {
		delegateTask.setVariable("taskIdL3", delegateTask.getId());		
		
		  String taskApprover = (String) delegateTask.getVariable("approverL3");
		  String taskApproverEmail = (String) delegateTask.getVariable("approverEmailL3");		  
		  String workflowType = (String) delegateTask.getVariable("workflowType");
		  
		  if (taskApprover != null) {          
	          
	              try {
	            	  EmailDto mail = new EmailDto();
	                  mail.setTo(taskApproverEmail);
	                  mail.setSubject("Task assigned: " + delegateTask.getName());

	                  Map<String, Object> model = new HashMap<>();
	                  model.put("workflowType", workflowType);
	                  model.put("approver", taskApprover);
	                  mail.setModel(model);

	                  emailService.sendApprovalNotification(mail,"ApprovalNotificationApprover.ftlh");
	                  LOGGER.log(Level.INFO, () -> "Task Assignment Email successfully sent to Approver '" + taskApprover + "' with address '" + taskApproverEmail + "'.");

	              } catch (Exception e) {
	                  LOGGER.log(Level.WARNING, "Could not send email to Task Approver. Approver Email ID is either Not Valid OR Cannot be Resolved.", e);
	              }
	          } else {
	              LOGGER.log(Level.WARNING, () -> "Not sending email to Approver " + taskApprover + "', Approver does not have a valid email address.");
	          }
		  
		  
	      } 
		
	
	
}
