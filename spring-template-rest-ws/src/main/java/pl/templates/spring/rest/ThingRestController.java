package pl.templates.spring.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import pl.templates.spring.entity.ThingBE;
import pl.templates.spring.service.ThingService;

import javax.inject.Inject;
import java.util.List;

@RestController
@RequestMapping("/thing")
public class ThingRestController {

    @Inject
    private ThingService thingService;

    @RequestMapping(method = RequestMethod.GET)
    public List<ThingBE> getAllThings() {
        return thingService.findAllThings();
    }
}
