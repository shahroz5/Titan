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
import com.titan.poss.file.dto.ItemStoneStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemStoneMappingValidationTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("itemStoneMappingFileAuditId");

		List<String> itemStoneMappingErrorList = new ArrayList<>();

		// checking for item code

		String itemCodeSql = "select (item_code ) from item_stone_mapping_stage ims where file_audit_id ='"
				+ fileAuditId + "' and item_code not in (" + "select (item_code ) from products.dbo.item_master im )";
		String itemCodeErrorSql = "SELECT * FROM item_stone_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and item_code IN (" + itemCodeSql + ")";
		List<ItemStoneStageDto> itemStoneMappingItemCodeErrorList = namedParameterJdbcTemplate.query(itemCodeErrorSql,
				new BeanPropertyRowMapper<>(ItemStoneStageDto.class));
		itemStoneMappingItemCodeErrorList.stream().forEach(itemStone -> {
			itemStoneMappingErrorList.add(itemStone.getId());
			dataAuditService.saveDataAuditData(itemStone.getId(), MapperUtil.getJsonString(itemStone),
					"item code: " + itemStone.getItemCode() + " does not exist", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});

		// checking for stone type code
		checkStoneCodeErrors(fileAuditId, itemStoneMappingErrorList);

		// removing failed records from staging db
		if (!itemStoneMappingErrorList.isEmpty()) {
			List<String> itemStoneMappingErrList = new ArrayList<>();
			for (int index = 0; index < itemStoneMappingErrorList.size(); index++) {
				itemStoneMappingErrList.add(itemStoneMappingErrorList.get(index));
				if (itemStoneMappingErrList.size() == 2000 || index + 1 == itemStoneMappingErrorList.size()) {
					removeItemStoneMappingErrors(itemStoneMappingErrList, fileAuditId);
					itemStoneMappingErrList.clear();
				}
			}
		}

		return RepeatStatus.FINISHED;
	}

	private void checkStoneCodeErrors(String fileAuditId, List<String> itemStoneMappingErrorList) {
		String stoneCodesSql = "select (stone_code ) from item_stone_mapping_stage ims where file_audit_id ='"
				+ fileAuditId + "' and stone_code not in ("
				+ "select (stone_code ) from products.dbo.stone_master sm )";
		String stoneCodesErrorSql = "SELECT * FROM item_stone_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and stone_code IN (" + stoneCodesSql + ")";
		List<ItemStoneStageDto> itemStoneMappingStoneCodeErrorList = namedParameterJdbcTemplate
				.query(stoneCodesErrorSql, new BeanPropertyRowMapper<>(ItemStoneStageDto.class));
		itemStoneMappingStoneCodeErrorList.stream().forEach(itemStone -> {
			itemStoneMappingErrorList.add(itemStone.getId());
			dataAuditService.saveDataAuditData(itemStone.getId(), MapperUtil.getJsonString(itemStone),
					"stone code: " + itemStone.getStoneCode() + " does not exist", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});
	}

	private void removeItemStoneMappingErrors(List<String> itemStoneMappingErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("ids", itemStoneMappingErrorList);
		String removeSql = "DELETE FROM item_stone_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and id IN (:ids)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}
}
