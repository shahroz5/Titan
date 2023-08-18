/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.exception;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FieldErrorResource implements Serializable {

	private static final long serialVersionUID = 993025984162795163L;
	private String field;
	private String message;
	private Object inputValue;

	public FieldErrorResource() {
		super();
	}

	public FieldErrorResource(String field, String message, Object inputValue) {
		super();
		this.field = field;
		this.message = message;
		this.inputValue = inputValue;
	}

}