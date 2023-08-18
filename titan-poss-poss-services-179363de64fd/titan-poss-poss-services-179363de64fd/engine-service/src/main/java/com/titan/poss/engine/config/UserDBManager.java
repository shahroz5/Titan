/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.config;

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
@EnableJpaRepositories(basePackages = { "com.titan.poss.engine.user",
		"com.titan.poss.user" }, entityManagerFactoryRef = "userEngineDataEntityManager", transactionManagerRef = "userEngineDataTransactionManager")
public class UserDBManager extends BaseConfig {

	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean userEngineDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss.user", userEngineDataSource(env));
	}

	@Bean
	public DataSource userEngineDataSource(Environment env) {
		return getDataSource(env, "user.datasource", "UserDB");
	}

	@Bean
	public PlatformTransactionManager userEngineDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(userEngineDataEntityManager().getObject());
		return transactionManager;
	}
}
