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
import com.titan.poss.file.dto.CardDetailsDto;
import com.titan.poss.file.jobs.mapper.CardDetailsMapper;
import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class CardDetailsJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<CardDetailsDto> cardDetailsFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<CardDetailsDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<CardDetailsDto> cardDetailsDtoLineMapper = createCardDetailsLineMapper();
		reader.setLineMapper(cardDetailsDtoLineMapper);

		return reader;
	}

	private LineMapper<CardDetailsDto> createCardDetailsLineMapper() {
		DefaultLineMapper<CardDetailsDto> cardMapper = new DefaultLineMapper<>();

		LineTokenizer cardDetailsLineTokenizer = createCardDetailsLineTokenizer();
		cardMapper.setLineTokenizer(cardDetailsLineTokenizer);

		FieldSetMapper<CardDetailsDto> cardDetailsMapper = createCardDetailsMapper();
		cardMapper.setFieldSetMapper(cardDetailsMapper);

		return cardMapper;
	}

	private LineTokenizer createCardDetailsLineTokenizer() {
		DelimitedLineTokenizer cardDetailsLineTokenizer = new DelimitedLineTokenizer();
		cardDetailsLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		cardDetailsLineTokenizer.setNames("cardNo", "isActive");
		return cardDetailsLineTokenizer;
	}

	private FieldSetMapper<CardDetailsDto> createCardDetailsMapper() {
		BeanWrapperFieldSetMapper<CardDetailsDto> cardDetailsMapper = new BeanWrapperFieldSetMapper<>();
		cardDetailsMapper.setTargetType(CardDetailsDto.class);
		return cardDetailsMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<CardDetailsDto> cardDetailsIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<CardDetailsDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from card_details_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(CardDetailsDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<CashbackCardDetailsDaoExt> cardDetailsDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, CardDetailsMapper cardDetailsMapper,
			DataSource dataSource) {
		JdbcCursorItemReader<CashbackCardDetailsDaoExt> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM payments.dbo.cashback_card_details where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(cardDetailsMapper);
		return reader;
	}
}
