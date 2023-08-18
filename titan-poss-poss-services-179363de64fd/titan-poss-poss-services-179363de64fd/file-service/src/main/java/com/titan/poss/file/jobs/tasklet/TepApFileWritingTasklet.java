/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.TepApDetailsDto;
import com.titan.poss.file.dto.TepApHdrDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class TepApFileWritingTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private Environment env;

	private static final String TEP_AP_LOCAL_OUTPUT_FOLDER = "tep.ap.completed.path";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext().get("tepApTransactionId");
		String tepHeaderSql = "Select * from tep_ap_header_stage where file_id = '" + fileId + "'";
		String tepDetailsSql = "Select * from tep_ap_details_stage where file_id = '" + fileId + "'";
		List<TepApHdrDto> tepHeaderList = namedParameterJdbcTemplate.query(tepHeaderSql,
				new BeanPropertyRowMapper<>(TepApHdrDto.class));
		List<TepApDetailsDto> tepDetailsList = namedParameterJdbcTemplate.query(tepDetailsSql,
				new BeanPropertyRowMapper<>(TepApDetailsDto.class));
		String fileName = tepHeaderList.get(0).getFileName();
		try (BufferedWriter writer = new BufferedWriter(
				new FileWriter(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
						+ env.getProperty(TEP_AP_LOCAL_OUTPUT_FOLDER) + fileName + "." + FileExtensionEnum.TXT))) {
			for (int i = 0; i < tepHeaderList.size(); i++) {
				writer.write(tepHeaderList.get(i).getRecType() + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getInvoiceType() + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getInvoiceNumber() + DelimiterEnum.PSV.getValue()
						+ CalendarUtils.formatDateToString(tepHeaderList.get(i).getBusinessDate(), "dd-MMM-yy")
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getVendorCode()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getVendorSite()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getAmount().setScale(0, RoundingMode.DOWN)
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getCurrencyCode()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getDescription()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getCustomerEmailId()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getCustomerName()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getCustomerBankAccNo()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getBankIfscCode()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getBtqEmailId()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getFileName());
				writer.append(FileIntegrationConstants.NEW_LINE);
				for (TepApDetailsDto tepDetails : tepDetailsList) {
					if (tepDetails.getInvoiceNumber().equalsIgnoreCase(tepHeaderList.get(i).getInvoiceNumber())) {
						writer.write(tepDetails.getRecType() + DelimiterEnum.PSV.getValue()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getInvoiceNumber()
								+ DelimiterEnum.PSV.getValue()
								+ CalendarUtils.formatDateToString(tepHeaderList.get(i).getBusinessDate(), "dd-MMM-yy")
								+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getAmount().setScale(0, RoundingMode.DOWN)
								+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
								+ tepDetails.getGlCodeCombination() + DelimiterEnum.PSV.getValue()
								+ tepDetails.getItemCode() + DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
								+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getFileName());
						writer.append(FileIntegrationConstants.NEW_LINE);
					}
				}
			}
		}
		return RepeatStatus.FINISHED;
	}
}
