/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.configuration;

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

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@ConditionalOnMissingClass({ "com.titan.poss.MonolithicApplication" })
@EnableJpaRepositories(basePackages = "com.titan.poss.config", entityManagerFactoryRef = "configSyncDataEntityManager", transactionManagerRef = "configSyncDataTransactionManager")
public class ConfigDBManger extends BaseConfig {
	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean configSyncDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss.config", configSyncDataSource(env));
	}

	@Bean
	public DataSource configSyncDataSource(Environment env) {
		return getDataSource(env, "config.datasource", "ConfigDB");
	}

	@Bean
	public PlatformTransactionManager configSyncDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(configSyncDataEntityManager().getObject());
		transactionManager.setNestedTransactionAllowed(true);
		transactionManager.setRollbackOnCommitFailure(true);
		return transactionManager;
	}
}
