/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class BankingDetails extends BaseFieldsValidator implements Serializable  {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean isBankingMandatory;
	private Boolean isPasswordMandatory;
	private Boolean enableCashDeposit;
	private Boolean enableChequeDeposit;
	private String remarksForPassword;
	private String sapCode;
	@NotNull
	private String paymentMode;

}
