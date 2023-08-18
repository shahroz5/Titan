/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotBlank;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.validator.ApprovalCodeEmailRoleDateValidation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.util.Map;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ApprovalCodeEmailRoleDateValidation
public class GRNRequestDto extends BaseCancelGRNDto {

	@NotBlank
	private String approverRoleCode;

	private String approvalCode;
	private String ccafNo;

	private Map<@NotBlank(message = "File Type can not be blank") String, @NotNull @Size(min = 1, message = "Minimum no of tempId for a file type is {min}") List<@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String>> tempFileIds;

	private Date approvalDate;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250)
	private String requestorRemarks;
	
	private Boolean isVoid;

	@Override
	public String toString() {
		return "GRNRequestDto [approverRoleCode=" + approverRoleCode + ", approvalCode=" + approvalCode
				+ ", tempFileIds=" + tempFileIds + ", approvalDate=" + approvalDate + ", requestorRemarks="
				+ requestorRemarks + ", toString()=" + super.toString() + "]";
	}

}
