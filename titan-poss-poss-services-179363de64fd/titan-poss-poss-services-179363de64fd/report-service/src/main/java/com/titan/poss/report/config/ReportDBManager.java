/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.config;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
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
@EnableJpaRepositories(basePackages = "com.titan.poss.report", entityManagerFactoryRef = "reportDataEntityManager", transactionManagerRef = "reportDataTransactionManager")
public class ReportDBManager extends BaseConfig {

	private Environment env;

	@Primary
	@Bean
	public LocalContainerEntityManagerFactoryBean reportDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss", reportDataSource(env));
	}
	
	@Primary
	@Bean("reportDataSource")
	public DataSource reportDataSource(Environment env) {
		return getDataSource(env, "datasource", "ReportDB");
	}

	@Primary
	@Bean
	public PlatformTransactionManager reportDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(reportDataEntityManager().getObject());
		return transactionManager;
	}
}
