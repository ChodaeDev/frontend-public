'use client';

import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import 'ol/ol.css';
import { Bus, Car, MapPin, Phone, Clock, TrainFront } from 'lucide-react';
import { useTranslation } from '@/i18n/client';

const coordinates = { lat: 37.599686543845, lng: 127.130102358334 };

interface RouteItem {
  from: string;
  steps: string[];
  stop: string;
}

interface DirectionsDict {
  address: string;
  addressValue: string;
  addressSub: string;
  oldAddress: string;
  oldAddressValue: string;
  phone: string;
  phoneValue: string;
  hours: string;
  hoursValue: string;
  note: string;
  floor: string;
  byBus: string;
  byTrain: string;
  byCar: string;
  busRoutes: RouteItem[];
  trainRoutes: RouteItem[];
  carRoutes: RouteItem[];
}

function RouteSection({ title, icon, routes }: { title: string; icon: React.ReactNode; routes: RouteItem[] }) {
  return (
    <div>
      <h3 className={'flex items-center gap-2 text-lg font-bold text-main mb-4'}>
        <div className={'size-5 text-accent1 shrink-0 mt-0.5'}>
          {icon}
        </div>
        {title}
      </h3>
      <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        {routes.map((route, i) => (
          <div key={i} className={'rounded-xl hover:bg-gray9 p-4'}>
            <p className={'font-bold text-accent1 mb-2'}>{route.from}</p>
            <div className={'flex flex-col gap-1 mb-2'}>
              {route.steps.map((step, j) => (
                <p key={j} className={'text-sm text-main'}>{step}</p>
              ))}
            </div>
            <p className={'text-sm font-semibold text-sub flex items-center gap-1'}>
              <MapPin className={'size-3.5 shrink-0'} />
              {route.stop}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DirectionsContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const { dictionary } = useTranslation();
  const t = dictionary.directions as DirectionsDict;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([coordinates.lng, coordinates.lat])),
    });

    markerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/assets/images/map-marker.svg',
          scale: 0.8,
        }),
        text: new Text({
          text: t.floor,
          font: 'bold 13px sans-serif',
          offsetX: 20,
          offsetY: -20,
          fill: new Fill({ color: '#E53E3E' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
          textAlign: 'left',
        }),
      }),
    );

    const vectorSource = new VectorSource({ features: [markerFeature] });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://api.vworld.kr/req/wmts/1.0.0/${ process.env.NEXT_PUBLIC_VWORLD_API_KEY }/Base/{z}/{y}/{x}.png`,
            crossOrigin: 'anonymous',
          }),
        }),
        new VectorLayer({ source: vectorSource }),
      ],
      view: new View({
        center: fromLonLat([coordinates.lng, coordinates.lat]),
        zoom: 18,
        minZoom: 10,
        maxZoom: 19,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
      map.dispose();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={'flex flex-col gap-12'}>
      {/* 지도 */}
      <div ref={mapRef} className={'w-full h-80 md:h-[480px] rounded-2xl overflow-hidden border border-gray8'} />

      {/* 주소/연락처 정보 */}
      <div className={'grid grid-cols-1 sm:grid-cols-2 gap-6'}>
        <div className={'flex gap-3'}>
          <MapPin className={'size-5 text-accent1 shrink-0 mt-1'} />
          <div>
            <span className={'text-sm font-medium text-sub'}>{t.address}</span>
            <p className={'text-main font-semibold'}>{t.addressValue}</p>
            <p className={'text-sm text-gray4'}>{t.addressSub}</p>
            <div className={'mt-2'}>
              <span className={'text-sm font-medium text-sub'}>{t.oldAddress}</span>
              <p className={'text-main'}>{t.oldAddressValue}</p>
            </div>
          </div>
        </div>
        <div className={'flex flex-col gap-4'}>
          <div className={'flex gap-3'}>
            <Phone className={'size-5 text-accent1 shrink-0 mt-1'} />
            <div>
              <span className={'text-sm font-medium text-sub'}>{t.phone}</span>
              <p className={'text-main font-semibold'}>{t.phoneValue}</p>
            </div>
          </div>
          <div className={'flex gap-3'}>
            <Clock className={'size-5 text-accent1 shrink-0 mt-1'} />
            <div>
              <span className={'text-sm font-medium text-sub'}>{t.hours}</span>
              <p className={'text-main font-semibold whitespace-pre-line'}>{t.hoursValue}</p>
              {t.note && (
                <p className={'text-xs text-gray4 mt-1'}>{t.note}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 교통편 안내 */}
      <div className={'flex flex-col gap-10'}>
        <RouteSection
          title={t.byBus}
          icon={<Bus className={'size-5 text-accent1'} />}
          routes={t.busRoutes}
        />
        <RouteSection
          title={t.byTrain}
          icon={<TrainFront className={'size-5 text-accent1'} />}
          routes={t.trainRoutes}
        />
        <RouteSection
          title={t.byCar}
          icon={<Car className={'size-5 text-accent1'} />}
          routes={t.carRoutes}
        />
      </div>
    </div>
  );
}
