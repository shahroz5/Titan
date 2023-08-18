/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.UUID;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.file.service.DataSyncService;
import com.titan.poss.file.service.EpossTokenService;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;
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
public class DataSyncServiceImpl implements DataSyncService {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private EpossTokenService epossTokenService;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	private String authorizationToken;

	private static final String EXCEPTION = "exception : ";

	@Override
	public void publishProductMessagesToQueue(SyncStagingDto data, String tableName) {
		if (isEnabled) {
			try {
				if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
						|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {
					authorizationToken = getToken();
				}

				Response response = dataSyncServiceClient.publishWithToken("Bearer " + authorizationToken,
						data.getMessageRequest());
				if (response.status() == 200) {
					deleteSyncStaging(data.getId(), tableName);
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

	private String getToken() {
		VendorDao vendor = vendorRepository.findByVendorCode(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = epossTokenService.getAuthHeaderToken(vendor);
		return authorizationToken;
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
