package com.tntime.services;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import com.tntime.models.GeoEvent;
import com.tntime.repositories.GeoEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class TnRssFeedService {

    private static final Logger log = LoggerFactory.getLogger(TnRssFeedService.class);

    private final GeoEventRepository repository;
    private final CategoryClassifier classifier;
    private final GeoLocationHelper geoHelper;
    private final RssConfigProperties rssConfig;

    public TnRssFeedService(GeoEventRepository repository,
                            CategoryClassifier classifier,
                            GeoLocationHelper geoHelper,
                            RssConfigProperties rssConfig) {
        this.repository = repository;
        this.classifier = classifier;
        this.geoHelper = geoHelper;
        this.rssConfig = rssConfig;
    }

    @Scheduled(fixedRateString = "${tntime.rss.poll-interval-ms}")
    public void pollRssFeeds() {
        if (rssConfig.getFeeds() == null) {
            log.warn("No RSS feeds configured.");
            return;
        }

        log.info("⚡ TNTIME: Polling {} curated TN RSS feeds", rssConfig.getFeeds().size());

        for (RssConfigProperties.Feed feedConfig : rssConfig.getFeeds()) {
            try {
                @SuppressWarnings("deprecation")
                XmlReader reader = new XmlReader(new URL(feedConfig.getUrl()));
                SyndFeedInput input = new SyndFeedInput();
                SyndFeed feed = input.build(reader);

                for (SyndEntry entry : feed.getEntries()) {
                    String title = entry.getTitle();
                    String link = entry.getLink();
                    
                    if (title == null || link == null) continue;

                    GeoEvent evt = new GeoEvent();
                    evt.setTitle(title);
                    evt.setSourceUrl(link);
                    
                    if (entry.getPublishedDate() != null) {
                        evt.setEventTime(entry.getPublishedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
                    } else {
                        evt.setEventTime(LocalDateTime.now());
                    }

                    String category = classifier.classify(title);
                    evt.setCategory(category);
                    evt.setSeverity(category.equals("ACCIDENT") || category.equals("CRIME") ? "HIGH" : "MEDIUM");

                    String[] districtRef = new String[1];
                    evt.setLocation(geoHelper.geocodeText(title, districtRef));
                    evt.setDistrict(districtRef[0]);

                    repository.save(evt);
                }
                log.info("RSS Poll complete for {}. Parsed {} events.", feedConfig.getName(), feed.getEntries().size());

            } catch (Exception e) {
                log.error("Failed to parse RSS feed: " + feedConfig.getName(), e.getMessage());
            }
        }
    }
}

@Configuration
@ConfigurationProperties(prefix = "tntime.rss")
class RssConfigProperties {
    private List<Feed> feeds;

    public List<Feed> getFeeds() {
        return feeds;
    }

    public void setFeeds(List<Feed> feeds) {
        this.feeds = feeds;
    }

    public static class Feed {
        private String name;
        private String url;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}
