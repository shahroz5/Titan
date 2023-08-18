package com.titan.poss.integration.intg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.titan.poss.integration.intg.dao.DbBackupAuditDao;

public interface DbBackupAuditRepository extends JpaRepository<DbBackupAuditDao, Integer>{
	List<DbBackupAuditDao> findByFileNameAndVersion(String fileName, Integer version);
	List<DbBackupAuditDao>  findByFileName(String fileName);
	DbBackupAuditDao findByFileNameAndStatus(String fileName, String status);
}
