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
  LoaderCircle,
} from 'lucide-react';

import Github from '@/public/github-mark.svg';
import { cn } from '@/lib/utils';

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
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  function extractIdFromKmtUrl(kmtUrl: string): string | null {
    const match = kmtUrl.match(/tour\/(\d+)/);
    return match ? match[1] : null;
  }

  async function searchTour() {
    setLoading(true);
    const tourId = extractIdFromKmtUrl(kmtUrl);
    if (!tourId) {
      setError('Please enter a valid komoot tour link.');
      return;
    }
    const response = await fetch(`https://api.komoot.de/v007/tours/${tourId}`);

    if (!response.ok) {
      setError('Failed to fetch tour data');
      setLoading(false);
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

    setLoading(false);
  }

  const animationDuration = 300; // Duration in milliseconds

  return (
    <div className="font-ibm p-4 h-screen flex flex-col justify-between items-center">
      <h1 className="font-sora font-bold text-2xl">komoot-gpx-downloader</h1>
      {/* <div className="p-4 border rounded-md w-full max-w-[780px]"> */}
      <div className="w-screen flex items-center justify-start overflow-hidden">
        <div
          className={`flex items-center w-[200vw] transition-transform duration-${animationDuration}`}
          style={{
            // opacity: imgLoaded ? '0' : '100%',
            transform: imgLoaded ? 'translateX(-100vw)' : 'translateX(0)',
            // display: imgLoaded ? 'none' : 'flex',
          }}
        >
          <div className="w-screen flex justify-center items-center px-4">
            <div
              className={cn(
                'w-full flex flex-col gap-6 p-4 border rounded-md max-w-[780px] transition-opacity duration-150'
              )}
              style={{ opacity: imgLoaded ? 0 : 1 }}
            >
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
                className="group self-end relative"
              >
                <span className={cn(loading ? 'opacity-0' : 'opacity-100')}>
                  Search Tour
                </span>
                <ArrowRight
                  className={cn(
                    'group-hover:translate-x-1 transition-transform duration-150',
                    loading ? 'opacity-0' : 'opacity-100'
                  )}
                />
                {loading && (
                  <LoaderCircle
                    className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    size={16}
                  />
                )}
              </Button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
          <div className="w-screen flex justify-center items-center px-4">
            {tourData && (
              <div
                className="w-full flex flex-col gap-6 transition-opacity duration-150 p-4 border rounded-md max-w-[780px]"
                style={{ opacity: imgLoaded ? 1 : 0 }}
              >
                <h2 className="font-bold text-lg mb-2">{tourData.name}</h2>
                <div className="flex flex-col gap-2">
                  <div className="rounded-md h-[300px] overflow-hidden flex justify-center items-center">
                    <Image
                      width={1560}
                      height={600}
                      src={tourData.mapImageUrl}
                      alt="Tour Map Preview"
                      className="h-full max-w-fit"
                      onLoad={() => setImgLoaded(true)}
                      // style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
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
                </div>
                <div className="flex justify-between w-full mt-6">
                  <Button
                    onClick={() => {
                      setImgLoaded(false);
                      setTimeout(() => {
                        setTourData(null);
                      }, animationDuration);
                    }}
                    variant="outline"
                  >
                    <ArrowLeft />
                    Back
                  </Button>
                  <Button
                    onClick={() =>
                      downloadKomootGpx(tourData.id, tourData.name)
                    }
                  >
                    Download GPX
                    <HardDriveDownload />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 items-center">
        <p>
          made with ❤️ by{' '}
          <Link href={'https://www.matteotressi.com'} className="underline">
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
