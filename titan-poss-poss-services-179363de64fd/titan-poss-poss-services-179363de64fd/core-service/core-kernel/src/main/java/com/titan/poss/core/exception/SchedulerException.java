/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SuppressWarnings("serial")
@Data
@EqualsAndHashCode(callSuper = false)
public class SchedulerException extends RuntimeException {

	private final String correlationId; // non mandatory

	private final Throwable data; // object which failed

	private final String primaryData; // key-- for your object

	private final String errorMessage; // ---- throwable.getMessage()

	private final String jobCode; // ---- // we can configure

	private final String errorCode;

	/**
	 * @param correlationId CorrelationId before exception occurred
	 * @param data          Object details of ex
	 * @param primaryData   Custom key to identify Object detail.
	 * @param errorMessage  Custom message with details to be used for debugging by
	 *                      the consumer
	 * @param jobCode       Constant based on the scenarios, exception occurred.
	 * @param errorCode     Standard error code from error-mesages.properties file
	 */
	public SchedulerException(String correlationId, Throwable data, String primaryData, String errorMessage,
			String jobCode, String errorCode) {
		super(errorMessage, data);
		this.correlationId = correlationId;
		this.data = data;
		this.primaryData = primaryData;
		this.errorMessage = errorMessage;
		this.jobCode = jobCode;
		this.errorCode = errorCode;
	}

	@Override
	public String toString() {
		return "SchedulerException [errorCode = " + errorCode + ", errorMessage = " + errorMessage + ", errorCause = "
				+ primaryData + ", errorDetails = " + data + "]";
	}

}
