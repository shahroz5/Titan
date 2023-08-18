/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */


package com.titan.poss.integration.intg.dao;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@Entity
@Table(name = "com_audit")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class ComAuditDao extends AuditableEntity implements  Serializable {
 
private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;
	
	@Column(name="com_order_number")
	private String comOrderNumber;
	
	@Column(name = "request", columnDefinition = "NVARCHAR", nullable = false,length = 4000)
	private String request;
	
	@Column(name = "response", columnDefinition = "NVARCHAR", nullable = false, length = 4000)
	private String response;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "request_time")
	private Date requestTime;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "response_time")
	private Date responseTime;
	
	@Column(name="com_type")
	private String comType;
	
	
}
