/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Email Send Task Listener for L1 Approver
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class TaskAssignmentListenerL1 implements TaskListener {
	
	private static final Logger LOGGER = Logger.getLogger(TaskAssignmentListenerL1.class.getName());
	 
	  @Autowired
	  private EmailService emailService;
	 
	  @Override 
	  public void notify(DelegateTask delegateTask) { 
		 
      delegateTask.setVariable("taskIdL1", delegateTask.getId());      
      
		@SuppressWarnings("unchecked")
		List<String> taskApproverList = (List<String>) delegateTask.getVariable("approverL1");
		@SuppressWarnings("unchecked")
		List<String> taskApproverEmailList = (List<String>) delegateTask.getVariable("approverEmailL1");
		String workflowType = (String) delegateTask.getVariable("workflowType");

	  if (taskApproverList != null) {          
          for(String taskApproverEmail:taskApproverEmailList) {
              try {
            	  EmailDto mail = new EmailDto();
                  mail.setTo(taskApproverEmail);
                  mail.setSubject("Task assigned: " + delegateTask.getName());

                  Map<String, Object> model = new HashMap<>();
                  model.put("workflowType", workflowType);
                  model.put("approver", taskApproverEmail);                  
                  mail.setModel(model);

                  emailService.sendApprovalNotification(mail,"ApprovalNotificationApprover.ftlh");
                  LOGGER.log(Level.INFO, () -> "Task Assignment Email successfully sent to Approver '" + taskApproverList + "' with address '" + taskApproverEmail + "'.");

              } catch (Exception e) {
                  LOGGER.log(Level.WARNING, "Could not send email to Task Approver. Approvers Email ID is either Not Valid OR Cannot be Resolved.", e);
              }
           }
          } else {
              LOGGER.log(Level.WARNING, () -> "Not sending email to Approvers " + taskApproverList + "', Approver does not have a valid email address.");
          }
      } 
}
	 

