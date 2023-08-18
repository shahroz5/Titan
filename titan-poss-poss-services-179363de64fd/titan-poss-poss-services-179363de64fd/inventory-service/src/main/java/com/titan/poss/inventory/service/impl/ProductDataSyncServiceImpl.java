/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service.impl;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Service;

import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.inventory.service.ProductDataSyncService;
import com.titan.poss.product.dao.SyncStaging;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class ProductDataSyncServiceImpl implements ProductDataSyncService {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	private static final Logger LOGGER = LoggerFactory.getLogger(ProductDataSyncServiceImpl.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void publishProductMessagesToQueue(SyncStagingDto data, String tableName) {		
		if (isEnabled) {
			try {
				data.getMessageRequest().setSource(CommonUtil.getLocationCode());
				LOGGER.info("Publishing ");
				Response response = dataSyncServiceClient.publish(data.getMessageRequest());
				LOGGER.info("Published response : {} ", response);
				if (response.status() == 200) {
					deleteSyncStaging(data.getId(), tableName);
					LOGGER.info("Published : {} ", data.getMessageRequest());
				}
			} catch (Exception e) {
				log.error(EXCEPTION, e);
			}
		}
	}

	private void deleteSyncStaging(String id, String tableName) {
		SqlParameterSource parameters = new MapSqlParameterSource().addValue("id", id);
		String sql = "DELETE from " + tableName + " where id =:id";
		namedParameterJdbcTemplate.update(sql, parameters);
	}

	public String saveSyncStaging(SyncStaging syncStaging, String tableName) {
		UUID uuid = UUID.randomUUID();
		SqlParameterSource parameters = new MapSqlParameterSource().addValue("message", syncStaging.getMessage())
				.addValue("status", syncStaging.getStatus()).addValue("id", uuid.toString());
		String sql = "INSERT into "+ tableName + " (message, status, id) values (:message, :status, :id)";
		namedParameterJdbcTemplate.update(sql, parameters);
		return uuid.toString();
	}

}
