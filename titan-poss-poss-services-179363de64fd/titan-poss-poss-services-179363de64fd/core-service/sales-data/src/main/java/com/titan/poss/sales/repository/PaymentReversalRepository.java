package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.PaymentReversalDao;

@Repository("salesPaymentReversalRepository")
public interface PaymentReversalRepository extends JpaRepository<PaymentReversalDao, String>{

}
