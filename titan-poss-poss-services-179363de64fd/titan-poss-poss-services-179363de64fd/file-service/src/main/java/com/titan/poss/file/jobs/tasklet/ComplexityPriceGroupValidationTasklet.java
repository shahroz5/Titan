/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.product.sync.dto.ComplexityPriceGroupSyncDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class ComplexityPriceGroupValidationTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;
	
	private static final String DOES_NOT_EXIST = " does not exist";
    private static final String SELECT_FROM_COMPLEXITY_GROUP_STAGE = "SELECT * FROM complexity_price_group_mapping_stage where file_audit_id = '";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobParameters()
		.get("fileAuditId");
		log.debug("fileAuditId >>>"+chunkContext.getStepContext().getJobParameters().get("fileAuditId"));
		List<String> priceCodesErrorList = new ArrayList<>();
		
		List<String> complexityCodesErrorList = new ArrayList<>();
		String complexityCodeSql = "";
		String complexityCodeErrorSql = "";
		String priceGroupSql = "";
	    String priceGroupErrorSql = "";
		List<ComplexityPriceGroupSyncDto> complexityStageErrorList = new ArrayList<>();
		
		List<ComplexityPriceGroupSyncDto> priceGroupStageErrorList = new ArrayList<>();
		
		
		 // checking for complexity code for not available
		 complexityCodeSql = "select (complexity_code ) from complexity_price_group_mapping_stage ims where file_audit_id ='"
		 + fileAuditId + "' and complexity_code not in (\r\n"
		 + "select (complexity_code ) from products.dbo.complexity_master cm )";
		 complexityCodeErrorSql = SELECT_FROM_COMPLEXITY_GROUP_STAGE + fileAuditId + "' and complexity_code IN ("
		 + complexityCodeSql + ")";
		 complexityStageErrorList = namedParameterJdbcTemplate.query(complexityCodeErrorSql,
		 new BeanPropertyRowMapper<>(ComplexityPriceGroupSyncDto.class));
		 complexityStageErrorList.stream().forEach(item -> {
		 complexityCodesErrorList.add(item.getComplexityCode());
		 dataAuditService.saveDataAuditData(item.getComplexityCode(), MapperUtil.getJsonString(item),
		 "Complexity code: " + item.getComplexityCode() + DOES_NOT_EXIST + " in complexity master.",
		 fileAuditId, ErrorTypeEnum.ERROR.toString());
		  });
	   // checking for price group for not available
         priceGroupSql = "select (price_group ) from complexity_price_group_mapping_stage ims where file_audit_id ='"
		 + fileAuditId + "' and price_group not in (\r\n"
		 + "select (price_group ) from products.dbo.price_group_master cm )";
		 priceGroupErrorSql = SELECT_FROM_COMPLEXITY_GROUP_STAGE + fileAuditId + "' and price_group IN ("
		 + priceGroupSql + ")";
		 priceGroupStageErrorList = namedParameterJdbcTemplate.query(priceGroupErrorSql,
		 new BeanPropertyRowMapper<>(ComplexityPriceGroupSyncDto.class));
		 priceGroupStageErrorList.stream().forEach(item -> {
		 priceCodesErrorList.add(item.getPriceGroup());
		 dataAuditService.saveDataAuditData(item.getPriceGroup(), MapperUtil.getJsonString(item),
		"Price Group : " + item.getPriceGroup() + DOES_NOT_EXIST + " in price group master.",
		fileAuditId, ErrorTypeEnum.ERROR.toString());
		 });
		       // checking for complexity code for available and in active
         complexityCodeSql = "select (complexity_code ) from complexity_price_group_mapping_stage ims where file_audit_id ='"
		 + fileAuditId + "' and complexity_code in (\r\n"
		+ "select (complexity_code ) from products.dbo.complexity_master cm where cm.is_active = 0)";
		complexityCodeErrorSql = SELECT_FROM_COMPLEXITY_GROUP_STAGE + fileAuditId + "' and complexity_code IN ("
		 + complexityCodeSql + ")";
		complexityStageErrorList = namedParameterJdbcTemplate.query(complexityCodeErrorSql,
		new BeanPropertyRowMapper<>(ComplexityPriceGroupSyncDto.class));
		complexityStageErrorList.stream().forEach(item -> {
		if (!complexityCodesErrorList.contains(item.getComplexityCode()))
		complexityCodesErrorList.add(item.getComplexityCode());
		dataAuditService.saveDataAuditData(item.getComplexityCode(), MapperUtil.getJsonString(item),
		"Complexity code: " + item.getComplexityCode() + " is inactive " + " in complexity master.",
		fileAuditId, ErrorTypeEnum.ERROR.toString());
		});
				 // checking for price group for not available
         priceGroupSql = "select (price_group ) from complexity_price_group_mapping_stage ims where file_audit_id ='"
		 + fileAuditId + "' and price_group in (\r\n"
		 + "select (price_group ) from products.dbo.price_group_master cm where cm.is_active = 0)";
		 priceGroupErrorSql = SELECT_FROM_COMPLEXITY_GROUP_STAGE + fileAuditId + "' and price_group IN ("
		 + priceGroupSql + ")";
		 priceGroupStageErrorList = namedParameterJdbcTemplate
		 .query(priceGroupErrorSql, new BeanPropertyRowMapper<>(ComplexityPriceGroupSyncDto.class));
		 priceGroupStageErrorList.stream().forEach(item -> {
		 if (!priceCodesErrorList.contains(item.getPriceGroup()))
		 priceCodesErrorList.add(item.getPriceGroup());
		 dataAuditService.saveDataAuditData(item.getPriceGroup(), MapperUtil.getJsonString(item),
		"Price Group : " + item.getPriceGroup() + " is inactive " + " in price group master.", fileAuditId,
				 ErrorTypeEnum.ERROR.toString());
			    });
				 // removing failed records from staging db
		 if (!priceCodesErrorList.isEmpty()) {
		 List<String> priceCodeErrList = new ArrayList<>();
		 for (int index = 0; index < priceCodesErrorList.size(); index++) {
		 priceCodeErrList.add(priceCodesErrorList.get(index));
		 if (priceCodeErrList.size() == 2000 || index + 1 == priceCodesErrorList.size()) {
		 removePriceMasterErrors(priceCodeErrList, fileAuditId);
		 priceCodeErrList.clear();
				 }
                 }
				}
				if (!complexityCodesErrorList.isEmpty()) {
			 List<String> complexityCodeErrList = new ArrayList<>();
				for (int index = 0; index < priceCodesErrorList.size(); index++) {
				complexityCodeErrList.add(priceCodesErrorList.get(index));
				 if (complexityCodeErrList.size() == 2000 || index + 1 == priceCodesErrorList.size()) {
				removeComplexityCodeMasterErrors(complexityCodeErrList, fileAuditId);
				complexityCodeErrList.clear();
				 }
			}
	 }
			/*	String complexitypricegroupUpdateSql ="update products.dbo.complexity_price_group_mapping \r\n" + 
						"set id=t2.id,complexity_code=t2.complexity_code,price_group=t2.price_group,making_charge_punit=t2.making_charge_punit,making_charge_pgram=t2.making_charge_pgram,wastage_pct=t2.wastage_pct,making_charge_pct=t2.making_charge_pct,is_active='true',created_by=t2.created_by,created_date=t2.created_date,last_modified_by=t2.last_modified_by,\r\n" + 
						"last_modified_date=t2.last_modified_date,src_sync_id=(t1.src_sync_id+1),dest_sync_id='0',correlation_id=t2.file_audit_id\r\n" + 
						"from products.dbo.complexity_price_group_mapping t1\r\n" + 
						"inner join complexity_price_group_mapping_stage t2\r\n" + 
						"on t1.complexity_code = t2.complexity_code and t1.price_group = t2.price_group where t2.file_audit_id = '" + fileAuditId + "'";
				jdbcTemplate.execute(complexitypricegroupUpdateSql);*/

	return RepeatStatus.FINISHED;
	}

	private void removePriceMasterErrors(List<String> priceCodesErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("productGroups", priceCodesErrorList);
		String removeSql = "DELETE FROM complexity_price_group_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and price_group IN (:productGroups)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}
	
	private void removeComplexityCodeMasterErrors(List<String> priceCodesErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("complexityCodes", priceCodesErrorList);
		String removeSql = "DELETE FROM complexity_price_group_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and complexity_code IN (:complexityCodes)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}

}
