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
import com.titan.poss.file.dto.FirMerFileDto;
import com.titan.poss.file.dto.FirMerStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class FirMerJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<FirMerFileDto> firMerFileReader(@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<FirMerFileDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<FirMerFileDto> firMerLineMapper = createFirMerLineMapper();
		reader.setLineMapper(firMerLineMapper);

		return reader;
	}

	private LineMapper<FirMerFileDto> createFirMerLineMapper() {
		DefaultLineMapper<FirMerFileDto> firMapper = new DefaultLineMapper<>();

		LineTokenizer firMerLineTokenizer = createFirMerMasterLineTokenizer();
		firMapper.setLineTokenizer(firMerLineTokenizer);

		FieldSetMapper<FirMerFileDto> firMerMapper = createFirMerMapper();
		firMapper.setFieldSetMapper(firMerMapper);

		return firMapper;
	}

	private LineTokenizer createFirMerMasterLineTokenizer() {
		DelimitedLineTokenizer firMerLineTokenizer = new DelimitedLineTokenizer();
		firMerLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		firMerLineTokenizer.setNames("itemCode", "lotNumber", "unitWeight", "quantity", "initiatedLocationCode",
				"sourceLocationCode", "destinationLocationCode", "fiscalYear");
		return firMerLineTokenizer;
	}

	private FieldSetMapper<FirMerFileDto> createFirMerMapper() {
		BeanWrapperFieldSetMapper<FirMerFileDto> firMerMapper = new BeanWrapperFieldSetMapper<>();
		firMerMapper.setTargetType(FirMerFileDto.class);
		return firMerMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<FirMerStageDto> firMerIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<FirMerStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from fir_mer_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(FirMerStageDto.class));
		return reader;
	}
}
