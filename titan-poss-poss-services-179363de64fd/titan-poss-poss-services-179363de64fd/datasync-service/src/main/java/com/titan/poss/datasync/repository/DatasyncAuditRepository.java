/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dao.DatasyncId;
import com.titan.poss.datasync.dto.DatasyncAuditResponseDto;
import com.titan.poss.datasync.dto.NotificationRequestDto;
import com.titan.poss.datasync.dto.StatusCountDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface DatasyncAuditRepository extends JpaRepository<DatasyncAuditDao, DatasyncId> {

	List<DatasyncAuditDao> findById(String id);

	List<DatasyncAuditDao> findByDestination(String destination);

	DatasyncAuditDao findByIdAndDestination(String id, String destination);

	@Transactional
	@Modifying
	@Query("UPDATE DatasyncAuditDao d set d.status = :status,d.lastModifiedDate = :date,d.exception = NULL WHERE d.id = :id AND d.destination = :destination")
	void updateDatasyncAuditStatusById(@Param("id") String id, @Param("status") String status,
			@Param("destination") String destination, @Param("date") Date date);

	@Transactional
	@Modifying
	@Query("UPDATE DatasyncAuditDao d set d.status = :status, d.messageRefId = :msgRefId,d.lastModifiedDate = :date  WHERE d.id = :id")
	void updateMessageRefIdAndStatusById(@Param("id") String id, @Param("msgRefId") String messageRefId,
			@Param("status") String status, @Param("date") Date date);
	
	@Transactional
	@Modifying
	@Query("UPDATE DatasyncAuditDao d set d.status = :status, d.messageRefId = :msgRefId,d.lastModifiedDate = :date  WHERE d.id = :id AND d.destination= :dest")
	void updateMessageRefIdAndStatusAndDestinationById(@Param("id") String id, @Param("msgRefId") String messageRefId,
			@Param("status") String status, @Param("dest") String dest, @Param("date") Date date);

	List<DatasyncAuditDao> findTop10ByIsNotifiedOrderByLastModifiedDateDesc(Boolean notified);

	/**
	 * @param messageId
	 * @param status
	 * @param exception
	 * @param date
	 */
	@Transactional
	@Modifying
	@Query("UPDATE DatasyncAuditDao d set d.status = :status, d.exception = :exception, d.lastModifiedDate = :date WHERE d.id = :id AND d.destination = :destination")
	void updateDatasyncAuditStatusByIdAndDestination(@Param("id") String id, @Param("status") String status,
			@Param("exception") String exception, @Param("destination") String destination, @Param("date") Date date);

	Page<DatasyncAuditDao> findByStatusInAndDataflowDirectionAndSource(List<String> status, String dataFlowDirection,String source,
			Pageable pageable);
	
	@Query("SELECT new com.titan.poss.datasync.dto.StatusCountDto (d.status, count(d)) FROM DatasyncAuditDao d"
			+ " WHERE d.messageType !='NOTIFICATION' AND d.syncTime >= :date1 AND d.syncTime < :date2 "
			+ " AND ((d.destination =:location OR nullif(CHOOSE(1,:location),'') IS NULL)"
			+ " OR (d.source =:location OR nullif(CHOOSE(1,:location),'') IS NULL)) GROUP BY d.status")
	List<StatusCountDto> getStatusCount(@Param("date1") long date1, @Param("date2") long date2,
			@Param("location") String location);
	

	@Query("SELECT new com.titan.poss.datasync.dto.DatasyncAuditResponseDto (d.id,d.destination,d.source,d.operation,"
			+ "d.dataflowDirection,d.messageRefId,d.status,d.messageType,d.exception,d.syncTime ) FROM DatasyncAuditDao d WHERE"
			+ " d.messageType !='NOTIFICATION' AND d.syncTime >= :date1 AND d.syncTime < :date2"
			+ " AND d.status = :status AND ((d.destination =:location OR nullif(CHOOSE(1,:location),'') IS NULL)"
			+ " OR (d.source =:location OR nullif(CHOOSE(1,:location),'') IS NULL)) ")
	Page<DatasyncAuditResponseDto> listMessage(@Param("date1") long date1, @Param("date2") long date2,
			@Param("location") String location, @Param("status") String status, Pageable pageable);

	
	@Transactional
	@Modifying
	@Query("UPDATE DatasyncAuditDao d "
			+ "SET d.status = CASE "
			+ "WHEN (status='IN_QUEUE' AND :#{#ntfy.status} IN ('RECEIVED','SYNCED','DISCARDED','FAILED_CONFLICT','FAILED_DEPENDENCY','FAILED_PERSIST')) THEN  :#{#ntfy.status} "
			+ "WHEN (status IN ('FAILED_CONFLICT','FAILED_DEPENDENCY','FAILED_PERSIST','RECEIVED') AND  :#{#ntfy.status} IN ('SYNCED','DISCARDED','FAILED_CONFLICT','FAILED_DEPENDENCY','FAILED_PERSIST')) THEN  :#{#ntfy.status} " 
			+ "ELSE status END, d.syncTime = :syncTime "
			+ "WHERE d.id = :#{#ntfy.messageId} AND d.destination = :#{#ntfy.destination}")
	void updateDataSyncWithNotification(@Param("ntfy")NotificationRequestDto notificationRequest,@Param("syncTime") long syncTime);

	@Transactional
	@Modifying
	@Query("UPDATE DatasyncAuditDao d "
			+ "SET d.status = :status,"
			+ "d.lastModifiedDate = :date WHERE d.id = :#{#ntfy.notificationId} AND d.destination = :#{#ntfy.source}")
	void updateNotification(@Param("ntfy") NotificationRequestDto notificationRequest, @Param("status") String status,
			@Param("date") Date date);

	

}
