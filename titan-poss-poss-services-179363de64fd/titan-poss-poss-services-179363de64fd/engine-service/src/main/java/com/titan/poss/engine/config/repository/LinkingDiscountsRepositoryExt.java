package com.titan.poss.engine.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.repository.LinkingDiscountsRepository;

@Repository("EngineLinkingDiscountsRepository")
public interface LinkingDiscountsRepositoryExt extends LinkingDiscountsRepository {

	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT dlm.dest_discount_id FROM discount_link_master dlm "
			+ " WHERE dlm.is_active = 1" 
			+ " AND dlm.src_discount_id = :srcDiscountId ")
	// @formatter:on
	List<String> findAllBySrcDiscountId(@Param("srcDiscountId") String srcDiscountId);

}
