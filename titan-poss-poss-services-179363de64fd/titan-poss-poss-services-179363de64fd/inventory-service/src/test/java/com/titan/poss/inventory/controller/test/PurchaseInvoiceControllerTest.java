package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceConfirmDto;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceItemUpdateDto;
import com.titan.poss.inventory.dto.request.PurchaseStockItemBulkDto;
import com.titan.poss.inventory.dto.response.PurchaseInvoiceItemDto;

@DisplayName("PurchaseInvoiceControllerTest")
public class PurchaseInvoiceControllerTest extends InventoryBase {
	private static HttpHeaders headers1 = new HttpHeaders();
	private static final Logger LOGGER = LoggerFactory.getLogger(PurchaseInvoiceControllerTest.class);

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.pna", "welcome123"));
	}

	@Test
	void testGetPurchaseInvoiceCount() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("purchase-invoices/counts"),
				HttpMethod.GET, entity, String.class);
		LOGGER.info(response.getStatusCode() + " " + response.getBody());
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testListPurchaseInvoices() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("purchase-invoices?invoiceType=CFA_BTQ"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetPurchaseInvoice() {
		List<String> invoiceId = getInvoiceId();

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("purchase-invoices/" + invoiceId.get(0) + "?invoiceType=CFA_BTQ"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetPurchaseInvoiceItem() {
		List<String> invoiceId = getInvoiceId();
		PurchaseInvoiceItemDto itemId = getinvoiceItemId(invoiceId.get(0));

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(
						"purchase-invoices/" + invoiceId.get(0) + "/items/" + itemId.getId() + "?invoiceType=CFA_BTQ"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private PurchaseInvoiceItemDto getinvoiceItemId(String invoiceId) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("purchase-invoices/" + invoiceId + "/items?invoiceType=CFA_BTQ"), HttpMethod.GET,
				entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		PurchaseInvoiceItemDto purchaseInvoiceItemDto = new PurchaseInvoiceItemDto();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {

			JsonNode data = resultsIterator.next();
			purchaseInvoiceItemDto.setId(data.get("id").asText());
			purchaseInvoiceItemDto.setBinCode(data.get("binCode").asText());
			purchaseInvoiceItemDto.setBinGroupCode(data.get("binGroupCode").asText());
			purchaseInvoiceItemDto.setMeasuredWeight(BigDecimal.valueOf(data.get("measuredWeight").asDouble()));
			break;
		}
		return purchaseInvoiceItemDto;
	}

	@Test
	void testListPurchaseInvoiceItems() {
		List<String> invoiceId = getInvoiceId();

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("purchase-invoices/" + invoiceId.get(0) + "/items?invoiceType=CFA_BTQ"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private List<String> getInvoiceId() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("purchase-invoices?invoiceType=CFA_BTQ"), HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		List<String> invoiceId = new ArrayList<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			invoiceId.add(data.get("id").asText());
		}
		return invoiceId;
	}

	@Test
	void testUpdateAllPurchaseInvoiceItems() {
		List<String> invoiceId = getInvoiceId();
		PurchaseStockItemBulkDto receiveStockItemBulkDto = new PurchaseStockItemBulkDto();
		List<String> itemIds = new ArrayList<>();
		receiveStockItemBulkDto.setBinCode("ZEROBIN");
		receiveStockItemBulkDto.setStatus("VERIFIED");
		receiveStockItemBulkDto.setId(itemIds);

		HttpEntity<PurchaseStockItemBulkDto> entity1 = new HttpEntity<>(receiveStockItemBulkDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("purchase-invoices/" + invoiceId.get(0) + "/items?invoiceType=CFA_BTQ"),
				HttpMethod.PATCH, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testUpdatePurchaseInvoice() {
		List<String> invoiceId = getInvoiceId();
		PurchaseInvoiceConfirmDto invoiceConfirmDto = new PurchaseInvoiceConfirmDto();
		invoiceConfirmDto.setReceivedDate(new Date());
		invoiceConfirmDto.setRemarks("Updating purchase invoice items for testing");

		HttpEntity<PurchaseInvoiceConfirmDto> entity1 = new HttpEntity<>(invoiceConfirmDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("purchase-invoices/" + invoiceId.get(0) + "?invoiceType=CFA_BTQ"), HttpMethod.PATCH,
				entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void updatePurchaseInvoiceItem() {
		List<String> invoiceId = getInvoiceId();
		PurchaseInvoiceItemDto itemId = getinvoiceItemId(invoiceId.get(0));
		JsonData itemDetails = new JsonData();
		PurchaseInvoiceItemUpdateDto invoiceItemVerifyDto = new PurchaseInvoiceItemUpdateDto();
		invoiceItemVerifyDto.setBinCode(itemId.getBinCode());
		invoiceItemVerifyDto.setBinGroupCode(itemId.getBinGroupCode());
		invoiceItemVerifyDto.setItemDetails(itemDetails);
		invoiceItemVerifyDto.setMeasuredWeight(itemId.getMeasuredWeight());
		invoiceItemVerifyDto.setRemarks("Testing flow");

		HttpEntity<PurchaseInvoiceItemUpdateDto> entity1 = new HttpEntity<>(invoiceItemVerifyDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(
						"purchase-invoices/" + invoiceId.get(0) + "/items/" + itemId.getId() + "?invoiceType=CFA_BTQ"),
				HttpMethod.PATCH, entity1, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}
}
