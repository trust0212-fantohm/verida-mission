import { DatastoreOpenConfig, IDatastore } from "@verida/types";
import { WebUser, WebUserProfile } from "@verida/web-helpers";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { config } from "~/config";
import { Sentry } from "~/features/sentry";

if (!config.veridaContextName) {
  throw new Error("Verida Context Name must be defined");
}

const webUserInstance = new WebUser({
  debug: true,
  clientConfig: {
    environment: config.veridaEnvironment,
  },
  contextConfig: {
    name: config.veridaContextName,
  },
  accountConfig: {
    request: {
      logoUrl: config.veridaConnectLogoUrl,
    },
  },
});

type VeridaContextType = {
  webUserInstanceRef: React.MutableRefObject<WebUser>;
  isConnected: boolean;
  did: string | undefined;
  profile: WebUserProfile | undefined;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  openDatastore: (
    schemaUrl: string,
    config?: DatastoreOpenConfig
  ) => Promise<IDatastore>;
};

export const VeridaContext = React.createContext<VeridaContextType | null>(
  null
);

type VeridaProviderProps = {
  children?: React.ReactNode;
};

export const VeridaProvider: React.FunctionComponent<VeridaProviderProps> = (
  props
) => {
  const webUserInstanceRef = useRef(webUserInstance);

  const [isConnected, setIsConnected] = useState(false);
  const [did, setDid] = useState<string>();
  const [profile, setProfile] = useState<WebUserProfile>();

  const updateStates = useCallback(() => {
    webUserInstance
      .isConnected()
      .then(setIsConnected)
      .catch(() => {
        setIsConnected(false);
      });
    webUserInstance
      .getDid()
      .then((newDid) => {
        setDid(newDid);
        Sentry.setUser({ id: newDid });
      })
      .catch(() => {
        setDid(undefined);
        Sentry.setUser(null);
      });
    webUserInstance
      .getPublicProfile()
      .then(setProfile)
      .catch(() => {
        setProfile(undefined);
      });
  }, []);

  const veridaEventListener = useCallback(() => {
    void updateStates();
  }, [updateStates]);

  useEffect(() => {
    webUserInstance.addListener("connected", veridaEventListener);
    webUserInstance.addListener("profileChanged", veridaEventListener);
    webUserInstance.addListener("disconnected", veridaEventListener);
    void webUserInstance.isConnected(); // Will trigger a 'connected' event if already connected and therefore update the states
    return () => {
      webUserInstance.removeAllListeners();
    };
  }, [updateStates, veridaEventListener]);

  // Exposing common methods for easier access than through the ref
  const connect = useCallback(() => {
    return webUserInstanceRef.current.connect();
  }, [webUserInstanceRef]);

  const disconnect = useCallback(() => {
    return webUserInstanceRef.current.disconnect();
  }, [webUserInstanceRef]);

  const openDatastore = useCallback(
    (schemaUrl: string, config?: DatastoreOpenConfig) => {
      return webUserInstanceRef.current.openDatastore(schemaUrl, config);
    },
    [webUserInstanceRef]
  );

  const contextValue: VeridaContextType = useMemo(
    () => ({
      isConnected,
      did,
      connect,
      disconnect,
      openDatastore,
      profile,
      webUserInstanceRef,
    }),
    [
      isConnected,
      did,
      connect,
      disconnect,
      openDatastore,
      profile,
      webUserInstanceRef,
    ]
  );

  return (
    <VeridaContext.Provider value={contextValue}>
      {props.children}
    </VeridaContext.Provider>
  );
};
