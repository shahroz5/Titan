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

import com.titan.poss.core.dao.AuditableEntity;

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
@Table(name = "file_sequence")
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class FileSequenceDao extends AuditableEntity implements java.io.Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;
	
	@OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.MERGE)
	@JoinColumn(name = "file_master_id", nullable = false)
	private FileMasterDao fileMaster;
	
	@Column(name = "sequence_no")
	private Integer sequenceNo;
	
	@Column(name = "fiscal_year")
	private Integer fiscalYear;
	
}
