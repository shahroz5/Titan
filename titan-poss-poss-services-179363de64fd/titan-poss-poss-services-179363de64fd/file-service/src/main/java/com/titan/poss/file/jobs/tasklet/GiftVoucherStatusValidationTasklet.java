/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

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
import com.titan.poss.file.dto.GiftVoucherStatusStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherStatusValidationTasklet implements Tasklet {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("giftVoucherStatusSavedId");

		String gvSerialNoCodeSql = "select (gv_serial_no ) from gift_voucher_status_stage ims where file_audit_id ='"
				+ fileAuditId + "' and gv_serial_no not in ("
				+ "select ( serial_no ) from payments.dbo.gift_master cm )";
		List<Integer> serialNoErrorList = jdbcTemplate.queryForList(gvSerialNoCodeSql, Integer.class);
		if (!serialNoErrorList.isEmpty()) {
			SqlParameterSource parameters = new MapSqlParameterSource("serialNos", serialNoErrorList);
			String sql = "SELECT * FROM gift_voucher_status_stage where file_audit_id = '" + fileAuditId
					+ "' and gv_serial_no IN (:serialNos)";
			List<GiftVoucherStatusStageDto> giftVoucherStatusErrorList = namedParameterJdbcTemplate.query(sql, parameters,
					new BeanPropertyRowMapper<>(GiftVoucherStatusStageDto.class));
			giftVoucherStatusErrorList.stream().forEach(giftIndent -> 
				dataAuditService.saveDataAuditData(giftIndent.getGvSerialNo().toString(), MapperUtil.getJsonString(giftIndent),
						"Gv Serial No: " + giftIndent.getGvSerialNo().toString() + " does not exist", fileAuditId,
						ErrorTypeEnum.ERROR.toString())
			);
			
			// deleting from stage table
			SqlParameterSource deleteParameters = new MapSqlParameterSource("serialNos", serialNoErrorList);
			String removeSql = "DELETE FROM gift_voucher_status_stage where file_audit_id = '" + fileAuditId
					+ "' and gv_serial_no IN (:serialNos)";
			namedParameterJdbcTemplate.update(removeSql, deleteParameters);
		}

		return RepeatStatus.FINISHED;
	}


}
