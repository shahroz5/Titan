/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "credit_note_transfer")
@EqualsAndHashCode(callSuper = false)
public class CreditNoteTransferDao extends SyncableEntity implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "src_location_code")
	private String srcLocationCode;

	@Column(name = "dest_location_code")
	private String destLocationCode;

	@Column(name = "cn_details", columnDefinition = "NVARCHAR")
	private String cnDetails;

	@Column(name = "src_cn_id", columnDefinition = "uniqueidentifier")
	private String srcCnId;

	@Column(name = "dest_cn_id", columnDefinition = "uniqueidentifier")
	private String destCnId;

	@Column(name = "amount", columnDefinition = "decimal")
	private BigDecimal amount;

	@Column(name = "status")
	private String status;
	
	@Column(name = "doc_no")
	private Integer docNo;
	
	@Column(name = "fiscal_year")
	private Short fiscalYear;
	
	@Column(name = "request_date")
	private Date requestDocDate;
	
	@Column(name = "transfer_date")
	private Date transferDocDate;

}
