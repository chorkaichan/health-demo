import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health'
import dayjs from 'dayjs'

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
} as HealthKitPermissions


export default function App() {
  const [ heartRateData, setHeartRateData ] = useState<HealthValue[]>([])
  const init = () => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      /* Called after we receive a response from the system */

      if (error) {
        console.log('[ERROR] Cannot grant permissions!')
      }

      /* Can now read or write to HealthKit */

      const options = {
        startDate: new Date(2020, 1, 1).toISOString(),
      }

      AppleHealthKit.getHeartRateSamples(
        options,
        (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.error(callbackError)
            return
          }
          setHeartRateData(results)
        },
      )
    })
  }
  
  useEffect(() => {
    init()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {heartRateData.slice(0, 5).map((data) => (
        <Text key={`heart-rate-${dayjs(data.endDate).format('YYYYMMDD-HHmmss')}`}>
          {`${dayjs(data.endDate).format('YYYY/MM/DD HH:mm:ss')}時点の心拍数: ${data.value}`}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
