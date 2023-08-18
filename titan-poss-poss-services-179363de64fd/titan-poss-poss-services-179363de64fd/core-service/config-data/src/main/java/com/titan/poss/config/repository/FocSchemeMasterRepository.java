package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeMasterDao;

@Repository
public interface FocSchemeMasterRepository extends JpaRepository<FocSchemeMasterDao, String> {

	/**
	 * @param id
	 * @return FocSchemeMasterDao
	 */
	FocSchemeMasterDao findOneById(String id);

}
