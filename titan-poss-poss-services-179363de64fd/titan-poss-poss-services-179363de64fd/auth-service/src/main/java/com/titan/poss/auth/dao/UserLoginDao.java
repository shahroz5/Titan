/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.auth.dao;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;

import com.titan.poss.user.dao.base.BaseUserLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/*
* The persistent class for the user_login database table.
*/

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "AuthUserLogin")
@Table(name = "user_login")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE user_login SET is_login_active = 0 WHERE user_name = ?")
public class UserLoginDao extends BaseUserLogin implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.ALL)
	@JoinColumn(name = "employee_code", nullable = false)
	private EmployeeDao employee;

}
