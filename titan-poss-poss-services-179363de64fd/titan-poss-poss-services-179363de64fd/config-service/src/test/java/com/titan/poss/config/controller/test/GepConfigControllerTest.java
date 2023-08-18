///*  Copyright 2019. Titan Company Limited
//*  All rights reserved.
//*/
//package com.titan.poss.config.controller.test;
//
//import static org.junit.jupiter.api.Assertions.assertTrue;
//
//import java.math.BigDecimal;
//import java.util.Date;
//import java.util.HashSet;
//import java.util.Set;
//
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.junit.jupiter.params.ParameterizedTest;
//import org.junit.jupiter.params.provider.CsvSource;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.web.client.RestTemplate;
//
//import com.titan.poss.config.ConfigBase;
//import com.titan.poss.config.dto.AddRangeDto;
//import com.titan.poss.config.dto.BaseGepConfigDetailsDto;
//import com.titan.poss.config.dto.GepConfigItemDto;
//import com.titan.poss.config.dto.request.ExchangeConfigProductGroupMappingRequestDto;
//import com.titan.poss.config.dto.request.ExchangeUpdateConfigDto;
//import com.titan.poss.config.dto.request.GepConfigDetailsRequestDto;
//import com.titan.poss.config.dto.request.GepConfigItemMappingRequestDto;
//import com.titan.poss.config.dto.request.GepConfigLocationsRequestDto;
//import com.titan.poss.config.dto.request.GepConfigProductGroupMappingRequestDto;
//import com.titan.poss.core.utils.test.AuthUtil;
//
///**
// * @author Mindtree Ltd.
// * @version 2.0
// */
//@ExtendWith(SpringExtension.class)
//public class GepConfigControllerTest extends ConfigBase {
//
//	private static final String URI = "gep-configs";
//
//	private static final String SEPARATOR = "/";
//
//	private static HttpHeaders headers = new HttpHeaders();
//
//	@BeforeAll
//	public static void initAuthUser() {
//		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "Welcome123"));
//	}
//
//	@Test
//	void testGetGepConfigList() {
//		HttpEntity<String> entity = new HttpEntity<>(null, headers);
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "?isPageable=true"),
//				HttpMethod.GET, entity, String.class);
//
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testGetGepConfig(String configId, String status) {
//		HttpEntity<String> entity = new HttpEntity<>(null, headers);
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + SEPARATOR + configId),
//				HttpMethod.GET, entity, String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@Test
//	void testCreateGepConfig() {
//		ExchangeUpdateConfigDto gepConfigRequestDto = new ExchangeUpdateConfigDto();
//		gepConfigRequestDto.setDescription("test");
//		gepConfigRequestDto.setIsActive(true);
//		gepConfigRequestDto.setIsOfferEnabled(true);
//		HttpEntity<ExchangeUpdateConfigDto> entity = new HttpEntity<>(gepConfigRequestDto, headers);
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testUpdateGepConfig(String configId, String status) {
//		ExchangeUpdateConfigDto gepConfigRequestDto = new ExchangeUpdateConfigDto();
//		gepConfigRequestDto.setDescription("test");
//		gepConfigRequestDto.setIsActive(false);
//		gepConfigRequestDto.setIsOfferEnabled(true);
//		HttpEntity<ExchangeUpdateConfigDto> entity = new HttpEntity<>(gepConfigRequestDto, headers);
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + SEPARATOR + configId),
//				HttpMethod.PATCH, entity, String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testgetGepConfigDetails(String configId, String status) {
//		HttpEntity<String> entity = new HttpEntity<>(null, headers);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + SEPARATOR + "details"), HttpMethod.GET, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testAddGepDetails(String configId, String status) {
//		GepConfigDetailsRequestDto gepConfigDetailsRequestDto = new GepConfigDetailsRequestDto();
//		Set<BaseGepConfigDetailsDto> addLocationSet = new HashSet<>();
//		BaseGepConfigDetailsDto baseLocation = new BaseGepConfigDetailsDto();
//		baseLocation.setDeductionPercent(new BigDecimal(30));
//		baseLocation.setEndDate(new Date());
//		baseLocation.setItemType("J");
//		baseLocation.setMetalType("GOLD");
//		baseLocation.setRangeId("54830379-C479-4167-89E0-0DD9EAA16F4B");
//		baseLocation.setSchemePercent(new BigDecimal(30));
//		baseLocation.setStartDate(new Date());
//		addLocationSet.add(baseLocation);
//		gepConfigDetailsRequestDto.setAddConfigDetails(addLocationSet);
//		HttpEntity<GepConfigDetailsRequestDto> entity = new HttpEntity<>(gepConfigDetailsRequestDto, headers);
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + SEPARATOR + "details"), HttpMethod.POST, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testGetLocationsMapping(String configId, String status) {
//		HttpEntity<String> entity = new HttpEntity<>(null, headers);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + SEPARATOR + "locations"), HttpMethod.GET, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testUpdateLocationsMapping(String configId, String status) {
//		GepConfigLocationsRequestDto gepConfigLocationsDto = new GepConfigLocationsRequestDto();
//		Set<String> addLocation = new HashSet<>();
//		addLocation.add("HNR");
//		gepConfigLocationsDto.setAddLocations(addLocation);
//		HttpEntity<GepConfigLocationsRequestDto> entity = new HttpEntity<>(gepConfigLocationsDto, headers);
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + SEPARATOR + "locations"), HttpMethod.PATCH, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testGetProductGroupsMapping(String configId, String status) {
//		HttpEntity<String> entity = new HttpEntity<>(null, headers);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + SEPARATOR + "product-groups"), HttpMethod.GET, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testUpdateProductGroupsMapping(String configId, String status) {
//		ExchangeConfigProductGroupMappingRequestDto gepConfigProductGroupMappingRequestDto = new ExchangeConfigProductGroupMappingRequestDto();
//		Set<String> addProductGroup = new HashSet<>();
//		Set<AddRangeDto> addRangeSet = new HashSet<>();
//		addProductGroup.add("75");
//		gepConfigProductGroupMappingRequestDto.setAddProductGroups(addProductGroup);
//		AddRangeDto addRange = new AddRangeDto();
//		addRange.setPercentValue(new BigDecimal(45));
//		addRange.setRangeId("54830379-C479-4167-89E0-0DD9EAA16F4B");
//		addRangeSet.add(addRange);
//		gepConfigProductGroupMappingRequestDto.setAddRanges(addRangeSet);
//		HttpEntity<GepConfigProductGroupMappingRequestDto> entity = new HttpEntity<>(
//				gepConfigProductGroupMappingRequestDto, headers);
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + SEPARATOR + "product-groups"), HttpMethod.PATCH, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testGetItemThemeMapping(String configId, String status) {
//		HttpEntity<String> entity = new HttpEntity<>(null, headers);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + "?isThemeEnabled=false&isPageable=true"), HttpMethod.GET,
//				entity, String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@ParameterizedTest
//	@CsvSource({ "421F47BD-95D9-4E31-ACD9-FA140735CD6A,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testUpdateItemThemeMapping(String configId, String status) {
//		GepConfigItemMappingRequestDto getItemConfig = new GepConfigItemMappingRequestDto();
//		Set<GepConfigItemDto> itemThemeSet = new HashSet<>();
//		GepConfigItemDto gepItemTheme = new GepConfigItemDto();
//		gepItemTheme.setIsExcluded(true);
////		gepItemTheme.setItemCode("5097321AAA4A11");
////		gepItemTheme.setThemeCode(null);
//		itemThemeSet.add(gepItemTheme);
////		getItemConfig.setAddItemDetails(itemThemeSet);
//		HttpEntity<GepConfigItemMappingRequestDto> entity = new HttpEntity<>(getItemConfig, headers);
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + configId + SEPARATOR + "product-groups"), HttpMethod.PATCH, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//}
