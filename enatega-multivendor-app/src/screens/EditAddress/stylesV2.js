import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#FFF'
    },
    subContainer: {
      flex: 1,
      flexGrow: 1,
      alignItems: 'center',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderColor: 'grey',
      justifyContent: 'space-between',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      shadowColor: '#00000026',
      shadowRadius: 11,
      ...alignment.PTlarge
    },
    upperContainer: {
      width: '90%',
      alignItems: 'center'
    },
    horizontalLine: {
      borderBottomColor: theme.Pink.tagColor,
      borderBottomWidth: 1,
      marginVertical: 10, // Adjust this value to control the spacing above and below the line
      width: '90%',
      alignSelf: 'center',
      marginBottom: 30
    },
    addressContainer: {
      paddingTop: 0,
      width: '100%',
      ...alignment.Psmall
    },
    labelButtonContainer: {
      ...alignment.PxSmall,
      width: '80%'
    },
    labelTitleContainer: {
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    buttonInline: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: 'black'
    },
    textbuttonInline: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: 'black'
    },
    titlebuttonInline: {
      paddingLeft: 10,
      paddingRight: 12,
      justifyContent: 'space-between',
      ...alignment.PxSmall
    },
    labelButton: {
      width: 60,
      height: 60,
      borderWidth: 1,
      borderColor: props !== null ? props.tagColor : 'transparent',
      borderRadius: 8,
      justifyContent: 'center',
      ...alignment.PxSmall,
      backgroundColor: theme.Pink.tagColor
    },
    textlabelButton: {
      justifyContent: 'center',
      ...alignment.PxSmall,
      backgroundColor: theme.Pink.tagColor
    },
    activeLabel: {
      width: 60,
      height: 60,
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      color: props !== null ? props.tagColor : 'transparent',
      borderColor: props !== null ? props.black : 'transparent',
      backgroundColor: props !== null ? props.darkBgFont : 'transparent',
      ...alignment.PxSmall
    },
    saveBtnContainer: {
      width: '80%',
      height: verticalScale(40),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent',
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 20
    },
    fakeMarkerContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      marginLeft: -24,
      marginTop: -58,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    marker: {
      height: 48,
      width: 48
    },
    mapContainer: {
      height: '40%',
      backgroundColor: 'transparent'
    },
    geoLocation: {
      flexDirection: 'row'
    },
    editAddressImageContainer: {
      width: scale(50),
      height: scale(50),
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 1,
      translateX: scale(-25),
      translateY: scale(-25),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: -25 }, { translateY: -25 }]
    },
    editOldAddressImageContainer: {
      width: scale(50),
      height: scale(50),
      position: 'absolute',
      top: '46%',
      left: '50%',
      zIndex: 1,
      translateX: scale(-25),
      translateY: scale(-25),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: -25 }, { translateY: -25 }]
    }
  })
export default styles
