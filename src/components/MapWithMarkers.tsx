import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "../theme/mapStyles";
import { Moment, Location } from "../data/models";
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
  locations?: Location[];
  colour?: string;
  onDismiss?: () => void;
  isWalking?: boolean;
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
    let locations: {}[] = [];
    if (props.locations) {
      locations = props.locations.map((location: Location) => {
        bounds.extend(location);
        return { lat: location!.lat, lng: location!.lng };
      });
    }
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
      strokeColor: props.colour || "#00ccb4",
      strokeOpacity: 1.0,
      strokeWeight: 5,
    });
    walkPath.setMap(map);
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
        {props.locations && props.locations.length > 0 && (
          <Marker
            position={{
              lat: props.locations![0].lat,
              lng: props.locations![0].lng,
            }}
            icon={{
              url: "./assets/icon/map_marker_start.svg",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 30),
            }}
          />
        )}

        {props.moments.map((moment: Moment, index) => {
          return (
            <Marker
              key={moment.timestamp}
              position={{
                lat: moment.location!.lat,
                lng: moment.location!.lng,
              }}
              icon={{
                url: "./assets/icon/map_marker.svg",
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 30),
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

        {props.locations && props.locations.length > 1 && (
          <Marker
            position={{
              lat: props.locations![props.locations.length - 1].lat,
              lng: props.locations![props.locations.length - 1].lng,
            }}
            icon={{
              url: props.isWalking
                ? "./assets/icon/map_marker_current_location.svg"
                : "./assets/icon/map_marker_end.svg",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 30),
            }}
          />
        )}

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
            <IonCol className="ion-text-center text-body small-print ion-align-items-center">
              <img
                src="./assets/icon/map_marker_start.svg"
                alt=""
                style={{
                  height: "20px",
                  marginRight: "3px",
                  marginBottom: "-3px",
                }}
              />
              = Start
              <img
                src="./assets/icon/map_marker_end.svg"
                alt=""
                style={{
                  height: "20px",
                  marginRight: "3px",
                  marginLeft: "16px",
                  marginBottom: "-3px",
                }}
              />
              = End
            </IonCol>
          </IonRow>
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
