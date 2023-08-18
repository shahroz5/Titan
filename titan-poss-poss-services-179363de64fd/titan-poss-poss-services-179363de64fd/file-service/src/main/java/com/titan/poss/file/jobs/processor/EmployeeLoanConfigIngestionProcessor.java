/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.jobs.processor;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class EmployeeLoanConfigIngestionProcessor
		implements ItemProcessor<EmployeeLoanConfigWriterDto, EmployeeLoanConfigWriterDto>, StepExecutionListener {

	private String fileAuditId;

	private String user;

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");

	}

	@Override
	public EmployeeLoanConfigWriterDto process(EmployeeLoanConfigWriterDto item) throws Exception {
		item.setLocationCodes(item.getLocationCodes());
		item.setProductGrpCodes(item.getProductGrpCodes());
		item.setEmployeeName(item.getEmployeeName());
		item.setEmployeeCode(item.getEmployeeCode());
		item.setMobileNo(item.getMobileNo());
		item.setValidaityDate(item.getValidaityDate());
		item.setApprovalDate(item.getApprovalDate());
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		item.setSrcSyncId(0);
		item.setDestSyncId(0);
		return item;
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		// TODO Auto-generated method stub
		return null;
	}

}
