package pl.napadlek.springdemo.runner;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.session.HashSessionIdManager;
import org.eclipse.jetty.server.session.HashSessionManager;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.WebAppContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EmbeddedJetty {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmbeddedJetty.class);

    private static final int DEFAULT_PORT = 9713;

    public static void main(String[] args) throws Exception {
        new EmbeddedJetty().startJetty(DEFAULT_PORT);
    }

    private void startJetty(int port) throws Exception {
        Server server = new Server(port);

        WebAppContext wac = new WebAppContext();
        wac.setBaseResource(Resource.newClassPathResource("/"));
        wac.setDescriptor("WEB-INF/web.xml");
        wac.setHandler(new SessionHandler(new HashSessionManager()));
        LOGGER.info(wac.getResourceBase());
        server.setHandler(wac);
        server.setSessionIdManager(new HashSessionIdManager());
        server.start();
        LOGGER.info("Server started at port {}", port);
        server.join();
    }
}
