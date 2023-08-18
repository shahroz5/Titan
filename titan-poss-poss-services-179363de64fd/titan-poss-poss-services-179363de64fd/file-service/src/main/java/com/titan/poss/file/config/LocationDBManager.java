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
		"com.titan.poss.location" }, entityManagerFactoryRef = "locationDataEntityManager", transactionManagerRef = "locationDataTransactionManager")

public class LocationDBManager extends BaseConfig {

	@Bean("locationDataEntityManager")
	public LocalContainerEntityManagerFactoryBean locationDataEntityManager(Environment env) {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss", configLocationDataSource(env));
	}

	@Bean
	public DataSource configLocationDataSource(Environment env) {
		return getDataSource(env, "location.datasource", "LocationDB");
	}

	@Bean
	public PlatformTransactionManager locationDataTransactionManager(Environment env) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(locationDataEntityManager(env).getObject());
		return transactionManager;
	}

}
