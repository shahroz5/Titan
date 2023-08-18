/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.FileServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.report.service.AuthService;
import com.titan.poss.report.service.ReportDecryptService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class ReportDecryptServiceImpl implements ReportDecryptService {

	@Autowired
	private FileServiceClient fileServiceClient;

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private VendorRepository vendorRepository;
	
	@Autowired
	private AuthService authService;
	
	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Override
	public void decryptReport(String sql, String reportId, String authorizationHeader, String authorizationCookie) {
		LaunchJobRequest jobRequest = new LaunchJobRequest();
		jobRequest.setJobName(FileIntegrationConstants.REPORT_DECRYPT_JOB);
		Map<String, String> jobParams = new HashMap<>();
		jobParams.put("sql", sql);
		jobParams.put("reportId", reportId);
		jobRequest.setJobParams(jobParams);
		
		if (StringUtils.isEmpty(authorizationHeader)) {
			authorizationHeader = "Bearer " + getToken();
		}
		
		fileServiceClient.runAJob(authorizationHeader, authorizationCookie, jobRequest);
	}

	@Override
	public void deleteCustomerTemp(String reportId) {
		String deleteSql = "DELETE from customer_master_temp where report_id ='" + reportId + "'";
		jdbcTemplate.execute(deleteSql);
	}

	private String getToken() {
		VendorDao vendor = vendorRepository.findByVendorCode(VendorCodeEnum.POSS_TITAN.toString());
		return getAuthHeaderToken(vendor);
	}
	
	public String getAuthHeaderToken(VendorDao vendor) {
		List<String> credentials = verifyConfigDetails(vendor);
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);
		boolean isNewTokenReq = false;

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			OAuthToken oauthToken = null;
			oauthToken = authService.getAuthToken(userName, password);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();

			// save the updated token, expire time
			JsonData jsonData = TokenValidatorUtil.updateApiUserToken(vendor.getVendorDetails(), token, exp);
			vendor.setVendorDetails(MapperUtil.getJsonString(jsonData));
			
			vendorRepository.save(vendor);
		}
		return token;
	}
	
	private List<String> verifyConfigDetails(VendorDao vendor) {
		String configDetailStr = vendor.getVendorDetails();
		String userName = null;
		String password = null;
		String token = null;
		String exp = null;
		List<String> missingFields = new ArrayList<>();
		if (!StringUtils.isBlank(configDetailStr)) {
			// free space for new password & check last n password to not to match
			Map<String, String> map = TokenValidatorUtil.getMapFromJsonStr(configDetailStr);
			userName = map.get(CommonConstants.USER_NAME);
			password = map.get(CommonConstants.PSWD);
			token = map.get(CommonConstants.TOKEN);
			exp = map.get("exp");
			if (StringUtils.isBlank(userName))
				missingFields.add(CommonConstants.USER_NAME);
			if (StringUtils.isBlank(password))
				missingFields.add(CommonConstants.PSWD);
		} else {
			missingFields = List.of(CommonConstants.USER_NAME, CommonConstants.PSWD);
		}
		if (!missingFields.isEmpty()) {
			throw new ServiceException("Credentials missing for API call to EPOSS.", "ERR-INT-024", missingFields);
		}
		return new ArrayList<>(Arrays.asList(userName, password, token, exp));
	}

}
