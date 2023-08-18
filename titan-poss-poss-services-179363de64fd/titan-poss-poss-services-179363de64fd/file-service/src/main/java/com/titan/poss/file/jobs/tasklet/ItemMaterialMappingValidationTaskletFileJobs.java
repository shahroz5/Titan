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
import com.titan.poss.file.dto.ItemMaterialStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemMaterialMappingValidationTaskletFileJobs implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("itemMaterialMappingFileAuditId");

		List<String> itemMaterialMappingErrorList = new ArrayList<>();

		// checking for item code
		String itemCodeSql = "select (item_code ) from item_material_mapping_stage ims where file_audit_id ='"
				+ fileAuditId + "' and item_code not in (" + "select (item_code ) from products.dbo.item_master im )";
		String itemCodeErrorSql = "SELECT * FROM item_material_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and item_code IN (" + itemCodeSql + ")";
		List<ItemMaterialStageDto> itemMaterialMappingItemCodeErrorList = namedParameterJdbcTemplate
				.query(itemCodeErrorSql, new BeanPropertyRowMapper<>(ItemMaterialStageDto.class));
		itemMaterialMappingItemCodeErrorList.stream().forEach(itemMaterial -> {
			itemMaterialMappingErrorList.add(itemMaterial.getId());
			dataAuditService.saveDataAuditData(itemMaterial.getId(), MapperUtil.getJsonString(itemMaterial),
					"item code: " + itemMaterial.getItemCode() + " does not exist", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});

		// checking for material type code
		String materialCodeSql = "select (material_code ) from item_material_mapping_stage ims where file_audit_id ='"
				+ fileAuditId + "' and material_code not in ("
				+ "select (material_code ) from products.dbo.material_master sm )";
		String sql = "SELECT * FROM item_material_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and material_code IN (" + materialCodeSql + ")";
		List<ItemMaterialStageDto> itemMaterialMappingMaterialCodeErrorList = namedParameterJdbcTemplate.query(sql,
				new BeanPropertyRowMapper<>(ItemMaterialStageDto.class));
		itemMaterialMappingMaterialCodeErrorList.stream().forEach(itemMaterial -> {
			itemMaterialMappingErrorList.add(itemMaterial.getId());
			dataAuditService.saveDataAuditData(itemMaterial.getId(), MapperUtil.getJsonString(itemMaterial),
					"material code: " + itemMaterial.getMaterialCode() + " does not exist", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});

		// removing failed records from staging db
		if (!itemMaterialMappingErrorList.isEmpty()) {
			List<String> itemMaterialMappingErrList = new ArrayList<>();
			for (int index = 0; index < itemMaterialMappingErrorList.size(); index++) {
				itemMaterialMappingErrList.add(itemMaterialMappingErrorList.get(index));
				if (itemMaterialMappingErrorList.size() == 2000 || index + 1 == itemMaterialMappingErrorList.size()) {
					removeItemMaterialMappingErrors(itemMaterialMappingErrList, fileAuditId);
					itemMaterialMappingErrList.clear();
				}
			}
		}

		return RepeatStatus.FINISHED;
	}

	private void removeItemMaterialMappingErrors(List<String> itemMaterialMappingErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("ids", itemMaterialMappingErrorList);
		String removeSql = "DELETE FROM item_material_mapping_stage where file_audit_id = '" + fileAuditId
				+ "' and id IN (:ids)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}

}
