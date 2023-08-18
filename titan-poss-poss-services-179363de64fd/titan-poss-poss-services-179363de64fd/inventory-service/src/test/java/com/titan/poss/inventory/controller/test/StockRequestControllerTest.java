package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

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
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.request.RequestStockItemDto;
import com.titan.poss.inventory.dto.request.StockRequestCreateDto;
import com.titan.poss.inventory.dto.request.StockRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.StockRequestUpdateDto;

@DisplayName("StockRequestControllerTest")
class StockRequestControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();
	private static HttpHeaders headers2 = new HttpHeaders();





	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
		headers2.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.BGR", "welcome123"));
	}





	@Test
	@DisplayName("testGetStockRequestCount")
	void a() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("stock-requests/counts"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}





	@Test
	@DisplayName("testListStockRequests")
	void b() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("stock-requests?requestGroup=SENT&requestType=BTQ&status=ISSUED"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}





	@Test
	@DisplayName("testGetStockRequest")
	void c() {
		//		List<String> stockRequestId = getStockRequestId("RECEIVED", "BTQ", "ISSUED");

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers2);

		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("stock-requests/10?requestGroup=RECEIVED&requestType=BTQ"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}





	private List<String> getStockRequestId(String requestGroup, String requestType, String status) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate
				.exchange(createURLWithPort("stock-requests?requestGroup=" + requestGroup + "&requestType="
						+ requestType + "&status=" + status), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> stockRequestId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			stockRequestId.add(data.get("id").asText());
		}
		return stockRequestId;
	}





	@Test
	@DisplayName("testListStockRequestItems")
	void d() {
		//		List<String> stockRequestId = getStockRequestId("RECEIVED", "BTQ", "ISSUED");
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers2);

		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("stock-requests/10/items?requestGroup=RECEIVED&requestType=BTQ"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}





	@Test
	@DisplayName("testCreateStockRequest")
	void g() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers2);

		ResponseEntity<JsonNode> jsonNode = restTemplate
				.exchange(createURLWithPort("stock-managements/items?binGroupCode=STN&binType=BIN_BIN"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		StockRequestCreateDto requestStockCreateDto = new StockRequestCreateDto();
		List<RequestStockItemDto> items = new ArrayList<>();
		RequestStockItemDto requestItemDto = new RequestStockItemDto();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			requestItemDto.setItemCode(data.get("itemCode").asText());
			requestItemDto.setQuantity((short) data.get("availableQuantity").asInt());
			items.add(requestItemDto);
			break;
		}
		requestStockCreateDto.setItems(items);
		requestStockCreateDto.setRemarks("Testing for stock request flow");
		requestStockCreateDto.setSrcLocationCode("BGR");

		HttpEntity<StockRequestCreateDto> entity = new HttpEntity<>(requestStockCreateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("stock-requests?requestType=BTQ"), HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}





	@ParameterizedTest
	@CsvSource({ "512318DCXABA17,URB,BAD_REQUEST" })
	@DisplayName("testCreateStockRequestNegetive")
	void h(String itemCode, String location, String status) {

		StockRequestCreateDto requestStockCreateDto = new StockRequestCreateDto();
		List<RequestStockItemDto> items = new ArrayList<>();
		RequestStockItemDto requestItemDto = new RequestStockItemDto();
		requestItemDto.setItemCode(itemCode);
		requestItemDto.setQuantity((short) 1);
		items.add(requestItemDto);
		requestStockCreateDto.setItems(items);
		requestStockCreateDto.setRemarks("Testing for stock request flow");
		requestStockCreateDto.setSrcLocationCode(location);

		HttpEntity<StockRequestCreateDto> entity = new HttpEntity<>(requestStockCreateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate
				.exchange(createURLWithPort("stock-requests?requestType=BTQ"), HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}





	@ParameterizedTest
	@CsvSource({ "19,RECEIVED,OK,ACCEPTED", "19,RECEIVED,BAD_REQUEST,APVL_REJECTED" })
	@DisplayName("testUpdateStockRequestItem")
	void e(String id, String type, String status, StockRequestStatusEnum enums) {
		List<String> stockRequestItemId = getStockRequestItemId(id, type, "BTQ");
		StockRequestItemUpdateDto itemUpdateDto = new StockRequestItemUpdateDto();
		itemUpdateDto.setQuantity((short) 0);
		itemUpdateDto.setStatus(enums.toString());
		HttpEntity<StockRequestItemUpdateDto> entity = new HttpEntity<>(itemUpdateDto, headers2);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-requests/" + id + "/items/"
				+ stockRequestItemId.get(0) + "?requestType=BTQ"), HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}





	@ParameterizedTest
	@CsvSource({ "19,RECEIVED,OK,ACCEPTED", "19,RECEIVED,BAD_REQUEST,APVL_REJECTED" })
	@DisplayName("testUpdateStockRequest")
	void f(String id, String type, String status, StockRequestStatusEnum enums) {
		List<String> stockRequestItemId = getStockRequestItemId(id, type, "BTQ");

		StockRequestUpdateDto requestUpdateDto = new StockRequestUpdateDto();
		List<String> itemIds = stockRequestItemId;
		requestUpdateDto.setItemIds(itemIds);
		requestUpdateDto.setRemarks("testing flow");
		requestUpdateDto.setStatus(enums.toString());

		HttpEntity<StockRequestUpdateDto> entity = new HttpEntity<>(requestUpdateDto, headers2);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stock-requests/" + id
				+ "?requestGroup=" + type + "&requestType=BTQ"), HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}





	private List<String> getStockRequestItemId(String id, String requestGroup, String requestType) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers2);

		ResponseEntity<JsonNode> jsonNode = restTemplate
				.exchange(createURLWithPort("stock-requests/" + id + "/items?requestGroup=" + requestGroup
						+ "&requestType=" + requestType), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> stockRequestItemId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			stockRequestItemId.add(data.get("id").asText());
		}
		return stockRequestItemId;
	}

}
