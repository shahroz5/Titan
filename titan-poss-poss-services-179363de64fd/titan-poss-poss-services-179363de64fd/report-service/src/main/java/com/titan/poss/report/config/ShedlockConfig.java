/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import net.javacrumbs.shedlock.core.LockProvider;
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ShedlockConfig {

	/**
     * Returns LockProvider that is used by the ShedLock mechanism which ensures
     * that a scheduled job is run ONLY once at that particular time, even though
     * the particular scheduled job gets triggered multiple times at that same
     * particular time from multiple instances of the same application running on
     * multiple application servers.
     *
     * @param dataSource data source
     * @return lock provider
     */
    @Bean
    public LockProvider lockProvider(@Qualifier("reportDataSource") DataSource dataSource) {
	return new JdbcTemplateLockProvider(dataSource);
    }
}
