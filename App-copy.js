import React from 'react';
import { StyleSheet, Text, View ,Platform,AppRegistry, TouchableOpacity, Button, Alert} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import MapView ,{ Marker }from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Icon } from 'react-native-elements'
import Polyline from '@mapbox/polyline';

const LATITUDE        = 37.78825;
const LONGITUDE       = 122.4324;
const LATITUDE_DELTA  = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export default class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      coords:[],
      errorMessage: null,
      marker:
      {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      initRegion:{
        latitude:LATITUDE.toString(),
        longitude:LONGITUDE.toString(),
      },
      addicon:"add-location",
      recentericon:"explore"
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            accuracy: position.coords.accuracy
          }
        });
      },
      (error) => alert(error.message),
      {timeout: 10000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      const newRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        accuracy: position.coords.accuracy
      }
      // console.log(newRegion.latitude);
      // console.log(newRegion.longitude);
      this.setState({newRegion},function(){
        this.getDirections(newRegion.latitude+`,`+newRegion.longitude,"36.80388"+`,`+newRegion.longitude);
      });

    });
    // console.log(destRegion)
    // this.setState({errorMessage:"30"},function(){
    //   console.log(this.state.errorMessage);
    // });
    // console.log(this.state.errorMessage);

    // this.getDirections("36.220388,-119.745523", "36.812205,-119.7455234")
  }

  async getDirections(startLoc, destinationLoc) {
    // console.log(startLoc)
    // console.log(destinationLoc)
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=36.812205,-119.7455234&key=AIzaSyDX5utPptbyccB5lnvi6MAf1msxMH4OU1k`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({coords: coords})
            return coords
        } catch(error) {
            alert(error)
            return error
        }
    }


  componentWillMount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  render() {
    return (

      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          followUserLocation={true}>
          <Marker
            coordinate={{latitude:36.81388, longitude:this.state.region.longitude}}
            title={"Target"}
            description={""}>
          </Marker>
          <MapView.Polyline
              coordinates={this.state.coords}
              strokeWidth={2}
              strokeColor="red">
          </MapView.Polyline>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onPress}
          >
           <Icon
              name= {this.state.recentericon}
              color="dodgerblue"
              size={35}
           />
          </TouchableOpacity>
        </MapView>
        <TouchableOpacity
         style={styles.button}
         onPress={()=>{Alert.alert('Copied!');}}
        >


         <Icon
              name= {this.state.addicon}
              color="dodgerblue"
              size={35}
            />
       </TouchableOpacity>

      </View>
    );
  }
  // onPress=()=>{
  //   Alert.alert('Copied!')
  // }
}
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    button:{
      backgroundColor: 'ghostwhite',
      marginLeft:220,
      marginBottom:100,
      borderRadius:35,
      width:70,
      height:70,
      // borderWidth:1,
      //  borderColor:'rgba(0,0,0,0.2)',
      //  alignItems:'center',
      justifyContent:'center',
      //  width:100,
      //  height:100,
      //  backgroundColor:'#fff',
      //  borderRadius:50,
    }
  });
// AppRegistry.registerComponent('Test', () => Test);
