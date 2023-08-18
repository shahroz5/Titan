/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.user.notification.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "user_emitter_mapping")
@EqualsAndHashCode(callSuper = false)
public class UserEmitterMappingDao extends AuditableEntity implements java.io.Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;
	
	@Column(name = "employee_code")
	private String employeeCode;
	
	
	@Column(name = "emitter")
	private byte[] sseEmitter;
	

	// For role_Code join with EmployeeRoleMapping	
	
}
