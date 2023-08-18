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
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@ConditionalOnMissingClass({ "com.titan.poss.MonolithicApplication" })
@EnableJpaRepositories(basePackages = "com.titan.poss.location", entityManagerFactoryRef = "locationSyncDataEntityManager", transactionManagerRef = "locationSyncDataTransactionManager")
public class LocationDBManager extends BaseConfig {

	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean locationSyncDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss.location", locationSyncDataSource(env));
	}

	@Bean
	public DataSource locationSyncDataSource(Environment env) {
		return getDataSource(env, "locations.datasource", "LocationDB");
	}

	@Bean
	public PlatformTransactionManager locationSyncDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(locationSyncDataEntityManager().getObject());
		transactionManager.setNestedTransactionAllowed(true);
		transactionManager.setRollbackOnCommitFailure(true);
		return transactionManager;
	}

}