package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.BinToBinFileStageDao;

@Repository
public interface BinToBinFileStageRepository extends JpaRepository<BinToBinFileStageDao, Integer> {

}
