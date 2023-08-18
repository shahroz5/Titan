/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.report.repository;


import com.titan.poss.report.dao.ReportSchedulerDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("reportSchedulerRepository")
public interface ReportSchedulerRepository  extends JpaRepository<ReportSchedulerDao, String> {
}
