/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.repository;

import com.titan.poss.report.dao.ReportMasterDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("reportMasterRepository")
public interface ReportMasterRepository extends JpaRepository<ReportMasterDao, String> {

}
