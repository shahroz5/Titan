/*  
 * Copyright 2019. Titan Company Limited
 *  All rights reserved.
*/
package com.titan.poss.user.dao;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;

import com.titan.poss.user.dao.base.BaseRole;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DAO for <b>role_master</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity(name = "UserRole")
@Table(name = "role_master")
@EqualsAndHashCode(callSuper = false)
@SQLDelete(sql = "UPDATE role_master SET is_active = 0 WHERE role_code = ?")
public class RoleDao extends BaseRole implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Override
	public String toString() {
		return "RoleDao [toString()=" + super.toString() + "]";
	}

}
