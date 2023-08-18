/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.exception;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@SuppressWarnings("serial")
public class ServerException extends RuntimeException {

	private final String errorCode;





	public ServerException(String message, String errorCode) {
		super(message);
		this.errorCode = errorCode;
	}





	public String getErrorCode() {
		return errorCode;
	}


}
