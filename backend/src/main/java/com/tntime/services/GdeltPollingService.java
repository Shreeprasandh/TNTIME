package com.tntime.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tntime.models.GeoEvent;
import com.tntime.repositories.GeoEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
public class GdeltPollingService {

    private static final Logger log = LoggerFactory.getLogger(GdeltPollingService.class);

    private final GeoEventRepository repository;
    private final CategoryClassifier classifier;
    private final GeoLocationHelper geoHelper;
    private final WebClient webClient;
    private final ObjectMapper mapper;

    @Value("${tntime.gdelt.base-url}")
    private String gdeltBaseUrl;

    @Value("${tntime.gdelt.adm1-code}")
    private String adm1Code;

    public GdeltPollingService(GeoEventRepository repository, 
                               CategoryClassifier classifier,
                               GeoLocationHelper geoHelper,
                               WebClient.Builder webClientBuilder) {
        this.repository = repository;
        this.classifier = classifier;
        this.geoHelper = geoHelper;
        this.webClient = webClientBuilder.build();
        this.mapper = new ObjectMapper();
    }

    // Polls based on interval defined in application.yml
    @Scheduled(fixedRateString = "${tntime.gdelt.poll-interval-ms}")
    public void pollGdeltApi() {
        log.info("⚡ TNTIME: Polling GDELT API for recent events in ADM1: {}", adm1Code);

        String url = String.format("%s?query=sourcelang:tamil+ADM1CODE:%s&mode=artlist&format=json&maxrecords=50", 
                gdeltBaseUrl, adm1Code);

        webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> {
                    log.error("GDELT API error: " + e.getMessage());
                    return Mono.empty();
                })
                .subscribe(this::processGdeltResponse);
    }

    private void processGdeltResponse(String jsonBody) {
        try {
            JsonNode root = mapper.readTree(jsonBody);
            JsonNode articles = root.path("articles");
            if (articles.isMissingNode() || !articles.isArray()) {
                return;
            }

            for (JsonNode article : articles) {
                String title = article.path("title").asText("");
                String url = article.path("url").asText("");
                
                if (title.isBlank() || url.isBlank()) continue;

                GeoEvent event = new GeoEvent();
                event.setTitle(title);
                event.setSourceUrl(url);
                event.setEventTime(LocalDateTime.now()); // Using current time for live prototype feel
                
                String category = classifier.classify(title);
                event.setCategory(category);
                
                // Set urgency/severity
                event.setSeverity(category.equals("ACCIDENT") || category.equals("CRIME") ? "HIGH" : "MEDIUM");

                String[] districtRef = new String[1];
                event.setLocation(geoHelper.geocodeText(title, districtRef));
                event.setDistrict(districtRef[0]);

                repository.save(event);
                log.debug("Saved GDELT event: [{}] {}", category, title);
            }
            log.info("GDELT poll complete. Parsed {} records.", articles.size());

        } catch (Exception e) {
            log.error("Error parsing GDELT JSON", e);
        }
    }
}
