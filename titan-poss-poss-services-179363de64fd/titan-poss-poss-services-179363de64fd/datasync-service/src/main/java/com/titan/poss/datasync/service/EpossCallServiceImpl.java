/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.inventory.dao.BinDao;
import com.titan.poss.inventory.dao.BinGroupDao;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.BinGroupRepository;
import com.titan.poss.inventory.repository.BinRepository;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.repository.ComplexityRepository;
import com.titan.poss.product.repository.ItemRepository;
import com.titan.poss.product.repository.ProductCategoryRepository;
import com.titan.poss.product.repository.ProductGroupRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
public class EpossCallServiceImpl implements EpossCallService {

	@Autowired
	private VendorRepository vendorRepository;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private AuthService authService;

	@Autowired
	private ItemRepository itemRepository;

	@Autowired
	private ComplexityRepository complexityRepository;

	@Autowired
	private ProductCategoryRepository productCategoryRepository;

	@Autowired
	private ProductGroupRepository productGroupRepository;

	@Autowired
	private BinRepository binRepository;

	@Autowired
	private BinGroupRepository binGroupRepository;

	private static final String USER_NAME = "username";
	private static final String PSWD = "password";
	private static final String TOKEN = "token";

	@Override
	public ApiResponseDto getTheEPOSSData(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParams,
			Object reqBody) {

		String authorizationToken = getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());

		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(httpMethod);
		epossApiReqDto.setRelativeUrl(relativeUrl);
		epossApiReqDto.setRequestParams(requestParams);
		epossApiReqDto.setReqBody(reqBody);
		ApiResponseDto epossApiResponseDto = integrationServiceClient
				.callEpossAPIWHeader("Bearer " + authorizationToken, epossApiReqDto);

		if (epossApiResponseDto.getHttpResponseCode() != HttpStatus.OK.value()) {
			throw new ServiceException(JsonUtils.getValueFromJsonString(epossApiResponseDto.getResponse(), "message"),
					JsonUtils.getValueFromJsonString(epossApiResponseDto.getResponse(), "code"),
					JsonUtils.getValueFromJsonString(epossApiResponseDto.getResponse(), "errorCause"));
		}
		return epossApiResponseDto;
	}

	@Override
	public String getAuthHeaderToken(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(VendorCodeEnum.POSS_TITAN.name());
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
			log.info("new token is required. So, calling auth-service to fetch token");
			OAuthToken oauthToken = null;
			oauthToken = authService.getAuthToken(userName, password);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();
			// save the updated token, expire time
			JsonData jsonData = TokenValidatorUtil.updateApiUserToken(vendor.getVendorDetails(), token, exp);
			vendor.setVendorDetails(MapperUtil.getJsonString(jsonData));
			vendorRepo.save(vendor);
		}
		return token;
	}

	/**
	 * @param vendor
	 * @return
	 */
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
			userName = map.get(USER_NAME);
			password = map.get(PSWD);
			token = map.get(TOKEN);
			exp = map.get("exp");
			if (StringUtils.isBlank(userName))
				missingFields.add(USER_NAME);
			if (StringUtils.isBlank(password))
				missingFields.add(PSWD);
		} else {
			missingFields = List.of(USER_NAME, PSWD);
		}
		if (!missingFields.isEmpty()) {
			throw new ServiceException("Credentials missing for API call to EPOSS.", "ERR-INT-024", missingFields);
		}
		return new ArrayList<>(Arrays.asList(userName, password, token, exp));
	}

	@Override
	public void getInventoryDependencyAndSave(InventoryDetailsDao inventory) {
		ItemDao itemDao = itemRepository.findOneByItemCode(inventory.getItemCode());
		if (itemDao == null) {
			String currencyUrl = "api/product/v2/items/datasync/" + inventory.getItemCode();
			ApiResponseDto epossApiResponseDto = getTheEPOSSData(HttpMethod.GET, currencyUrl, null, null);
			itemDao = MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
					ItemDao.class);
			getComplexityAndSave(itemDao.getComplexity().getComplexityCode());
			getProductGroupAndSave(itemDao.getProductGroup().getProductGroupCode());
			getProductCategoryAndSave(itemDao.getProductCategory().getProductCategoryCode());
			itemRepository.save(itemDao);
		}
		getBinAndSave(inventory.getBinCode(), inventory.getBinGroupCode());
	}

	/**
	 * @param binCode
	 */
	private void getBinAndSave(String binCode, String binGroup) {
		BinDao binDao = binRepository.findOneByBinCodeAndBinGroupBinGroupCode(binCode, binGroup);
		if (binDao == null) {
			String binUrl = "api/inventory/v2/bins/datasync/" + binCode;
			Map<String, String> reqParams = Map.of("binGroup", binGroup);
			ApiResponseDto epossApiResponseDto = getTheEPOSSData(HttpMethod.GET, binUrl, reqParams, null);
			BinDao bin = MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
					BinDao.class);
			BinGroupDao binGroupDao = binGroupRepository.findOneByBinGroupCode(bin.getBinGroup().getBinGroupCode());
			if (binGroupDao == null) {
				String binGroupUrl = "api/inventory/v2/bingroups/datasync/" + bin.getBinGroup().getBinGroupCode();
				ApiResponseDto epossApiResponse = getTheEPOSSData(HttpMethod.GET, binGroupUrl, null, null);
				binGroupDao = MapperUtil.getObjectMapperInstance().convertValue(epossApiResponse.getResponse(),
						BinGroupDao.class);
				binGroupRepository.save(binGroupDao);
			}
			binRepository.save(bin);
		}
	}

	@Override
	public void getComplexityAndSave(String complexityCode) {
		ComplexityDao complexityDao = complexityRepository.findOneByComplexityCode(complexityCode);
		if (complexityDao == null) {
			String complexityUrl = "api/product/v2/complexities/datasync/" + complexityCode;
			ApiResponseDto epossApiResponseDto = getTheEPOSSData(HttpMethod.GET, complexityUrl, null, null);
			ComplexityDao complexity = MapperUtil.getObjectMapperInstance()
					.convertValue(epossApiResponseDto.getResponse(), ComplexityDao.class);
			complexityRepository.save(complexity);
		}
	}

	@Override
	public void getProductGroupAndSave(String productGroupCode) {
		ProductGroupDao productGroupDao = productGroupRepository.findOneByProductGroupCode(productGroupCode);
		if (productGroupDao == null) {
			String productGroupUrl = "api/product/v2/product-groups/datasync/" + productGroupCode;
			ApiResponseDto epossApiResponseDto = getTheEPOSSData(HttpMethod.GET, productGroupUrl, null, null);
			ProductGroupDao productGroup = MapperUtil.getObjectMapperInstance()
					.convertValue(epossApiResponseDto.getResponse(), ProductGroupDao.class);
			productGroupRepository.save(productGroup);
		}
	}

	@Override
	public void getProductCategoryAndSave(String productCategoryCode) {
		ProductCategoryDao productCategoryDao = productCategoryRepository
				.findOneByProductCategoryCode(productCategoryCode);
		if (productCategoryDao == null) {
			String productCategoryUrl = "api/product/v2/product-categories/datasync/" + productCategoryCode;
			ApiResponseDto epossApiResponseDto = getTheEPOSSData(HttpMethod.GET, productCategoryUrl, null, null);
			ProductCategoryDao productCategory = MapperUtil.getObjectMapperInstance()
					.convertValue(epossApiResponseDto.getResponse(), ProductCategoryDao.class);
			productCategoryRepository.save(productCategory);
		}
	}

}
