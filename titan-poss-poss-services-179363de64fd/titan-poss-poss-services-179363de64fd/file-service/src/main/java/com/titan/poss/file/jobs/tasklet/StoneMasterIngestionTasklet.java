/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.titan.poss.file.service.FileService;
import com.titan.poss.location.dao.CountryDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StoneMasterIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("stoneMasterFileAuditId");

		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getStoneWeightUnit();
		// @formatter:off

		String updateStatusOfInsertFlowRecords = "update stone_master_stage set transfer_type = 'INSERT' where  file_audit_id = '"
				+ fileAuditId + "' and \r\n"
				+ "stone_code not in  (select stone_code from products.dbo.stone_master sm)";

		String stoneMasterInsertSql = "insert into products.dbo.stone_master(stone_code, stone_type_code, "
				+ "std_weight, std_value, rate_per_carat, color, quality, shape, config_details, weight_unit, currency_code, is_active, created_by, created_date, last_modified_by,"
				+ "last_modified_date, src_sync_id, dest_sync_id,correlation_id)\r\n"
				+ "SELECT stone_code,stone_type_code, weight, price, rate_per_carat, color, stone_quality, stone_shape, config_details,'" + weightUnit + "', '"+currencyCode+"', is_active, login_id, created_date,last_modified_id,\r\n"
				+ "last_modified_date, 0, 0, file_audit_id FROM stone_master_stage\r\n"
				+ "where file_audit_id = '" + fileAuditId + "' AND transfer_type = 'INSERT'";

		String stoneMasterUpsertSql = "update products.dbo.stone_master \r\n"
				+ "set color=t2.color,std_weight=t2.weight,stone_type_code=t2.stone_type_code,quality=t2.stone_quality,\r\n"
				+ "shape=t2.stone_shape,std_value=t2.price,rate_per_carat=t2.rate_per_carat,config_details=t2.config_details,is_active=t2.is_active,\r\n"
				+ "created_by=t2.login_id,created_date=t2.created_date,last_modified_by=t2.last_modified_id,last_modified_date=t2.last_modified_date\r\n"
				+ ",currency_code='"+currencyCode+"', weight_unit='"+weightUnit +"', src_sync_id=t1.src_sync_id+1, dest_sync_id=0, \r\n"
				+ "correlation_id=t2.file_audit_id\r\n" + "from products.dbo.stone_master t1\r\n"
				+ "inner join stone_master_stage t2\r\n"
				+ "on t1.stone_code = t2.stone_code where t2.file_audit_id ='" + fileAuditId+ "' and t2.transfer_type = 'UPDATE'";
		// @formatter:on
		jdbcTemplate.execute(updateStatusOfInsertFlowRecords);
		jdbcTemplate.execute(stoneMasterInsertSql);
		jdbcTemplate.execute(stoneMasterUpsertSql);

		return RepeatStatus.FINISHED;
	}

}
