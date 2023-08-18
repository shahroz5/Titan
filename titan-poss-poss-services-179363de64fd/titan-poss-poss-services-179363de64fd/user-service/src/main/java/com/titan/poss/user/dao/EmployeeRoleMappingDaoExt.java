/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.user.dao.base.BaseEmployeeRoleMapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity(name = "UserEmployeeRoleMappingExt")
@Table(name = "employee_role_mapping")
public class EmployeeRoleMappingDaoExt extends BaseEmployeeRoleMapping implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	public String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_code", nullable = false)
	private RoleDao role;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_code", nullable = false)
	private EmployeeDao employee;

	@Override
	public String toString() {
		return "EmployeeRoleMappingDaoExt [id=" + id + ", role=" + role.getRoleCode() + ", employee="
				+ employee.getEmployeeCode() + ", toString()=" + super.toString() + "]";
	}

}
