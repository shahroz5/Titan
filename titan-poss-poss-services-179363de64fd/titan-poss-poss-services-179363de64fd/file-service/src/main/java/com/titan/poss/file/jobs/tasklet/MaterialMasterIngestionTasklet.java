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
public class MaterialMasterIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("materialMasterFileAuditId");

		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getWeightUnit();
		// @formatter:off

		String updateStatusOfInsertFlowRecords = "update material_master_stage set transfer_type = 'INSERT' where  file_audit_id = '"
				+ fileAuditId + "' and \r\n"
				+ "material_code not in  (select material_code from products.dbo.material_master mm)";

		String materialMasterInsertSql = "insert into products.dbo.material_master(material_code, material_type_code, "
				+ "std_weight, std_value, rate_per_gram, color, quality, shape, config_details, weight_unit, currency_code, is_active, created_by, created_date, last_modified_by,"
				+ "last_modified_date, src_sync_id, dest_sync_id,correlation_id)\r\n"
				+ "SELECT material_code,material_type, weight, price, rate_per_gram, color, stone_quality, stone_shape, config_details,'" + weightUnit + "', '"+currencyCode+"', is_active, login_id, created_date,last_modified_id,\r\n"
				+ "last_modified_date, 0, 0, file_audit_id FROM material_master_stage\r\n"
				+ "where file_audit_id = '" + fileAuditId + "' AND transfer_type = 'INSERT'";

		String materialMasterUpdateSql = "update products.dbo.material_master \r\n"
				+ "set material_code=t2.material_code,color=t2.color,std_weight=t2.weight,material_type_code=t2.material_type,quality=t2.stone_quality,shape=t2.stone_shape,\r\n"
				+ "std_value=t2.price,rate_per_gram=t2.rate_per_gram,config_details=t2.config_details,is_active='true',\r\n"
				+ "created_by=t2.login_id,created_date=t2.created_date,last_modified_by=t2.last_modified_id,last_modified_date=t2.last_modified_date,currency_code='"+ currencyCode
				+ "',weight_unit='"+weightUnit+"'\r\n"
				+ ",src_sync_id=(t1.src_sync_id+1),dest_sync_id='0',correlation_id=t2.file_audit_id\r\n"
				+ "from products.dbo.material_master t1\r\n"
				+ "inner join material_master_stage t2\r\n"
				+ "on t1.material_code = t2.material_code where t2.file_audit_id ='" + fileAuditId
				+ "' and t2.transfer_type = 'UPDATE'";

		jdbcTemplate.execute(updateStatusOfInsertFlowRecords);
		jdbcTemplate.execute(materialMasterInsertSql);
		jdbcTemplate.execute(materialMasterUpdateSql);

		return RepeatStatus.FINISHED;
	}
}
