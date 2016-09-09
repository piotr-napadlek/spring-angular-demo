package pl.templates.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.templates.spring.entity.ThingBE;

public interface ThingRepository extends JpaRepository<ThingBE, Long> {

}
