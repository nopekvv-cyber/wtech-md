#!/usr/bin/env bash
# Encodes a Higgsfield MP4 into WebM VP9 + MP4 H.264 (<= 1080p, <= 1.5 MB) with a JPG poster.
# Usage: scripts/encode-media.sh <input.mp4> <public/media/basename> [max_height] [loop_xfade_seconds]
set -euo pipefail
IN="$1"; OUT="$2"; MAXH="${3:-1080}"; XF="${4:-0.5}"
DUR=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$IN")
TMP=$(mktemp -d)
# Seamless loop: crossfade the tail into the head so frame N-1 flows into frame 0.
if [ "$XF" != "0" ]; then
  HEAD=$(awk -v d="$DUR" -v x="$XF" 'BEGIN{h=d-x; if(h<0.1)h=0.1; print h}')
  ffmpeg -v error -y -i "$IN" -filter_complex \
    "[0:v]split[a][b];[a]trim=0:${HEAD},setpts=PTS-STARTPTS[head];[b]trim=${HEAD},setpts=PTS-STARTPTS[tail];[tail][head]xfade=transition=fade:duration=${XF}:offset=0,scale=-2:'min(ih,${MAXH})',fps=30,format=yuv420p[v]" \
    -map "[v]" -an -c:v libx264 -crf 14 -preset veryfast "$TMP/loop.mp4"
  SRC="$TMP/loop.mp4"
else
  ffmpeg -v error -y -i "$IN" -vf "scale=-2:'min(ih,${MAXH})',fps=30,format=yuv420p" -an -c:v libx264 -crf 14 -preset veryfast "$TMP/loop.mp4"
  SRC="$TMP/loop.mp4"
fi
encode() {
  local crf_vp9=$1 crf_264=$2
  ffmpeg -v error -y -i "$SRC" -c:v libvpx-vp9 -b:v 0 -crf "$crf_vp9" -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an "$OUT.webm"
  ffmpeg -v error -y -i "$SRC" -c:v libx264 -crf "$crf_264" -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an "$OUT.mp4"
}
encode 36 27
LIMIT=1500000
for step in 1 2 3; do
  W=$(stat -f%z "$OUT.webm"); M=$(stat -f%z "$OUT.mp4")
  if [ "$W" -le $LIMIT ] && [ "$M" -le $LIMIT ]; then break; fi
  encode $((36 + step*4)) $((27 + step*3))
done
ffmpeg -v error -y -i "$SRC" -frames:v 1 -q:v 4 "$OUT.jpg"
rm -rf "$TMP"
printf "%-40s webm %7d KB  mp4 %7d KB  poster %5d KB\n" "$OUT" $(( $(stat -f%z "$OUT.webm") / 1024 )) $(( $(stat -f%z "$OUT.mp4") / 1024 )) $(( $(stat -f%z "$OUT.jpg") / 1024 ))
