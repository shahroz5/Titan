/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.config;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.core.env.Environment;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public abstract class BaseConfig {

	protected DataSource getDataSource(Environment env, String dataSourceName, String poolName) {
		HikariConfig hikariConfig = new HikariConfig();
		hikariConfig.setPoolName(poolName);
		hikariConfig.setDriverClassName(env.getProperty("spring.datasource.driverClassName"));
		hikariConfig.setJdbcUrl(env.getProperty("spring." + dataSourceName + ".url"));
		hikariConfig.setUsername(env.getProperty("spring.datasource.username"));
		hikariConfig.setPassword(env.getProperty("spring.datasource.password"));
		// hikariConfig.setAutoCommit(false);
		hikariConfig.setMaximumPoolSize(50);
		hikariConfig.setConnectionTimeout(180000);
		return new HikariDataSource(hikariConfig);
	}

	protected Map<String, Object> jpaProperties() {
		HashMap<String, Object> jpaProperties = new HashMap<>();
		jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.SQLServer2012Dialect");
		return jpaProperties;
	}

	protected LocalContainerEntityManagerFactoryBean getDataEntityManager(
			LocalContainerEntityManagerFactoryBean entityManagerFactory, String scanPackage, DataSource dataSource) {
		entityManagerFactory.setDataSource(dataSource);
		entityManagerFactory.setPackagesToScan(scanPackage);
		entityManagerFactory.setJpaPropertyMap(jpaProperties());
		entityManagerFactory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
		return entityManagerFactory;
	}

	protected LocalContainerEntityManagerFactoryBean getDataEntityManagerForMultipleEntities(
			LocalContainerEntityManagerFactoryBean entityManagerFactory, String[] scanPackages, DataSource dataSource) {
		entityManagerFactory.setDataSource(dataSource);
		entityManagerFactory.setPackagesToScan(scanPackages);
		entityManagerFactory.setJpaPropertyMap(jpaProperties());
		entityManagerFactory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
		return entityManagerFactory;
	}
}
