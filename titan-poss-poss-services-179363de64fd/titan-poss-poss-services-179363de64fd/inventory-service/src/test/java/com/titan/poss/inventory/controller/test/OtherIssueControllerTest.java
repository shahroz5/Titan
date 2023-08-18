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
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.request.StockIssueStockConfirmDto;

@DisplayName("OtherIssueControllerTest")
public class OtherIssueControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
	}

	@Test
	@DisplayName("testGetStockRequestCount")
	void a() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("other-issues/request/counts"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "FOC", "LOSS", "EXH", "PSV", "LOAN" })
	@DisplayName("testListStockRequests")
	void b(String type) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-issues/request?requestType=" + type), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "FOC", "LOSS", "EXH", "PSV", "LOAN" })
	@DisplayName("testGetStockRequest")
	void c(String type) {
		List<String> stockrequestId = getStockRequestId(type);
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);
		if (stockrequestId == null || stockrequestId.isEmpty()) {

		} else {
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("other-issues/request/" + stockrequestId.get(0) + "?requestType=" + type),
					HttpMethod.GET, entity, String.class);

			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}
	}

	private List<String> getStockRequestId(String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("other-issues/request?requestType=" + type), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> stockrequestId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			if (data.get("status").asText().equals("APPROVED")) {
				stockrequestId.add(data.get("id").asText());
			}
		}
		return stockrequestId;
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "FOC", "LOSS", "EXH", "PSV", "LOAN" })
	@DisplayName("testListStockRequestItems")
	void d(String type) {
		List<String> stockrequestId = getStockRequestId(type);
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-issues/request/" + stockrequestId.get(0) + "/items?requestType=" + type),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "FOC", "LOSS", "EXH", "PSV", "LOAN" })
	@DisplayName("testGetStockRequestItem")
	void e(String type) {
		List<String> stockrequestId = getStockRequestId(type);

		List<String> stockrequestItemId = getStockRequestItemId(stockrequestId.get(0), type);
		if (stockrequestItemId == null || stockrequestItemId.isEmpty()) {
			HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort(
							"other-issues/request/" + stockrequestId.get(0) + "/items/656575tfgr6?requestType=" + type),
					HttpMethod.GET, entity, String.class);

			assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
		} else {
			HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("other-issues/request/" + stockrequestId.get(0) + "/items/"
							+ stockrequestItemId.get(0) + "?requestType=" + type),
					HttpMethod.GET, entity, String.class);

			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}
	}

	private List<String> getStockRequestItemId(String stockrequestId, String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("other-issues/request/" + stockrequestId + "/items?requestType=" + type),
				HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> stockrequestItemId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			stockrequestItemId.add(data.get("id").asText());
		}
		return stockrequestItemId;
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "FOC", "LOSS", "EXH", "PSV", "LOAN" })
	@DisplayName("testUpdateStockRequest")
	void g(String type) {
		List<String> stockrequestId = getStockRequestId(type);
		StockIssueStockConfirmDto stockIssueStockConfirmDto = new StockIssueStockConfirmDto();
		JsonData jsonData = new JsonData();
		String details = "{\"employeeId\":\"E12456\",\"employeeName\":\"TITANuser\",\"designation\":\"CASHIER\",\"mobileNo\":\"1234567890\",\"emailId \":\"E12456.@gmail.com \"}";
		Object obj = MapperUtil.getJsonFromString(details);
		jsonData.setType("Employee");
		jsonData.setData(obj);
		stockIssueStockConfirmDto.setCarrierDetails(jsonData);
		stockIssueStockConfirmDto.setRemarks("Issuing out the selected products to the factory");

		HttpEntity<StockIssueStockConfirmDto> entity1 = new HttpEntity<>(stockIssueStockConfirmDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-issues/request/" + stockrequestId.get(0) + "?requestType=" + type),
				HttpMethod.PATCH, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "FOC", "LOSS", "EXH", "PSV", "LOAN" })
	@DisplayName("testUpdateAllOtherIssueItems")
	void f(String type) {
		List<String> stockrequestId = getStockRequestId(type);

		IssueStockItemBulkDto issueStockItemBulkDto = new IssueStockItemBulkDto();
		List<String> itemIds = new ArrayList<>();
		issueStockItemBulkDto.setItemIds(itemIds);
		issueStockItemBulkDto.setStatus("SELECTED");

		HttpEntity<IssueStockItemBulkDto> entity1 = new HttpEntity<>(issueStockItemBulkDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-issues/request/" + stockrequestId.get(0) + "/items?requestType=" + type),
				HttpMethod.PATCH, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	@DisplayName("getOtherIssuePDFImp")
	void h() {
		HttpEntity<String> entity1 = new HttpEntity<>(null, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("other-issues/request/3/prints?otherIssueType=FOC"), HttpMethod.GET, entity1,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
