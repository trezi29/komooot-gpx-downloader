'use client';

import { useState } from 'react';
import { downloadKomootGpx } from './download-gpx';
import Image from 'next/image';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import {
  ArrowRight,
  ArrowLeft,
  MoveUpRightIcon,
  MoveDownRight,
  MoveHorizontal,
  HardDriveDownload,
} from 'lucide-react';

import Github from '@/public/github-mark.svg';

interface TourData {
  id: string;
  name: string;
  distance: number;
  elevation_up: number;
  elevation_down: number;
  mapImageUrl: string;
}

export default function Home() {
  const [tourData, setTourData] = useState<TourData | null>(null);
  const [kmtUrl, setKmtUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  function extractIdFromKmtUrl(kmtUrl: string): string | null {
    const match = kmtUrl.match(/tour\/(\d+)/);
    return match ? match[1] : null;
  }

  async function searchTour() {
    const tourId = extractIdFromKmtUrl(kmtUrl);
    if (!tourId) {
      setError('Please enter a valid komoot tour link.');
      return;
    }
    const response = await fetch(`https://api.komoot.de/v007/tours/${tourId}`);

    if (!response.ok) {
      setError('Failed to fetch tour data');
      return;
    }
    const tourData = await response.json();
    console.log(tourData);

    setTourData({
      id: tourData.id,
      name: tourData.name,
      distance: tourData.distance,
      mapImageUrl: tourData.map_image.src,
      elevation_up: tourData.elevation_up,
      elevation_down: tourData.elevation_down,
    });
  }

  return (
    <div className="font-ibm p-4 h-screen flex flex-col justify-between items-center">
      <h1 className="font-sora font-bold text-2xl">komoot-gpx-downloader</h1>
      {!tourData && (
        <div className="w-full flex flex-col gap-4">
          <div>
            <Label htmlFor="kmt-url" className="mb-1.5">
              Enter komoot’s tour link:
            </Label>
            <Input
              type="text"
              value={kmtUrl}
              onChange={(e) => setKmtUrl(e.target.value)}
              onFocus={() => setError(null)}
            />
          </div>
          <Button
            disabled={!kmtUrl}
            onClick={searchTour}
            className="group self-end"
          >
            Search Tour
            <ArrowRight className="group-hover:translate-x-1 transition-all duration-150" />
          </Button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tourData && (
        <div>
          <h2>{tourData.name}</h2>
          <Image
            width={600}
            height={400}
            src={tourData.mapImageUrl}
            alt="Tour Map Preview"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">
              <MoveHorizontal />
              <p>{(tourData.distance / 1000).toFixed(2)} km</p>
            </div>
            <div className="flex items-center gap-2">
              <MoveUpRightIcon />
              <p>{Math.round(tourData.elevation_up)} m</p>
            </div>
            <div className="flex items-center gap-2">
              <MoveDownRight />
              <p>{Math.round(tourData.elevation_down)} m</p>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <Button onClick={() => setTourData(null)} variant="outline">
              <ArrowLeft />
              Back
            </Button>
            <Button
              onClick={() => downloadKomootGpx(tourData.id, tourData.name)}
            >
              Download GPX
              <HardDriveDownload />
            </Button>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col gap-2 items-center">
        <p>
          made with ❤️ by{' '}
          <Link href={'https://wwww.matteotressi.com'} className="underline">
            matteotressi.com
          </Link>
        </p>
        <Button variant={'outline'} asChild>
          <Link
            href="https://github.com/trezi29/komooot-gpx-downloader"
            target="_blank"
          >
            <Image src={Github} alt="Github logo" width={16} height={16} />
            GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}
