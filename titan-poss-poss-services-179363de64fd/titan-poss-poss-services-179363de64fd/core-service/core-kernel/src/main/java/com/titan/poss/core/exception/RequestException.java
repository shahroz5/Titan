/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.exception;

import org.springframework.validation.Errors;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SuppressWarnings("serial")
public class RequestException extends RuntimeException {
	private final Errors errors;





	public RequestException(String message, Errors errors) {
		super(message);
		this.errors = errors;
	}





	public Errors getErrors() {
		return errors;
	}
}
