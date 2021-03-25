import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "../theme/mapStyles";
import { Moment } from "../data/models";
import {
  IonButton,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from "@ionic/react";
import { close as cancelIcon } from "ionicons/icons";

declare const window: any;

const mapContainerStyle = {
  width: "100%",
  height: "calc(100% - 84px)",
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const MapWithMarkers: React.FC<{
  moments: Moment[];
  onDismiss?: () => void;
}> = (props) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB2do_Zm1jyT-IugUTa9HfLo8a6EplMMY8",
  });

  const [center, setCenter] = useState({
    lat: 55.953251,
    lng: -3.188267,
  });

  useEffect(() => {
    if (mapRef.current && props.moments.length > 1) {
      fitBounds(mapRef.current);
    } else {
      return;
    }
  }, [props.moments]);

  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    fitBounds(map);
  }, []);
  const [selected, setSelected] = useState<Moment | null>();

  const fitBounds = (map: any) => {
    const bounds = new window.google.maps.LatLngBounds();

    const locations = props.moments.map((moment) => {
      bounds.extend(moment.location);
      return { lat: moment.location!.lat, lng: moment.location!.lng };
    });
    map.fitBounds(bounds);

    if (props.moments.length < 2) {
      window.google.maps.event.addListenerOnce(map, "idle", function () {
        if (map.getZoom() > 18) {
          map.setZoom(18);
        }
      });
      return;
    }
    const walkPath = new window.google.maps.Polyline({
      path: locations,
      geodesic: true,
      strokeColor: "#00ccb4",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    walkPath.setMap(map);
  };

  const getMapMarker = (index: number) => {
    if (index === props.moments.length - 1) {
      return "./assets/icon/map_marker_start.svg";
    } else if (index === 0) {
      return "./assets/icon/map_marker_end.svg";
    }
    return "./assets/icon/map_marker.svg";
  };

  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <div>Loading maps.</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {props.moments.map((moment: Moment, index) => {
          return (
            <Marker
              key={moment.timestamp}
              position={{
                lat: moment.location!.lat,
                lng: moment.location!.lng,
              }}
              icon={{
                url: getMapMarker(index),
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
              }}
              onClick={() => {
                setCenter({
                  lat: moment.location!.lat,
                  lng: moment.location!.lng,
                });
                setSelected(moment);
              }}
            />
          );
        })}

        {selected ? (
          <InfoWindow
            position={{
              lat: selected.location!.lat,
              lng: selected.location!.lng,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              {selected.note && <p className="text-heading">{selected.note}</p>}
              {selected.imagePath && (
                <img
                  src={selected.imagePath}
                  alt=""
                  style={{
                    maxHeight: "240px",
                    maxWidth: "240px",
                    display: "block",
                    width: "100%",
                  }}
                />
              )}
              {selected.audioPath && (
                <audio controls className="moments-list__audio">
                  <source src={selected.audioPath} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>

      <IonCardHeader
        className="ion-no-padding"
        color="light"
        style={{
          paddingBottom: "20px",
        }}
      >
        <IonGrid>
          <IonRow>
            <IonCol size="8" offset="2">
              <IonButton expand="block" onClick={props.onDismiss}>
                <IonIcon slot="start" icon={cancelIcon} />
                Close Map
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
    </>
  );
};

export default MapWithMarkers;
