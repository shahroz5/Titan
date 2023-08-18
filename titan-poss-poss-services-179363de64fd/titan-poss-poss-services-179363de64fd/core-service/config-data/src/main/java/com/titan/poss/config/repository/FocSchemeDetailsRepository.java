package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeDetailsDao;

@Repository
public interface FocSchemeDetailsRepository extends JpaRepository<FocSchemeDetailsDao, String> {


}
