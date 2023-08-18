package com.titan.poss.sales.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.transaction.ChainedTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import com.titan.poss.core.config.BaseConfig;

@Configuration("SalesTransactionManagerConfig")
public class TransactionManagerConfig extends BaseConfig {

	@Bean("chainedTransaction")
	public ChainedTransactionManager transactionManager(
			@Qualifier("inventoryDataTransactionManager") PlatformTransactionManager inventoryTransactionManger,
			@Qualifier("salesDataTransactionManager") PlatformTransactionManager salesTransactionManger,
			@Qualifier("productDataTransactionManager") PlatformTransactionManager productDataTransactionManager
			) {
		return new ChainedTransactionManager(inventoryTransactionManger, salesTransactionManger,productDataTransactionManager);
	}
}
