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
 * @author  Mindtree Ltd.
 * @version 1.0 
 */
@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@EnableJpaRepositories(basePackages = { "com.titan.poss.location",
		"com.titan.poss.engine.location" }, entityManagerFactoryRef = "locationMonolithicDataEntityManager", transactionManagerRef = "locationMonolithicDataTransactionManager")
public class LocationDataConfig extends BaseConfig {

	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean locationMonolithicDataEntityManager() {
		String[] locationeEntityPackage = { "com.titan.poss" };
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManagerForMultipleEntities(entityManagerFactory, locationeEntityPackage,
				locationDataSource(env));
	}

	@Bean
	public DataSource locationDataSource(Environment env) {
		return getDataSource(env, "location-datasource", "LocationDB");
	}

	@Bean
	public PlatformTransactionManager locationMonolithicDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(locationMonolithicDataEntityManager().getObject());
		return transactionManager;
	}

}