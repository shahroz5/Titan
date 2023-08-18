/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "credit_note_master")
@EqualsAndHashCode(callSuper = false)
public class CreditNoteMasterDao extends MasterSyncableEntity implements Serializable {

	/**
	* 
	*/
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "credit_note_type")
	private String creditNoteType;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "config_details", columnDefinition = "NVARCHAR")
	private String configDetails;

	@Column(name = "is_active")
	private Boolean isActive;
	

}
