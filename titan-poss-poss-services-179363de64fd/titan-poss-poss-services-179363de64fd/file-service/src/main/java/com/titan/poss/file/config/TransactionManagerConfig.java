package com.titan.poss.file.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.transaction.ChainedTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import com.titan.poss.core.config.BaseConfig;

@Configuration("FileTransactionManagerConfig")
public class TransactionManagerConfig extends BaseConfig {

	@Bean("chainedTransaction")
	public ChainedTransactionManager transactionManager(
			@Qualifier("inventoryDataTransactionManager") PlatformTransactionManager inventoryTransactionManger,
			@Qualifier("fileDataTransactionManager") PlatformTransactionManager fileDataTransactionManager) {
		return new ChainedTransactionManager(inventoryTransactionManger, fileDataTransactionManager);
	}
}
