package com.titan.poss.workflow.camundabpm;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.camunda.bpm.engine.identity.User;
import org.camunda.bpm.engine.impl.context.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskAssignmentListener implements TaskListener {	
	  
	  private static final Logger LOGGER = Logger.getLogger(TaskAssignmentListener.class.getName());
	 
	  @Autowired
	  private EmailService emailService;
	  
	  @Override 
	  public void notify(DelegateTask delegateTask) { 
		  
	  String assignee = delegateTask.getAssignee();
	  String taskId = delegateTask.getId();
	  String requestDetails = (String) delegateTask.getVariable("requestData");
	  String type = (String) delegateTask.getVariable("workFlowType");
	
	  if (assignee != null) {
          IdentityService identityService = Context.getProcessEngineConfiguration().getIdentityService();
          User user = identityService.createUserQuery().userId(assignee).singleResult();

          if (user != null) {
              String recipient = user.getEmail();
              delegateTask.setVariable("approverFirstName", user.getFirstName());
        	  delegateTask.setVariable("approverLastName", user.getLastName());
        	  delegateTask.setVariable("approverEmail", user.getEmail());
        	  delegateTask.setVariable("taskId", taskId);

        	          	  
              try {
            	  EmailDto mail = new EmailDto();
                  mail.setTo(recipient);
                  mail.setSubject("Task assigned: " + delegateTask.getName());

                  Map<String, Object> model = new HashMap<>();
                  model.put("workFlowType", type);
                  model.put("approverFirstName", user.getFirstName());
                  model.put("approverLastName", user.getLastName());
                  model.put("taskId", taskId);
                  model.put("type", type);
                  model.put("requestDetails", requestDetails);
                  mail.setModel(model);

                  emailService.sendApprovalNotification(mail,"ApprovalNotificationApprover.ftlh");
                  LOGGER.log(Level.INFO, () -> "Task Assignment Email successfully sent to Approver '" + assignee + "' with address '" + recipient + "'.");

              } catch (Exception e) {
                  LOGGER.log(Level.WARNING, "Could not send email to assignee Approver", e);
              }
          } else {
              LOGGER.log(Level.WARNING, () -> "Not sending email to Approver " + assignee + "', Approver has no email address.");
          }
      } else {
    	  LOGGER.log(Level.WARNING, () -> "Not sending email to Approver " + assignee + "', Approver does not have a valid email address.");
      }
}
	 

}
