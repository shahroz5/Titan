/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class IntegrationServiceException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -301995925120521576L;
	private final String errorCode;
	private final Object errorDetails;

	/**
	 * Instantiates a new integration service exception.
	 *
	 * @param message   - Custom message with details to be used for debugging by
	 *                  the consumer
	 * @param errorCode - Standard error code
	 */
	public IntegrationServiceException(String message, String errorCode) {
		super(message);
		this.errorCode = errorCode;
		this.errorDetails = null;
	}

	/**
	 * 
	 * @param message    - Custom message with details to be used for debugging by
	 *                   the consumer
	 * @param errorCode  - Standard error code
	 * @param errorCause - Cause of the exception
	 */
	public IntegrationServiceException(String message, String errorCode, Throwable errorCause) {
		super(message, errorCause);
		this.errorCode = errorCode;
		this.errorDetails = null;
	}

	/**
	 * 
	 * @param message     - Custom message with details to be used for debugging by
	 *                    the consumer
	 * @param errorCode   - Standard error code from error-mesages.properties file
	 * @param errorObject - Error Response Object with deatils
	 */
	public IntegrationServiceException(String message, String errorCode, Object errorDetails) {
		super(message);
		this.errorCode = errorCode;
		this.errorDetails = errorDetails;
	}

	public String getErrorCode() {
		return errorCode;
	}

	@Override
	public String toString() {
		return "IntegrationServiceException [errorCode=" + errorCode + ", errorMessage = " + getMessage()
				+ ", errorCause = " + this.getErrorDetails() + "]";
	}
}
