#!/usr/bin/env ruby
# frozen_string_literal: true

# Fetches the latest Instagram posts from a Behold JSON feed and rewrites
# _data/instagram.yml. Run before `jekyll build`; netlify.toml already does.
#
#   BEHOLD_FEED_ID=xxxxxxxx ruby bin/fetch_instagram.rb
#
# Why Behold rather than Instagram's Graph API: Behold holds the Instagram
# token and refreshes it, so there is no Meta app to maintain and no 60-day
# token expiry. Their feed endpoint is public and needs no key.
#
# Images are downloaded and served from this site: Instagram's own CDN URLs
# expire, and self-hosting keeps the section fast and free of third-party
# requests.
#
# Deliberately fail-soft. Missing feed id, a bad response, or a failed image
# download all leave the existing _data/instagram.yml alone and exit 0, so a
# deploy can never break because of the feed.

require 'net/http'
require 'json'
require 'uri'
require 'yaml'
require 'fileutils'

POST_LIMIT = 3
DATA_FILE  = File.expand_path('../_data/instagram.yml', __dir__)
IMAGE_DIR  = File.expand_path('../img/instagram', __dir__)
PROFILE    = 'https://www.instagram.com/taltechbasketballschool/'
CAPTION_MAX = 80

def keep_existing(message)
  warn "[instagram] #{message} - keeping the existing #{File.basename(DATA_FILE)}"
  exit 0
end

feed_id = ENV['BEHOLD_FEED_ID'].to_s.strip
keep_existing('BEHOLD_FEED_ID not set') if feed_id.empty?

begin
  # BEHOLD_FEED_URL exists so this can be pointed at a local fixture in tests
  base = ENV['BEHOLD_FEED_URL'] || "https://feeds.behold.so/#{feed_id}"
  response = Net::HTTP.get_response(URI(base))
  keep_existing("Behold returned HTTP #{response.code}") unless response.is_a?(Net::HTTPSuccess)
  payload = JSON.parse(response.body)
rescue StandardError => e
  keep_existing("request failed: #{e.class}")
end

# Behold returns either a bare array of posts or an object wrapping them.
posts = payload.is_a?(Array) ? payload : (payload['posts'] || payload['media'] || [])
keep_existing('no posts in the feed') if posts.empty?

FileUtils.mkdir_p(IMAGE_DIR)

entries = posts.first(POST_LIMIT).filter_map do |post|
  # Prefer Behold's optimised sizes; fall back to the raw Instagram media.
  sizes  = post['sizes'] || {}
  source = (sizes['medium'] || sizes['large'] || sizes['full'] || {})['mediaUrl'] ||
           sizes['medium'] || sizes['large'] ||
           post['thumbnailUrl'] || post['mediaUrl']
  source = source['mediaUrl'] if source.is_a?(Hash)
  next if source.to_s.empty?

  id       = post['id'].to_s.gsub(/[^0-9A-Za-z_-]/, '')
  ext      = source.to_s.include?('.webp') ? 'webp' : 'jpg'
  filename = "#{id}.#{ext}"

  begin
    File.binwrite(File.join(IMAGE_DIR, filename), Net::HTTP.get(URI(source)))
  rescue StandardError => e
    warn "[instagram] could not download #{id}: #{e.class}"
    next
  end

  caption = (post['prunedCaption'] || post['caption']).to_s.split("\n").first.to_s.strip
  caption = "#{caption[0, CAPTION_MAX - 3]}..." if caption.length > CAPTION_MAX

  {
    'permalink'  => post['permalink'],
    'media_type' => post['mediaType'],
    'media_url'  => "/img/instagram/#{filename}",
    'caption'    => caption,
    'alt'        => post['altText'].to_s.strip,
    'timestamp'  => post['timestamp']
  }
end

keep_existing('every image download failed') if entries.empty?

File.write(DATA_FILE, {
  'enabled'     => true,
  'username'    => 'taltechbasketballschool',
  'profile_url' => PROFILE,
  'placeholder' => false,
  'posts'       => entries
}.to_yaml)

puts "[instagram] wrote #{entries.length} posts to #{File.basename(DATA_FILE)}"
