package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.OrderDao;

@Repository
public interface OrderRepository extends JpaRepository<OrderDao, String> {

	//@formatter:off
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE sales_order \r\n"
			+ " SET paid_value = :paidValue, \r\n"
			+ " last_modified_by = :lastModifiedBy, \r\n"
			+ " last_modified_date = :lastModifiedDate \r\n"
			+ " WHERE id IN (:idList)")
	//@formatter:on
	Integer updatePaidValidByIdIn(@Param(value = "idList") Set<String> idList,
			@Param(value = "paidValue") BigDecimal paidValue, @Param(value = "lastModifiedBy") String lastModifiedBy,
			@Param(value = "lastModifiedDate") Date lastModifiedDate);

	List<OrderDao> findAllBySalesTxnIdIn(List<String> salesTransactionIdList);
}
