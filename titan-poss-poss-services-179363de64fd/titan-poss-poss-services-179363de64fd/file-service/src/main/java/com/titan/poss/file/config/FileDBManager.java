/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.config;

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
@EnableJpaRepositories(basePackages = { "com.titan.poss.file.dao",
		"com.titan.poss.file.repository" }, entityManagerFactoryRef = "fileDataEntityManager", transactionManagerRef = "fileDataTransactionManager")

public class FileDBManager extends BaseConfig {

	@Bean("fileDataEntityManager")
	@Primary
	public LocalContainerEntityManagerFactoryBean fileDataEntityManager(Environment env) {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss", configFileDataSource(env));
	}

	@Bean
	@Primary
	public DataSource configFileDataSource(Environment env) {
		return getDataSource(env, "datasource", "FileDB");
	}

	@Bean
	@Primary
	public PlatformTransactionManager fileDataTransactionManager(Environment env) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(fileDataEntityManager(env).getObject());
		return transactionManager;
	}

}
