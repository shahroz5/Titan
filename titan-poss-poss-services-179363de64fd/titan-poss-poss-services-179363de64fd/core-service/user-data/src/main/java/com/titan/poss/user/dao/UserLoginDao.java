/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.user.dao;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;

import com.titan.poss.user.dao.base.BaseUserLogin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>user_login</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "UserLogin")
@Table(name = "user_login")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE user_login SET is_login_active = 0 WHERE user_name = ?")
@ToString(callSuper = true)
public class UserLoginDao extends BaseUserLogin implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@EqualsAndHashCode.Exclude
	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_code", nullable = false)
	private EmployeeDao employee;

}
