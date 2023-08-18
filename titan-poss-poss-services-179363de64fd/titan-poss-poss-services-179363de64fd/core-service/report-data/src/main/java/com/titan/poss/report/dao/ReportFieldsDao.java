/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "report_fields")
@EqualsAndHashCode(callSuper = false)
public class ReportFieldsDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "report_master_id")
	private ReportMasterDao reportMaster;

	@Column(name = "field_name")
	private String fieldName;

	@Column(name = "font_name")
	private String fontName;

	@Column(name = "height")
	private Integer height;

	@Column(name = "width")
	private Integer width;

	@Column(name = "font_size")
	private Integer fontSize;

	@Column(name = "hr_align")
	private String hrAlign;

	@Column(name = "vr_align")
	private String vrAlign;

	@Column(name = "field_type")
	private String fieldType;

	@Column(name = "is_optional")
	private Boolean isOptional;
	
	@Column(name = "column_order")
	private Integer columnOrder;
	
	@Column(name = "header_field_name")
	private String headerFieldName;
	
	@Column(name = "is_encrypted")
	private Boolean isEncrypted;
}

