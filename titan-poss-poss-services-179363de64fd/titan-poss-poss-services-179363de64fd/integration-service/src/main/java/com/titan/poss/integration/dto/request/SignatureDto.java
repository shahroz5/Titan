/**
 * 
 */
package com.titan.poss.integration.dto.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.CertificateTypeEnum;

import lombok.Data;

/**
 * @author Mindtree
 * @version 1.0
 */
@Data
public class SignatureDto {

	@NotNull
	@NotBlank
	private String toSign;

	@NotNull
	private CertificateTypeEnum certificateType;

}
