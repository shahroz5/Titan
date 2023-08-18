/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.titan.poss.core.exception.ErrorResponse;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;

import brave.Tracer;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class IntegrationCustomExceptionHandler extends ResponseEntityExceptionHandler {

	@Autowired
	private Tracer tracer;

	private static final String TRACE_ID_IS = "Trace ID is  :  {}";

	private static final Logger EXCEPTION_LOGGER = LoggerFactory.getLogger(IntegrationCustomExceptionHandler.class);

	// Amazon Service Exception
	// server side error which occurs in S3 like login error
	@ExceptionHandler(AmazonS3Exception.class)
	protected ResponseEntity<Object> handleServiceException(AmazonS3Exception e, WebRequest request) {
		return handleS3Error(e, request);
	}

	// Amazon Client Exception
	// when from client side in application running some error comes
	// like while send a request, AWS response parsing, trying to access S3 n/w not
	// available
	@ExceptionHandler(SdkClientException.class)
	protected ResponseEntity<Object> handleServiceException(SdkClientException e, WebRequest request) {
		return handleS3Error(e, request);
	}

	private ResponseEntity<Object> handleS3Error(Exception e, WebRequest request) {

		StringWriter sw = new StringWriter();
		e.printStackTrace(new PrintWriter(sw));
		EXCEPTION_LOGGER.error("AmazonS3Exception Error Details: \n{}", sw);

		if (e instanceof AmazonS3Exception) {

			// check for generic error for key doesn't exist in S3 bucket
			AmazonS3Exception amazonException = (AmazonS3Exception) e;
			int status = amazonException.getStatusCode();
			String errorCode = amazonException.getErrorCode();
			if (status == HttpStatus.NOT_FOUND.value() && errorCode.equalsIgnoreCase("NoSuchKey")) {
				String errCode = "ERR-INT-004";
				String errMessage = "File doesn't exist in S3.";
				return throwErrorByCodeAndMessageInput(e, request, errCode, errMessage);
			}
		}

		String errCode = "ERR-INT-003";
		String errMessage = "Online storage operation failed.";
		return throwErrorByCodeAndMessageInput(e, request, errCode, errMessage);
	}

	private ResponseEntity<Object> throwErrorByCodeAndMessageInput(Exception e, WebRequest request, String errCode,
			String errMessage) {
		ErrorResponse error = new ErrorResponse(errCode, getErrMessageFromProperty(errCode, errMessage),
				tracer.currentSpan().context().spanIdString(), null);

		if (EXCEPTION_LOGGER.isDebugEnabled()) {
			EXCEPTION_LOGGER.debug(TRACE_ID_IS, tracer.currentSpan().context().spanIdString());
		}

		return throwError(e, error, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}

	private ResponseEntity<Object> throwError(Exception ex, @Nullable Object body, HttpHeaders headers,
			HttpStatus status, WebRequest request) {
		return handleExceptionInternal(ex, body, headers, status, request);
	}

	private String getErrMessageFromProperty(String errCode, String errMessage) {

		String message = ApplicationPropertiesUtil.getProperty(errCode);

		if (StringUtils.isBlank(message)) {
			message = errMessage;
		}
		return message.trim();
	}
}
