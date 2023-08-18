package com.titan.poss.integration.service;

import com.titan.poss.core.dto.EmailIdValidationResponseDto;

public interface EmailIdValidationService {

	EmailIdValidationResponseDto verifyEmailId(String vendorCode, String verificationType, String emailId);

}
