/*  
 * Copyright 2019. Titan Company Limited
*/
package com.titan.poss.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class for ACL group details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AclGroupResponse {
	private String aclGroupCode;
	private String description;
	private Boolean isLeaf;
	private String parentAclGroupCode;

}
