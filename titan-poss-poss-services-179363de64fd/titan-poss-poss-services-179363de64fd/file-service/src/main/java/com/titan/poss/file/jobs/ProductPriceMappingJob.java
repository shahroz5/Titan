/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs;

import javax.sql.DataSource;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.ProductPriceMappingDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.ProductPriceMappingFailureListener;
import com.titan.poss.file.jobs.mapper.ProductPriceMapper;
import com.titan.poss.file.jobs.processor.ProductPriceMappingIngestionProcessor;
import com.titan.poss.file.jobs.processor.ProductPriceMappingStagingProcessor;
import com.titan.poss.file.jobs.reader.ProductPriceMappingJobReader;
import com.titan.poss.file.jobs.tasklet.ProductPriceMappingTasklet;
import com.titan.poss.file.jobs.writer.ProductPriceMappingDatayncWriter;
import com.titan.poss.file.jobs.writer.ProductPriceMappingJobStagingWriter;
import com.titan.poss.file.jobs.writer.ProductPriceMappingJobWriter;
import com.titan.poss.product.dao.ProductPriceMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class ProductPriceMappingJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private ProductPriceMappingJobReader productPriceMappingJobReader;

	@Bean(name = "PRODUCT_PRICE_MAPPING")
	public Job productPriceMappingJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			ProductPriceMappingJobWriter productPriceMappingJobWriter, ProductPriceMapper productPriceMapper) {

		return jobBuilderFactory.get("PRODUCT_PRICE_MAPPING").incrementer(new RunIdIncrementer())
				.listener(getProductPriceMappingJobListener())
				.start(productPriceMappingStagingStep(getProductPriceMappingStagingProcessor(),
						getProductPriceMappingFailureListener(), env))
				.next(productPriceMappingJobTasklet())
				.next(productPriceMappingIngestionStep(getProductPriceMappingIngestionProcessor(),
						getProductPriceMappingFailureListener(), dataSource, productPriceMappingJobWriter))
				.next(productPriceMappingDataSyncStep(productPriceMapper, dataSource)).build();
	}

	@Bean
	public Step productPriceMappingDataSyncStep(ProductPriceMapper productPriceMapper, DataSource dataSource) {
		return stepBuilderFactory.get("productPriceMappingDataSyncStep")
				.<ProductPriceMappingDao, ProductPriceMappingDao>chunk(100)
				.reader(productPriceMappingJobReader.productPriceMappingDataSyncReader(
						FileIntegrationConstants.WILL_BE_INJECTED, productPriceMapper, dataSource))
				.writer(getProductPriceMappingDatayncWriter()).build();
	}

	@Bean
	public ProductPriceMappingDatayncWriter getProductPriceMappingDatayncWriter() {
		return new ProductPriceMappingDatayncWriter();
	}

	@Bean
	public Step productPriceMappingStagingStep(ProductPriceMappingStagingProcessor productPriceMappingStagingProcessor,
			ProductPriceMappingFailureListener productPriceMappingFailureListener, Environment env) {
		return stepBuilderFactory.get("productPriceMappingStagingStep")
				.<ProductPriceMappingDto, ProductPriceMappingDto>chunk(500)
				.reader(productPriceMappingJobReader.productPriceMappingFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(productPriceMappingStagingProcessor).writer(getProductPriceMappingStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(productPriceMappingFailureListener).build();
	}

	@Bean
	public Step productPriceMappingIngestionStep(ProductPriceMappingIngestionProcessor productPriceMappingProcessor,
			ProductPriceMappingFailureListener productPriceMappingFailureListener, DataSource dataSource,
			ProductPriceMappingJobWriter productPriceMappingJobWriter) {
		return stepBuilderFactory.get("productPriceMappingIngestionStep")
				.<ProductPriceMappingDto, ProductPriceMappingDto>chunk(500)
				.reader(productPriceMappingJobReader
						.productPriceMappingIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(productPriceMappingProcessor)
				.writer(productPriceMappingJobWriter.productPriceMappingIngestionWriter(dataSource)).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(productPriceMappingFailureListener)
				.build();
	}

	@Bean
	public Step productPriceMappingJobTasklet() {
		return stepBuilderFactory.get("productPriceMappingJobTasklet").tasklet(getProductPriceMappingTasklet()).build();
	}

	@Bean
	public ProductPriceMappingTasklet getProductPriceMappingTasklet() {
		return new ProductPriceMappingTasklet();
	}

	@Bean
	public FileUploadJobListener getProductPriceMappingJobListener() {
		return new FileUploadJobListener("Product price mapping",
				"DELETE from product_price_mapping_stage where file_audit_id = '");
	}

	@Bean
	public ProductPriceMappingStagingProcessor getProductPriceMappingStagingProcessor() {
		return new ProductPriceMappingStagingProcessor();
	}

	@Bean
	public ProductPriceMappingIngestionProcessor getProductPriceMappingIngestionProcessor() {
		return new ProductPriceMappingIngestionProcessor();
	}

	@Bean
	public ProductPriceMappingFailureListener getProductPriceMappingFailureListener() {
		return new ProductPriceMappingFailureListener();
	}

	@Bean
	public ProductPriceMappingJobStagingWriter getProductPriceMappingStagingWriter() {
		return new ProductPriceMappingJobStagingWriter();
	}

}