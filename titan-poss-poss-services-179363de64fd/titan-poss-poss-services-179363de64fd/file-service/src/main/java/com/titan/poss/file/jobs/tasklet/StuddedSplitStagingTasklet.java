/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.io.BufferedReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dto.StuddedSplitDtlDto;
import com.titan.poss.file.dto.StuddedSplitHdrDto;
import com.titan.poss.file.dto.StuddedSplitLdtlDto;
import com.titan.poss.file.service.StuddedSplitValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StuddedSplitStagingTasklet implements Tasklet, StepExecutionListener {

	@Autowired
	private Environment env;

	@Autowired
	private StuddedSplitValidationService studdedSplitValidationService;

	@Autowired
	private NamedParameterJdbcTemplate namedparameterjdbctemplate;

	private boolean valid;

	private static final String STUDDED_SPLIT_JOB_LOCAL_SOURCE_FILE_PATH = "studded.split.file.source.path";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("studdedSplitTransactionId");
		String fileName = (String) chunkContext.getStepContext().getJobParameters()
				.get(JobFileNameEnum.STUDDED_SPLIT_FILE_NAME.getValue());
		String srcFolder = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(STUDDED_SPLIT_JOB_LOCAL_SOURCE_FILE_PATH) + fileName;
		Path path = Paths.get(srcFolder);
		List<StuddedSplitHdrDto> hdrDtos = new ArrayList<>();
		List<StuddedSplitDtlDto> dtlDtos = new ArrayList<>();
		List<StuddedSplitLdtlDto> ldtlDtos = new ArrayList<>();
		try (BufferedReader bufferedReader = Files.newBufferedReader(path)) {
			String line;

			while ((line = bufferedReader.readLine()) != null) {
				String[] split = line.split("\\|");
				if (split[0].equalsIgnoreCase("PHDR") || split[0].equalsIgnoreCase("CHDR")) {
					hdrDtos.add(mapHdrDto(split, fileId));
				} else if (split[0].equalsIgnoreCase("PDTL") || split[0].equalsIgnoreCase("CDTL")) {
					dtlDtos.add(mapDtlDto(split, fileId));
				} else if (split[0].equalsIgnoreCase("PLDTL") || split[0].equalsIgnoreCase("CLDTL")) {
					ldtlDtos.add(mapldtlDto(split, fileId));
				}
			}
		}
		if (validate(dtlDtos, ldtlDtos)) {
			writeToStageTable(hdrDtos, dtlDtos, ldtlDtos);
		}
		return RepeatStatus.FINISHED;

	}

	private StuddedSplitHdrDto mapHdrDto(String[] split, String fileId) {
		StuddedSplitHdrDto hdrDto = new StuddedSplitHdrDto();
		hdrDto.setHeader(split[0]);
		hdrDto.setConstant(split[1]);
		hdrDto.setLocationCode(split[2]);
		hdrDto.setFiscalYear(Integer.parseInt(split[3]));
		hdrDto.setSerialNumber(Integer.parseInt(split[4]));
		hdrDto.setCurrentDate(split[5]);
		if (split[0].equalsIgnoreCase("CHDR")) {
			hdrDto.setNoOfLineItems(Integer.parseInt(split[6]));
		}
		hdrDto.setFileId(fileId);

		return hdrDto;
	}

	private StuddedSplitDtlDto mapDtlDto(String[] split, String fileId) {
		StuddedSplitDtlDto dtlDto = new StuddedSplitDtlDto();
		dtlDto.setDetail(split[0]);
		dtlDto.setConstant(split[1]);
		dtlDto.setLocationCode(split[2]);
		dtlDto.setFiscalYear(split[3]);
		dtlDto.setSerialNumber(Integer.parseInt(split[4]));
		dtlDto.setCurrentDate(split[5]);
		dtlDto.setLineItemNumber(Integer.parseInt(split[6]));
		dtlDto.setItemCode(split[7]);
		dtlDto.setValue(split[8]);
		dtlDto.setQuantity(Integer.parseInt(split[9]));
		dtlDto.setWeight(split[10]);
		dtlDto.setTotalValue(split[11]);
		dtlDto.setConstantValue1(Integer.parseInt(split[12]));
		dtlDto.setConstantValue2(Integer.parseInt(split[13]));
		dtlDto.setConstantValue3(Integer.parseInt(split[14]));
		dtlDto.setLotNumber(split[15]);
		dtlDto.setActualF1(split[16]);
		dtlDto.setDiamondWeight(split[17]);
		dtlDto.setOtherStoneWeight(split[18]);
		if (split[0].equalsIgnoreCase("CDTL")) {
			dtlDto.setParentLineItemNumber(Integer.parseInt(split[19]));
		}
		dtlDto.setFileId(fileId);
		return dtlDto;
	}

	private StuddedSplitLdtlDto mapldtlDto(String[] split, String fileId) {
		StuddedSplitLdtlDto ldtlDto = new StuddedSplitLdtlDto();
		ldtlDto.setLineDetail(split[0]);
		ldtlDto.setLineItemNo(Integer.parseInt(split[1]));
		ldtlDto.setSubLineItemNo(Integer.parseInt(split[2]));
		ldtlDto.setStoneCode(split[3]);
		ldtlDto.setStoneWeight(split[4]);
		ldtlDto.setStoneQuantity(Integer.parseInt(split[5]));
		if (split[0].equalsIgnoreCase("CLDTL")) {
			ldtlDto.setParentLineItemNo(Integer.parseInt(split[6]));
		}
		ldtlDto.setFileId(fileId);
		return ldtlDto;
	}

	private boolean validate(List<StuddedSplitDtlDto> dtlDtos, List<StuddedSplitLdtlDto> ldtlDtos) {

		valid = true;
		for (StuddedSplitDtlDto dtlDto : dtlDtos) {
			if (!studdedSplitValidationService.validateDtlDto(dtlDto)) {
				valid = false;
			}
		}
		if (!studdedSplitValidationService.validateDtlWeights(dtlDtos)) {
			valid = false;
		}

		for (StuddedSplitLdtlDto ldtlDto : ldtlDtos) {
			if (!studdedSplitValidationService.validateLdtlDto(ldtlDto)) {
				valid = false;
			}
		}
		return valid;
	}

	private void writeToStageTable(List<StuddedSplitHdrDto> hdrDtos, List<StuddedSplitDtlDto> dtlDtos,
			List<StuddedSplitLdtlDto> ldtlDtos) {

		SqlParameterSource[] hdrBatch = SqlParameterSourceUtils.createBatch(hdrDtos.toArray());
		String hdrSql = "INSERT into [file].dbo.studded_split_hdr_stage(header,constant,location_code,fiscal_year,serial_number,\"current_date\",no_of_line_items,file_id,created_date)\r\n"
				+ " values(:header, :constant, :locationCode, :fiscalYear, :serialNumber, :currentDate, :noOfLineItems, :fileId, getdate())";
		namedparameterjdbctemplate.batchUpdate(hdrSql, hdrBatch);

		SqlParameterSource[] dtlBatch = SqlParameterSourceUtils.createBatch(dtlDtos.toArray());
		String dtlSql = "INSERT into [file].dbo.studded_split_dtl_stage(detail,constant,location_code,fiscal_year,serial_number,\"current_date\",line_item_number,item_code,value,quantity,weight,total_value,constant_value1,\r\n"
				+ "constant_value2,constant_value3,lot_number,actual_f1,diamond_weight,other_stone_weight,parent_line_item_number,file_id,created_date)\r\n"
				+ " values(:detail, :constant, :locationCode, :fiscalYear, :serialNumber, :currentDate, :lineItemNumber, :itemCode, :value, :quantity, :weight, :totalValue, :constantValue1, :constantValue2\r\n"
				+ " , :constantValue3, :lotNumber, :actualF1, :diamondWeight, :otherStoneWeight, :parentLineItemNumber, :fileId, getdate()) ";
		namedparameterjdbctemplate.batchUpdate(dtlSql, dtlBatch);

		SqlParameterSource[] ldtlBatch = SqlParameterSourceUtils.createBatch(ldtlDtos.toArray());
		String ldtlSql = "INSERT into [file].dbo.studded_split_ldtl_stage(line_detail,line_item_no,sub_line_item_no,stone_code,stone_weight,stone_quantity,parent_line_item_no,file_id,created_date)\r\n"
				+ " values(:lineDetail, :lineItemNo, :subLineItemNo, :stoneCode, :stoneWeight, :stoneQuantity, :parentLineItemNo, :fileId , getdate())";
		namedparameterjdbctemplate.batchUpdate(ldtlSql, ldtlBatch);

	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		// autogenerated

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		if (valid) {
			stepExecution.getJobExecution().getExecutionContext().put("valid", "true");
			return ExitStatus.COMPLETED;
		}
		stepExecution.getJobExecution().getExecutionContext().put("valid", "false");
		return ExitStatus.STOPPED;
	}

}
