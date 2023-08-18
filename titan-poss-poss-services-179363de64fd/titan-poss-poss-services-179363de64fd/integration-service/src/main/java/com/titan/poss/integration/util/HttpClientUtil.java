/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HttpContext;
import org.springframework.http.HttpHeaders;

import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.integration.dto.response.HttpResponseUtil;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class HttpClientUtil {

	private HttpClientUtil() {
		throw new IllegalStateException("HttpClientUtil");
	}

	/**
	 * Send http request.
	 *
	 * @param url               the url
	 * @param httpRequest       the req
	 * @param maxRetries        the max retries
	 * @param connectionTimeout the connection timeout
	 * @return the http response util
	 * @throws IOException            Signals that an I/O exception has occurred.
	 * @throws ClassNotFoundException
	 */
	public static HttpResponseUtil sendHttpRequest(Object httpRequest, Integer maxRetries, Integer connectionTimeout,
			boolean isObjRequired, String basicHeader) throws IOException {
		long startTime = System.currentTimeMillis();
		CloseableHttpClient httpclient = getHttpClient(maxRetries, connectionTimeout);

		// add headers with for loop
		HttpUriRequest hur = (HttpUriRequest) httpRequest;
		if (!StringUtils.isEmpty(basicHeader)) {
			hur.setHeader(HttpHeaders.AUTHORIZATION, "Basic " + basicHeader);
		}

		// setting a hard time out for the whole connection
		TimerTask task = new TimerTask() {
			@Override
			public void run() {
				if (hur != null) {
					hur.abort();
				}
			}
		};
		new Timer(true).schedule(task, connectionTimeout.longValue() * 1000);

		HttpResponse httpresponse = httpclient.execute(hur);
		long responseTime = System.currentTimeMillis() - startTime;
		HttpResponseUtil httpUtilResponse = new HttpResponseUtil();
		String response = null;
		if (httpresponse.getEntity() != null) {
			BufferedHttpEntity bufHttpEntity = new BufferedHttpEntity(httpresponse.getEntity());
			httpresponse.setEntity(bufHttpEntity);
			response = IOUtils.toString(bufHttpEntity.getContent(), StandardCharsets.UTF_8.name());
		}
		if (isObjRequired && response!=null) {
			Object obj = StringUtil.convertStrToJsonIfPossible(response);
			httpUtilResponse.setResponseObj(obj);
		}

		httpUtilResponse.setResponseTime(responseTime);
		httpUtilResponse.setResponse(response);
		httpUtilResponse.setHttpResponseCode(httpresponse.getStatusLine().getStatusCode());
		httpclient.close();
		return httpUtilResponse;
	}

	public static HttpResponseUtil sendHttpRequest(Object httpRequest, Integer maxRetries, Integer connectionTimeout,
			String basicHeader) throws IOException {
		return sendHttpRequest(httpRequest, maxRetries, connectionTimeout, false, basicHeader);
	}

	// PENDING Map<String, String> reqParam
	public static HttpResponseUtil getRequest(String url, Map<String, String> headers, Integer maxRetries,
			Integer connectionTimeout, String basicHeader) throws IOException {
		HttpGet getRequest = new HttpGet(url);
		if (headers != null)
			headers.forEach(getRequest::addHeader);
		return sendHttpRequest(getRequest, maxRetries, connectionTimeout, basicHeader);
	}

	public static HttpResponseUtil postRequest(String url, Map<String, String> headers, Integer maxRetries,
			Integer connectionTimeout, String basicHeader) throws IOException {
		HttpPost getRequest = new HttpPost(url);
		if (headers != null)
			headers.forEach(getRequest::addHeader);
		return sendHttpRequest(getRequest, maxRetries, connectionTimeout, basicHeader);
	}

	/**
	 * Gets the http client.
	 *
	 * @param maxRetries        the max retries
	 * @param connectionTimeout the connection timeout
	 * @return the http client
	 * @throws IOException Signals that an I/O exception has occurred.
	 */
	private static CloseableHttpClient getHttpClient(Integer maxRetries, Integer connectionTimeout) {
		RequestConfig config = RequestConfig.custom().setConnectTimeout(connectionTimeout * 1000)
				.setConnectionRequestTimeout(connectionTimeout * 1000).setSocketTimeout(connectionTimeout * 1000)
				.build();

		// @formatter:off
		return HttpClients.custom()
				.setRetryHandler((IOException exception, int executionCount,
						HttpContext context) -> executionCount <= maxRetries)
				.setSSLHostnameVerifier(new NoopHostnameVerifier())
				.setDefaultRequestConfig(config)
				.useSystemProperties().build();
		// @formatter:on
	}
}
