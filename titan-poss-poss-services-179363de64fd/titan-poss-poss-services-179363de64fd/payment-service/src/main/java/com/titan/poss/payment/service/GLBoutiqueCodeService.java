/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_GL_CODE_SERVICE;

import java.util.List;


import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.GLBoutiqueCodeDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.request.GLBoutiqueCodeMappingRequestDto;
import com.titan.poss.payment.dto.request.GLBoutiqueCodeUpdateDto;
import com.titan.poss.payment.dto.response.GLBoutiqueCodeMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYMENT_GL_CODE_SERVICE)
public interface GLBoutiqueCodeService {

	/**
	 * This method will return the list of all gl_btq_codess based on the isActive.
	 * @param locationCode 
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<GLCodeDto>>
	 */
	PagedRestResponse<List<GLBoutiqueCodeDto>> listGLCodes(String locationCode, Boolean isActive, Pageable pageable);

	/**
	 * This method will return the GL Code based on the locationCode.
	 * 
	 * @param locationCode
	 * @return GLCodeDto
	 */
	GLBoutiqueCodeDto getGLCode(String locationCode);

	/**
	 * This method will save the GLCode.
	 * 
	 * @param glCodeDto
	 * @return GLCodeDto
	 */
	GLBoutiqueCodeDto addGLCode(GLBoutiqueCodeDto glCodeDto);

	/**
	 * This method will update the GL Code.
	 * 
	 * @param locationCode
	 * @param glCodeUpdateDto
	 * @return GLCodeDto
	 */
	GLBoutiqueCodeDto updateGLCode(String locationCode, GLBoutiqueCodeUpdateDto glCodeUpdateDto);

	/**
	 * This method will get the list of gl_code for based on location Code and
	 * PaymentCode.
	 *
	 * @param locationCode
	 * @return ListResponse<GLCodeMappingDto>
	 */
	PagedRestResponse<List<GLBoutiqueCodeMappingDto>> getPaymentLocationMapping(List<String> locationCode, Pageable pageable);

	/**
	 * This method will mapped the glCodes for multiple paymentCodes in multiple
	 * locations.
	 *
	 * @param glCodeMappingRequestDto
	 * @return ListResponse<GLCodeMappingRequestDto>
	 */
	ListResponse<GLBoutiqueCodeMappingDto> updatePaymentLocationMapping(
			GLBoutiqueCodeMappingRequestDto glCodeMappingRequestDto);

}
