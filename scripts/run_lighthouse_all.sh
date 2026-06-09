#!/bin/bash
URLS=("http://localhost:4321/" "http://localhost:4321/program" "http://localhost:4321/kegiatan" "http://localhost:4321/donasi" "http://localhost:4321/tentang" "http://localhost:4321/kontak")

echo "Running Lighthouse on all pages..."
for url in "${URLS[@]}"; do
  echo "Testing $url..."
  npx lighthouse "$url" --output=json --output-path="/tmp/lighthouse-$(echo $url | sed 's/[^a-zA-Z0-9]/_/g')" --chrome-flags="--headless --no-sandbox" --only-categories=accessibility,seo --quiet
done
echo "Done."
