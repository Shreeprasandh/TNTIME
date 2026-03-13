package com.tntime.repositories;

import com.tntime.models.GeoEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GeoEventRepository extends JpaRepository<GeoEvent, UUID> {

    /**
     * Finds events strictly within the Tamil Nadu bounding box.
     * Uses PostGIS ST_Within and ST_MakeEnvelope (SRID 4326).
     * Bounding box: SW (76.15, 8.07) to NE (80.34, 13.56).
     */
    @Query(value = """
            SELECT * FROM geo_event 
            WHERE ST_Within(location, ST_MakeEnvelope(76.15, 8.07, 80.34, 13.56, 4326))
            ORDER BY event_time DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<GeoEvent> findLatestWithinTamilNadu(@Param("limit") int limit);
}
