/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.reader;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.file.transform.LineTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.GiftVoucherIndentFileStageDto;
import com.titan.poss.file.dto.GiftVoucherStatusFileStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftMasterJobReader {

	@Autowired
	private Environment env;

	private static final String DECRYPTED_GIFT_VOUCHER_FILE_PATH = "gv.source.path";

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<GiftVoucherIndentFileStageDto> giftVoucherIndentStagingReader(@Value("#{jobParameters['"
			+ FileIntegrationConstants.GIFT_VOUCHER_INDENT_FILE_NAME + "']}") String giftVoucherIndentFileName) {

		FlatFileItemReader<GiftVoucherIndentFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(DECRYPTED_GIFT_VOUCHER_FILE_PATH) + giftVoucherIndentFileName));

		LineMapper<GiftVoucherIndentFileStageDto> giftVoucherIndentLineMapper = createGiftVoucherIndentLineMapper();
		reader.setLineMapper(giftVoucherIndentLineMapper);

		return reader;
	}

	private LineMapper<GiftVoucherIndentFileStageDto> createGiftVoucherIndentLineMapper() {
		DefaultLineMapper<GiftVoucherIndentFileStageDto> giftVoucherIndent = new DefaultLineMapper<>();

		LineTokenizer giftVoucherIndentLineTokenizer = createGiftVoucherIndentLineTokenizer();
		giftVoucherIndent.setLineTokenizer(giftVoucherIndentLineTokenizer);

		FieldSetMapper<GiftVoucherIndentFileStageDto> giftVoucherIndentMapper = createGiftVoucherIndentMapper();
		giftVoucherIndent.setFieldSetMapper(giftVoucherIndentMapper);

		return giftVoucherIndent;
	}

	private LineTokenizer createGiftVoucherIndentLineTokenizer() {
		DelimitedLineTokenizer giftVoucherIndentLineTokenizer = new DelimitedLineTokenizer();
		giftVoucherIndentLineTokenizer.setDelimiter(DelimiterEnum.PSV.getValue());
		giftVoucherIndentLineTokenizer.setNames("itemCode", "gvSerialNumber", "issuedTo", "region", "customerName",
				"customerType", "denomination", "quantity", "totalValue", "status", "gvCreationDate",
				"locationCode", "discount", "remarks", "excludes", "discountPercentage", "validityDays");
		return giftVoucherIndentLineTokenizer;
	}

	private FieldSetMapper<GiftVoucherIndentFileStageDto> createGiftVoucherIndentMapper() {
		BeanWrapperFieldSetMapper<GiftVoucherIndentFileStageDto> giftVoucherIndentMapper = new BeanWrapperFieldSetMapper<>();
		giftVoucherIndentMapper.setTargetType(GiftVoucherIndentFileStageDto.class);
		return giftVoucherIndentMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<GiftVoucherStatusFileStageDto> giftVoucherStatusStagingReader(@Value("#{jobParameters['"
			+ FileIntegrationConstants.GIFT_VOUCHER_STATUS_FILE_NAME + "']}") String giftVoucherStatusFileName) {

		FlatFileItemReader<GiftVoucherStatusFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(DECRYPTED_GIFT_VOUCHER_FILE_PATH) + giftVoucherStatusFileName));

		LineMapper<GiftVoucherStatusFileStageDto> giftVoucherStatusLineMapper = createGiftVoucherStatusLineMapper();
		reader.setLineMapper(giftVoucherStatusLineMapper);

		return reader;
	}

	private LineMapper<GiftVoucherStatusFileStageDto> createGiftVoucherStatusLineMapper() {
		DefaultLineMapper<GiftVoucherStatusFileStageDto> giftVoucherStatus = new DefaultLineMapper<>();

		LineTokenizer giftVoucherStatusLineTokenizer = createGiftVoucherStatusLineTokenizer();
		giftVoucherStatus.setLineTokenizer(giftVoucherStatusLineTokenizer);

		FieldSetMapper<GiftVoucherStatusFileStageDto> giftVoucherStatusMapper = createGiftVoucherStatusMapper();
		giftVoucherStatus.setFieldSetMapper(giftVoucherStatusMapper);

		return giftVoucherStatus;
	}

	private LineTokenizer createGiftVoucherStatusLineTokenizer() {
		DelimitedLineTokenizer giftVoucherStatusLineTokenizer = new DelimitedLineTokenizer();
		giftVoucherStatusLineTokenizer.setDelimiter(DelimiterEnum.PSV.getValue());
		giftVoucherStatusLineTokenizer.setNames("gvSerialNumber", "gvStatus", "actBlockedDateActivatedOn",
				"validFrom", "validTill", "validityDays");
		return giftVoucherStatusLineTokenizer;
	}

	private FieldSetMapper<GiftVoucherStatusFileStageDto> createGiftVoucherStatusMapper() {
		BeanWrapperFieldSetMapper<GiftVoucherStatusFileStageDto> giftVoucherStatusMapper = new BeanWrapperFieldSetMapper<>();
		giftVoucherStatusMapper.setTargetType(GiftVoucherStatusFileStageDto.class);
		return giftVoucherStatusMapper;
	}

}
