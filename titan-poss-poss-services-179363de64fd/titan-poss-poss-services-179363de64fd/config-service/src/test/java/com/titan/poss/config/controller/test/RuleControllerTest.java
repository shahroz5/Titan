/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.controller.test;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

import com.titan.poss.config.ConfigBase;
import com.titan.poss.config.dto.request.RuleLocationUpdateDto;
import com.titan.poss.config.dto.request.RuleMasterUpdateDto;
import com.titan.poss.config.dto.response.RuleMasterDto;
import com.titan.poss.config.dto.response.RuleProductDetailsDto;
import com.titan.poss.config.dto.response.RuleProductDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.test.AuthUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
public class RuleControllerTest extends ConfigBase {
	private static final String URI = "rule-types";

	private static HttpHeaders headers = new HttpHeaders();

	private static final String RESULTS = "results";

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	private JsonData setJsonData() {

		Object obj = MapperUtil
				.getJsonFromString("{\"type\":\"IBT_CONFIGURATIONS\",\"data\":{\"maxProductsPerStn\":55}}");
		JsonData jsonData = new JsonData();
		jsonData.setType("IBT_CONFIGURATIONS");
		jsonData.setData(obj);
		return jsonData;
	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,OK" })
	void testCreateConfiguration(String ruleType, String status) {

		RuleMasterDto configMasterDto = new RuleMasterDto();

		configMasterDto.setDescription("Testing Create Configuration");
		configMasterDto.setIsActive(true);
		configMasterDto.setRuleDetails(setJsonData());
		HttpEntity<RuleMasterDto> entity = new HttpEntity<>(configMasterDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + ruleType + "/rules"),
				HttpMethod.POST, entity, String.class);
		System.out.println("response.getStatusCode()" + response.getStatusCode() + response.getBody());

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,5,BAD_REQUEST", "IBT_CONFIGURATIONS,1,OK" })
	void testGetConfigs(String ruleType, Integer ruleId, String status) {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + ruleType + "/rules/" + ruleId), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,1,OK", "IBT_CONFIGURATIONS,5,BAD_REQUEST" })
	void testUpdateConfig(String ruleType, Integer ruleId, String status) {

		RuleMasterUpdateDto updateDto = new RuleMasterUpdateDto();
		updateDto.setRuleDetails(setJsonData());

		HttpEntity<RuleMasterUpdateDto> entity = new HttpEntity<>(updateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + ruleType + "/rules/" + ruleId), HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,1,BLR,OK" })
	void testConfigLocationMapping(String ruleType, Integer ruleId, String locCode, String status) {

		RuleLocationUpdateDto ruleLocDto = new RuleLocationUpdateDto();

		Set<String> addLocs = new HashSet<>();
		addLocs.add("BLR");

		Set<String> removeLocs = new HashSet<>();
		removeLocs.add(locCode);
		ruleLocDto.setAddLocations(addLocs);
		ruleLocDto.setRemoveLocations(removeLocs);
		Set<String> overwriteLocs = new HashSet<>();
		removeLocs.add(locCode);
		ruleLocDto.setOverwriteLocations(overwriteLocs);
		HttpEntity<RuleLocationUpdateDto> entity = new HttpEntity<>(ruleLocDto, headers);

		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + ruleType + "/rules/" + ruleId + "/locations"), HttpMethod.PATCH, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,1,OK" })
	void testMappedLocations(String ruleType, Integer ruleId, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + ruleType + "/rules/" + ruleId + "/mappedLocations"), HttpMethod.GET,
				entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,1,OK" })
	void testListConfigLocationMapping(String ruleType, Integer ruleId, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + ruleType + "/rules/" + ruleId + "/locations"), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,1,OK" })
	void testListConfigProductMapping(String ruleType, Integer ruleId, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + ruleType + "/rules/" + ruleId + "/productgroups"), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "IBT_CONFIGURATIONS,1,Diamond,Bangle,OK" })
	void testConfigProductMapping(String ruleType, Integer ruleId, String productGrpCode, String productCatCode,
			String status) {

		RuleProductDetailsDto ruleProductDto = new RuleProductDetailsDto();

		ruleProductDto.setRuleId(ruleId);
		ruleProductDto.setRuleType(ruleType);

		List<RuleProductDto> configList = new ArrayList<>();
		RuleProductDto productDto = new RuleProductDto();
		productDto.setProductCategoryCode(productCatCode);
		productDto.setProductGroupCode(productGrpCode);
		configList.add(productDto);
		ruleProductDto.setRules(configList);

		HttpEntity<RuleProductDetailsDto> entity = new HttpEntity<>(ruleProductDto, headers);

		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/" + ruleType + "/rules/" + ruleId + "/productgroups"), HttpMethod.PATCH,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void listRuleDetailsBasedOnFilters() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/IBT_CONFIGURATIONS/rules-details"), HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
