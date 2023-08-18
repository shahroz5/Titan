/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.dao;

import com.titan.poss.core.dao.AuditableEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "report_master")
@EqualsAndHashCode(callSuper = false)
public class ReportMasterDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "report_name")
	private String reportName;

	@Column(name = "report_type")
	private String reportType;

	@Column(name = "report_group")
	private String reportGroup;

	@Column(name = "report_description")
	private String reportDescription;

	@Column(name = "access_type")
	private String accessType;

	@Column(name = "format_type")
	private String formatType;

	@Column(name = "max_no_days")
	private Integer maxNoOfDays;

	@Column(name = "tbl_content")
	private Boolean tblContent;

	@Column(name = "lt_margin")
	private Integer ltMargin;

	@Column(name = "rt_margin")
	private Integer rtMargin;

	@Column(name = "tp_margin")
	private Integer tpMargin;

	@Column(name = "bt_margin")
	private Integer btMargin;

	@Column(name = "availability_days")
	private Integer availabilityDays;

    @Column(name = "regeneration_time")
    private Integer regenerationTime;

}
