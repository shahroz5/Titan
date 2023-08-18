package com.titan.poss.engine.payment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PayeeBankLocationMappingDao;
@Repository
public interface PayeeBankLocMappingRepository extends JpaRepository<PayeeBankLocationMappingDao, String>{
	
    Page<PayeeBankLocationMappingDao> findByLocationCodeAndIsDefault(String locationCode,Boolean isDefault,Pageable pageable);

}
