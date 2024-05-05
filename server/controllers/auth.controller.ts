import { Request, Response } from 'express';
import { formatCreatedAt } from '../utils/timeConverter';
import SuspiciousLogin, {ISuspiciousLogin} from '../models/suspiciousLogin.model';
import Preference from '../models/preference.model';
import {UserDocument} from '../models/user.model';
import { saveLogInfo } from '../middlewares/logger/logInfo';
import getCurrentContextData from '../utils/contextData';

interface SuspiciousContextData {
  mismatchedProps?: string[];
  currentContextData?: SuspiciousContextData;
  time?: string;
  id?: string;
  ip?: string;
  country?: string;
  city?: string;
  browser?: string;
  platform?: string;
  os?: string;
  device?: string;
  deviceType?: string;
}

export enum types {
  NO_CONTEXT_DATA = "no_context_data",
  MATCH = "match",
  BLOCKED = "blocked",
  SUSPICIOUS = "suspicious",
  ERROR = "error",
};

const isTrustedDevice = (currentContextData: SuspiciousContextData, userContextData: SuspiciousContextData): boolean =>
  Object.keys(userContextData).every(
    (key) => userContextData[key as keyof SuspiciousContextData] === currentContextData[key as keyof SuspiciousContextData]
  );

const isSuspiciousContextChanged = (oldContextData: SuspiciousContextData, newContextData: SuspiciousContextData): boolean => {
  return Object.keys(oldContextData).some(
    (key) => oldContextData[key as keyof SuspiciousContextData] !== newContextData[key as keyof SuspiciousContextData]
  );
};

const isOldDataMatched = (oldSuspiciousContextData: SuspiciousContextData, userContextData: SuspiciousContextData): boolean => {
  return Object.keys(oldSuspiciousContextData).every(
    (key) => oldSuspiciousContextData[key as keyof SuspiciousContextData] === userContextData[key as keyof SuspiciousContextData]
  );
};

const getOldSuspiciousContextData = (_id: string, currentContextData: SuspiciousContextData) => {
  return SuspiciousLogin.findOne({
    user: _id,
    ip: currentContextData.ip,
    country: currentContextData.country,
    city: currentContextData.city,
    browser: currentContextData.browser,
    platform: currentContextData.platform,
    os: currentContextData.os,
    device: currentContextData.device,
    deviceType: currentContextData.deviceType,
  })
}
const addNewSuspiciousLogin = async (_id: string, existingUser: UserDocument, currentContextData: SuspiciousContextData): Promise<ISuspiciousLogin> => {
  const newSuspiciousLogin = new SuspiciousLogin({
    user: _id,
    email: existingUser.email,
    ip: currentContextData.ip,
    country: currentContextData.country,
    city: currentContextData.city,
    browser: currentContextData.browser,
    platform: currentContextData.platform,
    os: currentContextData.os,
    device: currentContextData.device,
    deviceType: currentContextData.deviceType,
  });

  return await newSuspiciousLogin.save();
};

