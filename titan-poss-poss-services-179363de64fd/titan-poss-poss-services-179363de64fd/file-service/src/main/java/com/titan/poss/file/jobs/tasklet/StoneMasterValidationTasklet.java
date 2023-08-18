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
import com.titan.poss.file.dto.StoneMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StoneMasterValidationTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("stoneMasterFileAuditId");

		List<String> stoneCodesErrorList = new ArrayList<>();

		// checking for stone type code
		String stoneTypeCodeSql = "select (stone_type_code ) from stone_master_stage ims where file_audit_id ='"
				+ fileAuditId + "' and stone_type_code not in ("
				+ "select (stone_type_code ) from products.dbo.stone_type_master cm )";
		String sql = "SELECT * FROM stone_master_stage where file_audit_id = '" + fileAuditId
				+ "' and stone_type_code IN (" + stoneTypeCodeSql + ")";
		List<StoneMasterStageDto> stoneMasterErrorList = namedParameterJdbcTemplate.query(sql,
				new BeanPropertyRowMapper<>(StoneMasterStageDto.class));
		stoneMasterErrorList.stream().forEach(stone -> {
			stoneCodesErrorList.add(stone.getStoneCode());
			dataAuditService.saveDataAuditData(stone.getStoneCode(), MapperUtil.getJsonString(stone),
					"stone type code: " + stone.getStoneTypeCode() + " does not exist", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});

		// removing failed records from staging db

		if (!stoneCodesErrorList.isEmpty()) {
			List<String> stoneCodeErrList = new ArrayList<>();
			for (int index = 0; index < stoneCodesErrorList.size(); index++) {
				stoneCodeErrList.add(stoneCodesErrorList.get(index));
				if (stoneCodeErrList.size() == 2000 || index + 1 == stoneCodesErrorList.size()) {
					removeStoneCodeErrors(stoneCodeErrList, fileAuditId);
					stoneCodeErrList.clear();
				}
			}
		}

		return RepeatStatus.FINISHED;
	}

	private void removeStoneCodeErrors(List<String> stoneCodesErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("stoneCodes", stoneCodesErrorList);
		String removeSql = "DELETE FROM stone_master_stage where file_audit_id = '" + fileAuditId
				+ "' and stone_code IN (:stoneCodes)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}

}
