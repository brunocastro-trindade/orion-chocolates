import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/leaflet-theme.css";
import { useLanguage } from "@/i18n/LanguageContext";

// Real coordinates geocoded from the two store addresses (OpenStreetMap
// Nominatim) — no routing between them, just two independent pins so the
// user can pick whichever location is more convenient for them. Also used
// by the Contact section's address list. `id` keys into t.stores for the
// translated display name — the physical address itself stays in Portuguese
// in every language, since it's what a courier/GPS actually needs to read.
export const STORES = [
  {
    id: "itoupavaNorte" as const,
    address: "R. 7 de Maio, 1600 - Itoupava Norte, Blumenau - SC, 89052-385",
    lat: -26.8866763,
    lng: -49.0685402,
    hours: ["Segunda a Sábado: 10h - 22h", "Domingo: 14h - 20h"],
  },
  {
    id: "centro" as const,
    address: "R. Curt Hering, 226 - Centro, Blumenau - SC, 89010-030",
    lat: -26.9210373,
    lng: -49.0653646,
    hours: ["Segunda a Sexta: 08:30 - 19h", "Sábado: 08:40 - 13:30"],
  },
];

// Custom ORION-orange pin (replaces Leaflet's default blue marker) — a plain
// inline SVG DivIcon, so no extra image assets/bundler path issues.
const orionPinIcon = L.divIcon({
  className: "", // clears Leaflet's default "leaflet-div-icon" white square background
  html: `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="#e4693a" stroke="#251116" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="6" fill="#251116"/>
    </svg>
  `,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -38],
});

function StoreLocatorMap() {
  const elRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (!elRef.current) return;
    const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: false });
    map.getContainer().classList.add("orion-map");
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    STORES.forEach((store) => {
      L.marker([store.lat, store.lng], { icon: orionPinIcon })
        .addTo(map)
        .bindPopup(
          `<span class="orion-popup-title">${t.stores[store.id]}</span><span class="orion-popup-address">${store.address}</span><span class="orion-popup-hours">${store.hours.join("<br />")}</span><a class="orion-popup-cta" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}" target="_blank" rel="noopener noreferrer">${t.storeLocator.mapCta}</a>`,
          { className: "orion-popup", closeButton: true },
        );
    });

    map.fitBounds(
      L.latLngBounds(STORES.map((s) => [s.lat, s.lng] as [number, number])),
      { padding: [40, 40] },
    );

    // container is measured right at mount (inside a CSS-scaled ancestor),
    // so nudge Leaflet to recompute its size once layout has settled
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
    };
    // Recreated whenever the language changes so marker popups (store name,
    // "get directions" label) pick up the new strings — Leaflet builds that
    // HTML once at marker-creation time, it doesn't react to prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return <div ref={elRef} className="size-full" />;
}

export default function StoreLocator() {
  const { t } = useLanguage();

  return (
    <div className="absolute contents">
      {/* Title + lead stack in normal flow inside one absolute anchor, so a
          translation that wraps onto an extra line pushes the lead (and the
          map below it) down instead of overlapping. */}
      <div className="absolute flex flex-col items-center text-center" style={{ top: 2672, left: 174, width: 1092 }}>
        <h2
          className="font-normal animate-g8 [word-break:break-word] leading-[1.1] text-[#e29647] text-[72px]"
          style={{ fontFamily: "'Vesper Nocturne', serif" }}
        >
          {t.storeLocator.title}
        </h2>
        <p
          className="animate-g8 [word-break:break-word] mt-6 max-w-[943px] leading-[1.16] not-italic text-[#e29647] text-[24px]"
          style={{ fontFamily: "'Creato Display', 'DM Sans', sans-serif" }}
        >
          {t.storeLocator.lead}
        </p>
      </div>
      <div className="absolute overflow-hidden bg-[#e29647] rounded-[48px] animate-g8" style={{ left: 264, top: 2949, width: 924, height: 560 }}>
        <StoreLocatorMap />
      </div>
    </div>
  );
}
