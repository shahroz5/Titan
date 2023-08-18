package com.titan.poss.payment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.ConfigDaoExt;

@Repository("configRepository")
public interface ConfigRepositoryExt extends JpaRepository<ConfigDaoExt, String> {
	/**
	 * This method will return the Payment Configuration details based on the
	 * configId.
	 * 
	 * @param configId
	 * @return ConfigDaoExt
	 */
	ConfigDaoExt findOneByConfigId(String configId);

	/**
	 * 
	 * @param excludeConfigId
	 * @param configType
	 * @return ConfigDaoExt
	 */
	ConfigDaoExt findByConfigIdAndConfigType(String excludeConfigId, String configType);

	@Query("SELECT cd FROM ConfigDaoExt cd WHERE (:description IS NULL OR cd.description LIKE '%'+:description +'%') AND (:isActive IS NULL OR cd.isActive = :isActive)")
	Page<ConfigDaoExt> findAllConfigNames(@Param("description")String description, @Param("isActive")Boolean isActive, Pageable pageable);

}
