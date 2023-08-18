/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

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
import com.titan.poss.file.dto.GiftVoucherIndentStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherIndentValidationTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("giftVoucherIndentSavedId");
		String gvSerialNoCodeSql = "select (gv_serial_no ) from gift_voucher_indent_stage ims where file_audit_id = '"
				+ fileAuditId + "' AND gv_serial_no in (" + "select ( serial_no ) from payments.dbo.gift_master cm )";
		List<Integer> serialNoDuplicateList = jdbcTemplate.queryForList(gvSerialNoCodeSql, Integer.class);
		if (!serialNoDuplicateList.isEmpty()) {
			final int chunkSize = 2000;
			final AtomicInteger counter = new AtomicInteger();
			final Collection<List<Integer>> chunkLists = serialNoDuplicateList.stream()
					.collect(Collectors.groupingBy(data -> counter.getAndIncrement() / chunkSize)).values();
			chunkLists.forEach(chunckSerialNumberDuplicateList -> {
				SqlParameterSource parameters = new MapSqlParameterSource("serialNos", chunckSerialNumberDuplicateList);
				String sql = "SELECT * FROM gift_voucher_indent_stage where gv_serial_no IN (:serialNos)";
				List<GiftVoucherIndentStageDto> giftVoucherIndentErrorList = namedParameterJdbcTemplate.query(sql,
						parameters, new BeanPropertyRowMapper<>(GiftVoucherIndentStageDto.class));
				giftVoucherIndentErrorList.stream().forEach(giftIndent ->
					dataAuditService.saveDataAuditData(giftIndent.getGvSerialNo().toString(),
							MapperUtil.getJsonString(giftIndent),
							"Gv Serial No: " + giftIndent.getGvSerialNo().toString()
									+ " is already present in gift_master table",
							fileAuditId, ErrorTypeEnum.ERROR.toString())
				);
			});
			

			// removing data from stage table
			deleteDuplicate(serialNoDuplicateList);
		}
		return RepeatStatus.FINISHED;
	}

	private void deleteDuplicate(List<Integer> serialNoDuplicateList) {
		if (!serialNoDuplicateList.isEmpty()) {
			if (serialNoDuplicateList.size() > 2100) {
				List<Integer> duplicateList = new ArrayList<>();
				for (int i = 0; i < serialNoDuplicateList.size(); i++) {
					duplicateList.add(serialNoDuplicateList.get(i));
					if (duplicateList.size() == 2000 || duplicateList.size() == i + 1) {
						deleteDuplicateSerialNumbers(duplicateList);
						duplicateList.clear();
					}
				}
			} else {
				deleteDuplicateSerialNumbers(serialNoDuplicateList);
			}
		}
	}

	private void deleteDuplicateSerialNumbers(List<Integer> duplicateList) {
		SqlParameterSource deleteParameters = new MapSqlParameterSource("serialNos", duplicateList);
		String removeSql = "DELETE FROM gift_voucher_indent_stage where gv_serial_no IN (:serialNos)";
		namedParameterJdbcTemplate.update(removeSql, deleteParameters);
	}
}
