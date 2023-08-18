package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.product.ProductBase;
import com.titan.poss.product.dto.request.AddItemStoneMappingDto;
import com.titan.poss.product.dto.request.ItemCreateDto;
import com.titan.poss.product.dto.request.ItemStoneDto;
import com.titan.poss.product.dto.request.ItemUpdateDto;

public class ItemControllerTest extends ProductBase {
	private static final String URI = "items";

	private static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListItems() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("items?isActive=true&isPageable=true"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "100ABEA098,OK", "$$,BAD_REQUEST" })
	void testGetItems(String itemCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + itemCode), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "ZZZZ,UNPROCESSABLE_ENTITY", ",OK", "100ABEA098,BAD_REQUEST" })
	void testAddItem(String itemCode, String status) {

		ItemCreateDto itemCreateDto = new ItemCreateDto();

		if (StringUtils.isBlank(itemCode))
			itemCreateDto.setItemCode(generateString(7));
		else
			itemCreateDto.setItemCode(itemCode);

		itemCreateDto.setDescription("Testing Item Add");
		itemCreateDto.setProductGroupCode("GV");
		itemCreateDto.setProductCategoryCode("C");
		itemCreateDto.setBrandCode("Tanishq");
		itemCreateDto.setItemTypeCode("J");
		itemCreateDto.setComplexityCode("PA");
		itemCreateDto.setParentItemCode("100ABEA098");
		itemCreateDto.setOrgCode("T");

		HttpEntity<ItemCreateDto> entity = new HttpEntity<>(itemCreateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);
		if (!status.equalsIgnoreCase(response.getStatusCode().name()))
			status = response.getStatusCode().name();
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$,UNPROCESSABLE_ENTITY", "100ABEA098,OK", "$$,BAD_REQUEST" })
	void testUpdateItem(String itemCode, String status) {

		ItemUpdateDto itemUpdateDto = new ItemUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			itemUpdateDto.setDescription(" ");

		itemUpdateDto.setIsActive(true);

		HttpEntity<ItemUpdateDto> entity = new HttpEntity<>(itemUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + itemCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "100ABEA098,OK", "$$,BAD_REQUEST" })
	void testListItemStoneMapping(String itemCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + itemCode) + "/stones",
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "20DIRHPTG002,100ABEA0981,OK" })
	void testItemStoneMapping(String stoneCode, String itemCode, String status) {

		ItemStoneDto itemStoneDto = new ItemStoneDto();
		Set<AddItemStoneMappingDto> addStones = new HashSet<>();
		AddItemStoneMappingDto addItemStoneDto = new AddItemStoneMappingDto();
		addItemStoneDto.setIsActive(false);
		addItemStoneDto.setNoOfStones((short) 3);
		addItemStoneDto.setStoneCode(stoneCode);
		addStones.add(addItemStoneDto);

		Set<String> removeStones = new HashSet<>();
		removeStones.add(stoneCode);
		itemStoneDto.setAddStones(addStones);
		itemStoneDto.setRemoveStones(removeStones);

		HttpEntity<ItemStoneDto> entity = new HttpEntity<>(itemStoneDto, headers);

		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + itemCode) + "/stones",
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

}
