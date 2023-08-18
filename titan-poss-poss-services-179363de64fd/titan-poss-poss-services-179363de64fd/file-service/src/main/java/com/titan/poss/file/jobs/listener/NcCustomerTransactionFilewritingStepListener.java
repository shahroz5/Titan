/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class NcCustomerTransactionFilewritingStepListener implements StepExecutionListener {

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	private static final String MOVE_CUSTOMER_TRANSACTION_DATA_TO_AUDIT = "INSERT into ulp_customer_transaction_data_aud select * from ulp_customer_transaction_data_stage where file_audit_id = '";

	@Override
	public void beforeStep(StepExecution stepExecution) {
		// Default implementation Ignored

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		String fileAuditId = stepExecution.getJobExecution().getExecutionContext()
				.getString("NcCustomerTransactionSavedId");
		String sequenceNoString = stepExecution.getJobExecution().getExecutionContext().getString("sequenceNo");
		Integer sequenceNo = Integer.parseInt(sequenceNoString);

		BatchStatus status = stepExecution.getStatus();
		if (status.toString().equalsIgnoreCase("COMPLETED")) {
			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT store_code as location_code, max(transaction_date) as business_date from [file].dbo.ulp_customer_transaction_data_stage"
					+ " where file_audit_id ='" + fileAuditId
					+ "' and store_code in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue() + "')) group by store_code;";

			String locationCodeAndBusinessDateInsertSql = "SELECT store_code as location_code ,max(transaction_date) as business_date from [file].dbo.ulp_customer_transaction_data_stage "
					+ "where file_audit_id = '" + fileAuditId
					+ "' and store_code not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue() + "')) group by store_code;";

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue(),
					fileAuditId);

			fileAuditService.updateFileAudit(fileAuditId, status.toString(), FileGroupEnum.NETCARROTS.toString(),
					FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false, sequenceNo, null);
			jdbcTemplate.execute(MOVE_CUSTOMER_TRANSACTION_DATA_TO_AUDIT + fileAuditId + "'");
			log.debug("customer transaction data stage data moved to audit table");
		} else {
			fileAuditService.updateFileAudit(fileAuditId, status.toString(), FileGroupEnum.NETCARROTS.toString(),
					FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo, null);
		}
		log.debug("Nc Customer transaction job is completed at " + CalendarUtils.getCurrentDate());
		return ExitStatus.COMPLETED;
	}

}
