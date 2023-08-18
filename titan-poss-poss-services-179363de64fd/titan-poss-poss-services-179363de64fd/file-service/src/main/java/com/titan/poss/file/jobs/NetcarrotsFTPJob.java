/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.job.flow.support.SimpleFlow;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.NcCustomerTransactionStageDto;
import com.titan.poss.file.dto.NcMemberDataStageDto;
import com.titan.poss.file.dto.NcStoreMasterStageDto;
import com.titan.poss.file.dto.NcTransactionDataStageDto;
import com.titan.poss.file.jobs.listener.NcCustomerTransactionFilewritingStepListener;
import com.titan.poss.file.jobs.listener.NcMemberDataFileWritingStepListener;
import com.titan.poss.file.jobs.listener.NcStoreMasterFileWritingStepListener;
import com.titan.poss.file.jobs.listener.NcTransactionDataFileWritingStepListener;
import com.titan.poss.file.jobs.listener.NetcarrotsFTPJobStagingListener;
import com.titan.poss.file.jobs.listener.NetcarrotsJobListener;
import com.titan.poss.file.jobs.processor.NCMemberDataProcessor;
import com.titan.poss.file.jobs.reader.NetcarrotsJobReader;
import com.titan.poss.file.jobs.tasklet.NcTransactionDataTasklet;
import com.titan.poss.file.jobs.tasklet.NetcarrotsJobBaseTasklet;
import com.titan.poss.file.jobs.writer.NetcarrotsJobWriter;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Configuration
public class NetcarrotsFTPJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private NetcarrotsJobReader netcarrotsJobReader;

	@Autowired
	private NetcarrotsJobWriter netcarrotsJobWriter;

	@Bean(name = FileIntegrationConstants.NETCARROTS_JOB)
	public Job netcarrotsJob(JobBuilderFactory jobBuilderFactory, NetcarrotsJobListener netcarrotsJobListener,
			NcMemberDataFileWritingStepListener ncMemberDataFileWritingStepListener,
			NcStoreMasterFileWritingStepListener ncStoreMasterFileWritingStepListener) {

		Flow customerTransactionFlow = new FlowBuilder<SimpleFlow>("customerTransactionFlow")
				.start(customerTrasnsactionDataTasklet()).next(customerTransactionCmStagingStep())
				.next(customerTransactionBcStagingStep()).next(customerTransactionGrnStagingStep())
				.next(customerTransactionFilewritingStep(getNcCustomerTransactionFilewritingStepListener())).end();

		Flow memberDataFlow = new FlowBuilder<SimpleFlow>("memberDataFlow").start(memberDataTasklet())
				.next(memberDataStagingStep()).next(memberDataFileWritingStep(ncMemberDataFileWritingStepListener))
				.end();

		Flow storeMasterFlow = new FlowBuilder<SimpleFlow>("storeMasterFlow").start(storeMasterStagingStep())
				.next(storeMasterFileWritingStep(ncStoreMasterFileWritingStepListener)).end();

		Flow transactionDataFlow = new FlowBuilder<SimpleFlow>("transactionDataFlow").start(transactionDataTasklet())
				.next(transactionDataFileWritingStep()).end();

		return jobBuilderFactory.get(FileIntegrationConstants.NETCARROTS_JOB).incrementer(new RunIdIncrementer())
				.listener(netcarrotsJobListener).start(customerTransactionFlow).next(memberDataFlow)
				.next(storeMasterFlow).next(transactionDataFlow).end().build();
	}

	@Bean
	public Step customerTrasnsactionDataTasklet() {
		return stepBuilderFactory.get("customerTrasnsactionDataTasklet").tasklet(getNcCustomerTransactionTasklet())
				.listener(getNcCustomerTransactionStagingStepListener()).build();
	}

	@Bean
	public Step customerTransactionCmStagingStep() {
		return stepBuilderFactory.get("customerTransactionCmStagingStep")
				.<NcCustomerTransactionStageDto, NcCustomerTransactionStageDto>chunk(100)
				.reader(netcarrotsJobReader
						.customerTransactionCmStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(netcarrotsJobWriter.customerTransactionStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED))
				.build();
	}

	@Bean
	public Step customerTransactionBcStagingStep() {
		return stepBuilderFactory.get("customerTransactionBcStagingStep")
				.<NcCustomerTransactionStageDto, NcCustomerTransactionStageDto>chunk(100)
				.reader(netcarrotsJobReader
						.customerTransactionBcStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(netcarrotsJobWriter.customerTransactionStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED))
				.build();
	}

	@Bean
	public Step customerTransactionGrnStagingStep() {
		
		return stepBuilderFactory.get("customerTransactionGrnStagingStep")
				.<NcCustomerTransactionStageDto, NcCustomerTransactionStageDto>chunk(100)
				.reader(netcarrotsJobReader
						.customerTransactionGrnStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(netcarrotsJobWriter.customerTransactionStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED))
				.build();
	}

	@Bean
	public Step customerTransactionFilewritingStep(
			NcCustomerTransactionFilewritingStepListener ncCustomerTransactionFilewritingStepListener) {
		return stepBuilderFactory.get("customerTransactionFilewritingStep")
				.<NcCustomerTransactionStageDto, NcCustomerTransactionStageDto>chunk(100)
				.reader(netcarrotsJobReader.customerTransactionfileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(netcarrotsJobWriter.customerTransactionFileWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED))
				.listener(ncCustomerTransactionFilewritingStepListener).build();
	}

	@Bean
	public Step memberDataTasklet() {
		return stepBuilderFactory.get("memberDataTasklet").tasklet(getNcMemberDataTasklet())
				.listener(getNcMemberDataStagingStepListener()).build();
	}

	@Bean
	public Step memberDataStagingStep() {
		return stepBuilderFactory.get("memberDataStagingStep").<NcMemberDataStageDto, NcMemberDataStageDto>chunk(100)
				.reader(netcarrotsJobReader.memberDataStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getNCMemberDataProcessor())
				.writer(netcarrotsJobWriter.memberDataStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED)).build();
	}

	@Bean
	public Step memberDataFileWritingStep(NcMemberDataFileWritingStepListener ncMemberDataFileWritingStepListener) {
		return stepBuilderFactory.get("memberDataFileWritingStep")
				.<NcMemberDataStageDto, NcMemberDataStageDto>chunk(100)
				.reader(netcarrotsJobReader.memberDatafileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(netcarrotsJobWriter.memberDataFileWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED))
				.listener(ncMemberDataFileWritingStepListener).build();
	}

	@Bean
	public Step storeMasterStagingStep() {
		return stepBuilderFactory.get("storeMasterStagingStep").<NcStoreMasterStageDto, NcStoreMasterStageDto>chunk(100)
				.reader(netcarrotsJobReader.storeMasterStagingReader())
				.writer(netcarrotsJobWriter.storeMasterStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED))
				.listener(getNcStoreMasterStagingStepListener()).build();
	}

	@Bean
	public Step storeMasterFileWritingStep(NcStoreMasterFileWritingStepListener ncStoreMasterFileWritingStepListener) {
		return stepBuilderFactory.get("storeMasterFileWritingStep")
				.<NcStoreMasterStageDto, NcStoreMasterStageDto>chunk(100)
				.reader(netcarrotsJobReader.storeMasterfileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(netcarrotsJobWriter.storeMasterFileWriter(FileIntegrationConstants.WILL_BE_INJECTED))
				.listener(ncStoreMasterFileWritingStepListener).build();
	}

	@Bean
	public Step transactionDataTasklet() {
		return stepBuilderFactory.get("transactionDataTasklet").tasklet(getNcTransactionDataTasklet())
				.listener(geNcTransactionDataStagingStepListener()).build();
	}

	@Bean
	public Step transactionDataFileWritingStep() {
		return stepBuilderFactory.get("transactionDataFileWritingStep")
				.<NcTransactionDataStageDto, NcTransactionDataStageDto>chunk(100)
				.reader(netcarrotsJobReader.transactionDatafileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(netcarrotsJobWriter.transactionDataFileWriter(FileIntegrationConstants.WILL_BE_INJECTED))
				.listener(getNcTransactionDataFileWritingStepListener()).build();
	}

	@Bean
	public NetcarrotsFTPJobStagingListener getNcCustomerTransactionStagingStepListener() {
		return new NetcarrotsFTPJobStagingListener(FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue(),
				"NcCustomerTransactionSavedId", "Nc Customer Transaction");
	}

	@Bean
	public NCMemberDataProcessor getNCMemberDataProcessor() {
		return new NCMemberDataProcessor();
	}

	@Bean
	public NcCustomerTransactionFilewritingStepListener getNcCustomerTransactionFilewritingStepListener() {
		return new NcCustomerTransactionFilewritingStepListener();
	}

	@Bean
	public NetcarrotsFTPJobStagingListener geNcTransactionDataStagingStepListener() {
		return new NetcarrotsFTPJobStagingListener(FileMasterJobNameEnum.NC_NO_OF_RECORDS_DATA_JOB.getValue(),
				"NcTransactionDataSavedId", "Nc Transaction data");
	}

	@Bean
	public NcTransactionDataFileWritingStepListener getNcTransactionDataFileWritingStepListener() {
		return new NcTransactionDataFileWritingStepListener();
	}

	@Bean
	public NetcarrotsJobBaseTasklet getNcCustomerTransactionTasklet() {
		return new NetcarrotsJobBaseTasklet();
	}

	@Bean
	public NetcarrotsJobBaseTasklet getNcMemberDataTasklet() {
		return new NetcarrotsJobBaseTasklet();
	}

	@Bean
	public NetcarrotsFTPJobStagingListener getNcMemberDataStagingStepListener() {
		return new NetcarrotsFTPJobStagingListener(FileMasterJobNameEnum.NC_MEMBER_DATA_JOB.getValue(),
				"NcMemberDataSavedId", "Nc Member data");
	}

	@Bean
	public NetcarrotsFTPJobStagingListener getNcStoreMasterStagingStepListener() {
		return new NetcarrotsFTPJobStagingListener(FileMasterJobNameEnum.NC_STORE_DATA_JOB.getValue(),
				"NcStoreMasterSavedId", "Nc Store master");
	}

	@Bean
	public NcTransactionDataTasklet getNcTransactionDataTasklet() {
		return new NcTransactionDataTasklet();
	}

}
