package pl.napadlek.springdemo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.napadlek.springdemo.entity.NodeBE;

import java.util.List;

public interface NodeRepository extends JpaRepository<NodeBE, Long> {

    @Query("select node from NodeBE node where node.parentNode.id = :parentId")
    List<NodeBE> findChildren(@Param("parentId") long parentId);

    @Query("select node from NodeBE node where node.parentNode is null")
    List<NodeBE> findRootNodes();

}
