/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.user.dao.base.BaseEmployeeRoleMapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/*
* The persistent class BaseRoleMaster for the role_master database table.
*/
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity(name = "AuthEmployeeRoleMapping")
@Table(name = "employee_role_mapping")
public class EmployeeRoleMappingDao extends BaseEmployeeRoleMapping implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_code", nullable = false)
	private EmployeeDao employee;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_code", nullable = false)
	private RoleDao role;

	@Override
	public String toString() {
		return "EmployeeRoleMappingDao [id=" + id + ", employee=" + employee + ", role=" + role + ", toString()="
				+ super.toString() + "]";
	}

}
