/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.exception;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@EqualsAndHashCode(callSuper = false)
public class FieldErrorResponse extends ErrorResponse implements Serializable {

	private static final long serialVersionUID = 3405962975008208217L;
	private List<FieldErrorResource> fieldErrors;

	public FieldErrorResponse() {
		super();
	}

	public FieldErrorResponse(String code, String message, String traceId, Map<String, String> dynamicValues) {
		super(code, message, traceId, null, dynamicValues);
	}

	public List<FieldErrorResource> getFieldErrors() {
		return fieldErrors;
	}

	public void setFieldErrors(List<FieldErrorResource> fieldErrors) {
		this.fieldErrors = fieldErrors;
	}

}