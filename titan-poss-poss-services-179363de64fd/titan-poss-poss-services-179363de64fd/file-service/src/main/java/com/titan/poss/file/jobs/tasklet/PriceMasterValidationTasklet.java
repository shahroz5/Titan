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
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.PriceMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PriceMasterValidationTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("priceMasterFileAuditId");

		List<String> priceCodesErrorList = new ArrayList<>();

		// checking for item code
		String itemCodeSql = "select (item_code ) from price_master_stage ims where file_audit_id ='" + fileAuditId
				+ "' and item_code not in (" + "select (item_code ) from products.dbo.item_master im )";
		String itemCodeErrorSql = "SELECT * FROM price_master_stage where file_audit_id = '" + fileAuditId
				+ "' and item_code IN (" + itemCodeSql + ")";
		List<PriceMasterStageDto> priceMasterErrorList = namedParameterJdbcTemplate.query(itemCodeErrorSql,
				new BeanPropertyRowMapper<>(PriceMasterStageDto.class));
		priceMasterErrorList.stream().forEach(price -> {
			priceCodesErrorList.add(price.getId());
			dataAuditService.saveDataAuditData(price.getId(), MapperUtil.getJsonString(price),
					"item code: " + price.getItemCode() + " does not exist", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});

		// checking for price group code
		String priceGroupSql = "select (price_group ) from price_master_stage ims where file_audit_id ='" + fileAuditId
				+ "' and price_group not in (" + "select (price_group ) from products.dbo.price_group_master pgm )";
		String priceGroupErrorSql = "SELECT * FROM price_master_stage where file_audit_id = '" + fileAuditId
				+ "' and price_group IN (" + priceGroupSql + ")";
		priceMasterErrorList.clear();
		priceMasterErrorList = namedParameterJdbcTemplate.query(priceGroupErrorSql,
				new BeanPropertyRowMapper<>(PriceMasterStageDto.class));
		priceMasterErrorList.stream().forEach(price -> {
			priceCodesErrorList.add(price.getId());
			dataAuditService.saveDataAuditData(price.getId(), MapperUtil.getJsonString(price),
					"price group code: " + price.getPriceGroup() + " does not exist", fileAuditId,
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

		return RepeatStatus.FINISHED;
	}

	private void removePriceMasterErrors(List<String> priceCodesErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("ids", priceCodesErrorList);
		String removeSql = "DELETE FROM price_master_stage where file_audit_id = '" + fileAuditId
				+ "' and id IN (:ids)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}

}
