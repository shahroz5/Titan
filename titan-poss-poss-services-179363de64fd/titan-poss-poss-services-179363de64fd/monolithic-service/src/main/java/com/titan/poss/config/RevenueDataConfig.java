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
@EnableJpaRepositories(basePackages = {
		"com.titan.poss.revenue" }, entityManagerFactoryRef = "revenueDataEntityManager", transactionManagerRef = "revenueDataTransactionManager")
public class RevenueDataConfig extends BaseConfig {

	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean revenueDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss.revenue", inventoryDataSource(env));
	}

	@Bean
	public DataSource inventoryDataSource(Environment env) {
		return getDataSource(env, "revenue-datasource", "RevenueDB");
	}

	@Bean
	public PlatformTransactionManager revenueDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(revenueDataEntityManager().getObject());
		return transactionManager;
	}

}
