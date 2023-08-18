/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GhsDetails extends BaseFieldsValidator implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Min(value = 1, message = "suspendingCNs must be greater than 0")
	@NotNull
	private Integer noOfDaysForSuspendingGhs;
	private Integer gracePeriodAfterSuspenededGhs;
	@NotNull
	private Integer consolidateAttempts;
	private Boolean isEghsMandatory;
	private Boolean isConsentLetterUploadMandatory;
	private Boolean isClubbingGHSAccRestricted;
	private Boolean grammageCNTransfer;
	private Boolean isOtpRequired;
	private Boolean isGHSRedemptionAllowed;
	private Integer noOfDaysToBlockCustomerConfig;
	private Integer noOfDaysToBlockAdvanceBooking;
	private Boolean isAllowedToClubRivahGhsAndGhs;
	private Boolean isAllowedToClubAccountsOfSameScheme;
	private Boolean isAlowedToClubAccountsOfDiffCategory;
	private Boolean isUploadMandatoryforGHSWithoutOTP;
	private Boolean isAllowedToClubRivahGhsAndGrammage;

}
