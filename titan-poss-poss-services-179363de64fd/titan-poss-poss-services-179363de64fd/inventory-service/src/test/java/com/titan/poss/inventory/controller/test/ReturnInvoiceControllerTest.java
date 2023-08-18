package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
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
import com.titan.poss.inventory.dto.request.InvoiceItem;
import com.titan.poss.inventory.dto.request.RemoveStockItemsDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceConFirmDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceCreateItemsDto;

@DisplayName("ReturnInvoiceControllerTest")
class ReturnInvoiceControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.pna", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "BTQ_CFA", "TEP_PLAIN", "TEP_STUDDED", "GEP", "COIN" })
	@DisplayName("testGetReturnInvoice")
	void b(String type) {
		String returnInvoiceId = getReturnInvoiceId(type);

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("return-invoices/" + returnInvoiceId + "?invoiceType=" + type), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private String getReturnInvoiceId(String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("return-invoices?invoiceType=" + type), HttpMethod.POST, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		String returnInvoiceId = null;
		returnInvoiceId = jsonNode.getBody().get("id").asText();
		return returnInvoiceId;
	}

	@ParameterizedTest
	@CsvSource({ "BTQ_CFA", "TEP_PLAIN", "TEP_STUDDED", "GEP", "COIN" })
	@DisplayName("testListPurchaseInvoiceItems")
	void e(String type) {
		String returnInvoiceId = getReturnInvoiceId(type);
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("return-invoices/" + returnInvoiceId + "/items?invoiceType=" + type), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "BTQ_CFA", "TEP_PLAIN", "TEP_STUDDED", "GEP", "COIN" })
	@DisplayName("testAddReturnInvoice")
	void a(String type) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("return-invoices?invoiceType=" + type), HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "BTQ_CFA", "TEP_PLAIN", "TEP_STUDDED", "GEP", "COIN" })
	@DisplayName("testAddReturnInvoiceItems")
	void d(String type) {
		String returnInvoiceId = getReturnInvoiceId(type);
		ReturnInvoiceCreateItemsDto returnInvoiceItemDto = new ReturnInvoiceCreateItemsDto();
		List<InvoiceItem> invoiceItems = new ArrayList<>();
		returnInvoiceItemDto.setInvoiceItems(invoiceItems);

		HttpEntity<ReturnInvoiceCreateItemsDto> entity1 = new HttpEntity<>(returnInvoiceItemDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("return-invoices/" + returnInvoiceId + "/items?invoiceType=" + type), HttpMethod.POST,
				entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "BTQ_CFA", "TEP_PLAIN", "TEP_STUDDED", "GEP", "COIN" })
	@DisplayName("testRemoveReturnInvoiceItems")
	void c(String type) {
		RemoveStockItemsDto removeStockItemsDto = new RemoveStockItemsDto();
		String returnInvoiceId = getReturnInvoiceId(type);
		List<String> itemIds = new ArrayList<>();
		if (type.equals("BTQ_CFA")) {
			itemIds.add(getItemId());
		}
		removeStockItemsDto.setItemIds(itemIds);

		HttpEntity<RemoveStockItemsDto> entity1 = new HttpEntity<>(removeStockItemsDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("return-invoices/" + returnInvoiceId + "/items?invoiceType=" + type), HttpMethod.PUT,
				entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private String getItemId() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("stock-managements/items?binType=BIN_BIN"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		String itemId = null;
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			itemId = data.get("id").asText();
			break;
		}
		return itemId;
	}

	@ParameterizedTest
	@CsvSource({ "BTQ_CFA", "TEP_PLAIN", "TEP_STUDDED", "GEP", "COIN" })
	@DisplayName("testUpdateReturnInvoice")
	void f(String type) {
		String returnInvoiceId = getReturnInvoiceId(type);
		ReturnInvoiceConFirmDto invoiceConfirmDto = new ReturnInvoiceConFirmDto();
		JsonData jsonData = new JsonData();
		String details = "{\"companyName\":\"Bluedart\",\"docketNumber\": \"12\",\"lockNumber\":\"21\",\"roadPermitNumber\":\"GL/12/AX/1213\",\"numberOfBoxes\": \"2\",\"boxDetails\": [{\"serialNumber\": \"11111\",\"boxNumber\": \"22222\",\"lockNumber\": \"33333\",\"boxWeight\": \"140.50\",\"weightUnit\": \"gms\"}, {\"serialNumber\": \"11111\",\"boxNumber\": \"22222\",\"lockNumber\": \"33333\",\"boxWeight\": \"140.50\",\"weightUnit\": \"gms\"}]}";
		Object obj = MapperUtil.getJsonFromString(details);
		jsonData.setType("courier");
		jsonData.setData(obj);
		invoiceConfirmDto.setCarrierDetails(jsonData);
		invoiceConfirmDto.setCfaLocationCode("PAT");
		invoiceConfirmDto.setRemarks("Confirming the return invoice for testing");

		HttpEntity<ReturnInvoiceConFirmDto> entity1 = new HttpEntity<>(invoiceConfirmDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("return-invoices/" + returnInvoiceId + "?invoiceType=" + type), HttpMethod.PATCH,
				entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "3,BTQ_CFA", "4,TEP_PLAIN", "5,TEP_STUDDED", "6,GEP", "7,COIN" })
	@DisplayName("getRequestPDFImpTest")
	void g(String id, String type) {
		HttpEntity<String> entity1 = new HttpEntity<>(null, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("return-invoices/request/" + id + "/prints?returnInvoiceType=" + type),
				HttpMethod.GET, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}
}
