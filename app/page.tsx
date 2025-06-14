'use client';

import { useState } from 'react';
import { downloadKomootGpx } from './download-gpx';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TourData {
  id: string;
  name: string;
  distance: number;
  mapImageUrl: string;
}

export default function Home() {
  const [tourData, setTourData] = useState<TourData | null>(null);
  const [kmtUrl, setKmtUrl] = useState('');

  function extractIdFromKmtUrl(kmtUrl: string): string | null {
    const match = kmtUrl.match(/tour\/(\d+)/);
    return match ? match[1] : null;
  }

  async function searchTour() {
    const tourId = extractIdFromKmtUrl(kmtUrl);
    if (!tourId) {
      alert('Please enter a tour ID');
      return;
    }
    const response = await fetch(`https://api.komoot.de/v007/tours/${tourId}`);

    if (!response.ok) {
      alert('Failed to fetch tour data');
      return;
    }
    const tourData = await response.json();
    console.log(tourData);

    setTourData({
      id: tourData.id,
      name: tourData.name,
      distance: tourData.distance,
      mapImageUrl: tourData.map_image.src,
    });

    // const coordinates = await fetch(
    //   `https://api.komoot.de/v007/tours/${tourId}/coordinates`
    // );

    // if (!coordinates.ok) {
    //   alert('Failed to fetch tour coordinates');
    //   return;
    // }

    // const coordsData = await coordinates.json();

    // downloadGPX(coordsData.items, tourData.name);
  }

  return (
    <div>
      <h1>Komoot gpx downloader</h1>
      <Input
        type="text"
        value={kmtUrl}
        onChange={(e) => setKmtUrl(e.target.value)}
      />
      <Button onClick={searchTour}>Search Tour</Button>
      {tourData && (
        <div>
          <h2>Tour Details</h2>
          <p>Name: {tourData.name}</p>
          <p>Distance: {tourData.distance} meters</p>
          <img
            src={tourData.mapImageUrl}
            alt="Tour Map Preview"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Button onClick={() => downloadKomootGpx(tourData.id, tourData.name)}>
            Download GPX
          </Button>
        </div>
      )}
    </div>
  );
}
