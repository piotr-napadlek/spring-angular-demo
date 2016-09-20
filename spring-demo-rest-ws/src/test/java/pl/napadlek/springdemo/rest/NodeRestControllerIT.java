package pl.napadlek.springdemo.rest;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import pl.napadlek.springdemo.service.NodeService;

import javax.inject.Inject;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "/spring-test-context.xml")
@WebAppConfiguration
public class NodeRestControllerIT {

    @Inject
    private NodeService nodeService;

    @Inject
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    public void testFindRootNodes() throws Exception {
        // given
        // when
        ResultActions resultActions = this.mockMvc.perform(get("/nodes/").accept(MediaType.APPLICATION_JSON));
        // then
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[0].value").value(1d))
                .andExpect(jsonPath("$[1].value").value(2d))
                .andExpect(jsonPath("$[0].rootSum").value(1d))
                .andExpect(jsonPath("$[1].rootSum").value(2d));
    }

    @Test
    public void testFindChildrenNodes() throws Exception {
        // given
        // when
        ResultActions resultActions = this.mockMvc.perform(get("/nodes/3?parentRootSum=10.1").accept(MediaType.APPLICATION_JSON));
        // then
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(4))
                .andExpect(jsonPath("$[1].id").value(5))
                .andExpect(jsonPath("$[0].value").value(1.11d))
                .andExpect(jsonPath("$[1].value").value(1.12d))
                .andExpect(jsonPath("$[0].rootSum").value(closeTo(11.21d, 0.000_001)))
                .andExpect(jsonPath("$[1].rootSum").value(closeTo(11.22d, 0.000_001)));
    }

    @Test
    public void testUpdateNode() throws Exception {
        // given
        // when
        ResultActions response = this.mockMvc.perform(
                put("/nodes?parentRootSum=1")
                        .content(Files.readAllBytes(Paths.get(this.getClass().getResource("nodeToSave.json").toURI())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON));
        // then
        response
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.rootSum").value(closeTo(101., 0.000_001)));
    }

    @Ignore
    @Test
    public void testRemoveNode() throws Exception {
        // TODO implement simple delete integration test
    }

}
