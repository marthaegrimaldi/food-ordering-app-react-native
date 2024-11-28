import React, { useContext } from 'react'
import { View, TouchableOpacity, Image, FlatList } from 'react-native'
import { useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { subscriptionOrder } from '../../apollo/subscriptions'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import TextError from '../Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'
import ConfigurationContext from '../../context/Configuration'
import { ProgressBar } from '../Main/ActiveOrders/ProgressBar'
import { calulateRemainingTime } from '../../utils/customFunctions'
import Spinner from '../Spinner/Spinner'
import EmptyView from '../EmptyView/EmptyView'

const ActiveOrders = ({ navigation, loading, error, activeOrders }) => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const configuration = useContext(ConfigurationContext)

  const emptyView = () => {
    return (
      <EmptyView
        title={'titleEmptyActiveOrders'}
        description={'emptyActiveOrdersDesc'}
        buttonText={'emptyActiveOrdersBtn'}
      />
    )
  }

  const renderItem = ({ item }) => (
    <Item
      item={item}
      navigation={navigation}
      currentTheme={currentTheme}
      configuration={configuration}
    />
  )

  if (loading) {
    return (
      <Spinner
        size={'small'}
        backColor={currentTheme.themeBackground}
        spinnerColor={currentTheme.main}
      />
    )
  }
  if (error) return <TextError text={error.message} />

  return (
    <FlatList
      data={activeOrders}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={emptyView}
    />
  )
}

const getItems = items => {
  return items
    .map(
      item =>
        `${item.quantity}x ${item.title}${
          item.variation.title ? `(${item.variation.title})` : ''
        }`
    )
    .join('\n')
}

const Item = ({ item, navigation, currentTheme, configuration }) => {
  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: item._id } }
  )
  const { t } = useTranslation()
  const remainingTime = calulateRemainingTime(item)
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('OrderDetail', { _id: item._id })}>
      <View style={{ flex: 1 }}>
        <View style={styles(currentTheme).subContainer}>
          <View style={styles().orderDescriptionContainer}>
            <TextDefault h5 bold textColor={currentTheme.gray500}>
              {t('estimatedDeliveryTime')}
            </TextDefault>
          </View>
          <View style={styles().orderDescriptionContainer}>
            <TextDefault Regular textColor={currentTheme.gray900} H1 bolder>
              {remainingTime}-{remainingTime + 5} {t('mins')}
            </TextDefault>
          </View>
          <View style={{ flex: 1 }}>
            <ProgressBar
              configuration={configuration}
              currentTheme={currentTheme}
              item={item}
              navigation={navigation}
              customWidth={scale(65)}
            />
          </View>
          <View
            style={{
              ...styles().orderDescriptionContainer,
              ...alignment.PTxSmall
            }}>
            <TextDefault h5 bold textColor={currentTheme.secondaryText}>
              {item.orderStatus === 'PENDING'
                ? t('PenddingText')
                : t('PenddingText1')}
            </TextDefault>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              //alignItems: 'center',
              justifyContent: 'center',
              ...alignment.Mmedium,
              ...alignment.MTlarge,
              ...alignment.PLmedium
            }}>
            <Image
              style={styles(currentTheme).restaurantImage1}
              resizeMode="cover"
              source={{ uri: item.restaurant.image }}
            />
            <View style={styles(currentTheme).textContainer2}>
              <View style={styles().subContainerLeft}>
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  uppercase
                  bolder
                  numberOfLines={2}
                  style={styles(currentTheme).restaurantName}>
                  {item.restaurant.name}
                </TextDefault>
                <TextDefault
                  numberOfLines={1}
                  style={{ ...alignment.MTxSmall }}
                  textColor={currentTheme.fontMainColor}
                  bolder
                  small>
                  {getItems(item.items)}
                </TextDefault>
              </View>
            </View>
            <View style={styles(currentTheme).subContainerRight}>
              <TextDefault
                //numberOfLines={1}
                textColor={currentTheme.fontMainColor}
                bolder>
                {configuration.currencySymbol}
                {parseFloat(item.orderAmount).toFixed(2)}
              </TextDefault>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ActiveOrders
