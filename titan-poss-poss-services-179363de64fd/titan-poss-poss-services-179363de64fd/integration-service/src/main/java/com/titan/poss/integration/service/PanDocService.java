package com.titan.poss.integration.service;

import com.titan.poss.core.dto.PanDocDetailsResponseDto;

public interface PanDocService {

	PanDocDetailsResponseDto verifyPanDetails(String vendorCode, String verificationType, String panCardNo);

}
