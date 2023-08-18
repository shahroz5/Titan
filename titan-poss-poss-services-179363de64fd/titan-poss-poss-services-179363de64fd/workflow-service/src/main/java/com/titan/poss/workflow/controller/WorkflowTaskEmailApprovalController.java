/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.titan.poss.workflow.service.WorkflowTaskServiceEmailApprRejService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * Controller Class for Workflow Task Approver OVER THE EMAIL.
 * The API Exposed here is not secured by JWT Auth Token.
 * Hence, the Approval details sent over email is Encrypted using Symmetric Key Encryption using AES Algorithm.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("workflow/v2/workflow-task/approval-over-email")
@Api(tags = { "workflow-task-email-approval-controller" })
@Validated
public class WorkflowTaskEmailApprovalController {	
	
	@Autowired
	WorkflowTaskServiceEmailApprRejService workflowTaskServiceEmailApprRejService;
	
	
	/**
	 * This method will Accept thr Details from the Email
	 * and based on that APPROVE or REJECT.
	 * 
	 * @param key
	 * @return String
	 */
	@ApiOperation(value = "APPROVE or REJECT the Request over the email", notes = "This API will update the Status as APPROVED or REJECTED based on Approver Action over the email.")
	@GetMapping(value = "/action")
	public ModelAndView approvalOrRejectionOverEmail(
			@ApiParam(name = "key", value = "The key Containing details of Task ID, Process ID , Task Name etc.", required = true) @RequestParam String key) {		
		String status = workflowTaskServiceEmailApprRejService.approveWorkflowTaskOverEmail(key);
		ModelAndView modelAndView = new ModelAndView();
		
		if(status.equals("APPROVED"))
			modelAndView.setViewName("success-notification");
		else {
			modelAndView.setViewName("error-notification");
			
		}
		return modelAndView;
		
	}
	
}
