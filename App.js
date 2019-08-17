import React from 'react';
import { StyleSheet, Text, View ,Platform,AppRegistry, TouchableOpacity, Button, Alert, TextInput} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import MapView ,{ Marker }from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { AppLoading } from 'expo';
import { Icon } from 'react-native-elements'
import Polyline from '@mapbox/polyline';
import awsmobile from './aws-exports';
import Amplify, { API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import uuid from "uuid";
import styles from './App.style.js';

const LATITUDE        = 37.78825;
const LONGITUDE       = -119.4324;
const LATITUDE_DELTA  = 0.0922;
const LONGITUDE_DELTA = 0.0421;
Amplify.configure(awsmobile);

export default class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      email   : '',
      password: '',
      confirmpassword:'',
      username:'',
      emailicon:'account_circle',
      passwordicon:'vpn_key',
      linkPressed:false,
      showMarkersPressed: false,
      apiresponse:null,
      coords:[],
      errorMessage: null,
      markerinfo:null,
      markers: [],
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      saveLocationicon:"add-location",
      recentericon:"explore",
      getLinkicon:"input",
      deleteicon:"delete",
      showMarkersicon:"flag",
      titleshouldShow:false,
      markershouldShow:false
    };
    this._getLocationAsync=this._getLocationAsync.bind(this);
    this.getLink=this.getLink.bind(this);
    this.switchMarkers=this.switchMarkers.bind(this);
    this.linkPressed=this.linkPressed.bind(this);
  }

  componentDidMount() {


  }

  componentWillMount() {
    this._getLocationAsync();

  }

  _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      let location = await Location.getCurrentPositionAsync({});
      // console.log('User location', location);
      let userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      this.setState({
        userLocation,
        region: {
          ...this.state.region,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        }
       });
      // console.log('User location', userLocation);
    };

  saveLocation = () => {
    if(!this.state.titleshouldShow){
      this.setState({
        titleshouldShow:true
      })
    }
   else {
     this.setState({
       titleshouldShow:false
     })

   }
   // console.log(this.state.saveLocationMarker)
  }

