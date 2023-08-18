/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.reader;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.file.transform.LineTokenizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.GiftVoucherStatusUpdateDto;
import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftVoucherStatusUpdateJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<GiftVoucherStatusUpdateDto> giftVoucherStatusUpdateFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<GiftVoucherStatusUpdateDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<GiftVoucherStatusUpdateDto> giftVoucherStatusUpdateLineMapper = createGiftVoucherStatusUpdateLineMapper();
		reader.setLineMapper(giftVoucherStatusUpdateLineMapper);
		return reader;
	}

	private LineMapper<GiftVoucherStatusUpdateDto> createGiftVoucherStatusUpdateLineMapper() {
		DefaultLineMapper<GiftVoucherStatusUpdateDto> giftVoucherStatusUpdateMapper = new DefaultLineMapper<>();

		LineTokenizer giftVoucherStatusUpdateLineTokenizer = createGiftVoucherStatusUpdateLineTokenizer();
		giftVoucherStatusUpdateMapper.setLineTokenizer(giftVoucherStatusUpdateLineTokenizer);

		FieldSetMapper<GiftVoucherStatusUpdateDto> giftVoucherMapper = createGiftVoucherStatusUpdateMapper();
		giftVoucherStatusUpdateMapper.setFieldSetMapper(giftVoucherMapper);

		return giftVoucherStatusUpdateMapper;
	}

	private LineTokenizer createGiftVoucherStatusUpdateLineTokenizer() {
		DelimitedLineTokenizer giftVoucherStatusLineTokenizer = new DelimitedLineTokenizer();
		giftVoucherStatusLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		giftVoucherStatusLineTokenizer.setNames("serialNo", "status");
		return giftVoucherStatusLineTokenizer;
	}

	private FieldSetMapper<GiftVoucherStatusUpdateDto> createGiftVoucherStatusUpdateMapper() {
		BeanWrapperFieldSetMapper<GiftVoucherStatusUpdateDto> giftVoucherStatusUpdateMapper = new BeanWrapperFieldSetMapper<>();
		giftVoucherStatusUpdateMapper.setTargetType(GiftVoucherStatusUpdateDto.class);
		return giftVoucherStatusUpdateMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GiftVoucherStatusUpdateIngestionDto> giftVoucherStatusUpdateIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<GiftVoucherStatusUpdateIngestionDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from gift_voucher_status_update_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(GiftVoucherStatusUpdateIngestionDto.class));
		return reader;
	}
}