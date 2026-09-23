// Google Maps JavaScript API Loader with Places Library support

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_APP_GOOGLE_MAPS_KEY || "AIzaSyAgoieOAdV38-2TY2OrQoo10L0QVq7_BH8";

let mapsLoadPromise: Promise<typeof google.maps> | null = null;

export function loadGoogleMaps(
  lang: string = "ar",
  apiKey: string = GOOGLE_MAPS_API_KEY,
): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only be loaded in a browser environment"));
  }

  if ((window as any).google?.maps) {
    return Promise.resolve((window as any).google.maps);
  }

  if (mapsLoadPromise) {
    return mapsLoadPromise;
  }

  mapsLoadPromise = new Promise((resolve, reject) => {
    const scriptId = "google-maps-api-script";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if ((window as any).google?.maps) {
        resolve((window as any).google.maps);
        return;
      }
      existingScript.addEventListener("load", () => resolve((window as any).google.maps));
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${lang}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if ((window as any).google?.maps) {
        resolve((window as any).google.maps);
      } else {
        reject(new Error("Google Maps object not found on window"));
      }
    };

    script.onerror = (err) => {
      mapsLoadPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return mapsLoadPromise;
}
