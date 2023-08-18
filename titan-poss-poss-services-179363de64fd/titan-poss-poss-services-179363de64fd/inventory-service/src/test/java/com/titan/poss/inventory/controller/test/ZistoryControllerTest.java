package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

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

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;

@DisplayName("HistoryControllerTest")
class ZistoryControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();
	private static HttpHeaders headers2 = new HttpHeaders();
	private static HttpHeaders headers3 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.bgr", "welcome123"));
		headers2.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.pna", "welcome123"));
		headers3.add("Authorization", "Bearer " + AuthUtil.getAuthToken("bos.urb", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "TODAY,ISSUE,ISSUED", "LAST_WEEK,ISSUE,CANCELLED", "LAST_MONTH,ISSUE,ISSUED",
			"LAST_YEAR,RECEIVE,RECEIVED", "CUSTOM,ISSUE,ISSUED" })
	void testListStockTransfer(String date, String type, String status) {
		String custom = "history/transfer?date=CUSTOM&endDate=2020-01-01&historyType=ISSUE&startDate=2019-12-01&status=ISSUED&transferType=BTQ_BTQ";
		if (date.equals("CUSTOM")) {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(custom), HttpMethod.GET, entity,
					String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		} else {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("history/transfer?date=" + date
					+ "&historyType=" + type + "&status=" + status + "&transferType=BTQ_BTQ"), HttpMethod.GET, entity,
					String.class);

			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}
	}

	@ParameterizedTest
	@CsvSource({ "2,RECEIVE,BTQ_BTQ" })
	void testListStockTransferItems(String id, String status, String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("history/transfer/" + id + "/items?historyType=" + status + "&transferType=" + type),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetStockTransfer() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("history/transfer/2"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "TODAY,ADJ", "LAST_WEEK,ADJ", "LAST_MONTH,ADJ", "LAST_YEAR,ADJ" })
	void testListStockIssue(String date, String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("history/issue?date=" + date + "&requestType=" + type), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetStockIssue() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("history/issue/2"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetStockInvoice() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers2);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("history/invoice/2"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ADJ", "BTQ", "FAC", "MER", "FOC", "LOAN", "LOSS", "PSV", "CONV" })
	void testListStockIssueItems(String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("history/issue/2/items?requestType=" + type), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "TODAY,ISSUE,ISSUED", "LAST_WEEK,ISSUE,ISSUED", "LAST_MONTH,ISSUE,ISSUED", "LAST_YEAR,RECEIVE,ISSUED",
			"CUSTOM,ISSUE,ISSUED" })
	void testListStockInvoice(String date, String type, String status) {
		String custom = "history/invoice?date=LAST_MONTH&endDate=2020-03-03&invoiceType=BTQ_CFA&startDate=2019-12-01&status=ISSUED";
		if (date.equals("CUSTOM")) {
			HttpEntity<String> entity = new HttpEntity<>(null, headers2);
			ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(custom), HttpMethod.GET, entity,
					String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		} else {
			HttpEntity<String> entity = new HttpEntity<>(null, headers2);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("history/invoice?date=" + date + "&invoiceType=BTQ_CFA&status=" + status),
					HttpMethod.GET, entity, String.class);

			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}
	}

	@ParameterizedTest
	@CsvSource({ "2,CFA_BTQ,RECEIVED", "3,BTQ_CFA,ISSUED", "4,TEP_PLAIN,ISSUED", "5,TEP_STUDDED,ISSUED" })
	void testListStockInvoiceItems(Integer id, String type, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers2);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("history/invoice/" + id + "/items?invoiceType=" + type + "&status=" + status),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "TODAY,ADJ", "LAST_WEEK,ADJ", "LAST_MONTH,ADJ", "LAST_YEAR,ADJ" })
	void testListStockTransaction(String date, String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers3);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("history/transaction?date=" + date + "&transactionType=" + type), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetStockTransaction() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers3);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("history/transaction/3"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "2,ADJ", "3,FOC", "4,LOSS", "5,EXH", "6,PSV", "7,LOAN" })
	void testListStockTransactionItems(String id, String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers3);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("history/transaction/" + id + "/items?transactionType=" + type), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
