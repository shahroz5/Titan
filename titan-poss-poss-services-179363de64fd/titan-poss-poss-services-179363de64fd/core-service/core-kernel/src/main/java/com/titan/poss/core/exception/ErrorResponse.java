/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.exception;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ErrorResponse implements Serializable {
	private static final long serialVersionUID = 1L;
	private String code;
	private String message;
	private String traceId;
	private Long timestamp;
	private Object errorCause;
	private Map<String, String> dynamicValues;

	public ErrorResponse() {
	}

	public ErrorResponse(String code, String message, String traceId, Object errorCause) {
		super();
		this.code = code;
		this.message = message;
		this.traceId = traceId;
		this.timestamp = Instant.now().toEpochMilli();
		this.errorCause = errorCause;
	}

	public ErrorResponse(String code, String message, String traceId, Object errorCause,
			Map<String, String> dynamicValues) {
		super();
		this.code = code;
		this.message = message;
		this.traceId = traceId;
		this.timestamp = Instant.now().toEpochMilli();
		this.errorCause = errorCause;
		this.dynamicValues = dynamicValues;
	}

}