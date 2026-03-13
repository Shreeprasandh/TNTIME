package com.tntime.controllers;

import com.tntime.models.GeoEvent;
import com.tntime.repositories.GeoEventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final GeoEventRepository repository;

    public EventController(GeoEventRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/live")
    public Mono<ResponseEntity<Map<String, Object>>> getLiveEvents() {
        // Fetch latest 100 events strictly within TN bounds
        List<GeoEvent> features = repository.findLatestWithinTamilNadu(100);

        // Map to GeoJSON FeatureCollection format for MapLibre
        List<Map<String, Object>> geoJsonFeatures = features.stream().map(evt -> {
            Map<String, Object> feature = new HashMap<>();
            feature.put("type", "Feature");
            
            Map<String, Object> geometry = new HashMap<>();
            geometry.put("type", "Point");
            // Location is org.locationtech.jts.geom.Point
            geometry.put("coordinates", new double[]{evt.getLocation().getX(), evt.getLocation().getY()});
            feature.put("geometry", geometry);

            Map<String, Object> props = new HashMap<>();
            props.put("id", evt.getId().toString());
            props.put("title", evt.getTitle());
            props.put("category", evt.getCategory());
            props.put("district", evt.getDistrict());
            props.put("severity", evt.getSeverity());
            props.put("sourceUrl", evt.getSourceUrl());
            props.put("eventTime", evt.getEventTime().toString());
            feature.put("properties", props);

            return feature;
        }).collect(Collectors.toList());

        Map<String, Object> geoJson = new HashMap<>();
        geoJson.put("type", "FeatureCollection");
        geoJson.put("features", geoJsonFeatures);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("aoi", "Tamil Nadu / IN25");
        response.put("timestamp", Instant.now().toString());
        response.put("count", features.size());
        response.put("data", geoJson);

        return Mono.just(ResponseEntity.ok(response));
    }

    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, String>>> health() {
        return Mono.just(ResponseEntity.ok(Map.of(
            "service", "tntime-backend",
            "status", "UP",
            "phase", "2 — Data Engine Live"
        )));
    }
}
