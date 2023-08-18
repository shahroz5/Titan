/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.exception;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SuppressWarnings("serial")
@Data
@EqualsAndHashCode(callSuper = false)
public class ServiceException extends RuntimeException {
	private final String errorCode;
	private final Object errorDetails;
	private final Map<String, String> dynamicValues;

	/**
	 * 
	 * @param message       - Custom message with details to be used for debugging
	 *                      by the consumer
	 * @param errorCode     - Standard error code from error-mesages.properties file
	 * 
	 * @param dynamicValues - to be replaced in error-messages.properties file
	 */
	public ServiceException(String message, String errorCode, Map<String, String> dynamicValues) {
		super(message);
		this.errorCode = errorCode;
		this.errorDetails = null;
		this.dynamicValues = dynamicValues;
	}

	/**
	 * 
	 * @param message       - Custom message with details to be used for debugging
	 *                      by the consumer
	 * @param errorCode     - Standard error code from error-mesages.properties file
	 * @param dynamicValues - to be replaced in error-messages.properties file
	 * @param errorCause    - Cause of the exception
	 */
	public ServiceException(String message, String errorCode, Throwable errorCause, Map<String, String> dynamicValues) {
		super(message, errorCause);
		this.errorCode = errorCode;
		this.errorDetails = null;
		this.dynamicValues = dynamicValues;
	}

	/**
	 * 
	 * @param message       - Custom message with details to be used for debugging
	 *                      by the consumer
	 * @param errorCode     - Standard error code from error-mesages.properties file
	 * @param dynamicValues - to be replaced in error-messages.properties file
	 * @param errorObject   - Error Response Object with details
	 */
	public ServiceException(String message, String errorCode, Object errorDetails, Map<String, String> dynamicValues) {
		super(message);
		this.errorCode = errorCode;
		this.errorDetails = errorDetails;
		this.dynamicValues = dynamicValues;
	}

	/**
	 * 
	 * @param message   - Custom message with details to be used for debugging by
	 *                  the consumer
	 * @param errorCode - Standard error code from error-mesages.properties file
	 */
	public ServiceException(String message, String errorCode) {
		super(message);
		this.errorCode = errorCode;
		this.errorDetails = null;
		this.dynamicValues = null;
	}

	/**
	 * 
	 * @param message    - Custom message with details to be used for debugging by
	 *                   the consumer
	 * @param errorCode  - Standard error code from error-mesages.properties file
	 * @param errorCause - Cause of the exception
	 */
	public ServiceException(String message, String errorCode, Throwable errorCause) {
		super(message, errorCause);
		this.errorCode = errorCode;
		this.errorDetails = null;
		this.dynamicValues = null;
	}

	/**
	 * 
	 * @param message     - Custom message with details to be used for debugging by
	 *                    the consumer
	 * @param errorCode   - Standard error code from error-mesages.properties file
	 * @param errorObject - Error Response Object with details
	 */
	public ServiceException(String message, String errorCode, Object errorDetails) {
		super(message);
		this.errorCode = errorCode;
		this.errorDetails = errorDetails;
		this.dynamicValues = null;
	}

	public String getErrorCode() {
		return errorCode;
	}

	@Override
	public String toString() {
		return "ServiceException [errorCode = " + errorCode + ", errorMessage = " + getMessage() + ", errorCause = "
				+ this.getErrorDetails() + ", dynamicValues = " + this.dynamicValues + "]";
	}

}
