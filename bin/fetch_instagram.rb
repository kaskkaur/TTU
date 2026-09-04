#!/usr/bin/env ruby
# frozen_string_literal: true

# Fetches the latest Instagram posts and writes _data/instagram.yml.
#
# Run before `jekyll build`. It is deliberately fail-soft: if the token is
# missing or Instagram errors, it leaves the existing _data/instagram.yml in
# place and exits 0, so a expired token can never break a deploy.
#
#   IG_USER_ID=...  IG_TOKEN=...  ruby bin/fetch_instagram.rb
#
# Requires an Instagram *Business or Creator* account linked to a Facebook
# Page. The old Basic Display API was shut down in December 2024; this uses
# the Graph API.

require 'net/http'
require 'json'
require 'uri'
require 'yaml'
require 'fileutils'

LIMIT      = 3
DATA_FILE  = File.expand_path('../_data/instagram.yml', __dir__)
IMAGE_DIR  = File.expand_path('../img/instagram', __dir__)
PROFILE    = 'https://www.instagram.com/taltechbasketballschool/'

def warn_and_exit(message)
  warn "[instagram] #{message} - keeping the existing #{File.basename(DATA_FILE)}"
  exit 0
end

user_id = ENV['IG_USER_ID']
token   = ENV['IG_TOKEN']
warn_and_exit('IG_USER_ID or IG_TOKEN not set') if user_id.to_s.empty? || token.to_s.empty?

fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
uri = URI("https://graph.instagram.com/v21.0/#{user_id}/media")
uri.query = URI.encode_www_form(fields: fields, limit: LIMIT, access_token: token)

begin
  response = Net::HTTP.get_response(uri)
  warn_and_exit("Instagram returned HTTP #{response.code}") unless response.is_a?(Net::HTTPSuccess)
  payload = JSON.parse(response.body)
rescue StandardError => e
  warn_and_exit("request failed: #{e.class}")
end

posts = Array(payload['data']).first(LIMIT)
warn_and_exit('no posts returned') if posts.empty?

# Instagram's CDN URLs expire, so the images are pulled down at build time and
# served from the site itself.
FileUtils.mkdir_p(IMAGE_DIR)
entries = posts.filter_map do |post|
  source = post['media_type'] == 'VIDEO' ? post['thumbnail_url'] : post['media_url']
  next if source.to_s.empty?

  filename = "#{post['id']}.jpg"
  begin
    File.binwrite(File.join(IMAGE_DIR, filename), Net::HTTP.get(URI(source)))
  rescue StandardError => e
    warn "[instagram] could not download #{post['id']}: #{e.class}"
    next
  end

  caption = post['caption'].to_s.split("\n").first.to_s.strip
  caption = "#{caption[0, 77]}..." if caption.length > 80

  {
    'permalink'  => post['permalink'],
    'media_type' => post['media_type'],
    'media_url'  => "/img/instagram/#{filename}",
    'caption'    => caption,
    'timestamp'  => post['timestamp']
  }
end

warn_and_exit('every image download failed') if entries.empty?

File.write(DATA_FILE, {
  'username'    => 'taltechbasketballschool',
  'profile_url' => PROFILE,
  'placeholder' => false,
  'posts'       => entries
}.to_yaml)

puts "[instagram] wrote #{entries.length} posts to #{File.basename(DATA_FILE)}"
