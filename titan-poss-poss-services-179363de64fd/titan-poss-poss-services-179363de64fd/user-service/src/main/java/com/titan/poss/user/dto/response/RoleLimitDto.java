/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Base RoleLimitReq details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class RoleLimitDto {

	private Integer id;

	private String ownerType;

	private Integer reqDocNo;

	private String requestRemarks;

	private String requesterName;

	private String status;

	private List<String> address;

	private String roleName;

	private Date reqDocDate;

}
