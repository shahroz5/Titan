/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dao.base;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/*
* The persistent class BaseAclMaster for the acl_master database table.
*/
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BaseAcl extends MasterAuditableEntity {

	@Id
	@Column(name = "acl_code", unique = true, nullable = false, length = 50)
	private String aclCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "acl_group", nullable = false, length = 100)
	private String aclGroup;

	@Column(name = "is_corp_can_access", nullable = true)
	private Boolean isCorpCanAccess;

	@Column(name = "access_type", nullable = false)
	private String accessType;

}
