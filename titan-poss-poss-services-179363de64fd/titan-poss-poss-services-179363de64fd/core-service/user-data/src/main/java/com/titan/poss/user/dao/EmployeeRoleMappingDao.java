/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.user.dao;

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

/**
 * DAO for <b>employee_master</b> and <b>role_master</b> mapping
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity(name = "UserEmployeeRoleMapping")
@Table(name = "employee_role_mapping")
public class EmployeeRoleMappingDao extends BaseEmployeeRoleMapping implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_code", nullable = false)
	private RoleDao role;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_code", nullable = false)
	private EmployeeDao employee;

	@Override
	public String toString() {
		return "EmployeeRoleMappingDao [id=" + id + ", role=" + role.getRoleCode() + ", employee="
				+ employee.getEmployeeCode() + "]";
	}

}
