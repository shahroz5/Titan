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
import com.titan.poss.file.dto.MaterialMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class MaterialMasterValidationTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("materialMasterFileAuditId");

		List<String> materialCodesErrorList = new ArrayList<>();

		// checking for material type code
		String materialTypeCodeSql = "select (material_type) from material_master_stage ims where file_audit_id ='"
				+ fileAuditId + "' and material_type not in ("
				+ "select (material_type_code ) from products.dbo.material_type_master mtm )";
		String sql = "SELECT * FROM material_master_stage where file_audit_id = '" + fileAuditId
				+ "' and material_type IN (" + materialTypeCodeSql + ")";
		List<MaterialMasterStageDto> materialMasterErrorList = namedParameterJdbcTemplate.query(sql,
				new BeanPropertyRowMapper<>(MaterialMasterStageDto.class));
		materialMasterErrorList.stream().forEach(material -> {
			materialCodesErrorList.add(material.getMaterialCode());
			dataAuditService.saveDataAuditData(material.getMaterialCode(), MapperUtil.getJsonString(material),
					"material type code: " + material.getMaterialType() + " does not exist", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});

		// removing failed records from staging db
		if (!materialCodesErrorList.isEmpty()) {
			List<String> materialCodeErrList = new ArrayList<>();
			for (int index = 0; index < materialCodesErrorList.size(); index++) {
				materialCodeErrList.add(materialCodesErrorList.get(index));
				if (materialCodeErrList.size() == 2000 || index + 1 == materialCodesErrorList.size()) {
					removeMaterialMasterErrors(materialCodeErrList, fileAuditId);
					materialCodeErrList.clear();
				}
			}
		}

		return RepeatStatus.FINISHED;
	}

	private void removeMaterialMasterErrors(List<String> materialCodesErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("materialCodes", materialCodesErrorList);
		String removeSql = "DELETE FROM material_master_stage where file_audit_id = '" + fileAuditId
				+ "' and material_code IN (:materialCodes)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}
}
