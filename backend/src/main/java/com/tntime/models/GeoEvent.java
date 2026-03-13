package com.tntime.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "geo_event")
public class GeoEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 1024)
    private String title;

    @Column(nullable = false, length = 50)
    private String category; // POLITICS, ACCIDENT, WEATHER, CRIME, INFRASTRUCTURE, OTHER

    @Column(length = 2048)
    private String sourceUrl;

    @Column(nullable = false)
    private LocalDateTime eventTime;

    // PostGIS geometry for spatial queries
    @Column(columnDefinition = "geometry(Point,4326)", nullable = false)
    private Point location;

    @Column(length = 100)
    private String district;

    @Column(length = 20)
    private String severity; // LOW, MEDIUM, HIGH

    @CreationTimestamp
    private LocalDateTime createdAt;

    public GeoEvent() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public LocalDateTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalDateTime eventTime) {
        this.eventTime = eventTime;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
