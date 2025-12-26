#!/usr/bin/env bash

awk '
/^\s*{/ {
  name = ""
  from = ""
  to = ""
  fromApproxSeen = 0
  toApproxSeen = 0
  fromApprox = 0
  toApprox = 0
}

/displayName:/ {
  match($0, /"([^"]+)"/, m)
  name = m[1]
}

/fromYear:/ {
  match($0, /-?[0-9]+/, m)
  from = m[0]
}

/fromApprox:/ {
  fromApproxSeen = 1
  fromApprox = ($0 ~ /true/)
}

/toYear:/ {
  match($0, /-?[0-9]+/, m)
  to = m[0]
}

/toApprox:/ {
  toApproxSeen = 1
  toApprox = ($0 ~ /true/)
}

/^\s*}/ {
  printf "%s (%s%s to %s%s)\n",
    name,
    (fromApproxSeen && fromApprox ? "~" : ""), from,
    (toApproxSeen && toApprox ? "~" : ""), to
}
' persons_data.ts
