
import React, {useState, useEffect} from "react";
import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'
import {CssBaseline, Grid} from '@material-ui/core'
import {getPlacesData} from './api/index'


function App() {
  const [places, setPlaces]= useState([])
  const [coordinates, setCoordinates] = useState({})
  const [bounds, setBounds] = useState('')
  const [childclicked, setChildClicked]= useState()
  const [isLoading, setisLoading] = useState(false)
  const [type, setType] = useState('restaurants')
  const [ratings, setRatings] = useState('')
  const [filteredplaces, setFilteredPlaces]= useState([])


  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords:{latitude, longitude}})=>{
      setCoordinates({lat:latitude, lng: longitude})
    })
  },[])
  useEffect(()=>{
    const filteredPlaces= places?.filter((place)=>place.rating>ratings)
    setFilteredPlaces(filteredPlaces)
  },[ratings])
  useEffect(()=>{
    if (bounds.sw && bounds.ne){
      setisLoading(true)
    getPlacesData(type,bounds.sw, bounds.ne)
    .then((data)=>{
      //console.log(data)
      setPlaces(data?.filter((place)=>place.name && place.num_reviews>0))
      setFilteredPlaces([])
      setisLoading(false)
    })
      
    }
    
  },[type,bounds])
  return (
    <>
      <CssBaseline/>
      <Header setCoordinates={setCoordinates}/>
      <Grid container spacing={3} style={{width:'100%'}}>
        <Grid item xs={12} md={4}>
            <List places={filteredplaces.length?filteredplaces: places}
            childclicked={childclicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            ratings={ratings}
            setRatings={setRatings}
            />
        </Grid>
        <Grid item xs={12} md={8}>
            <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates} 
            places={filteredplaces.length?filteredplaces: places}
            setChildClicked={setChildClicked}
            />
        </Grid>
      {console.log(coordinates)}
      </Grid>
    </>
  );
}

export default App;
