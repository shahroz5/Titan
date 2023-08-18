/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.BinRequestDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository
public interface BinRequestRepository extends JpaRepository<BinRequestDao, Integer> {

	@Query("SELECT b FROM BinRequestDao b WHERE b.status = 'REQUESTED' AND (b.reqLocationCode =:locationCode OR :locationCode IS NULL)")
	Page<BinRequestDao> getAllRequests(@Param("locationCode") String locationCode, Pageable pageable);

	Long countByStatusIn(List<String> status);

	BinRequestDao findOneByBinNameAndStatusIn(String bin, List<String> status);

	// for history
	@Query("select b from BinRequestDao b where (b.reqDocNo = :reqDocNo OR :reqDocNo IS NULL) and "
			+ " (b.reqFiscalYear = :reqFiscalYear OR :reqFiscalYear IS NULL) and (b.binName = :binName OR :binName IS NULL) and "
			+ " (b.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) and b.status in (:statuses) and "
			+ " b.approvalDate between :startDate and :endDate and b.reqLocationCode = :reqLocationCode")
	Page<BinRequestDao> listBinRequestHistory(@Param("reqDocNo") Integer reqDocNo,
			@Param("reqFiscalYear") Short reqFiscalYear, @Param("binName") String binName,
			@Param("binGroupCode") String binGroupCode, @Param("statuses") List<String> statuses,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("reqLocationCode") String reqLocationCode, Pageable pageable);

}
