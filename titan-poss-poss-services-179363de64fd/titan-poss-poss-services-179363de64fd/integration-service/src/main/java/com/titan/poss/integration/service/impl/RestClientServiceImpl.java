/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BaseApiReqDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.ThirdPartyApiReqDto;
import com.titan.poss.core.enums.VendorTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.service.RestClientService;
import com.titan.poss.integration.service.VendorService;
import com.titan.poss.integration.util.HttpClientUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("ApiServiceCallerImpl")
public class RestClientServiceImpl implements RestClientService {

	private static final List<String> FORWARDED_HEADERS = List.of("AUTHORIZATION", "COOKIE", "ACCEPT-LANGUAGE");

	@Autowired
	private VendorService vendorService;

	@Override
	public ApiResponseDto runEPOSSAPIRequest(EpossApiReqDto epossApiReqDto, String headerToken,
			HttpServletRequest request) {

		VendorDao vendor = vendorService.getActiveByVendorType(VendorTypeEnum.POSS);

		String token;
		if (headerToken != null) {
			token = headerToken;
		} else {
			token = request.getHeader(CommonConstants.AUTH_HEADER);
		}

		Map<String, String> inputHeaders = new HashMap<>();
		if (request != null) {
			Enumeration<String> headerNames = request.getHeaderNames();

			if (headerNames != null) {
				while (headerNames.hasMoreElements()) {
					String headerName = headerNames.nextElement();
					String headerVal = request.getHeader(headerName);
					inputHeaders.put(headerName.toUpperCase(), headerVal);
				}
			}
		}
		inputHeaders.put(CommonConstants.AUTH_HEADER.toUpperCase(), token);
		log.debug("Header value of Autorization header after override: {}",
				inputHeaders.get(CommonConstants.AUTH_HEADER));

		Integer retryCount = vendor.getRetryCount();
		Integer timeOutSeconds = vendor.getTimeOutSeconds();

		//vendor.setBaseurl("https://dev-eposs.titanposs.in/");
		UriComponentsBuilder ucb = UriComponentsBuilder
				.fromUriString(vendor.getBaseurl().trim() + "/" + epossApiReqDto.getRelativeUrl());

		Object httpReq = getHttpReqObject(epossApiReqDto, inputHeaders, ucb, true);

		return executeAPI(retryCount, timeOutSeconds, httpReq, true);
	}

	private ApiResponseDto executeAPI(Integer retryCount, Integer timeOutSeconds, Object httpReq, boolean isOfTitan) {
		HttpResponseUtil hru = null;
		try {
			hru = HttpClientUtil.sendHttpRequest(httpReq, retryCount, timeOutSeconds, true, null);
		} catch (IOException e) {
			if (isOfTitan)
				throw new ServiceException("Call to EPOSS Failed.", "ERR-INT-025", e);
			else
				throw new ServiceException("Call to third party api Failed.", "ERR-INT-005", e);
		}
		try {
			log.trace("\nAPI Response :\n{}\n", MapperUtil.getJsonString(hru.getResponseObj()));
		} catch (Exception e) {
			log.debug("Not a JSON. \nAPI Response :\n{}\n", hru.getResponseObj());
		}

		return new ApiResponseDto(hru.getResponseObj(), hru.getHttpResponseCode(), hru.getResponseTime());
	}

	private Object getHttpReqObject(BaseApiReqDto apiReqDto, Map<String, String> headers, UriComponentsBuilder ucb,
			boolean isOfTitan) {
		if (!CollectionUtils.isEmpty(apiReqDto.getRequestParams())) {
			for (Map.Entry<String, String> entry : apiReqDto.getRequestParams().entrySet())
				ucb.queryParam(entry.getKey(),
						URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8).replace("\\+", "%20"));
		}
		String url = ucb.build().toString();

		return getByHttpMethodObj(apiReqDto.getHttpMethod(), url, apiReqDto.getReqBody(), headers, isOfTitan);
	}

	/**
	 * Return HttpReq Object with auth header & body set
	 * 
	 * @param httpMethod
	 * @param url
	 * @param obj
	 * @param token
	 * @return Object
	 */
	private Object getByHttpMethodObj(HttpMethod httpMethod, String url, Object obj, Map<String, String> inputHeaders,
			boolean isOfTitan) {

		String objStr = null;
		StringEntity strEntity = null;
		if (obj != null) {
			objStr = MapperUtil.getStringFromJson(obj);
			try {
				strEntity = new StringEntity(objStr);
				strEntity.setContentType(ContentTypesEnum.JSON.getValue());
			} catch (UnsupportedEncodingException e) {
				if (isOfTitan)
					throw new ServiceException("Call to EPOSS Failed", "ERR-INT-025", e);
				else
					throw new ServiceException("Call to third party api Failed.", "ERR-INT-005", e);
			}
		}

		HttpRequestBase httpReq = null;
		// @formatter:off
		switch (httpMethod) {
		case GET:
			httpReq = new HttpGet(url);
			break;
		case POST:
			HttpPost httpPost = new HttpPost(url);
			httpPost.setEntity(strEntity);
			httpReq = httpPost;
			break;
		case PATCH:
			HttpPatch httpPatch = new HttpPatch(url);
			httpPatch.setEntity(strEntity);
			httpReq = httpPatch;
			break;
		case PUT:
			HttpPut httpPut = new HttpPut(url);
			httpPut.setEntity(strEntity);
			httpReq = httpPut;
			break;
		case DELETE:
			httpReq = new HttpDelete(url);
			break;
		default:
			httpReq = new HttpGet(url);
			break;
		}

		// @formatter:on

		List<String> headerNames = new ArrayList<>();
		if (inputHeaders != null) {
			for (Map.Entry<String, String> entry : inputHeaders.entrySet()) {
				headerNames.add(entry.getKey());
				if (FORWARDED_HEADERS.contains(entry.getKey().toUpperCase())) {
					httpReq.addHeader(entry.getKey(), entry.getValue());
				}
			}
		}
		return httpReq;

	}

	@Override
	public ApiResponseDto runThirdPartyAPI(ThirdPartyApiReqDto apiReqDto) {

		UriComponentsBuilder ucb = UriComponentsBuilder.fromUriString(apiReqDto.getUrl().trim());
		Object httpReq = getHttpReqObject(apiReqDto, null, ucb, false);
		return executeAPI(1, 30, httpReq, false);
	}
	
	@Override
	public ApiResponseDto callLegacyAPI(ThirdPartyApiReqDto apiReqDto,String uriCode) {
		VendorDao vendorDao = vendorService.getActiveByVendorType(VendorTypeEnum.LEGACY);
		JsonObject jsonObject = new JsonParser().parse(vendorDao.getVendorDetails()).getAsJsonObject();
		String uri=vendorDao.getBaseurl() + jsonObject.getAsJsonObject("data").get(uriCode).getAsString();
		apiReqDto.setUrl(uri);
		UriComponentsBuilder ucb = UriComponentsBuilder.fromUriString(apiReqDto.getUrl().trim());
		Object httpReq = getHttpReqObject(apiReqDto, null, ucb, false);
		return executeAPI(vendorDao.getRetryCount(), vendorDao.getTimeOutSeconds(), httpReq, false);
	}
	
	
}
