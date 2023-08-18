/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
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
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class LocationCreditNoteDetails extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@NotNull
	private Integer suspendingCNs;
	@NotNull
	private Integer transferredCNs;
	@NotNull
	private Integer activatedCNs;
	@NotNull
	private Integer maxNoOfCN;
	@NotNull
	private Integer otpForMinCN;
	private Boolean isEmployeeLoanCNCancel;
	private Boolean isEmployeeLoanCNTransfer;
	private Boolean isEVoucherCnCancellationAllowed;
	private Boolean isEVoucherCnTransferAllowed;
	private Boolean isQcgcCnCancellationAllowed;
	private Boolean isQcgcCnTransferAllowed;
	private Boolean isGvCnCancellationAllowed;
	private Boolean isGvCnTransferAllowed;
	private Boolean isGhsCnCancellationAllowed;
	private Boolean isGhsCnTransferAllowed;
	private Boolean isUploadMandatoryforThirdPartyCNWithoutOTP;

}
