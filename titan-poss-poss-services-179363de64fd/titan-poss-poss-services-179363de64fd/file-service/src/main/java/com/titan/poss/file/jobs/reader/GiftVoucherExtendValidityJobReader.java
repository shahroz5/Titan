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
import com.titan.poss.file.dto.GiftVoucherExtendValidityDto;
import com.titan.poss.file.dto.GiftVoucherExtendValidityIngestionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftVoucherExtendValidityJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<GiftVoucherExtendValidityDto> giftVoucherExtendValidityFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<GiftVoucherExtendValidityDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ FileIntegrationConstants.PATH_DELIMITTER + env.getProperty(FileIntegrationConstants.TEMP_FOLDER)
				+ FileIntegrationConstants.PATH_DELIMITTER + fileGroup + FileIntegrationConstants.PATH_DELIMITTER
				+ fileName));

		reader.setLinesToSkip(1);

		LineMapper<GiftVoucherExtendValidityDto> giftVoucherExtendValidityLineMapper = createGiftVoucherExtendValidityLineMapper();
		reader.setLineMapper(giftVoucherExtendValidityLineMapper);

		return reader;
	}

	private LineMapper<GiftVoucherExtendValidityDto> createGiftVoucherExtendValidityLineMapper() {
		DefaultLineMapper<GiftVoucherExtendValidityDto> giftVoucherExtendValidityMapper = new DefaultLineMapper<>();

		LineTokenizer giftVoucherExtendValidityLineTokenizer = createGiftVoucherExtendValidityLineTokenizer();
		giftVoucherExtendValidityMapper.setLineTokenizer(giftVoucherExtendValidityLineTokenizer);

		FieldSetMapper<GiftVoucherExtendValidityDto> giftVoucherMapper = createGiftVoucherExtendValidityMapper();
		giftVoucherExtendValidityMapper.setFieldSetMapper(giftVoucherMapper);

		return giftVoucherExtendValidityMapper;
	}

	private LineTokenizer createGiftVoucherExtendValidityLineTokenizer() {
		DelimitedLineTokenizer extendValidityLineTokenizer = new DelimitedLineTokenizer();
		extendValidityLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		extendValidityLineTokenizer.setNames("serialNo", "validTill");
		return extendValidityLineTokenizer;
	}

	private FieldSetMapper<GiftVoucherExtendValidityDto> createGiftVoucherExtendValidityMapper() {
		BeanWrapperFieldSetMapper<GiftVoucherExtendValidityDto> giftVoucherExtendValidityMapper = new BeanWrapperFieldSetMapper<>();
		giftVoucherExtendValidityMapper.setTargetType(GiftVoucherExtendValidityDto.class);
		return giftVoucherExtendValidityMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GiftVoucherExtendValidityIngestionDto> giftVoucherExtendValidityIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<GiftVoucherExtendValidityIngestionDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from gift_voucher_extend_validity_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(GiftVoucherExtendValidityIngestionDto.class));
		return reader;
	}
}
