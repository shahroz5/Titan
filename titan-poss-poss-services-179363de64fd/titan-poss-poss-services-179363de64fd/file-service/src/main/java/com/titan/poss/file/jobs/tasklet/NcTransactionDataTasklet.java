/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.time.LocalDate;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.service.FileService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class NcTransactionDataTasklet implements Tasklet, StepExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	private static final String MD = "MD";

	private static final String TD = "TD";

	private static final String ENCIRCLE_MEMBER = "Encircle Member";

	private static final String NON_ENCIRCLE_MEMBER = "Non Encircle Member";

	private static final String NO_OF_RECORDS = "No Of Records";

	private static final String NO_OF_UNIQUE_BILLS = "No of Unique Bills";

	private static final String ZERO = "0";

	private static final String TRANSACTION_STAGE_INSERT_QUERY = "insert into ulp_transaction_data_stage (file_shared_date, file_type, file_name, transaction_type,\r\n"
			+ "type, store_records, eposs_records, encircle_td_file_records, diff_store_vs_eposs, diff_eposs_vs_encircle, file_audit_id)"
			+ " values (?, ? ,?, ?, ?, ?, ?, ?, '" + ZERO + "', '" + ZERO + "', ?)";

	private static final String MD_NON_ENCRICLE_MEMBER_COUNT_QUERY = "select count(*) from [file].dbo.ulp_member_data_stage where unified_loyalty_no is null and file_audit_id = ?";

	private static final String TD_NON_ENCRICLE_MEMBER_COUNT_QUERY = "select count(*) from [file].dbo.ulp_customer_transaction_data_stage where unified_loyalty_no is null and file_audit_id = ?";

	private static final String UNIQUE_BILL_COUNT_QUERY = "select distinct count(cm_no) from [file].dbo.ulp_customer_transaction_data_stage uctds where file_audit_id = ?";

	private static final String CUSTOMER_TRANSACTION_COUNT_SQL = "select count(*) from ulp_customer_transaction_data_stage where unified_loyalty_no is not null and file_audit_id = ?";

	private static final String MEMBER_DATA_COUNT_SQL = "select count(*) from ulp_member_data_stage where unified_loyalty_no is not null and file_audit_id = ?";

	@Override
	public void beforeStep(StepExecution stepExecution) {
		// default method ignored
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String transactionDateString = "";
		transactionDateString = (String) chunkContext.getStepContext().getJobParameters()
				.get(FileIntegrationConstants.TRANSACTION_DATE);

		if (StringUtils.isEmpty(transactionDateString)) {
			transactionDateString = LocalDate.now().toString();
		}
		String ncTransactionfileAuditId = (String) chunkContext.getStepContext().getStepExecution().getJobExecution()
				.getExecutionContext().get("NcTransactionDataSavedId");
		String memberfileAuditId = (String) chunkContext.getStepContext().getStepExecution().getJobExecution()
				.getExecutionContext().get("NcMemberDataSavedId");
		String customerTransactionfileAuditId = (String) chunkContext.getStepContext().getStepExecution()
				.getJobExecution().getExecutionContext().get("NcCustomerTransactionSavedId");
		log.info("customerTransactionfileAuditId...........................................{}",customerTransactionfileAuditId);

		// insert md encircle member
		Integer mdEncircleMemberCount = jdbcTemplate.queryForObject(MEMBER_DATA_COUNT_SQL,
				new Object[] { memberfileAuditId }, Integer.class);
		String memberDataFileName = fileService.getNetcarrotsFileName(transactionDateString,
				FileMasterJobNameEnum.NC_MEMBER_DATA_JOB.getValue(), FileGroupEnum.NETCARROTS.toString(), false);
		insertIntoTransactionDataTable(transactionDateString, MD, memberDataFileName.replace(".txt", ""),
				ENCIRCLE_MEMBER, NO_OF_RECORDS, mdEncircleMemberCount, ncTransactionfileAuditId);

		// insert md non encircle member
		Integer mdNonEncircleMemberCount = jdbcTemplate.queryForObject(MD_NON_ENCRICLE_MEMBER_COUNT_QUERY,
				new Object[] { customerTransactionfileAuditId }, Integer.class);
		insertIntoTransactionDataTable(transactionDateString, MD, "", NON_ENCIRCLE_MEMBER, NO_OF_RECORDS,
				mdNonEncircleMemberCount, ncTransactionfileAuditId);

		// insert td encircle member
		Integer tdEncircleMemberCount = jdbcTemplate.queryForObject(CUSTOMER_TRANSACTION_COUNT_SQL,
				new Object[] { customerTransactionfileAuditId }, Integer.class);
		String customerTransactionDataFileName = fileService.getNetcarrotsFileName(transactionDateString,
				FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue(), FileGroupEnum.NETCARROTS.toString(), false);
		log.info("Customer transaction file name ..............................{}",customerTransactionDataFileName);
		insertIntoTransactionDataTable(transactionDateString, TD, customerTransactionDataFileName.replace(".txt", ""),
				ENCIRCLE_MEMBER, NO_OF_RECORDS, tdEncircleMemberCount, ncTransactionfileAuditId);
		log.info("After insertintoTransactionData table .....1.........................");
		// insert td non encircle member
		Integer tdNonEncircleMemberCount = jdbcTemplate.queryForObject(TD_NON_ENCRICLE_MEMBER_COUNT_QUERY,
				new Object[] { customerTransactionfileAuditId }, Integer.class);
		insertIntoTransactionDataTable(transactionDateString, TD, "", NON_ENCIRCLE_MEMBER, NO_OF_RECORDS,
				tdNonEncircleMemberCount, ncTransactionfileAuditId);
		log.info("After insertintoTransactionData table ......2........................");
		// insert no of unique bills
		Integer uniqueBillCount = jdbcTemplate.queryForObject(UNIQUE_BILL_COUNT_QUERY, new Object[] { customerTransactionfileAuditId },
				Integer.class);
		String uniqueBillFileName = customerTransactionDataFileName.replace("TD", "UB").replace(".txt", "");
		insertIntoTransactionDataTable(transactionDateString, TD, uniqueBillFileName, ENCIRCLE_MEMBER,
				NO_OF_UNIQUE_BILLS, uniqueBillCount, ncTransactionfileAuditId);
		log.info("After insertintoTransactionData table .......3.......................");
		return RepeatStatus.FINISHED;
	}

	private void insertIntoTransactionDataTable(String transactionDateString, String fileType, String fileName,
			String transactionType, String type, Integer noOfRecords, String fileAuditId) {
		Date inputDate = CalendarUtils.convertStringToDate(transactionDateString, "yyyy-MM-dd");
		String date = CalendarUtils.formatDateToString(inputDate, "dd-MMM-yyyy");
		log.info("Before Updating into table.........................................................");
		jdbcTemplate.update(TRANSACTION_STAGE_INSERT_QUERY, date, fileType, fileName, transactionType,
				type, noOfRecords, noOfRecords, noOfRecords, fileAuditId);
		log.info("Updated into table....................................");
	}

}
