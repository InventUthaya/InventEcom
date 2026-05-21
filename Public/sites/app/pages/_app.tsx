import 'shared/src/styles/globals.css'
import type { AppProps } from "next/app";
import { RecoilRoot, RecoilEnv } from 'recoil';
import React, { useEffect, useState } from 'react';
import { IOSDevice, androidDevice, findBrowser, findWindow, getLocalStorage, getUserLanguage, getUserLocationForParam, localStorageClearHandler } from 'shared/src/components/helper/Helper';
import { HelperConstant } from 'shared/src/components/helper/HelperConstant';
import { useRouter } from 'next/router';
import axios from 'axios';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';
import { Geolocation } from "@capacitor/geolocation";
import { App, URLOpenListenerEvent } from '@capacitor/app';
import dynamic from 'next/dynamic';
import UpdateUI from 'shared/src/components/app/updateUI/UpdateUI';
import { Capacitor } from '@capacitor/core';
import GlobalLoader from 'shared/src/components/utils/Loader/GlobalLoader';

type AppUpdateProps = { Android_Version: string, IOS_Version: string, Android_Forced_Update: boolean, IOS_Forced_Update: boolean }

// Disable the duplicate atom key checking
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function Apps({ Component, pageProps }: AppProps) {
  const [flexibleUpdate, setFlexibleUpdate] = useState(false);
  const [forcedUpdate, setForcedUpdate] = useState(false);
  const [switchGeo, setSwitchGeo] = useState(false);
  const [switchGeoStatus, setSwitchGeoStatus] = useState<"open" | "close" | "selected">("close");


  let notNowUpdate = findWindow() && window.localStorage.getItem(HelperConstant.noUpdate);
  let locationPermision = findWindow() && window.localStorage.getItem('permission');
  let router = useRouter();

  const performImmediateUpdate = async () => {
    setForcedUpdate(true);
    setFlexibleUpdate(false);
    if (findWindow())
      localStorage.removeItem(HelperConstant.noUpdate);
  };

  const startFlexibleUpdate = async () => {
    setForcedUpdate(false);
    setFlexibleUpdate(true);
  };

  const noUpdate = async () => {
    setForcedUpdate(false);
    setFlexibleUpdate(false);
    if (findWindow())
      window.localStorage.setItem(HelperConstant.noUpdate, HelperConstant.noUpdate);
  };

  const dailyUpdateHandler = () => {
    if (findWindow()) {
      const hours = HelperConstant.updateTime;
      const setHoursLimit = hours * 60 * 60 * 1000;
      const now = new Date().getTime() as any;
      const setupTime = localStorage.getItem('setupTime');

      if (setupTime == null) {
        localStorage.setItem('setupTime', now);
      } else {
        if (now - parseInt(setupTime) > setHoursLimit) {
          localStorage.removeItem(HelperConstant.noUpdate);
          localStorage.setItem('setupTime', now);
        }
      }
    }
  }

  const checkAppVersion = async (data: AppUpdateProps) => {
    await App.getInfo().then((res) => {
      if ((res.build !== (androidDevice() ? data.Android_Version : IOSDevice() ? data.IOS_Version : null) && (androidDevice() ? data.Android_Forced_Update : IOSDevice() ? data.IOS_Forced_Update : false) === true)) {
        return performImmediateUpdate();
      }
      if ((res.build !== (androidDevice() ? data.Android_Version : IOSDevice() ? data.IOS_Version : null) && (androidDevice() ? data.Android_Forced_Update : IOSDevice() ? data.IOS_Forced_Update : false) === false)) {
        return startFlexibleUpdate();
      }
      else {
        return noUpdate();
      }
    }).catch((e: any) => {
      console.log(e);
    });
  };

  const getAppUpdate = () => {
    // MasterServices.GetAppUpdate().then((res) => {
    //   if (res.status === 200) {
    //     checkAppVersion(res.data);
    //   }
    // }).catch(e => {
    //   console.log(e);
    // });
  }
  const locationHandler = () => {
    Geolocation.getCurrentPosition().then((res) => {
      getExactAddress(res.coords.latitude, res.coords.longitude);
    }).catch((error) => {
      if (error) {
        findWindow() && window.localStorage.setItem('permission', 'deny');
        findWindow() && window.localStorage.setItem("Ln", 'in_en');
        if (locationPermision == null) {
          localStorageClearHandler();
          router.push("/");
        }
      }
    });
  }

  const getExactAddress = (lat: number, lan: number) => {
    let api = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lan}&zoom=18&addressdetails=1`
    // let api = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lan}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=en`
    axios.get(api).then(res => {
      if (res.status === 200) {
        let countryCode = res.data.address.country_code;
        // let countryCode = res.data.results[0].components.country_code;
        findWindow() && window.localStorage.setItem('permission', 'allow');
        if (countryCode == 'ae') {
          findWindow() && window.localStorage.setItem("Ln", 'ae_en');
        }
        else {
          findWindow() && window.localStorage.setItem("Ln", 'in_en');
        }
        if (locationPermision == null) {
          localStorageClearHandler();
          router.push("/");

        }
      }
    }).catch(e => console.log(e));
  }


  const CheckGeoPermission = async () => {
    let permStatus = await Geolocation.checkPermissions();

    if (permStatus.coarseLocation === 'prompt' && permStatus.location == "prompt") {
      permStatus = await Geolocation.requestPermissions();
    }
    if (permStatus.coarseLocation !== 'granted' && permStatus.location !== "granted") {
      if (localStorage.getItem('geoStatus') !== 'open') {
        setSwitchGeoStatus("open");
        localStorage.setItem('geoStatus', 'open');
      }
    }
    if (permStatus.coarseLocation == 'granted' && permStatus.location == "granted") {
      locationHandler();
      localStorage.removeItem('geoStatus');
    }
  }


  const handleLocationChoice = (location: any) => {
    localStorage.setItem('Ln', location);
    setSwitchGeoStatus("selected");
    localStorage.removeItem('geoStatus');
  };

  useEffect(() => {
    const savedGeoStatus = localStorage.getItem('geoStatus');
    if (savedGeoStatus === 'open') {
      setSwitchGeoStatus('open');
    }

    if (Capacitor.isNativePlatform()) {
      CheckGeoPermission();
    }
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    if (findBrowser()) {
      SplashScreen.hide();
      dailyUpdateHandler();
      if (!notNowUpdate) {
        getAppUpdate();
      }
    }
  }, []);

  useEffect(() => {
    if (findBrowser()) {
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        const UTM = event.url.split('dofy.in/home/').pop();
        if (UTM) {
          localStorage.setItem("UTM", UTM);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      registerNotifications();
    }
  }, []);

  const addListeners = async () => {
    // await PushNotifications.addListener('registration', token => {

    //   if (getLocalStorage().PersonId) {
    //     let data = {
    //       FCMToken: token.value,
    //       PersonId: getLocalStorage().PersonId
    //     }
    //     // AuthServices.postFCM(data).then(res => console.log(res));
    //   }
    //   localStorage.setItem("RT", token.value);
    // });

    // await PushNotifications.addListener('registrationError', err => {
    //   console.error('Registration error: ', err.error);
    // });

    // await PushNotifications.addListener('pushNotificationReceived', notification => {
    //   console.log('Push notification received: ', notification);
    // });

    await PushNotifications.addListener('pushNotificationActionPerformed', result => {
      if (result.notification.data.orderId > 0) {
        router.push(`/${getUserLanguage()}${getUserLocationForParam(getUserLanguage())}/sell-device-details/${result.notification.data.orderId}`)
      }
    });
  }

  const registerNotifications = async () => {
    await PushNotifications.checkPermissions().then(res => {
      if (res.receive == "prompt") {
        PushNotifications.requestPermissions().then(async result => {
          if (result.receive != "granted") {
            PushNotifications.register();
          }
        })
      }
      if (res.receive == "granted") {
        PushNotifications.register();
        addListeners();
      }
    });

  }

  return <RecoilRoot>
    <GlobalLoader />
    {(forcedUpdate || flexibleUpdate) && <UpdateUI forcedUpdate={forcedUpdate} flexibleUpdate={flexibleUpdate} noUpdate={noUpdate} />}
    {/* {switchGeoStatus == "open" && <SwitchLocationPopup handleLocationChoice={handleLocationChoice} />} */}
    <Component {...pageProps} />
  </RecoilRoot>
}

export default dynamic(() => Promise.resolve(Apps), {
  ssr: false,
});
