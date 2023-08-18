/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.workflow.dto.constants.WorkflowProcessNameEnum;

/**
 * Utility Class to Select the Process Key at runtime based on the Approval
 * Level of Workflow Type
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class GetBPMNProcessNameUtil {

	// Get BPMN Process Name for a given Workflow Type
	public String getBPMNProcessNameUtilByWorkflowType(String workflowType) {

		String processName;

		switch (workflowType) {
		case "BIN_CODE_CREATION":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "OTHER_ISSUES":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "CONVERSION":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "IBT_CANCELLATION":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "MANUAL_BILL":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "ADVANCE_BOOKING_MANUAL_BILL":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "CANCEL_ADVANCE_BOOKING":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "ACTIVATE_ADVANCE_BOOKING":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "ACTIVATE_CUSTOMER_ORDER":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "CREDIT_NOTE_CANCELLATION":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "CREDIT_NOTE_GOLD_RATE_REMOVE":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "CREDIT_NOTE_TRANSFER":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "CREDIT_NOTE_ACTIVATE":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "INCREASE_IN_ROLES":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "APPROVE_RO_PAYMENT":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "BILL_CANCELLATION":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "UPLOAD_DOCUMENTS":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "IBT_TRANSFERS":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL2.toString();
			break;
		case "GRN_OTHER_REASONS":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL2.toString();
			break;
		case "GRN_MANUFACTURING_DEFECT":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL2.toString();
			break;
		case "DISCOUNT_CREATION":
			processName = WorkflowProcessNameEnum.WORKFLOW_EMAILAPPR.toString();
			break;
		case "DISCOUNT_MASTER_CREATION":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "GOODS_RETURN":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "TEP_APPROVAL_WORKFLOW":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "FULL_VALUE_TEP":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "MANUAL_FULL_VALUE_TEP":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "MANUAL_TEP":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "CUSTOMER_UPLOAD_DOCUMENT":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "MANUAL_BILL_GRF":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		case "TEP_EXCEPTION_APPROVAL_WORKFLOW":
			processName = WorkflowProcessNameEnum.WORKFLOWSERVICEL1.toString();
			break;
		default:
			throw new ServiceException("Invalid Workflow Type. Please Create Workflow Configurations", "ERR_WRF_004");
		}

		return processName;
	}
}
