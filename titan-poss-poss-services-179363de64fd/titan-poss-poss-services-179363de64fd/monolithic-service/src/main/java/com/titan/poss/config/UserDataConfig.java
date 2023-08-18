/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config;

import javax.sql.DataSource;

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

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@EnableJpaRepositories(basePackages = { "com.titan.poss.auth", "com.titan.poss.user",
		"com.titan.poss.engine.user" }, entityManagerFactoryRef = "userDataEntityManager", transactionManagerRef = "userDataTransactionManager")
public class UserDataConfig extends BaseConfig {

	private Environment env;

	@Primary
	@Bean
	public LocalContainerEntityManagerFactoryBean userDataEntityManager() {
		String[] userEntityPackages = { "com.titan.poss.user", "com.titan.poss.auth", "com.titan.poss.engine.user" };
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManagerForMultipleEntities(entityManagerFactory, userEntityPackages, userDataSource(env));
	}

	@Primary
	@Bean
	public DataSource userDataSource(Environment env) {
		return getDataSource(env, "user-datasource", "UserDB");
	}

	@Primary
	@Bean
	public PlatformTransactionManager userDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(userDataEntityManager().getObject());
		return transactionManager;
	}

}