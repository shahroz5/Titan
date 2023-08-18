/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetails extends BaseFieldsValidator implements Serializable  {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean isUploadDocumentAllowed;
	private Boolean isDownloadDocumentAllowed;
	private Boolean isDocumentDisplayForCC;
	@NotNull
	private Boolean isEmailForEncircleCustomer;
	@NotNull
	private Boolean isMobileNoForOneTimeCustomer;
	@NotNull
	private Boolean isEmailForOneTimeCustomer;
	@NotNull
	private Boolean isEmailForInstitutionalCustomer;
	@NotNull
	private Boolean isMobileNoForInstitutionalCustomer;
	@NotNull
	private Boolean isEmailForInternationalCustomer;
	@NotNull
	private Boolean isMobileNoForInternationalCustomer;
	
	private String catchmentName;
}
