/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.EmployeeLoanConfigReaderDto;
import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;
import com.titan.poss.file.service.EmployeeLoanValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class EmployeeLoanConfigStagingProcessor
		implements ItemProcessor<EmployeeLoanConfigReaderDto, EmployeeLoanConfigWriterDto>, StepExecutionListener {

	private String fileAuditId;

	private String user;

	@Autowired
	private EmployeeLoanValidationService employeeLoanValidationService;

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

	@Override
	public EmployeeLoanConfigWriterDto process(EmployeeLoanConfigReaderDto itemReader) throws Exception {
		EmployeeLoanConfigWriterDto item = new EmployeeLoanConfigWriterDto();
		
		item.setEmployeeName(checkIfNull(itemReader.getEmployeeName()));
		item.setEmployeeCode(checkIfNull(itemReader.getEmployeeCode()));
		item.setMobileNo(checkIfNull(itemReader.getMobileNo()));
		item.setAmountEligibility(checkIfDecimalNull(itemReader.getAmountEligibility()));
		item.setApprovalDate(checkIfDateNull(itemReader.getApprovalDate()));
		item.setValidaityDate(checkIfDateNull(itemReader.getValidaityDate()));
		item.setLocationCodes(checkIfNull(itemReader.getLocationCodes()));
		item.setProductGrpCodes(checkIfNull(itemReader.getProductGrpCodes()));
		item.setMargin(checkIfNull(itemReader.getMargin()));
		item.setOtpRequired(checkIfNull(itemReader.getOtpRequired()));
		item.setRedeemability(checkIfNull(itemReader.getRedeemability()));
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return validateEmployeeLoan(item);
	}

	private EmployeeLoanConfigWriterDto validateEmployeeLoan(EmployeeLoanConfigWriterDto item) {
		if (employeeLoanValidationService.dataValidation(item)) {
			return item;
		} else {
			return null;
		}
	}

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;

	}

	private BigDecimal checkIfDecimalNull(String value) {
		return StringUtils.isEmpty(value) ? null : new BigDecimal(value);

	}

	private Date checkIfDateNull(String value) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		try {
			return StringUtils.isEmpty(value.toString()) ? null : sdf.parse(value);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}

}
