package com.tntime.services;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Component
public class GeoLocationHelper {

    private final GeometryFactory geometryFactory;
    private final Random random;
    private final Map<String, double[]> districtCoordinates;

    public GeoLocationHelper() {
        // SRID 4326 for WGS84 GPS coordinates
        this.geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        this.random = new Random();
        this.districtCoordinates = new HashMap<>();

        // Approximate central coordinates for major TN districts
        districtCoordinates.put("chennai", new double[]{80.2707, 13.0827});
        districtCoordinates.put("coimbatore", new double[]{76.9558, 11.0168});
        districtCoordinates.put("madurai", new double[]{78.1198, 9.9252});
        districtCoordinates.put("tiruchirappalli", new double[]{78.7047, 10.7905});
        districtCoordinates.put("salem", new double[]{78.1460, 11.6643});
        districtCoordinates.put("tirunelveli", new double[]{77.7132, 8.7139});
        districtCoordinates.put("vellore", new double[]{79.1325, 12.9165});
        districtCoordinates.put("thoothukudi", new double[]{78.1348, 8.7642});
        districtCoordinates.put("thanjavur", new double[]{79.1378, 10.7870});
        districtCoordinates.put("kanyakumari", new double[]{77.5385, 8.0883});
        districtCoordinates.put("erode", new double[]{77.7172, 11.3410});
        districtCoordinates.put("dindigul", new double[]{77.9803, 10.3673});
    }

    /**
     * Extracts a district name from the text and returns a PostGIS Point with slight random jitter.
     * If no district is found, returns a random point within TN bounds.
     */
    public Point geocodeText(String text, String[] matchedDistrictFound) {
        String lowerContext = text != null ? text.toLowerCase() : "";

        String matchedDistrict = "Unknown (TN)";
        double[] baseCoords = null;

        for (Map.Entry<String, double[]> entry : districtCoordinates.entrySet()) {
            if (lowerContext.contains(entry.getKey())) {
                matchedDistrict = entry.getKey().substring(0, 1).toUpperCase() + entry.getKey().substring(1);
                baseCoords = entry.getValue();
                break;
            }
        }

        if (matchedDistrictFound != null && matchedDistrictFound.length > 0) {
            matchedDistrictFound[0] = matchedDistrict;
        }

        double lng, lat;
        if (baseCoords != null) {
            // Apply slight physical jitter (approx up to 10km) so pins don't stack exactly on top of each other
            lng = baseCoords[0] + (random.nextDouble() - 0.5) * 0.1;
            lat = baseCoords[1] + (random.nextDouble() - 0.5) * 0.1;
        } else {
            // Random point within TN bounding box: SW (76.15, 8.07) to NE (80.34, 13.56)
            lng = 76.15 + random.nextDouble() * (80.34 - 76.15);
            lat = 8.07 + random.nextDouble() * (13.56 - 8.07);
        }

        return geometryFactory.createPoint(new Coordinate(lng, lat));
    }
}
