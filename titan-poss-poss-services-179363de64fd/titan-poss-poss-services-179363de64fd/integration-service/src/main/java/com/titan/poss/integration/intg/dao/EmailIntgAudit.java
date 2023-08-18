/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.integration.intg.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>email_intg_audit</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "email_intg_audit")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class EmailIntgAudit extends BaseNotificationIntgEntity implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "recipient", columnDefinition = "NVARCHAR", nullable = false, length = 150)
	private String recipient;

}
