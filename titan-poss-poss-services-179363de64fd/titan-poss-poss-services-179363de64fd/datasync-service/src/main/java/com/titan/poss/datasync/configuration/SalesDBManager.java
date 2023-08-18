package com.titan.poss.datasync.configuration;

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
@EnableJpaRepositories(basePackages = "com.titan.poss.sales", entityManagerFactoryRef = "salesSyncDataEntityManager", transactionManagerRef = "salesSyncDataTransactionManager")
public class SalesDBManager extends BaseConfig{
	private Environment env;

	@Bean
	public LocalContainerEntityManagerFactoryBean salesSyncDataEntityManager() {
		LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
		return getDataEntityManager(entityManagerFactory, "com.titan.poss.sales", salesSyncDataSource(env));
	}

	@Bean
	public DataSource salesSyncDataSource(Environment env) {
		return getDataSource(env, "sales.datasource", "SalesDB");
	}

	@Bean
	public PlatformTransactionManager salesSyncDataTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(salesSyncDataEntityManager().getObject());
		transactionManager.setNestedTransactionAllowed(true);
		transactionManager.setRollbackOnCommitFailure(true);
		return transactionManager;
	}
}
