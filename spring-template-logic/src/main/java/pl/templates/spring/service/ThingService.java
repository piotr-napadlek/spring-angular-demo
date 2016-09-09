package pl.templates.spring.service;

import org.springframework.stereotype.Service;
import pl.templates.spring.entity.ThingBE;
import pl.templates.spring.repository.ThingRepository;

import javax.inject.Inject;
import java.util.List;

@Service
public class ThingService {

    @Inject
    private ThingRepository thingRepository;


    public List<ThingBE> findAllThings() {
        return thingRepository.findAll();
    }
}
