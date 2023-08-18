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
@Table(name = "sms_intg_audit")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SMSIntgAudit extends BaseNotificationIntgEntity implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "mobile_no", unique = true, nullable = false, length = 20)
	private String mobileNo;

	@Column(name = "req_body", columnDefinition = "NVARCHAR", nullable = false, length = 200)
	private String reqBody;

}
