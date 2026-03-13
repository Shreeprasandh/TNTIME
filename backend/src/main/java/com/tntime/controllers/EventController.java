package com.tntime.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Collections;
import java.util.Map;

/**
 * EventController — Phase 1 stub.
 * Returns an empty event list with server timestamp.
 * Will be wired to GeoEventService in Phase 2.
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    /**
     * GET /api/events/live
     * Returns a list of live geo-tagged events within Tamil Nadu.
     * Phase 1: returns [] with metadata. Phase 2: real data.
     */
    @GetMapping("/live")
    public Mono<ResponseEntity<Map<String, Object>>> getLiveEvents() {
        Map<String, Object> response = Map.of(
            "status", "ok",
            "aoi", "Tamil Nadu / IN25",
            "timestamp", Instant.now().toString(),
            "count", 0,
            "events", Collections.emptyList()
        );
        return Mono.just(ResponseEntity.ok(response));
    }

    /**
     * GET /api/events/health
     * Quick sanity endpoint.
     */
    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, String>>> health() {
        return Mono.just(ResponseEntity.ok(Map.of(
            "service", "tntime-backend",
            "status", "UP",
            "phase", "1 — Foundation stub"
        )));
    }
}
