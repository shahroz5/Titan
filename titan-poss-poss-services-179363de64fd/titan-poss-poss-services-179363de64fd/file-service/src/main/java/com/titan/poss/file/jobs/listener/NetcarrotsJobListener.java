/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.dao.FileSequenceDao;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.repository.FileSequenceRepository;
import com.titan.poss.file.service.FileSequenceService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.location.dao.CountryDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
@Slf4j
public class NetcarrotsJobListener implements JobExecutionListener {

	@Autowired
	private FileSequenceService fileSequenceService;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	@Autowired
	private FileSequenceRepository fileSequenceRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final String STORE_MASTER_TRUNCATE_SQL = "DELETE from ulp_store_master_stage where file_audit_id = '";

	private static final String CUSTOMER_TRANSACTION_TRUNCATE_SQL = "DELETE from ulp_customer_transaction_data_stage where file_audit_id = '";

	private static final String TRUNCATE_MEMBER_DATA_SQL = "DELETE from ulp_member_data_stage where file_audit_id = '";

	private static final String TRUNCATE_TRANSACTION_DATA = "DELETE from ulp_transaction_data_stage where file_audit_id = '";

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("NetcarrotsJob has started at: {}", CalendarUtils.getCurrentDate());
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.NETCARROTS.toString(),
				FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
		CountryDao countryData = fileService.getCountryData();
		FileSequenceDao fileSequence = null;
		if (fileMaster.getResetSequenceNo()) {
			fileSequence = fileSequenceRepository.findByFileMasterAndFiscalYear(fileMaster,
					countryData.getFiscalYear());
		} else {
			fileSequence = fileSequenceRepository.findByFileMaster(fileMaster);
		}
		Integer sequenceNo = fileSequence.getSequenceNo() + 1;
		jobExecution.getExecutionContext().put("sequenceNo", sequenceNo.toString());
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		String fileAuditId = jobExecution.getExecutionContext().getString("NcMemberDataSavedId");
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			// increase the sequence number
			fileSequenceService.updateFileSequenceByGroupAndName(FileGroupEnum.NETCARROTS.toString(),
					FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue(), null);

			fileSequenceService.updateFileSequenceByGroupAndName(FileGroupEnum.NETCARROTS.toString(),
					FileMasterJobNameEnum.NC_MEMBER_DATA_JOB.getValue(), null);

			fileSequenceService.updateFileSequenceByGroupAndName(FileGroupEnum.NETCARROTS.toString(),
					FileMasterJobNameEnum.NC_STORE_DATA_JOB.getValue(), null);

			fileSequenceService.updateFileSequenceByGroupAndName(FileGroupEnum.NETCARROTS.toString(),
					FileMasterJobNameEnum.NC_NO_OF_RECORDS_DATA_JOB.getValue(), null);
		}
		jdbcTemplate.execute(CUSTOMER_TRANSACTION_TRUNCATE_SQL + fileAuditId + "'");
		jdbcTemplate.execute(TRUNCATE_MEMBER_DATA_SQL + fileAuditId + "'");
		jdbcTemplate.execute(STORE_MASTER_TRUNCATE_SQL + fileAuditId + "'");
		jdbcTemplate.execute(TRUNCATE_TRANSACTION_DATA + fileAuditId + "'");
		log.info("NetcarrotsJob has ended at: {}", CalendarUtils.getCurrentDate());

	}
}
