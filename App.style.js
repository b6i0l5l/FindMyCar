import { StyleSheet, Dimensions, Platform } from 'react-native';
import React from 'react';

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  saveLocationButton:{
    backgroundColor: 'ghostwhite',
    position: 'absolute',
    bottom:80,
    right:15,
    borderRadius:35,
    width:60,
    height:60,
    justifyContent:'center',
  },
  recenterButton:{
    backgroundColor: 'ghostwhite',
    position: 'absolute',
    bottom:15,
    left:15,
    borderRadius:35,
    width:60,
    height:60,
    justifyContent:'center',
  },
  getLinkButton:{
    backgroundColor: 'ghostwhite',
    position: 'absolute',
    bottom:145,
    right:15,
    borderRadius:35,
    width:60,
    height:60,
    justifyContent:'center',
  },
  deleteButton:{
    backgroundColor: 'ghostwhite',
    position: 'absolute',
    bottom:15,
    right:15,
    borderRadius:35,
    width:60,
    height:60,
    justifyContent:'center',
  },
  showMarkersButton:{
    backgroundColor: 'ghostwhite',
    position: 'absolute',
    bottom:210,
    right:15,
    borderRadius:35,
    width:60,
    height:60,
    justifyContent:'center',
  },
  getTitle:{
    marginTop:50,
    marginLeft:15,
    marginRight:15,
    width:200,
    height:70,
    borderRadius:10,
    backgroundColor:"white",
    borderColor:"black",
    fontSize:15
  },
  saveButton:{
    width:200,
    height:40,
    borderRadius:10,
    textAlign: 'center',
    backgroundColor:"dodgerblue",
    color:"white"
  },
  saveButtonText:{
    textAlign: 'center',
    color:"white",
    fontSize:15
  }
});
