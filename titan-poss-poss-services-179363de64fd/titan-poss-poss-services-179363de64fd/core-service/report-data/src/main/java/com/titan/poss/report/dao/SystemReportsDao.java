/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.report.dao;

import com.titan.poss.core.dao.AuditableEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "system_reports")
@EqualsAndHashCode(callSuper = false)
public class SystemReportsDao extends AuditableEntity implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "scheduled_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date scheduleTime;

    @Column(name = "completion_time")
    private Date completionTime;

    @Column(name = "total_time")
    private Long totalTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_master_id")
    private ReportMasterDao reportMaster;

    @Column(name = "status")
    private String status;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "search_from_date")
    private Date searchFromDate;

    @Column(name = "search_to_date")
    private Date searchToDate;

    }
