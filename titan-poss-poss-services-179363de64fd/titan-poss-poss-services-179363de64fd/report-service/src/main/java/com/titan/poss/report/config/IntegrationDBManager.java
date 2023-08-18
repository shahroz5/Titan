/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.config;

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
@EnableJpaRepositories(basePackages = {
		"com.titan.poss.integration" }, entityManagerFactoryRef = "integrationDataEntityManager", transactionManagerRef = "integrationDataTransactionManager")

public class IntegrationDBManager extends BaseConfig {

	@Bean("integrationDataEntityManager")
	public LocalContainerEntityManagerFactoryBean integrationDataEntityManager(Environment env) {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss", configIntgDataSource(env));
	}

	@Bean
	public DataSource configIntgDataSource(Environment env) {
		HikariConfig hikariConfig = new HikariConfig();
		hikariConfig.setPoolName("IntegrationDB");
		hikariConfig.setDriverClassName(env.getProperty("spring.datasource.driverClassName"));
		hikariConfig.setJdbcUrl(env.getProperty("spring.integration.datasource.url"));
		hikariConfig.setUsername(env.getProperty("spring.integration.datasource.username"));
		hikariConfig.setPassword(env.getProperty("spring.integration.datasource.password"));
		return new HikariDataSource(hikariConfig);
	}

	@Bean
	public PlatformTransactionManager integrationDataTransactionManager(Environment env) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(integrationDataEntityManager(env).getObject());
		return transactionManager;
	}

}
