package org.cxt.repository;

import java.util.List;

import org.cxt.entity.Function;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface FunctionDao extends
	PagingAndSortingRepository<Function, String>,
	JpaSpecificationExecutor<Function> {
	
	@Query(value = " ", nativeQuery = true)
	List<Object[]> list(Long id, List<Integer> typeList, String campusName,
			int iDisplayStart, int iDisplayLength);
}