export const verifyContextData = async (req: Request, existingUser: UserDocument): Promise<types | SuspiciousContextData> => {
  try {
    const { _id } = existingUser;
    const userContextDataRes = await Preference.findOne({ user: _id }) as ISuspiciousLogin;

    if (!userContextDataRes) {
      return types.NO_CONTEXT_DATA;
    }

    const userContextData = {
      ip: userContextDataRes.ip,
      country: userContextDataRes.country,
      city: userContextDataRes.city,
      browser: userContextDataRes.browser,
      platform: userContextDataRes.platform,
      os: userContextDataRes.os,
      device: userContextDataRes.device,
      deviceType: userContextDataRes.deviceType,
    };

    const currentContextData = getCurrentContextData(req);

    if (isTrustedDevice(currentContextData, userContextData)) {
      return types.MATCH;
    }

    const oldSuspiciousContextData = await getOldSuspiciousContextData(
      _id,
      currentContextData
    );

    if (oldSuspiciousContextData) {
      if (oldSuspiciousContextData.isBlocked) return types.BLOCKED;
      if (oldSuspiciousContextData.isTrusted) return types.MATCH;
    }

    let newSuspiciousData: SuspiciousContextData = {};
    if (
      oldSuspiciousContextData &&
      isSuspiciousContextChanged(oldSuspiciousContextData, currentContextData)
    ) {
      const {
        ip: suspiciousIp,
        country: suspiciousCountry,
        city: suspiciousCity,
        browser: suspiciousBrowser,
        platform: suspiciousPlatform,
        os: suspiciousOs,
        device: suspiciousDevice,
        deviceType: suspiciousDeviceType,
      } = oldSuspiciousContextData;

      if (
        suspiciousIp !== currentContextData.ip ||
        suspiciousCountry !== currentContextData.country ||
        suspiciousCity !== currentContextData.city ||
        suspiciousBrowser !== currentContextData.browser ||
        suspiciousDevice !== currentContextData.device ||
        suspiciousDeviceType !== currentContextData.deviceType ||
        suspiciousPlatform !== currentContextData.platform ||
        suspiciousOs !== currentContextData.os
      ) {
        //  Suspicious login data found, but it doesn't match the current context data, so we add new suspicious login data
        const res = await addNewSuspiciousLogin(
          _id,
          existingUser,
          currentContextData
        );

        newSuspiciousData = {
          time: formatCreatedAt(res.createdAt),
          ip: res.ip,
          country: res.country,
          city: res.city,
          browser: res.browser,
          platform: res.platform,
          os: res.os,
          device: res.device,
          deviceType: res.deviceType,
        };
      } else {
        // increase the unverifiedAttempts count by 1
        await SuspiciousLogin.findByIdAndUpdate(
          oldSuspiciousContextData._id,
          {
            $inc: { unverifiedAttempts: 1 },
          },
          { new: true }
        );
        //  If the unverifiedAttempts count is greater than or equal to 3, then we block the user
        if (oldSuspiciousContextData.unverifiedAttempts >= 3) {
          await SuspiciousLogin.findByIdAndUpdate(
            oldSuspiciousContextData._id,
            {
              isBlocked: true,
              isTrusted: false,
            },
            { new: true }
          );

          await saveLogInfo(
            req,
            "Device blocked due to too many unverified login attempts",
            "sign in",
            "warn"
          );

          return types.BLOCKED;
        }

        // Suspicious login data found, and it matches the current context data, so we return "already_exists"
        return types.SUSPICIOUS;
      }
    } else if (
      oldSuspiciousContextData &&
      isOldDataMatched(oldSuspiciousContextData, currentContextData)
    ) {
      return types.MATCH;
    } else {
      //  No previous suspicious login data found, so we create a new one
      const res = await addNewSuspiciousLogin(
        _id,
        existingUser,
        currentContextData
      );

      newSuspiciousData = {
        time: formatCreatedAt(res.createdAt),
        id: res._id,
        ip: res.ip,
        country: res.country,
        city: res.city,
        browser: res.browser,
        platform: res.platform,
        os: res.os,
        device: res.device,
        deviceType: res.deviceType,
      };
    }

    const mismatchedProps = [];

    if (userContextData.ip !== newSuspiciousData.ip) {
      mismatchedProps.push("ip");
    }
    if (userContextData.browser !== newSuspiciousData.browser) {
      mismatchedProps.push("browser");
    }
    if (userContextData.device !== newSuspiciousData.device) {
      mismatchedProps.push("device");
    }
    if (userContextData.deviceType !== newSuspiciousData.deviceType) {
      mismatchedProps.push("deviceType");
    }
    if (userContextData.country !== newSuspiciousData.country) {
      mismatchedProps.push("country");
    }
    if (userContextData.city !== newSuspiciousData.city) {
      mismatchedProps.push("city");
    }

    if (mismatchedProps.length > 0) {
      return {
        mismatchedProps: mismatchedProps,
        currentContextData: newSuspiciousData,
      };
    }

    return types.MATCH;
  } catch (error) {
    return types.ERROR;
  }
};