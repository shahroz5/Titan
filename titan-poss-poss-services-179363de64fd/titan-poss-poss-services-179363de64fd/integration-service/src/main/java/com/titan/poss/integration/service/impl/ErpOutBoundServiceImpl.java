package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.client.methods.HttpGet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.InvoiceResponseDto;
import com.titan.poss.core.dto.StnResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.FileServiceClient;
import com.titan.poss.core.service.clients.InventoryServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.ErpOutBoundService;
import com.titan.poss.integration.util.HttpClientUtil;
import com.titan.poss.inventory.dto.constants.StockReceiveTypeEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ErpOutBoundServiceImpl implements ErpOutBoundService {
	private static final String INV = "inv";
	private static final String STN = "stn";
	private static final String USER_NAME = "Username";
	private static final String PASS_WORD = "Password";
	private static final String LOCATION_ERR = " is not for location: ";

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private FileServiceClient fileServiceClient;

	@Autowired
	private InventoryServiceClient inventoryServiceClient;

	@Override
	public void getStnService(String stnNo) {

		// first checking if it is present in db, else calling oracle api
		Object response = inventoryServiceClient.listStockReceive(StockReceiveTypeEnum.FAC_BTQ.toString(),
				Integer.parseInt(stnNo));
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		if (response != null) {
			PagedRestResponse<Object> pagedResponse = mapper.convertValue(response,
					new TypeReference<PagedRestResponse<Object>>() {
					});
			if (pagedResponse.getResults().toString().equalsIgnoreCase("[]")) {
				// calling oracle api
				ApiResponseDto apiResponse = callErpApi(stnNo, STN);
				StnResponseDto stnResponse = MapperUtil.mapObjToClass(apiResponse.getResponse(), StnResponseDto.class);
				if (stnResponse.getStn().getStnNo() == null) {
					throw new ServiceException("No data found for STN no: " + stnNo, "ERR-INT-067",
							"No data found for STN no: " + stnNo);
				} else if (!CommonUtil.getLocationCode().equalsIgnoreCase(stnResponse.getStn().getLocation())) {
					throw new ServiceException("STN no: " + stnNo + LOCATION_ERR + CommonUtil.getLocationCode(),
							"ERR-INT-069", "STN no: " + stnNo + LOCATION_ERR + CommonUtil.getLocationCode());
				} else {
					fileServiceClient.runStnJob(stnResponse);
				}
			}
		}
	}

	@Override
	public void getInvoiceService(String invNo) {
		// first checking if it is present in db, else calling oracle api
		Integer invoiceNumber = Integer.parseInt(invNo.substring(9));
		Object response = inventoryServiceClient.listPurchaseInvoices(invoiceNumber,
				FileIntegrationConstants.TRANSFER_TYPE_CFA_BTQ);
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		if (response != null) {
			PagedRestResponse<Object> pagedResponse = mapper.convertValue(response,
					new TypeReference<PagedRestResponse<Object>>() {
					});
			if (pagedResponse.getResults().toString().equalsIgnoreCase("[]")) {
				// calling oracle api
				ApiResponseDto apiResponse = callErpApi(invNo, INV);
				InvoiceResponseDto invResponse = MapperUtil.mapObjToClass(apiResponse.getResponse(),
						InvoiceResponseDto.class);
				if (invResponse.getInvoice() == null || invResponse.getInvoice().getInvoiceNumber() == null) {
					throw new ServiceException("No data found for Inv no: " + invNo, "ERR-INT-068",
							"No data found for Inv no: " + invNo);
				} else if (!CommonUtil.getLocationCode().equalsIgnoreCase(invResponse.getInvoice().getL3BtqCode())) {
					throw new ServiceException("Invoice no: " + invNo + LOCATION_ERR + CommonUtil.getLocationCode(),
							"ERR-INT-075", "Invoice no: " + invNo + LOCATION_ERR + CommonUtil.getLocationCode());
				} else {
					fileServiceClient.runInvoiceJob(invResponse);
				}
			}
		}
	}

	private ApiResponseDto callErpApi(String var, String uriCode) {
		VendorDao vendorDao = vendorRepo.findByVendorCode(VendorCodeEnum.ERP_API.name());
		if (vendorDao == null) {
			throw new ServiceException("Vendor not present", "ERR-INT-015", "Vendor not present");
		}
		JsonObject jsonObject = new JsonParser().parse(vendorDao.getVendorDetails()).getAsJsonObject();
		String uri = vendorDao.getBaseurl() + jsonObject.getAsJsonObject("data").get(uriCode).getAsString();
		UriComponentsBuilder ucb = UriComponentsBuilder.fromUriString(uri.trim());
		Map<String, String> urlParams = Map.of(uriCode, var);
		String url = ucb.buildAndExpand(urlParams).toUri().toString();
		HttpGet getRequest = new HttpGet(url);
		String auth = jsonObject.getAsJsonObject("data").get(USER_NAME).getAsString() + ":"
				+ jsonObject.getAsJsonObject("data").get(PASS_WORD).getAsString();
		byte[] encodeBase64 = Base64.encodeBase64(auth.getBytes(StandardCharsets.ISO_8859_1));
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(getRequest, vendorDao.getRetryCount(),
					vendorDao.getTimeOutSeconds(), new String(encodeBase64));
		} catch (IOException e) {
			throw new ServiceException("Call to third party api Failed.", "ERR-INT-005", e);
		}
		if (httpResponseUtil.getHttpResponseCode() != 200) {
			throw new ServiceException("Call to third party api Failed.", "ERR-INT-005",
					httpResponseUtil.getResponse());
		}
		return new ApiResponseDto(httpResponseUtil.getResponse(), httpResponseUtil.getHttpResponseCode(),
				httpResponseUtil.getResponseTime());
	}

}
