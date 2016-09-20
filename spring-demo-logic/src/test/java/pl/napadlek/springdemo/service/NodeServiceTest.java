package pl.napadlek.springdemo.service;

import org.assertj.core.data.Offset;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import pl.napadlek.springdemo.dto.NodeDO;
import pl.napadlek.springdemo.entity.NodeBE;
import pl.napadlek.springdemo.repository.NodeRepository;

import java.util.Arrays;
import java.util.Collections;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class NodeServiceTest {

    @InjectMocks
    private NodeService nodeService = new NodeService();
    @Mock
    private NodeRepository nodeRepository;

    @Test
    public void shouldRecalculateChildrenRootSumsRecursively() {
        // given
        double parentRootSum = 10d;
        NodeDO nodeDO = new NodeDO() {{
            setValue(1d);
            setId(1L);
            setParentId(null);
            setSubNodes(Arrays.asList(new NodeDO() {{
                setValue(2d);
            }}));
        }};
        // when
        nodeService.calculateChildrenRootSum(parentRootSum, Collections.singletonList(nodeDO));
        // then
        assertThat(nodeDO.getRootSum()).isEqualTo(11d, Offset.offset(0.000_000_001));
        assertThat(nodeDO.getSubNodes().get(0).getRootSum()).isEqualTo(13d, Offset.offset(0.000_000_001));
        verifyNoMoreInteractions(nodeRepository);
    }

    @Test
    public void shouldCallToSaveNewEntity() {
        // given
        NodeDO nodeDO = new NodeDO() {{
            setValue(1d);
        }};
        ArgumentCaptor<NodeBE> nodeBEArgumentCaptor = ArgumentCaptor.forClass(NodeBE.class);
        Mockito.when(nodeRepository.save(any(NodeBE.class))).thenReturn(new NodeBE());
        // when
        nodeService.saveNode(nodeDO);
        // then
        verify(nodeRepository, times(1)).save(nodeBEArgumentCaptor.capture());
        verifyZeroInteractions(nodeRepository);
        NodeBE repositoryPassedValue = nodeBEArgumentCaptor.getValue();
        assertThat(repositoryPassedValue.getId()).isNull(); // saving new entity
        assertThat(repositoryPassedValue.getValue()).isEqualTo(1d);
        assertThat(repositoryPassedValue.getParentNode()).isNull();
    }

}
