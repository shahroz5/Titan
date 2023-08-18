/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.enums.SchedulerCodeEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SchedulerStepUtil {

	private static final List<String> bodSchedulerSteps = new ArrayList<>();
	private static final List<String> eodSchedulerSteps = new ArrayList<>();
	private static final List<String> eodSchedulerStepsRevenue = new ArrayList<>();

	private SchedulerStepUtil() {

	}

	static {
		loadBodSchedulerSteps();
		loadEodSchedulerSteps();
		loadEodSchedulersRevenue();
	}

	public static List<String> getBodschedulersteps() {
		return bodSchedulerSteps;
	}

	public static List<String> getEodschedulersteps() {
		return eodSchedulerSteps;
	}

	public static List<String> getEodschedulerstepsRevenue() {
		return eodSchedulerStepsRevenue;
	}

	private static void loadBodSchedulerSteps() {
		bodSchedulerSteps.add(SchedulerCodeEnum.SALES_REMOVE_FROM_RESERVEBIN.name());
		bodSchedulerSteps.add(SchedulerCodeEnum.SALES_AB_SUSPEND.name());
		bodSchedulerSteps.add(SchedulerCodeEnum.SALES_RO_AIRPAY_PAYMENTS_DELETE.name());
		bodSchedulerSteps.add(SchedulerCodeEnum.SALES_CREDIT_NOTE_SUSPEND.name());

	}

	private static void loadEodSchedulerSteps() {
		eodSchedulerSteps.add(SchedulerCodeEnum.SALES_PENDING_BILL_CANCEL_DELETE.name());
		eodSchedulerSteps.add(SchedulerCodeEnum.INVENTORY_IBT_CLOSE.name());
		eodSchedulerSteps.add(SchedulerCodeEnum.CUSTOMER_DIGITAL_SIGNATURE_DELETION.name());
		eodSchedulerSteps.add(SchedulerCodeEnum.GENERATE_INVOICE_DOCUMENTS.name());
		eodSchedulerSteps.add(SchedulerCodeEnum.SALES_CLEAR_FROZEN_CREDIT_NOTE.name());
	}

	private static void loadEodSchedulersRevenue() {
		eodSchedulerStepsRevenue.add(SchedulerCodeEnum.SALES_HOLD_TRANSACTIONS_DELETE.name());
		eodSchedulerStepsRevenue.add(SchedulerCodeEnum.SALES_AB_CO_PAYMENT_CLEAR.name());

	}

}
