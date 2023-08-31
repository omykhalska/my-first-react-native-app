import { useEffect } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import useRoute from '../navigation/router'
import { useSelector } from 'react-redux'
import { authStateChangeUser } from '../redux/auth/authOperations'
import { getStateChange } from '../redux/auth/authSelectors'
import { useAppDispatch } from '../helpers/hooks'

interface IProps {
  onLayoutRootView: () => Promise<void>;
}

const Main = ({ onLayoutRootView }: IProps) => {
  const stateChange = useSelector(getStateChange)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authStateChangeUser())
  }, [])

  const routing = useRoute(stateChange)

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        {routing}
      </SafeAreaView>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    fontFamily: 'Roboto-Regular',
  },
})

export default Main
