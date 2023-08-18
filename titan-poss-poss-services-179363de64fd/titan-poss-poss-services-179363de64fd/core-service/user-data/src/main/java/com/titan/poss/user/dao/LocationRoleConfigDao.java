/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.user.dao;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.user.dao.base.BaseLocationRoleConfig;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>location_role_config</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "UserLocationRoleConfig")
@Table(name = "location_role_config")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class LocationRoleConfigDao extends BaseLocationRoleConfig implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_code", nullable = false)
	private RoleDao role;

}
