package com.titan.poss.datasync.configuration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.transaction.ChainedTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import com.titan.poss.core.config.BaseConfig;

@Configuration("DataSyncTransactionManagerConfig")
public class TransactionManagerConfig extends BaseConfig {
	
	@Bean("chainedTransaction")
	public ChainedTransactionManager transactionManager(
			@Qualifier("configSyncDataTransactionManager")PlatformTransactionManager configTransactionManger,
			@Qualifier("integrationSyncDataTransactionManager")PlatformTransactionManager integrationTransactionManger,
			@Qualifier("inventorySyncDataTransactionManager")PlatformTransactionManager inventoryTransactionManger,
			@Qualifier("locationSyncDataTransactionManager")PlatformTransactionManager locationTransactionManger,
			@Qualifier("paymentSyncDataTransactionManager")PlatformTransactionManager paymentTransactionManger,
			@Qualifier("productSyncDataTransactionManager")PlatformTransactionManager productTransactionManger,
			@Qualifier("salesSyncDataTransactionManager")PlatformTransactionManager salesTransactionManger,
			@Qualifier("storeSyncDataTransactionManager")PlatformTransactionManager storeTransactionManger,
			@Qualifier("userSyncDataTransactionManager")PlatformTransactionManager userTransactionManger) {
		return new ChainedTransactionManager(configTransactionManger,integrationTransactionManger,inventoryTransactionManger,locationTransactionManger,paymentTransactionManger,productTransactionManger,salesTransactionManger,storeTransactionManger,userTransactionManger);
	}
}
