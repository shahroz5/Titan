/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for response of role limit request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RoleLimitResponseDto extends RoleLimitDto {

	private String reqLocationCode;

	private String requesterContactNo;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String approvedBy;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String approvalRemarks;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Date approvalDate;

}
