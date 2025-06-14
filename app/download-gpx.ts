interface GPXCoordinate {
  lat: number;
  lng: number;
  alt: number;
  t: number; // milliseconds offset from startTime
}

export async function downloadKomootGpx(
  // coordinates: GPXCoordinate[],
  tourId: string,
  fileName: string = 'track.gpx'
): Promise<void> {
  const response = await fetch(
    `https://api.komoot.de/v007/tours/${tourId}/coordinates`
  );

  if (!response.ok) {
    alert('Failed to fetch tour coordinates');
    return;
  }

  const coordsData = await response.json();
  const coordinates: GPXCoordinate[] = coordsData.items;

  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Your App" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${fileName}</name>
    <trkseg>`;

  const gpxFooter = `
    </trkseg>
  </trk>
</gpx>`;

  const startTime = Date.now(); // o usa una data reale
  const gpxPoints = coordinates
    .map((p: GPXCoordinate) => {
      const time = new Date(startTime + p.t).toISOString();
      return `      <trkpt lat="${p.lat}" lon="${p.lng}">
        <ele>${p.alt}</ele>
        <time>${time}</time>
      </trkpt>`;
    })
    .join('\n');

  const gpxContent = `${gpxHeader}\n${gpxPoints}\n${gpxFooter}`;

  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
}
