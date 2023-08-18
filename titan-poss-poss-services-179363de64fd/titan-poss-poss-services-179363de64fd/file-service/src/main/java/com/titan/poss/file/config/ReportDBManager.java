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
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@ConditionalOnMissingClass({ "com.titan.poss.MonolithicApplication" })
@EnableJpaRepositories(basePackages = "com.titan.poss.report", entityManagerFactoryRef = "reportDataEntityManager", transactionManagerRef = "reportDataTransactionManager")
public class ReportDBManager extends BaseConfig {

	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean reportDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss", reportDataSource(env));
	}

	@Bean("reportDataSource")
	public DataSource reportDataSource(Environment env) {
		HikariConfig hikariConfig = new HikariConfig();
		hikariConfig.setPoolName("ReportDB");
		hikariConfig.setDriverClassName(env.getProperty("spring.datasource.driverClassName"));
		hikariConfig.setJdbcUrl(env.getProperty("spring.reports.datasource.url"));
		hikariConfig.setUsername(env.getProperty("spring.reports.datasource.username"));
		hikariConfig.setPassword(env.getProperty("spring.reports.datasource.password"));
		return new HikariDataSource(hikariConfig);
	}

	@Bean
	public PlatformTransactionManager reportDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(reportDataEntityManager().getObject());
		return transactionManager;
	}
}
