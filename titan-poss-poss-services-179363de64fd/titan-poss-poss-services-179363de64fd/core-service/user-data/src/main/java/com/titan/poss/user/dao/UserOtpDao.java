/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.user.dao;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.user.dao.base.BaseUserOtp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DAO for <b>user_otp</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "UserOtp")
@Table(name = "user_otp")
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class UserOtpDao extends BaseUserOtp implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_name", nullable = false)
	private EmployeeDao employee;

}
