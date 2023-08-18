/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dto.request.ApproverEmailApprDto;
import com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto;
import com.titan.poss.workflow.repository.WorkflowDecisionsRepository;
import com.titan.poss.workflow.repository.WorkflowProcessRepository;

/**
 * This Class sends Task Assignment Email to L1 Approvers
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class TaskAssignmentListenerEmailApprL1 implements TaskListener {

	private static final Logger LOGGER = Logger.getLogger(TaskAssignmentListenerEmailApprL1.class.getName());

	private static final String DELIMTER = "#";

	@Autowired
	private EmailService emailService;

	@Value("${baseHostURL}")
	private String baseHostURL;
	
	@Autowired
	private WorkflowProcessRepository wfProcess;
	
	@Autowired
	private WorkflowDecisionsRepository workflowDecisionsRepository;

	@Override
	public void notify(DelegateTask delegateTask) {
		
		String workflowType = (String) delegateTask.getVariable("workflowType");
		String taskId = delegateTask.getId();
		String taskName = delegateTask.getName();
		String processId = delegateTask.getProcessInstanceId();		
		String docNo = (String) delegateTask.getVariable("docNo");
		String fiscalYear = (String) delegateTask.getVariable("fiscalYear");
		
		sendEmaillToApprL1(workflowType,taskId,taskName,processId,docNo,fiscalYear);
		
	}

	public void sendEmaillToApprL1(String workflowType, String taskId, String taskName, String processId, String docNo,
			String fiscalYear) {

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
		
		
		emailContent.put("Workflow Type", workflowType);
		if (docNo != null)
			emailContent.put("Request No", docNo);
		if (fiscalYear != null)
			emailContent.put("Fiscal Year", fiscalYear);
		
		String filterValues = emailCntent.map(WorkflowProcessDao::getFilterValues).orElse(null);
		@SuppressWarnings("unchecked")
		Map<String,String> filterValuesContent = gson.fromJson(filterValues, Map.class);
		LOGGER.log(Level.INFO, () -> "Filter Data Content Values from Repository: " + filterValuesContent + "'.");
		
		
		String approveUrlKey = null;
		String rejectUrlKey = null;

		for (ApproverEmailApprDto list : listApproverEmailApprDto) {
			String apprKey = "true" + DELIMTER + processId + DELIMTER + taskId + DELIMTER + taskName + DELIMTER	+ list.getApproverL1() + DELIMTER + list.getApproverEmailL1();
			String rejKey = "false" + DELIMTER + processId + DELIMTER + taskId + DELIMTER + taskName + DELIMTER	+ list.getApproverL1() + DELIMTER + list.getApproverEmailL1();

			String unEncodedapprEncrypted = CryptoUtil.encrypt(apprKey, apprKey);
			String unEncodedrejEncrypted = CryptoUtil.encrypt(rejKey, rejKey);

			try {
				approveUrlKey = URLEncoder.encode(unEncodedapprEncrypted, "UTF-8");
				rejectUrlKey = URLEncoder.encode(unEncodedrejEncrypted, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				LOGGER.log(Level.WARNING, () -> "URL Encoding Error: '" + e + "'.");
			}

			String approveUrl = baseHostURL + "/workflow/v2/workflow-task/approval-over-email/action?key=" + approveUrlKey;
			String rejectUrl = baseHostURL + "/workflow/v2/workflow-task/approval-over-email/action?key=" + rejectUrlKey;

			LOGGER.log(Level.INFO, () -> "approveUrl Encrypted and Encoded: '" + approveUrl + "'.");
			LOGGER.log(Level.INFO, () -> "rejectUrl Encrypted and Encoded: '" + rejectUrl + "'.");

			if (list.getApproverEmailL1() != null) {
				try {
					Map<String, Object> model = new HashMap<>();
					EmailDto mail = new EmailDto();
					mail.setTo(list.getApproverEmailL1());
					if(filterValuesContent.get("typeOfRequest")!=null) {
						model.put("typeOfRequest", filterValuesContent.get("typeOfRequest"));
						mail.setSubject(filterValuesContent.get("typeOfRequest") + " Discount Request Notification");
					}else {
						mail.setSubject(workflowType + " Workflow Approval Notification");
					}
					
					model.put("assignee", list.getApproverL1());
					model.put("approveUrl", approveUrl);
					model.put("rejectUrl", rejectUrl);
					model.put("workflowType", workflowType);
					model.put("emailContent", emailContent);
					if(filterValuesContent.get("fileId") != null && filterValuesContent.get("fileName") != null) {
						String fileName = null;
						try {
							fileName = URLEncoder.encode(filterValuesContent.get("fileName"), "UTF-8");
						} catch (UnsupportedEncodingException e) {
							LOGGER.log(Level.WARNING, () -> "URL Encoding Error: '" + e + "'.");
						}
						String filePath = baseHostURL + "/api/config/v2/files/"+filterValuesContent.get("fileId")+"/download?fileName="+fileName;
						model.put("FAQ", filePath);
						LOGGER.log(Level.INFO, () -> "File Path" + filePath + "'.");
					}
					
					
					mail.setModel(model);
					
					emailService.sendApprovalNotification(mail, "ApprovalOverEmailNotification.ftlh");
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
