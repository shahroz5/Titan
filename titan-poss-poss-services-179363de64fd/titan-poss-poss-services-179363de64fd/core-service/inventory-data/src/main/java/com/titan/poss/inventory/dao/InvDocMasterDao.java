package com.titan.poss.inventory.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The persistent class for the inv_doc_master database table.
 * 
 */
@Data
@Entity
@Table(name = "inv_doc_master")
@EqualsAndHashCode(callSuper = false)
public class InvDocMasterDao extends AuditableEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "doc_no")
	private Integer docNo;

	@Column(name = "doc_type")
	private String docType;

	@Column(name = "fiscal_year")
	private Short fiscalYear;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "is_active")
	private Boolean isActive;

	public InvDocMasterDao() {
		// Empty Constructor
	}

}