package com.tntime.services;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryClassifier {

    // Hyper-local Tamil Nadu keywords for heuristics
    private static final List<String> POLITICS_KW = List.of(
            "dmk", "aiadmk", "stalin", "eps", "udhayanidhi", "assembly", "secretariat",
            "election", "bjp tn", "ntk", "seeman", "annamalai", "protest", "minister"
    );

    private static final List<String> ACCIDENT_KW = List.of(
            "crash", "accident", "road", "train", "fire", "derail", "collision", "fatality", "toll plaza"
    );

    private static final List<String> WEATHER_KW = List.of(
            "rmc chennai", "northeast monsoon", "red alert", "cyclone", "flood", "rain", 
            "imd", "waterlogging", "temperature", "drought", "reservoir"
    );

    private static final List<String> CRIME_KW = List.of(
            "arrest", "theft", "murder", "police", "smuggling", "tasmac", "seizure", "raid", "scam"
    );

    private static final List<String> INFRASTRUCTURE_KW = List.of(
            "cmrl", "metro", "airport", "highway", "subway", "bridge", "tangedco", "power cut", "flyover"
    );

    public String classify(String text) {
        if (text == null) return "OTHER";
        String lower = text.toLowerCase();

        if (matchesAny(lower, POLITICS_KW)) return "POLITICS";
        if (matchesAny(lower, WEATHER_KW)) return "WEATHER";
        if (matchesAny(lower, ACCIDENT_KW)) return "ACCIDENT";
        if (matchesAny(lower, CRIME_KW)) return "CRIME";
        if (matchesAny(lower, INFRASTRUCTURE_KW)) return "INFRASTRUCTURE";

        return "OTHER";
    }

    private boolean matchesAny(String text, List<String> keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }
}
