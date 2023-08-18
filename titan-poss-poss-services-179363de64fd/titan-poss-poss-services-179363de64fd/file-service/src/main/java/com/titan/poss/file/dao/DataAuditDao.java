/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.file.dao;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * DAO for <b>data_audit</b> table.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "data_audit")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class DataAuditDao implements java.io.Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;
	
	@Column(name = "data", columnDefinition = "NVARCHAR", nullable = false, length = 4000)
	private String data;
	
	@Column(name = "error_message", columnDefinition = "NVARCHAR", nullable = false, length = 4000)
	private String errorMessage;
	
	@OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.MERGE)
	@JoinColumn(name = "file_id", nullable = false)
	private FileAuditDao fileAudit;
	
	@Column(name = "primary_data")
	private String primaryData;
	
	@Column(name = "error_type")
	private String errorType;
	
}
