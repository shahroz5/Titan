/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.configuration;

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

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@ConditionalOnMissingClass({ "com.titan.poss.MonolithicApplication" })
@EnableJpaRepositories(basePackages = "com.titan.poss.user", entityManagerFactoryRef = "userServiceEntityManager", transactionManagerRef = "userServiceTransactionManager")
public class UserDBManager extends BaseConfig {
	private Environment env;

	@Bean
	@Primary
	public LocalContainerEntityManagerFactoryBean userServiceEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss.user", userServiceSource(env));
	}

	@Bean
	@Primary
	public DataSource userServiceSource(Environment env) {
		return getDataSource(env, "users.datasource", "UserDB");
	}

	@Bean
	@Primary
	public PlatformTransactionManager userServiceTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(userServiceEntityManager().getObject());
		return transactionManager;
	}

}
