/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO class for ACL details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
public class AclDto {
	private String aclCode;
	private String description;
	private String aclGroup;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Boolean isAssigned;

	public AclDto(String aclCode, String description, String aclGroup) {
		super();
		this.aclCode = aclCode;
		this.description = description;
		this.aclGroup = aclGroup;
		this.isAssigned = null;
	}

}