switchMarkers = () => {
  // console.log(this.state.showMarkersPressed)
  if (!this.state.showMarkersPressed){
    this.setState({
      showMarkersPressed:true
    })
    this.showMarkersLocation();
  }
  else{
    this.setState({
      showMarkersPressed:false,
      markers:[]
    })
  }

}

  showMarkersLocation=async()=>{
    this.setState({
      locations:[],
      // componentLoading: true
    })
    // this.setState({showMarkersPressed: !this.state.showMarkersPressed})

    const apiName='api8b99ff04';
    const path = "/location"; // you can specify the path
    const locations = await API.get(apiName, path);
    locations.body.Items.map((location) => (
      this.setState({
        markers: [
          ...this.state.markers,
        {
          id:location.id,
          coordinate:{
            latitude:Number(location.latitude),
            longitude:Number(location.longitude)
          },
          title:location.title
        }
      ]
    })
    ));
  }

  onChangetitle=(e)=>{
    // console.log(e);
    this.setState({
      saveLocationMarker:{
        ...this.state.saveLocationMarker,
        title:e,
      },
    })
    console.log(e);
  }
  linkPressed = () =>{
    if(!this.state.linkPressed){
      this.getLink()
      this.setState({
        linkPressed:true
      })
    }
    else{
      this.getLink()
      this.setState({
        linkPressed:false
      })
    }
  }
  getLink= async () => {
    // console.log(startLoc)
    // console.log(destinationLoc)
    // console.log(this.state.markers)
    // console.log('DO you get it')
    let location={
      latitude:this.state.userLocation.latitude.toString(),
      longitude:this.state.userLocation.longitude.toString()
    }
    // console.log(this.state.markerinfo);
    let markerLocation={
      latitude:this.state.markerinfo.coordinate.latitude.toString(),
      longitude:this.state.markerinfo.coordinate.longitude.toString()
    }
    // console.log("markerLocation:",markerLocation);
    let startLoc=(location.latitude + `,` + location.longitude)


    // console.log(startLoc);
    // console.log(markerLocation.latitude);
    let destiLoc=(markerLocation.latitude + `,`+ markerLocation.longitude)
    if (this.state.linkPressed){
      destiLoc =startLoc //hide the link
    }
    // setTimeout(() => console.log(destiLoc), 5000);
    // console.log(markerLocation.latitude);
    // console.log(destiLoc);

    // console.log(this.state.markers[0].coordinate.latitude);
    let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destiLoc}&key=AIzaSyDX5utPptbyccB5lnvi6MAf1msxMH4OU1k`)
    let respJson = await resp.json();
    let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map((point, index) => {
        return  {
            latitude : point[0],
            longitude : point[1]
        }
    })
    this.setState({coords: coords})

    }



  getMarkerinfo = (marker) => {
    // console.log(marker);
    if(this.state.markershouldShow){
      this.setState({
        markershouldShow:false
      })
    }
    else{
      this.setState({
        markerinfo:{
          coordinate:marker.coordinate,
          id:marker.id
        }
      })
    }


    // setTimeout(() => console.log("markinfo",this.state.markerinfo), 5000);
  }




  deleteMarker = async() => {
    console.log("Deleting marker: ", this.state.markerinfo.id)

    let data={
      body:{
        id:this.state.markerinfo.id
      }
    }

    const apiName='api8b99ff04';
    const path = "/delete-location"; // you can specify the path
    const apiResponse = await API.post(apiName, path, data)
    // console.log(apiResponse);
    let updateMarkers = this.state.markers
    updateMarkers.splice(updateMarkers.indexOf(this.state.markerinfo.id),1);
    console.log("Markers",this.state.markers);
    this.setState({
      markers:updateMarkers,
      markershouldShow:false
    })
    // setTimeout(() => console.log(this.state.markers), 5000);
  }

  saveButton=async()=>{
    let location = this.state.userLocation;
    let id = uuid.v1();

    let data = {
        body: {
          latitude: location.latitude,
          longitude: location.longitude,
          id:id,
          title:this.state.saveLocationMarker.title
        }
      }
   const apiName='api8b99ff04';
   const path = "/location"; // you can specify the path
   const apiResponse = await API.post(apiName, path, data);
   // console.log("response from saving location:!!!!!!!!!!!!! ", apiResponse);
   this.setState({
     saveLocationMarker:{
       ...this.state.saveLocationMarker,
       coordinate:{
         latitude:location.latitude,
         longitude:location.longitude,
       },
       id:id,
       title:this.state.saveLocationMarker.title
     },
     markershouldShow:true,
     titleshouldShow:false
   })

   // console.log(this.state.saveLocationMarker)
  }


  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._getLocationAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return (

      <View style={styles.container}>
        <MapView
          ref={ref => {this.newmap = ref;}}
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          followUserLocation={true}
          >

          <MapView.Polyline
              coordinates={this.state.coords}
              strokeWidth={2}
              strokeColor="red">
          </MapView.Polyline>


            {this.state.markers.map((marker)=>(
              <MapView.Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={()=>this.getMarkerinfo(marker)}>
              </MapView.Marker>
            ))}
            {this.state.markershouldShow?
            <Marker
              coordinate={this.state.saveLocationMarker.coordinate}
              title={this.state.saveLocationMarker.title}
              onPress={()=> this.getMarkerinfo(this.state.saveLocationMarker)}>
            </Marker>
            :null}
        </MapView>

        {this.state.titleshouldShow?
          <TextInput
          style={styles.getTitle}
          placeholder="Title name..."
          placeholderTextColor="#E6E6E6"
          onChangeText={this.onChangetitle}>
          </TextInput>
        :null}
        {this.state.titleshouldShow?
          <TouchableOpacity
           style={styles.saveButton}
           onPress={this.saveButton}
          >

           <Text
           style={styles.saveButtonText}>
           SAVE
           </Text>
          </TouchableOpacity>
        :null}
        <TouchableOpacity
         style={styles.showMarkersButton}
         onPress={this.switchMarkers}
        >
         <Icon
              name= {this.state.showMarkersicon}
              color="dodgerblue"
              size={35}
         />
         </TouchableOpacity>
        <TouchableOpacity
         style={styles.deleteButton}
         onPress={this.deleteMarker}
        >
         <Icon
              name= {this.state.deleteicon}
              color="dodgerblue"
              size={35}
         />
         </TouchableOpacity>
        <TouchableOpacity
         style={styles.getLinkButton}
         onPress={this.linkPressed}
        >

         <Icon
              name= {this.state.getLinkicon}
              color="dodgerblue"
              size={35}
         />


        </TouchableOpacity>

        <TouchableOpacity
         style={styles.saveLocationButton}
         onPress={this.saveLocation}
        >
         <Icon
              name= {this.state.saveLocationicon}
              color="dodgerblue"
              size={35}
         />

       </TouchableOpacity>

       <TouchableOpacity
         style={styles.recenterButton}
         onPress={()=>this.newmap.animateCamera({center:{latitude:this.state.region.latitude,longitude:this.state.region.longitude}}, 1000)}
       >
        <Icon
           name= {this.state.recentericon}
           color="dodgerblue"
           size={35}
        />
       </TouchableOpacity>


      </View>
    );
  }
}
AppRegistry.registerComponent('Test', () => Test);
