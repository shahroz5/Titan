/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
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
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.dto.request.OtherReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.OtherReceiveStockCreateDto;
import com.titan.poss.inventory.dto.request.ReceiveItemDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@DisplayName("OtherReceiveControllerTest")
public class OtherReceiveControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
	}

	@Test
	@DisplayName("getOtherReceiveCountTest")
	public void a() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("other-receives/counts"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("listStockReceiveTest")
	public void b(String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-receives?transactionType=" + type), HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("getOtherReceiveTest")
	public void c(String type) {
		List<String> stockreceiveId = getStockReceiveId(type);
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("/other-receives/" + stockreceiveId.get(0) + "?transactionType=" + type),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	private List<String> getStockReceiveId(String type) {

		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("other-receives?transactionType=" + type), HttpMethod.GET, entity1, JsonNode.class);
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

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("listOtherReceiveItemsTest")
	public void d(String type) {
		List<String> stockreceiveId = getStockReceiveId(type);
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-receives/" + stockreceiveId.get(0) + "/items?transactionType=" + type),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("getOtherReceiveItemTest")
	public void e(String type) {
		List<String> stockreceiveId = getStockReceiveId(type);
		List<StockTransactionDetailsDao> stockreceiveItemId = getStockReceiveItemId(stockreceiveId, type);
		if (stockreceiveItemId == null || stockreceiveItemId.isEmpty()) {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort(
							"other-receives/" + stockreceiveId.get(0) + "/items/65654fhg76567?transactionType=" + type),
					HttpMethod.GET, entity, String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
		} else {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("other-receives/" + stockreceiveId.get(0) + "/items/"
							+ stockreceiveItemId.get(0).getId() + "?transactionType=" + type),
					HttpMethod.GET, entity, String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}

	}

	private List<StockTransactionDetailsDao> getStockReceiveItemId(List<String> stockreceiveId, String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("other-receives/" + stockreceiveId.get(0) + "/items?transactionType=" + type),
				HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<StockTransactionDetailsDao> stockreceiveItemId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			StockTransactionDetailsDao stockTransactionDetails = new StockTransactionDetailsDao();
			JsonNode data = resultsIterator.next();
			stockTransactionDetails.setId(data.get("id").asText());
			stockTransactionDetails.setBinCode(data.get("binCode").asText());
			stockTransactionDetails.setBinGroupCode(data.get("binGroupCode").asText());
			stockTransactionDetails.setIssuedWeight(BigDecimal.valueOf(data.get("measuredWeight").asDouble()));
			stockreceiveItemId.add(stockTransactionDetails);
		}
		return stockreceiveItemId;
	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("updateOtherReceiveItemTest")
	public void f(String type) {
		List<String> stockreceiveId = getStockReceiveId(type);
		List<StockTransactionDetailsDao> stockreceiveItemId = getStockReceiveItemId(stockreceiveId, type);
		ReceiveStockItemUpdateDto receiveStockItemUpdateDto = new ReceiveStockItemUpdateDto();
		receiveStockItemUpdateDto.setBinCode(stockreceiveItemId.get(0).getBinCode());
		receiveStockItemUpdateDto.setBinGroupCode(stockreceiveItemId.get(0).getBinGroupCode());
		receiveStockItemUpdateDto.setMeasuredWeight(stockreceiveItemId.get(0).getIssuedWeight());
		receiveStockItemUpdateDto.setRemarks("this is other receive.");

		HttpEntity<ReceiveStockItemUpdateDto> entity = new HttpEntity<>(receiveStockItemUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-receives/" + stockreceiveId.get(0) + "/items/"
						+ stockreceiveItemId.get(0).getId() + "?transactionType=" + type),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("updateAllOtherReceiveItemsTest")
	public void g(String type) {
		List<String> stockreceiveId = getStockReceiveId(type);
		ReceiveStockItemBulkDto receiveStockItemBulkDto = new ReceiveStockItemBulkDto();
		List<String> ids = new ArrayList<>();
		receiveStockItemBulkDto.setBinCode("ZEROBIN");
		receiveStockItemBulkDto.setId(ids);
		receiveStockItemBulkDto.setStatus(StockReceiveStatusEnum.VERIFIED.toString());
		HttpEntity<ReceiveStockItemBulkDto> entity = new HttpEntity<>(receiveStockItemBulkDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-receives/" + stockreceiveId.get(0) + "/items?transactionType=" + type),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("updateStockTransactionTest")
	public void h(String type) {
		List<String> stockreceiveId = getStockReceiveId(type);
		g(type);
		OtherReceiveStockConfirmDto otherReceiveStockConfirmDto = new OtherReceiveStockConfirmDto();
		otherReceiveStockConfirmDto.setRemarks("testing flow");
		HttpEntity<OtherReceiveStockConfirmDto> entity = new HttpEntity<>(otherReceiveStockConfirmDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-receives/" + stockreceiveId.get(0) + "?transactionType=" + type),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "11GOPYM008,10,1000.000,PSV,OK", "11GOPYM008,10.000,1000.000,ADJ,OK",
			"512311VDRR1A40,21.000,1000.000,ADJ,BAD_REQUEST" })
	@DisplayName("createStockReceiveItems")
	public void i(String itemCode, BigDecimal weight, BigDecimal value, String type, String status) {
		OtherReceiveStockCreateDto otherReceiveStockCreateDto = new OtherReceiveStockCreateDto();
		ReceiveItemDto receiveItemDto = new ReceiveItemDto();
		List<ReceiveItemDto> items = new ArrayList<>();
		receiveItemDto.setBinCode("ZEROBIN");
		receiveItemDto.setBinGroupCode("STN");
		receiveItemDto.setItemCode(itemCode);
		receiveItemDto.setMeasuredWeight(weight);
		receiveItemDto.setQuantity((short) 1);
		receiveItemDto.setValue(value);
		items.add(receiveItemDto);
		otherReceiveStockCreateDto.setItems(items);
		otherReceiveStockCreateDto.setRemarks("Creating request for adj for testing flow");

		HttpEntity<OtherReceiveStockCreateDto> entity = new HttpEntity<>(otherReceiveStockCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-receives?transactionType=" + type), HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "EXH", "LOAN" })
	@DisplayName("updateStockTransactionNegativeTest")
	public void j(String type) {
		OtherReceiveStockConfirmDto otherReceiveStockConfirmDto = new OtherReceiveStockConfirmDto();
		otherReceiveStockConfirmDto.setRemarks(null);
		HttpEntity<OtherReceiveStockConfirmDto> entity = new HttpEntity<>(otherReceiveStockConfirmDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-receives/76576?transactionType=" + type), HttpMethod.PATCH, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));

	}

}
