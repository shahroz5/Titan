/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface OtpService {

	public void sendOTP(String id,String fileType, String otpType);

	public void validateOTP(String id, String otpType, String token);
}
