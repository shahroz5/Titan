/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config;

import javax.sql.DataSource;

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
@EnableJpaRepositories(basePackages = { "com.titan.poss.store",
		"com.titan.poss.engine.store" }, entityManagerFactoryRef = "storeDataEntityManager", transactionManagerRef = "storeDataTransactionManager")
public class StoreDataConfig extends BaseConfig {

	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean storeDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss", storeDataSource(env));
	}

	@Bean
	public DataSource storeDataSource(Environment env) {
		return getDataSource(env, "store-datasource", "StoreDB");
	}

	@Bean
	public PlatformTransactionManager storeDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(storeDataEntityManager().getObject());
		return transactionManager;
	}

}