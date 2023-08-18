package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.OrderDetailsDao;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetailsDao, String> {

	List<OrderDetailsDao> findAllByOrderId(@Param("orderId") String orderId);

}
