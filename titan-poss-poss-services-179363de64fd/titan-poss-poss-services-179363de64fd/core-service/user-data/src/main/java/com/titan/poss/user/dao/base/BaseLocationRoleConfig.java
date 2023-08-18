/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dao.base;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/*
* The persistent class BaseRoleMaster for the role_master database table.
*/
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class BaseLocationRoleConfig extends MasterAuditableEntity {

	@Id
	@GeneratedValue(strategy = IDENTITY)
	public Integer id;

	@Column(name = "location_code", nullable = false, length = 20)
	private String locationCode;

	@Column(name = "user_limit", nullable = false)
	private Short userLimit;

	@Column(name = "assigned_users", nullable = false)
	private Short assignedUsers;

	@Column(name = "is_default", nullable = false)
	private boolean isDefault;

}
