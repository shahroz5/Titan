/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller.test;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.dto.request.ReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@DisplayName("StockReceiveControllerTest")
public class StockReceiveControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.bgr", "welcome123"));
	}

	@Test
	@DisplayName("getStockReceiveCountTest")
	public void a() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("/stock-receives/counts"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("listStockReceiveTest")
	public void b() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("/stock-receives?transferType=BTQ_BTQ"), HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "2,BTQ_BTQ", "3,MER_BTQ" })
	@DisplayName("getStockReceiveTest")
	public void c(Integer id, String type) {
//		List<String> stockreceiveId = getStockReceiveId();

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("/stock-receives/" + id + "?transferType=" + type), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	private List<String> getStockReceiveId() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("/stock-receives?transferType=BTQ_BTQ"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> stockreceiveId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			stockreceiveId.add(data.get("id").asText());
		}
		return stockreceiveId;
	}

	@Test
	@DisplayName("listStockReceiveItemsTest")
	public void d() {
		List<String> stockreceiveId = getStockReceiveId();
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("/stock-receives/" + stockreceiveId.get(0) + "/items?transferType=BTQ_BTQ"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	@DisplayName("getStockReceiveItemTest")
	public void e() {
		List<String> stockreceiveId = getStockReceiveId();
		List<ReceiveStockItemDto> stockreceiveItemId = getStockreceiveItemId(stockreceiveId.get(0));
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("/stock-receives/" + stockreceiveId.get(0) + "/items/"
						+ stockreceiveItemId.get(0).getId() + "?transferType=BTQ_BTQ"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	private List<ReceiveStockItemDto> getStockreceiveItemId(String stockreceiveId) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);
		List<ReceiveStockItemDto> stockReceiveItems = new ArrayList<>();
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("/stock-receives/" + stockreceiveId + "/items?transferType=BTQ_BTQ"), HttpMethod.GET,
				entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			ReceiveStockItemDto receiveStockItem = new ReceiveStockItemDto();
			JsonNode data = resultsIterator.next();
			receiveStockItem.setId(data.get("id").asText());
			receiveStockItem.setMeasuredWeight(BigDecimal.valueOf(data.get("measuredWeight").asDouble()));
			stockReceiveItems.add(receiveStockItem);
		}
		return stockReceiveItems;
	}

	@ParameterizedTest
	@CsvSource({ "2,10,BTQ_BTQ,OK", "3,20,MER_BTQ,BAD_REQUEST", "3,10,MER_BTQ,OK" })
	@DisplayName("updateStockReceiveItemTest")
	public void f(String id, BigDecimal weight, String type, String status) {
//		List<String> stockreceiveId = getStockReceiveId();
		List<ReceiveStockItemDto> stockreceiveItems = getStockreceiveItemId(id);
		ReceiveStockItemUpdateDto receiveStockItemUpdateDto = new ReceiveStockItemUpdateDto();
		receiveStockItemUpdateDto.setBinCode("ZEROBIN");
		receiveStockItemUpdateDto.setBinGroupCode("STN");
		receiveStockItemUpdateDto.setMeasuredWeight(weight);
		receiveStockItemUpdateDto.setRemarks("stock receive item level details modified for testing purpose");

		HttpEntity<ReceiveStockItemUpdateDto> entity = new HttpEntity<>(receiveStockItemUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(
				"/stock-receives/" + id + "/items/" + stockreceiveItems.get(0).getId() + "?transferType=" + type),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "2,BTQ_BTQ", "3,MER_BTQ" })
	@DisplayName("updateAllStockReceiveItemsTest")
	public void g(Integer id, String type) {
//		List<String> stockreceiveId = getStockReceiveId();
		ReceiveStockItemBulkDto receiveStockItemBulkDto = new ReceiveStockItemBulkDto();
		receiveStockItemBulkDto.setBinCode("ZEROBIN");
		receiveStockItemBulkDto.setStatus(StockReceiveStatusEnum.VERIFIED.toString());
		List<String> strList = new ArrayList<>();
		receiveStockItemBulkDto.setId(strList);

		HttpEntity<ReceiveStockItemBulkDto> entity = new HttpEntity<>(receiveStockItemBulkDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("/stock-receives/" + id + "/items?transferType=" + type), HttpMethod.PATCH, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "2,BTQ_BTQ", "3,MER_BTQ" })
	@DisplayName("updateStockTransferTest")
	public void h(Integer id, String type) {
//		List<String> stockreceiveId = getStockReceiveId();
		ReceiveStockConfirmDto receiveStockItemUpdateDto = new ReceiveStockConfirmDto();
		receiveStockItemUpdateDto.setCourierReceivedDate(new Date());
		receiveStockItemUpdateDto.setReasonForDelay("due to courier issue");
		receiveStockItemUpdateDto.setRemarks("This is a test method and we are writing test cases");

		HttpEntity<ReceiveStockConfirmDto> entity = new HttpEntity<>(receiveStockItemUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("/stock-receives/" + id + "?transferType=" + type), HttpMethod.PATCH, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

}
