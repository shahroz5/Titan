/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.config;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.titan.poss.core.config.BaseConfig;

@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@ConditionalOnMissingClass({ "com.titan.poss.MonolithicApplication" })
@EnableJpaRepositories(basePackages = {
		"com.titan.poss.inventory" }, entityManagerFactoryRef = "inventoryDataEntityManager", transactionManagerRef = "inventoryDataTransactionManager")

public class InventoryDBManager extends BaseConfig {

	@Bean("inventoryDataEntityManager")
	public LocalContainerEntityManagerFactoryBean inventoryDataEntityManager(Environment env) {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss", configInventoryDataSource(env));
	}

	@Bean
	public DataSource configInventoryDataSource(Environment env) {
		return getDataSource(env, "inventory.datasource", "InventoryDB");
	}

	@Bean
	public PlatformTransactionManager inventoryDataTransactionManager(Environment env) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(inventoryDataEntityManager(env).getObject());
		transactionManager.setNestedTransactionAllowed(true);
		transactionManager.setRollbackOnCommitFailure(true);
		return transactionManager;
	}

}
