/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.dao;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;

import com.titan.poss.user.dao.base.BaseEmployee;

import lombok.Data;
import lombok.EqualsAndHashCode;

/*
* The persistent class for the employee_master database table.
*/
@Data
@Entity(name = "AuthEmployee")
@Table(name = "employee_master")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE employee_master SET is_active = 0 WHERE employee_code = ?")
public class EmployeeDao extends BaseEmployee implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

}
